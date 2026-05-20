import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import '../../core/config/gemini_config.dart';
import '../models/diagnosis_model.dart';

/// AI service for veterinary diagnosis — powered by DeepSeek
class GeminiService {
  Future<DiagnosisResult> analyzePetSymptoms({
    required String petType,
    required String petAge,
    required String symptoms,
    List<Uint8List>? images,
  }) async {
    try {
      final userPrompt = _buildDiagnosisPrompt(
        petType: petType,
        petAge: petAge,
        symptoms: symptoms,
        hasImages: images != null && images.isNotEmpty,
      );

      final response = await http.post(
        Uri.parse('${GeminiConfig.baseUrl}/chat/completions'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${GeminiConfig.apiKey}',
        },
        body: jsonEncode({
          'model': GeminiConfig.modelName,
          'messages': [
            {'role': 'system', 'content': GeminiConfig.systemPrompt},
            {'role': 'user', 'content': userPrompt},
          ],
          'temperature': GeminiConfig.temperature,
          'max_tokens': GeminiConfig.maxTokens,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('API error ${response.statusCode}: ${response.body}');
      }

      final data = jsonDecode(response.body) as Map<String, dynamic>;
      final responseText =
          (data['choices'] as List).first['message']['content'] as String? ?? '';

      return _parseResponse(responseText);
    } catch (e) {
      throw Exception('Failed to analyze symptoms: $e');
    }
  }

  String _buildDiagnosisPrompt({
    required String petType,
    required String petAge,
    required String symptoms,
    required bool hasImages,
  }) {
    final imageNote = hasImages
        ? '\nNote: The owner has provided photos, but image analysis is not available in this mode. Base your assessment on the symptoms described.\n'
        : '';

    return '''
Pet Information:
- Type: $petType
- Age: $petAge
$imageNote
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

  DiagnosisResult _parseResponse(String response) {
    DiagnosisSeverity severity = DiagnosisSeverity.medium;
    List<String> possibleConditions = [];
    List<String> recommendations = [];
    bool requiresVetVisit = false;

    final lower = response.toLowerCase();

    if (lower.contains('emergency') || lower.contains('severe')) {
      severity = DiagnosisSeverity.emergency;
      requiresVetVisit = true;
    } else if (lower.contains('high')) {
      severity = DiagnosisSeverity.high;
      requiresVetVisit = true;
    } else if (lower.contains('medium') || lower.contains('moderate')) {
      severity = DiagnosisSeverity.medium;
    } else if (lower.contains('low') || lower.contains('mild')) {
      severity = DiagnosisSeverity.low;
    }

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

    if (lower.contains('see a vet') ||
        lower.contains('veterinar') ||
        lower.contains('consult a professional')) {
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
