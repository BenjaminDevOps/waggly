import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';
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

      // If document doesn't exist, create it (for legacy users)
      if (!doc.exists) {
        final userModel = UserModel(
          id: user.uid,
          email: email,
          displayName: user.displayName ?? email.split('@')[0],
          photoUrl: user.photoURL,
          createdAt: DateTime.now(),
        );

        await _firestore!
            .collection('users')
            .doc(user.uid)
            .set(userModel.toFirestore());

        return userModel;
      }

      return UserModel.fromFirestore(doc);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    }
  }

  // Sign in with Google
  Future<UserModel?> signInWithGoogle() async {
    _checkFirebaseAvailability();

    try {
      // Trigger the authentication flow
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();

      // If user cancels the sign-in
      if (googleUser == null) return null;

      // Obtain the auth details from the request
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

      // Create a new credential
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      // Sign in to Firebase with the Google credential
      final userCredential = await _auth!.signInWithCredential(credential);
      final user = userCredential.user;
      if (user == null) return null;

      // Check if user document exists in Firestore
      final doc = await _firestore!.collection('users').doc(user.uid).get();

      if (doc.exists) {
        // User already exists, return existing data
        return UserModel.fromFirestore(doc);
      } else {
        // New user, create document
        final userModel = UserModel(
          id: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? 'User',
          photoUrl: user.photoURL,
          createdAt: DateTime.now(),
        );

        await _firestore!
            .collection('users')
            .doc(user.uid)
            .set(userModel.toFirestore());

        return userModel;
      }
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      // Handle specific Google Sign-In errors
      final errorMessage = e.toString();
      if (errorMessage.contains('ApiException: 10')) {
        throw Exception(
          'Google Sign-In configuration error.\n\n'
          'Please add SHA-1 fingerprint to Firebase Console:\n'
          '1. Run: cd android && ./gradlew signingReport\n'
          '2. Copy the SHA-1 fingerprint\n'
          '3. Add it to Firebase Console → Project Settings → Your App\n\n'
          'Then restart the app.'
        );
      } else if (errorMessage.contains('sign_in_canceled')) {
        return null; // User canceled, don't show error
      } else {
        throw Exception('Google Sign-In failed: $errorMessage');
      }
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
