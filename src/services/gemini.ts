import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { DiagnosisSeverity } from '../models/types';

const API_KEY = 'YOUR_GEMINI_API_KEY';
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `You are an expert veterinary AI assistant for the Waggly app. Your role is to:

1. Analyze pet symptoms and provide preliminary health assessments
2. Suggest potential conditions (NOT definitive diagnoses)
3. Recommend when to seek professional veterinary care
4. Provide general pet health advice

IMPORTANT DISCLAIMERS:
- You are NOT a replacement for professional veterinary care
- Always recommend consulting a veterinarian for serious symptoms
- Your assessments are preliminary and educational only
- Never prescribe specific medications

Respond in a caring, professional, and informative manner.
Format your response with clear sections: Assessment, Possible Conditions, Recommendations, When to Seek Help, Severity Level.`;

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
}): Promise<DiagnosisResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  const prompt = `${SYSTEM_PROMPT}

Pet Information:
- Type: ${params.petType}
- Age: ${params.petAge}

Symptoms Reported:
${params.symptoms}

Please provide:
1. Assessment of the symptoms
2. Possible conditions (list up to 3)
3. Recommendations for care
4. When to seek immediate veterinary help
5. Severity level (low/medium/high/emergency)`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return parseResponse(response);
}

function parseResponse(response: string): DiagnosisResult {
  let severity: DiagnosisSeverity = 'medium';
  const possibleConditions: string[] = [];
  const recommendations: string[] = [];
  let requiresVetVisit = false;

  const lower = response.toLowerCase();

  if (lower.includes('emergency') || lower.includes('severe')) {
    severity = 'emergency';
    requiresVetVisit = true;
  } else if (lower.includes('high')) {
    severity = 'high';
    requiresVetVisit = true;
  } else if (lower.includes('low') || lower.includes('mild')) {
    severity = 'low';
  }

  const lines = response.split('\n');
  let inConditions = false;
  let inRecommendations = false;

  for (const line of lines) {
    if (line.toLowerCase().includes('possible condition')) {
      inConditions = true;
      inRecommendations = false;
      continue;
    }
    if (line.toLowerCase().includes('recommendation')) {
      inRecommendations = true;
      inConditions = false;
      continue;
    }

    if (inConditions && line.trim().startsWith('-')) {
      possibleConditions.push(line.trim().substring(1).trim());
    }
    if (inRecommendations && line.trim().startsWith('-')) {
      recommendations.push(line.trim().substring(1).trim());
    }
  }

  if (lower.includes('see a vet') || lower.includes('veterinar')) {
    requiresVetVisit = true;
  }

  return {
    fullResponse: response,
    severity,
    possibleConditions: possibleConditions.length > 0
      ? possibleConditions
      : ['Unable to determine specific conditions'],
    recommendations: recommendations.length > 0
      ? recommendations
      : ['Monitor symptoms and consult a vet if they worsen'],
    requiresVetVisit,
  };
}
