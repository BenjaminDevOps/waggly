import 'dart:io';
import 'package:google_generative_ai/google_generative_ai.dart';
import '../../core/config/env_config.dart';

/// Service for interacting with Google Gemini AI
class GeminiService {
  late final GenerativeModel _model;
  late final GenerativeModel _visionModel;

  GeminiService() {
    // Get API key from environment configuration
    final apiKey = EnvConfig.geminiApiKey;

    // Text-only model for general queries
    _model = GenerativeModel(
      model: 'gemini-1.5-flash',
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
      ],
    );

    // Vision model for image analysis
    _visionModel = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: apiKey,
    );
  }

  /// Analyze pet symptoms with text only
  Future<String> analyzeSy
mptoms({
    required String petName,
    required String species,
    required String breed,
    required int ageYears,
    required String symptoms,
  }) async {
    final prompt = '''
You are an experienced veterinary AI assistant helping pet owners understand their pet's health concerns.

Pet Information:
- Name: $petName
- Species: $species
- Breed: $breed
- Age: $ageYears years

Symptoms described by owner:
$symptoms

Please provide:
1. **Initial Assessment**: What these symptoms might indicate
2. **Severity Level**: Rate as Low, Medium, High, or Critical
3. **Possible Causes**: List potential health issues (most likely first)
4. **Recommendations**: 
   - Immediate actions to take
   - Whether veterinary visit is needed (and how urgent)
   - Home care tips if applicable
5. **Questions**: 3-5 follow-up questions to better understand the situation

IMPORTANT: 
- You are NOT providing a diagnosis, only educational information
- Always recommend consulting a licensed veterinarian for serious concerns
- Be clear, compassionate, and helpful
- Format your response in clear sections with markdown

Provide your analysis:
''';

    try {
      final response = await _model.generateContent([Content.text(prompt)]);
      return response.text ?? 'Unable to generate analysis. Please try again.';
    } catch (e) {
      throw Exception('Failed to analyze symptoms: $e');
    }
  }

  /// Analyze pet with photo
  Future<String> analyzeWithPhoto({
    required String petName,
    required String species,
    required String breed,
    required int ageYears,
    required String symptoms,
    required File photoFile,
  }) async {
    final prompt = '''
You are an experienced veterinary AI assistant analyzing a pet's health concern.

Pet Information:
- Name: $petName
- Species: $species
- Breed: $breed
- Age: $ageYears years

Symptoms described: $symptoms

Please analyze the provided photo and symptoms together to provide:
1. **Visual Observations**: What you notice in the photo that's relevant to health
2. **Initial Assessment**: Combined analysis of symptoms + visual observations
3. **Severity Level**: Rate as Low, Medium, High, or Critical
4. **Possible Causes**: What the symptoms + photo might indicate
5. **Recommendations**: Specific advice based on visual findings

IMPORTANT: 
- This is educational information only, not a veterinary diagnosis
- Recommend professional veterinary care for concerning findings
- Be specific about visual observations

Provide your analysis:
''';

    try {
      final imageBytes = await photoFile.readAsBytes();
      final imagePart = DataPart('image/jpeg', imageBytes);

      final response = await _visionModel.generateContent([
        Content.multi([TextPart(prompt), imagePart])
      ]);

      return response.text ?? 'Unable to analyze photo. Please try again.';
    } catch (e) {
      throw Exception('Failed to analyze photo: $e');
    }
  }

  /// Ask follow-up question in conversation
  Future<String> askFollowUp({
    required String conversationContext,
    required String userQuestion,
  }) async {
    final prompt = '''
Continue the veterinary consultation conversation.

Previous context:
$conversationContext

User's question: $userQuestion

Provide a helpful, professional response that:
- Addresses their specific question
- Provides relevant veterinary insights
- Asks clarifying questions if needed
- Maintains a compassionate tone

Response:
''';

    try {
      final response = await _model.generateContent([Content.text(prompt)]);
      return response.text ?? 'Unable to generate response. Please try again.';
    } catch (e) {
      throw Exception('Failed to get response: $e');
    }
  }

  /// Generate final diagnosis report
  Future<Map<String, String>> generateDiagnosisReport({
    required String fullConversation,
    required String petName,
  }) async {
    final prompt = '''
Based on the following consultation about $petName, create a concise diagnosis report.

Full conversation:
$fullConversation

Generate a structured report with these sections (use markdown):

1. **Summary**: Brief overview of the consultation
2. **Key Findings**: Main health concerns identified
3. **Severity**: Rate as Low, Medium, High, or Critical (ONLY return the word)
4. **Recommendations**: Clear action items for the pet owner
5. **Follow-up**: What to monitor and when to seek help

Provide the report in a professional, easy-to-understand format.

Return ONLY a JSON object with these exact keys: "summary", "findings", "severity", "recommendations", "followup"
''';

    try {
      final response = await _model.generateContent([Content.text(prompt)]);
      final text = response.text ?? '';

      // Parse the response (simplified - in production, use proper JSON parsing)
      return {
        'analysis': text,
        'recommendations': text,
        'severity': _extractSeverity(text),
      };
    } catch (e) {
      throw Exception('Failed to generate report: $e');
    }
  }

  /// Extract severity from AI response
  String _extractSeverity(String text) {
    final lowerText = text.toLowerCase();
    if (lowerText.contains('critical')) return 'Critical';
    if (lowerText.contains('high')) return 'High';
    if (lowerText.contains('medium') || lowerText.contains('moderate')) {
      return 'Medium';
    }
    return 'Low';
  }

  /// Check if API key is configured
  static bool get isConfigured => EnvConfig.isGeminiConfigured;
}
