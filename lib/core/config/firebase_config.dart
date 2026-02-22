import 'package:firebase_core/firebase_core.dart';

/// Firebase configuration for Waggly
class FirebaseConfig {
  static Future<void> initialize() async {
    await Firebase.initializeApp(
      options: const FirebaseOptions(
        apiKey: 'YOUR_API_KEY',
        appId: '1:YOUR_APP_ID',
        messagingSenderId: 'YOUR_SENDER_ID',
        projectId: 'waggly-pet-health',
        storageBucket: 'waggly-pet-health.appspot.com',
      ),
    );
  }
}
