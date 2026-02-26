import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'firebase_options.dart';
import 'core/theme/app_theme.dart';
import 'core/config/firebase_config.dart';
import 'features/auth/screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

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
      home: const SplashScreen(),
    );
  }
}
