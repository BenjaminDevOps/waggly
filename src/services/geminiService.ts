import { GEMINI_API_KEY } from '@env';
import { PetType } from '@/types/models';

export interface DiagnosticRequest {
  petName: string;
  petType: PetType;
  age?: number;
  symptoms: string;
  duration?: string;
  additionalInfo?: string;
}

export interface DiagnosticResponse {
  analysis: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  urgency: string;
}

export class GeminiService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async getDiagnostic(request: DiagnosticRequest): Promise<DiagnosticResponse> {
    const prompt = this.buildPrompt(request);

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        throw new Error('Aucune réponse générée');
      }

      return this.parseResponse(text);
    } catch (error) {
      console.error('Error getting diagnostic:', error);
      throw new Error('Impossible d\'obtenir un diagnostic. Veuillez réessayer.');
    }
  }

  private buildPrompt(request: DiagnosticRequest): string {
    const animalType =
      request.petType === 'dog' ? 'chien' :
      request.petType === 'cat' ? 'chat' :
      'NAC (Nouvel Animal de Compagnie)';

    return `Tu es un assistant vétérinaire IA spécialisé dans le diagnostic préliminaire des animaux de compagnie.

IMPORTANT:
- Tu ne remplaces PAS un vétérinaire professionnel
- Toujours recommander une consultation vétérinaire en cas de doute
- Être clair et précis dans les recommandations

INFORMATIONS SUR L'ANIMAL:
- Nom: ${request.petName}
- Type: ${animalType}
${request.age ? `- Âge: ${request.age} ans` : ''}

SYMPTÔMES OBSERVÉS:
${request.symptoms}

${request.duration ? `DURÉE DES SYMPTÔMES: ${request.duration}` : ''}
${request.additionalInfo ? `INFORMATIONS ADDITIONNELLES: ${request.additionalInfo}` : ''}

Fournis une analyse structurée au format suivant:

ANALYSE:
[Analyse détaillée des symptômes et causes possibles]

GRAVITÉ: [LOW, MEDIUM, ou HIGH]

RECOMMANDATIONS:
- [Recommandation 1]
- [Recommandation 2]
- [Recommandation 3]

URGENCE:
[Indiquer si consultation vétérinaire immédiate nécessaire, dans les 24h, ou surveillance à domicile suffisante]

Réponds de manière professionnelle, bienveillante et en français.`;
  }

  private parseResponse(text: string): DiagnosticResponse {
    const severityMatch = text.match(/GRAVITÉ:\s*(LOW|MEDIUM|HIGH)/i);
    const severity = severityMatch
      ? (severityMatch[1].toLowerCase() as 'low' | 'medium' | 'high')
      : 'medium';

    const analysisMatch = text.match(/ANALYSE:(.*?)(?=GRAVITÉ:|RECOMMANDATIONS:|$)/s);
    const analysis = analysisMatch ? analysisMatch[1].trim() : text;

    const recommendationsMatch = text.match(/RECOMMANDATIONS:(.*?)(?=URGENCE:|$)/s);
    const recommendationsText = recommendationsMatch ? recommendationsMatch[1].trim() : '';
    const recommendations = recommendationsText
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0);

    const urgencyMatch = text.match(/URGENCE:(.*?)$/s);
    const urgency = urgencyMatch ? urgencyMatch[1].trim() : 'Consultation recommandée';

    return {
      analysis,
      severity,
      recommendations: recommendations.length > 0 ? recommendations : ['Consulter un vétérinaire'],
      urgency,
    };
  }
}

export const geminiService = new GeminiService();
