import 'dart:typed_data';
import 'package:google_generative_ai/google_generative_ai.dart';
import '../../core/config/gemini_config.dart';
import '../models/diagnosis_model.dart';

/// Gemini AI service for veterinary diagnosis
class GeminiService {
  late final GenerativeModel _model;

  GeminiService() {
    _model = GeminiConfig.getModel();
  }

  /// Analyze pet symptoms and provide diagnosis
  Future<DiagnosisResult> analyzePetSymptoms({
    required String petType,
    required String petAge,
    required String symptoms,
    List<Uint8List>? images,
  }) async {
    try {
      final prompt = _buildDiagnosisPrompt(
        petType: petType,
        petAge: petAge,
        symptoms: symptoms,
      );

      final content = <Content>[];
      final parts = <Part>[];

      // Add system prompt and user query
      parts.add(TextPart(GeminiConfig.systemPrompt));
      parts.add(TextPart(prompt));

      // Add images if provided
      if (images != null && images.isNotEmpty) {
        for (final image in images) {
          parts.add(DataPart('image/jpeg', image));
        }
      }

      content.add(Content.multi(parts));

      // Generate response
      final response = await _model.generateContent(content);
      final responseText = response.text ?? '';

      // Parse response
      return _parseResponse(responseText);
    } catch (e) {
      throw Exception('Failed to analyze symptoms: $e');
    }
  }

  /// Build diagnosis prompt
  String _buildDiagnosisPrompt({
    required String petType,
    required String petAge,
    required String symptoms,
  }) {
    return '''
Pet Information:
- Type: $petType
- Age: $petAge

Symptoms Reported:
$symptoms

Please provide:
1. Assessment of the symptoms
2. Possible conditions (list up to 3)
3. Recommendations for care
4. When to seek immediate veterinary help
5. Severity level (low/medium/high/emergency)

Format your response clearly with these sections.
''';
  }

  /// Parse Gemini response into structured data
  DiagnosisResult _parseResponse(String response) {
    // Simple parsing logic - can be enhanced with regex
    DiagnosisSeverity severity = DiagnosisSeverity.medium;
    List<String> possibleConditions = [];
    List<String> recommendations = [];
    bool requiresVetVisit = false;

    // Parse severity
    if (response.toLowerCase().contains('emergency') ||
        response.toLowerCase().contains('severe')) {
      severity = DiagnosisSeverity.emergency;
      requiresVetVisit = true;
    } else if (response.toLowerCase().contains('high')) {
      severity = DiagnosisSeverity.high;
      requiresVetVisit = true;
    } else if (response.toLowerCase().contains('medium') ||
        response.toLowerCase().contains('moderate')) {
      severity = DiagnosisSeverity.medium;
    } else if (response.toLowerCase().contains('low') ||
        response.toLowerCase().contains('mild')) {
      severity = DiagnosisSeverity.low;
    }

    // Simple extraction (in production, use better parsing)
    final lines = response.split('\n');
    bool inConditions = false;
    bool inRecommendations = false;

    for (final line in lines) {
      if (line.toLowerCase().contains('possible condition')) {
        inConditions = true;
        inRecommendations = false;
        continue;
      }
      if (line.toLowerCase().contains('recommendation')) {
        inRecommendations = true;
        inConditions = false;
        continue;
      }

      if (inConditions && line.trim().startsWith('-')) {
        possibleConditions.add(line.trim().substring(1).trim());
      }
      if (inRecommendations && line.trim().startsWith('-')) {
        recommendations.add(line.trim().substring(1).trim());
      }
    }

    // Check if vet visit is mentioned
    if (response.toLowerCase().contains('see a vet') ||
        response.toLowerCase().contains('veterinar') ||
        response.toLowerCase().contains('consult a professional')) {
      requiresVetVisit = true;
    }

    return DiagnosisResult(
      fullResponse: response,
      severity: severity,
      possibleConditions: possibleConditions.isNotEmpty
          ? possibleConditions
          : ['Unable to determine specific conditions'],
      recommendations: recommendations.isNotEmpty
          ? recommendations
          : ['Monitor symptoms and consult a vet if they worsen'],
      requiresVetVisit: requiresVetVisit,
    );
  }
}

/// Diagnosis result data class
class DiagnosisResult {
  final String fullResponse;
  final DiagnosisSeverity severity;
  final List<String> possibleConditions;
  final List<String> recommendations;
  final bool requiresVetVisit;

  DiagnosisResult({
    required this.fullResponse,
    required this.severity,
    required this.possibleConditions,
    required this.recommendations,
    required this.requiresVetVisit,
  });
}
