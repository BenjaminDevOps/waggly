import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';
import '../../core/config/firebase_config.dart';

/// Service for managing user data
class UserService {
  final FirebaseFirestore? _firestore = FirebaseConfig.isAvailable
      ? FirebaseFirestore.instance
      : null;

  /// Get user stream
  Stream<UserModel?> getUser(String userId) {
    if (_firestore == null) {
      return Stream.value(null);
    }

    return _firestore!
        .collection('users')
        .doc(userId)
        .snapshots()
        .map((snapshot) {
      if (!snapshot.exists) return null;
      return UserModel.fromFirestore(snapshot);
    });
  }

  /// Get user once
  Future<UserModel?> getUserOnce(String userId) async {
    if (_firestore == null) return null;

    final snapshot = await _firestore!.collection('users').doc(userId).get();

    if (!snapshot.exists) return null;
    return UserModel.fromFirestore(snapshot);
  }

  /// Create or update user
  Future<void> saveUser(UserModel user) async {
    if (_firestore == null) return;

    await _firestore!
        .collection('users')
        .doc(user.id)
        .set(user.toFirestore(), SetOptions(merge: true));
  }

  /// Update user fields
  Future<void> updateUser(String userId, Map<String, dynamic> data) async {
    if (_firestore == null) return;

    await _firestore!.collection('users').doc(userId).update(data);
  }

  /// Update user points
  Future<void> updatePoints(String userId, int points) async {
    if (_firestore == null) return;

    await _firestore!.collection('users').doc(userId).update({
      'totalPoints': FieldValue.increment(points),
    });
  }

  /// Update user streak
  Future<void> updateStreak(String userId, int streak) async {
    if (_firestore == null) return;

    await _firestore!.collection('users').doc(userId).update({
      'dailyStreak': streak,
      'lastActiveDate': Timestamp.now(),
    });
  }

  /// Add badge to user
  Future<void> addBadge(String userId, String badgeId) async {
    if (_firestore == null) return;

    await _firestore!.collection('users').doc(userId).update({
      'badges': FieldValue.arrayUnion([badgeId]),
    });
  }

  /// Increment AI diagnosis count
  Future<void> incrementDiagnosisCount(String userId) async {
    if (_firestore == null) return;

    await _firestore!.collection('users').doc(userId).update({
      'aiDiagnosisUsed': FieldValue.increment(1),
    });
  }

  /// Reset monthly diagnosis count
  Future<void> resetMonthlyDiagnosisCount(String userId) async {
    if (_firestore == null) return;

    await _firestore!.collection('users').doc(userId).update({
      'aiDiagnosisUsed': 0,
    });
  }

  /// Upgrade to premium
  Future<void> upgradeToPremium(String userId) async {
    if (_firestore == null) return;

    await _firestore!.collection('users').doc(userId).update({
      'isPremium': true,
    });
  }
}
