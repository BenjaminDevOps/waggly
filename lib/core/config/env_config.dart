import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Service for managing environment variables from .env file
class EnvConfig {
  static bool _isLoaded = false;

  /// Load environment variables from .env file
  /// Must be called before runApp() in main.dart
  static Future<void> load() async {
    try {
      await dotenv.load(fileName: '.env');
      _isLoaded = true;
    } catch (e) {
      print('⚠️ Warning: Failed to load .env file: $e');
      print('📝 Make sure you have created a .env file in the root directory');
      print('📄 Use .env.example as a template');
      _isLoaded = false;
    }
  }

  /// Check if environment variables are loaded
  static bool get isLoaded => _isLoaded;

  /// Get Gemini API Key
  static String get geminiApiKey {
    if (!_isLoaded) {
      throw Exception('Environment variables not loaded. Call EnvConfig.load() first.');
    }

    final key = dotenv.env['GEMINI_API_KEY'] ?? '';

    if (key.isEmpty || key == 'YOUR_GEMINI_API_KEY_HERE') {
      throw Exception(
        'Gemini API key not configured.\n'
        'Please add your API key to the .env file.\n'
        'Get your key from: https://ai.google.dev/'
      );
    }

    return key;
  }

  /// Check if Gemini API key is properly configured
  static bool get isGeminiConfigured {
    if (!_isLoaded) return false;

    final key = dotenv.env['GEMINI_API_KEY'] ?? '';
    return key.isNotEmpty && key != 'YOUR_GEMINI_API_KEY_HERE';
  }

  /// Get a custom environment variable
  static String? get(String key, {String? defaultValue}) {
    if (!_isLoaded) return defaultValue;
    return dotenv.env[key] ?? defaultValue;
  }

  /// Check if a specific key exists
  static bool has(String key) {
    if (!_isLoaded) return false;
    return dotenv.env.containsKey(key);
  }
}
