import { DiagnosisSeverity } from '../models/types';
import type { Locale } from '../i18n';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY ?? '';
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'French (Français)',
  es: 'Spanish (Español)',
};

// Severity keywords per language for robust parsing
const SEVERITY_KEYWORDS: Record<Locale, { emergency: string[]; high: string[]; low: string[] }> = {
  en: {
    emergency: ['emergency', 'severe', 'immediate', 'urgent'],
    high: ['high', 'serious', 'concerning'],
    low: ['low', 'mild', 'minor'],
  },
  fr: {
    emergency: ['urgence', 'sévère', 'grave', 'immédiat', 'emergency'],
    high: ['élevé', 'haut', 'sérieux', 'high'],
    low: ['faible', 'léger', 'mineur', 'low'],
  },
  es: {
    emergency: ['emergencia', 'severo', 'grave', 'inmediato', 'urgente', 'emergency'],
    high: ['alto', 'serio', 'preocupante', 'high'],
    low: ['bajo', 'leve', 'menor', 'low'],
  },
};

// Vet visit keywords per language
const VET_KEYWORDS: Record<Locale, string[]> = {
  en: ['see a vet', 'veterinar', 'consult', 'seek care'],
  fr: ['vétérinaire', 'vétérinair', 'consulter', 'consultation'],
  es: ['veterinario', 'veterinar', 'consultar', 'atención'],
};

function buildSystemPrompt(locale: Locale): string {
  const lang = LANGUAGE_NAMES[locale];
  return `You are an expert exotic-animal veterinary AI assistant for the Waggly NAC app, specialized in
"NAC" (Nouveaux Animaux de Compagnie) — exotic and non-traditional companion animals such as reptiles,
rodents, ferrets, birds, fish, amphibians and invertebrates. Your role is to:

1. Analyze the reported species-specific symptoms and provide preliminary health assessments
2. Suggest potential conditions (NOT definitive diagnoses), accounting for husbandry factors unique to
   exotic pets (temperature/UVB, humidity, diet, habitat setup)
3. Recommend when to seek professional veterinary care from a vet experienced with exotic/NAC species
   specifically, since many general practice vets do not treat them
4. Provide general care advice appropriate to the species mentioned

IMPORTANT DISCLAIMERS:
- You are NOT a replacement for professional veterinary care
- Always recommend consulting a veterinarian experienced with exotic/NAC species for serious symptoms
- Your assessments are preliminary and educational only
- Never prescribe specific medications

LANGUAGE REQUIREMENT: You MUST respond entirely in ${lang}. All sections, labels, and content must be in ${lang}.

Respond in a caring, professional, and informative manner.
Format your response with clear sections:
- Assessment (Évaluation / Evaluación)
- Possible Conditions (Conditions possibles / Condiciones posibles)
- Recommendations (Recommandations / Recomendaciones)
- When to Seek Help (Quand consulter / Cuándo buscar ayuda)
- Severity Level: one of [low/medium/high/emergency] (keep these words in English for parsing)`;
}

function buildUserPrompt(params: {
  petType: string;
  petAge: string;
  symptoms: string;
}, locale: Locale): string {
  const labels: Record<Locale, {
    petInfo: string; type: string; age: string;
    symptomsReported: string; provide: string;
    a1: string; a2: string; a3: string; a4: string; a5: string;
  }> = {
    en: {
      petInfo: 'Pet Information', type: 'Type', age: 'Age/Breed',
      symptomsReported: 'Symptoms Reported', provide: 'Please provide',
      a1: 'Assessment of the symptoms',
      a2: 'Possible conditions (list up to 3, starting each with "- ")',
      a3: 'Recommendations for care (list each starting with "- ")',
      a4: 'When to seek immediate veterinary help',
      a5: 'Severity level (write exactly: "Severity Level: low" or "medium" or "high" or "emergency")',
    },
    fr: {
      petInfo: 'Informations sur l\'animal', type: 'Type', age: 'Âge/Race',
      symptomsReported: 'Symptômes signalés', provide: 'Veuillez fournir',
      a1: 'Évaluation des symptômes',
      a2: 'Conditions possibles (listez jusqu\'à 3, commencez chaque ligne par "- ")',
      a3: 'Recommandations de soins (listez chaque élément commençant par "- ")',
      a4: 'Quand consulter un vétérinaire en urgence',
      a5: 'Niveau de gravité (écrivez exactement : "Severity Level: low" ou "medium" ou "high" ou "emergency")',
    },
    es: {
      petInfo: 'Información de la mascota', type: 'Tipo', age: 'Edad/Raza',
      symptomsReported: 'Síntomas reportados', provide: 'Por favor proporciona',
      a1: 'Evaluación de los síntomas',
      a2: 'Condiciones posibles (lista hasta 3, comenzando cada una con "- ")',
      a3: 'Recomendaciones de cuidado (lista cada elemento comenzando con "- ")',
      a4: 'Cuándo buscar atención veterinaria inmediata',
      a5: 'Nivel de gravedad (escribe exactamente: "Severity Level: low" o "medium" o "high" o "emergency")',
    },
  };

  const l = labels[locale];
  return `${l.petInfo}:
- ${l.type}: ${params.petType}
- ${l.age}: ${params.petAge}

${l.symptomsReported}:
${params.symptoms}

${l.provide}:
1. ${l.a1}
2. ${l.a2}
3. ${l.a3}
4. ${l.a4}
5. ${l.a5}`;
}

