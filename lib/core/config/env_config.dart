import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Service for managing environment variables from .env file
///
/// Configuration:
/// - Package: flutter_dotenv ^6.0.0
/// - File: .env (in project root)
/// - Loaded in: main.dart with dotenv.load()
///
/// Usage:
/// ```dart
/// final apiKey = EnvConfig.geminiApiKey;
/// final isConfigured = EnvConfig.isGeminiConfigured;
/// ```
class EnvConfig {

  /// Get Gemini API Key
  ///
  /// Throws an exception if the key is not configured.
  /// Use [isGeminiConfigured] to check before accessing.
  static String get geminiApiKey {
    final key = dotenv.env['GEMINI_API_KEY'] ?? '';

    if (key.isEmpty || key == 'YOUR_GEMINI_API_KEY_HERE') {
      throw Exception(
        'Gemini API key not configured.\n'
        'Please add your API key to the .env file.\n'
        'Get your key from: https://aistudio.google.com/apikey'
      );
    }

    return key;
  }

  /// Check if Gemini API key is properly configured
  ///
  /// Returns true if:
  /// - .env file is loaded
  /// - GEMINI_API_KEY exists
  /// - Key is not empty or placeholder
  static bool get isGeminiConfigured {
    final key = dotenv.env['GEMINI_API_KEY'] ?? '';
    return key.isNotEmpty && key != 'YOUR_GEMINI_API_KEY_HERE';
  }

  /// Get a custom environment variable
  ///
  /// Example:
  /// ```dart
  /// final apiUrl = EnvConfig.get('API_URL', defaultValue: 'https://api.example.com');
  /// ```
  static String? get(String key, {String? defaultValue}) {
    return dotenv.env[key] ?? defaultValue;
  }

  /// Check if a specific key exists in .env
  static bool has(String key) {
    return dotenv.env.containsKey(key);
  }

  /// Get all environment variables (for debugging)
  ///
  /// WARNING: Don't log this in production as it may contain sensitive data
  static Map<String, String> get all => dotenv.env;
}
