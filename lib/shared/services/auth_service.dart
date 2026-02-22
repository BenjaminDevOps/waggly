import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';
import '../../core/config/firebase_config.dart';

/// Authentication service using Firebase Auth
class AuthService {
  // Lazy initialization to avoid crashes when Firebase is not available
  FirebaseAuth? get _auth => FirebaseConfig.isAvailable ? FirebaseAuth.instance : null;
  FirebaseFirestore? get _firestore => FirebaseConfig.isAvailable ? FirebaseFirestore.instance : null;

  /// Check if Firebase is available
  bool get isFirebaseAvailable => FirebaseConfig.isAvailable;

  /// Throw error if Firebase is not available
  void _checkFirebaseAvailability() {
    if (!FirebaseConfig.isAvailable) {
      throw Exception(
        'Firebase is not available. The app is running in OFFLINE MODE.\n'
        'Please configure Firebase properly to use authentication features.'
      );
    }
  }

  // Get current user
  User? get currentUser => _auth?.currentUser;

  // Auth state changes
  Stream<User?> get authStateChanges =>
    _auth?.authStateChanges() ?? Stream.value(null);

  // Sign up with email and password
  Future<UserModel?> signUpWithEmail({
    required String email,
    required String password,
    required String displayName,
  }) async {
    _checkFirebaseAvailability();

    try {
      final userCredential = await _auth!.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      final user = userCredential.user;
      if (user == null) return null;

      // Update display name
      await user.updateDisplayName(displayName);

      // Create user document in Firestore
      final userModel = UserModel(
        id: user.uid,
        email: email,
        displayName: displayName,
        createdAt: DateTime.now(),
      );

      await _firestore!
          .collection('users')
          .doc(user.uid)
          .set(userModel.toFirestore());

      return userModel;
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    }
  }

  // Sign in with email and password
  Future<UserModel?> signInWithEmail({
    required String email,
    required String password,
  }) async {
    _checkFirebaseAvailability();

    try {
      final userCredential = await _auth!.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      final user = userCredential.user;
      if (user == null) return null;

      // Get user data from Firestore
      final doc = await _firestore!.collection('users').doc(user.uid).get();
      return UserModel.fromFirestore(doc);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    }
  }

  // Sign out
  Future<void> signOut() async {
    _checkFirebaseAvailability();
    await _auth!.signOut();
  }

  // Reset password
  Future<void> resetPassword(String email) async {
    _checkFirebaseAvailability();
    try {
      await _auth!.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    }
  }

  // Get user data from Firestore
  Future<UserModel?> getUserData(String userId) async {
    _checkFirebaseAvailability();
    try {
      final doc = await _firestore!.collection('users').doc(userId).get();
      if (!doc.exists) return null;
      return UserModel.fromFirestore(doc);
    } catch (e) {
      throw Exception('Failed to get user data: $e');
    }
  }

  // Update user data
  Future<void> updateUserData(UserModel user) async {
    _checkFirebaseAvailability();
    try {
      await _firestore!
          .collection('users')
          .doc(user.id)
          .update(user.toFirestore());
    } catch (e) {
      throw Exception('Failed to update user data: $e');
    }
  }

  // Handle Firebase Auth exceptions
  String _handleAuthException(FirebaseAuthException e) {
    switch (e.code) {
      case 'email-already-in-use':
        return 'This email is already registered';
      case 'invalid-email':
        return 'Invalid email address';
      case 'operation-not-allowed':
        return 'Operation not allowed';
      case 'weak-password':
        return 'Password is too weak';
      case 'user-disabled':
        return 'This account has been disabled';
      case 'user-not-found':
        return 'No user found with this email';
      case 'wrong-password':
        return 'Incorrect password';
      default:
        return 'Authentication error: ${e.message}';
    }
  }
}
