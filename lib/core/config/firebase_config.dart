/// Firebase availability configuration
class FirebaseConfig {
  static bool _isAvailable = false;

  /// Check if Firebase is available and initialized
  static bool get isAvailable => _isAvailable;

  /// Set Firebase availability status
  static void setAvailable(bool value) {
    _isAvailable = value;
  }
}
