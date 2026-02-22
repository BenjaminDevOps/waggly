/// App-wide constants for Waggly
class AppConstants {
  // App Info
  static const String appName = 'Waggly';
  static const String appVersion = '1.0.0';
  static const String appTagline = '🐾 Your Pet\'s Health Companion';

  // Freemium Limits
  static const int freeAiDiagnosisLimit = 3;
  static const int premiumAiDiagnosisLimit = -1; // unlimited

  // Gamification
  static const int pointsPerHealthCheck = 10;
  static const int pointsPerVetVisit = 50;
  static const int pointsPerDailyStreak = 5;
  static const int pointsPerWeeklyStreak = 25;

  // Affiliate
  static const String amazonAffiliateId = 'waggly-20';
  static const String zooplusAffiliateId = 'waggly';

  // Storage Keys
  static const String keyUser = 'user';
  static const String keyTheme = 'theme';
  static const String keyOnboarding = 'onboarding_completed';
  static const String keyStreak = 'daily_streak';
  static const String keyPoints = 'total_points';

  // Collections (Firestore)
  static const String collectionUsers = 'users';
  static const String collectionPets = 'pets';
  static const String collectionHealthRecords = 'health_records';
  static const String collectionDiagnoses = 'diagnoses';
  static const String collectionBadges = 'badges';
  static const String collectionShopItems = 'shop_items';
}
