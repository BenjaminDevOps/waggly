import 'package:google_generative_ai/google_generative_ai.dart';

/// Gemini AI configuration for veterinary diagnosis
class GeminiConfig {
  static const String apiKey = 'YOUR_GEMINI_API_KEY';
  static const String modelName = 'gemini-2.5-lite';

  static GenerativeModel getModel() {
    return GenerativeModel(
      model: modelName,
      apiKey: apiKey,
      generationConfig: GenerationConfig(
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      ),
      safetySettings: [
        SafetySetting(HarmCategory.harassment, HarmBlockThreshold.medium),
        SafetySetting(HarmCategory.hateSpeech, HarmBlockThreshold.medium),
        SafetySetting(HarmCategory.sexuallyExplicit, HarmBlockThreshold.medium),
        SafetySetting(HarmCategory.dangerousContent, HarmBlockThreshold.medium),
      ],
    );
  }

  /// System prompt for veterinary diagnosis
  static const String systemPrompt = '''
You are an expert veterinary AI assistant for the Waggly app. Your role is to:

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
Format your responses in clear sections: Assessment, Possible Conditions, Recommendations, When to Seek Help.
''';
}