export interface DiagnosisResult {
  fullResponse: string;
  severity: DiagnosisSeverity;
  possibleConditions: string[];
  recommendations: string[];
  requiresVetVisit: boolean;
}

export async function analyzePetSymptoms(params: {
  petType: string;
  petAge: string;
  symptoms: string;
  locale?: Locale;
}): Promise<DiagnosisResult> {
  const locale: Locale = params.locale ?? 'en';

  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: buildSystemPrompt(locale) },
        { role: 'user', content: buildUserPrompt(params, locale) },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const response: string = data.choices?.[0]?.message?.content ?? '';
  return parseResponse(response, locale);
}

function parseResponse(response: string, locale: Locale): DiagnosisResult {
  let severity: DiagnosisSeverity = 'medium';
  const possibleConditions: string[] = [];
  const recommendations: string[] = [];
  let requiresVetVisit = false;

  const lower = response.toLowerCase();
  const keywords = SEVERITY_KEYWORDS[locale];

  // Parse severity — always written in English as "Severity Level: X"
  const severityMatch = response.match(/severity level\s*:\s*(low|medium|high|emergency)/i);
  if (severityMatch) {
    severity = severityMatch[1].toLowerCase() as DiagnosisSeverity;
    requiresVetVisit = severity === 'high' || severity === 'emergency';
  } else {
    // Fallback keyword detection
    if (keywords.emergency.some(kw => lower.includes(kw))) {
      severity = 'emergency';
      requiresVetVisit = true;
    } else if (keywords.high.some(kw => lower.includes(kw))) {
      severity = 'high';
      requiresVetVisit = true;
    } else if (keywords.low.some(kw => lower.includes(kw))) {
      severity = 'low';
    }
  }

  // Detect vet visit
  if (VET_KEYWORDS[locale].some(kw => lower.includes(kw))) {
    requiresVetVisit = true;
  }

  // Parse bullet points for conditions and recommendations
  const lines = response.split('\n');
  let section: 'conditions' | 'recommendations' | null = null;

  const conditionMarkers: Record<Locale, string[]> = {
    en: ['possible condition'],
    fr: ['condition possible', 'conditions possibles'],
    es: ['condición posible', 'condiciones posibles'],
  };
  const recommendationMarkers: Record<Locale, string[]> = {
    en: ['recommendation'],
    fr: ['recommandation'],
    es: ['recomendación', 'recomendacion'],
  };

  for (const line of lines) {
    const lineLower = line.toLowerCase();

    if (conditionMarkers[locale].some(m => lineLower.includes(m))) {
      section = 'conditions';
      continue;
    }
    if (recommendationMarkers[locale].some(m => lineLower.includes(m))) {
      section = 'recommendations';
      continue;
    }
    // Reset section on new headers (lines with numbers or bold markers)
    if (/^\d+\./.test(line.trim()) && section) {
      section = null;
    }

    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      const content = trimmed.substring(2).trim();
      if (content && section === 'conditions' && possibleConditions.length < 3) {
        possibleConditions.push(content);
      } else if (content && section === 'recommendations' && recommendations.length < 5) {
        recommendations.push(content);
      }
    }
  }

  const fallbacks: Record<Locale, { conditions: string; recommendations: string }> = {
    en: { conditions: 'Unable to determine specific conditions', recommendations: 'Monitor symptoms and consult a vet if they worsen' },
    fr: { conditions: 'Impossible de déterminer les conditions spécifiques', recommendations: 'Surveillez les symptômes et consultez un vétérinaire s\'ils s\'aggravent' },
    es: { conditions: 'No se pueden determinar condiciones específicas', recommendations: 'Monitorea los síntomas y consulta un veterinario si empeoran' },
  };

  return {
    fullResponse: response,
    severity,
    possibleConditions: possibleConditions.length > 0
      ? possibleConditions
      : [fallbacks[locale].conditions],
    recommendations: recommendations.length > 0
      ? recommendations
      : [fallbacks[locale].recommendations],
    requiresVetVisit,
  };
}
