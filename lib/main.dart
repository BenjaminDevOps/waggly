import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'firebase_options.dart';
import 'core/theme/app_theme.dart';
import 'core/config/firebase_config.dart';
import 'core/config/env_config.dart';
import 'features/auth/screens/splash_screen.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables from .env file (flutter_dotenv 6.0.0)
  try {
    await dotenv.load(fileName: '.env');
    debugPrint('✅ Environment variables loaded from .env');
    debugPrint('🔑 Gemini API configured: ${EnvConfig.isGeminiConfigured}');
  } catch (e) {
    debugPrint('⚠️ Failed to load .env file: $e');
    debugPrint('📝 Create a .env file in project root (use .env.example as template)');
    debugPrint('🔗 Get Gemini API key: https://aistudio.google.com/apikey');
  }

  // Initialize Firebase with error handling
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    FirebaseConfig.setAvailable(true);
    debugPrint('✅ Firebase initialized successfully');
  } catch (e) {
    FirebaseConfig.setAvailable(false);
    debugPrint('⚠️ Firebase initialization failed: $e');
    debugPrint('🔧 App will run in OFFLINE MODE without Firebase features');
  }

  runApp(
    const ProviderScope(
      child: WagglyApp(),
    ),
  );
}

class WagglyApp extends StatelessWidget {
  const WagglyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Waggly',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      // Localization configuration
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en'), // English
        Locale('fr'), // French
        Locale('es'), // Spanish
      ],
      // Uncomment to force French for testing:
      // locale: const Locale('fr'),
      home: const SplashScreen(),
    );
  }
}
