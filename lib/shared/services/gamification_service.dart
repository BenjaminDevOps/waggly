import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';
import '../../core/constants/app_constants.dart';

enum BadgeType {
  firstPet,
  firstDiagnosis,
  streak7Days,
  streak30Days,
  points100,
  points500,
  points1000,
  vetVisit5,
  healthChampion,
}

/// Gamification service for points, badges, and streaks
class GamificationService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Add points to user
  Future<void> addPoints(String userId, int points) async {
    try {
      final userRef = _firestore.collection('users').doc(userId);
      await userRef.update({
        'totalPoints': FieldValue.increment(points),
      });

      // Check for point-based badges
      await _checkPointBadges(userId);
    } catch (e) {
      throw Exception('Failed to add points: $e');
    }
  }

  /// Update daily streak
  Future<void> updateDailyStreak(String userId) async {
    try {
      final userRef = _firestore.collection('users').doc(userId);
      final doc = await userRef.get();
      final data = doc.data() as Map<String, dynamic>;

      final lastActiveDate = data['lastActiveDate'] != null
          ? (data['lastActiveDate'] as Timestamp).toDate()
          : null;

      final now = DateTime.now();
      int currentStreak = data['dailyStreak'] ?? 0;

      if (lastActiveDate != null) {
        final difference = now.difference(lastActiveDate).inDays;

        if (difference == 1) {
          // Consecutive day
          currentStreak++;
          await addPoints(userId, AppConstants.pointsPerDailyStreak);
        } else if (difference > 1) {
          // Streak broken
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      await userRef.update({
        'dailyStreak': currentStreak,
        'lastActiveDate': Timestamp.fromDate(now),
      });

      // Check for streak badges
      await _checkStreakBadges(userId, currentStreak);
    } catch (e) {
      throw Exception('Failed to update streak: $e');
    }
  }

  /// Award badge to user
  Future<void> awardBadge(String userId, BadgeType badge) async {
    try {
      final userRef = _firestore.collection('users').doc(userId);
      await userRef.update({
        'badges': FieldValue.arrayUnion([badge.name]),
      });

      // Award bonus points for new badge
      await addPoints(userId, 50);
    } catch (e) {
      throw Exception('Failed to award badge: $e');
    }
  }

  /// Check if user earned point-based badges
  Future<void> _checkPointBadges(String userId) async {
    final userRef = _firestore.collection('users').doc(userId);
    final doc = await userRef.get();
    final data = doc.data() as Map<String, dynamic>;

    final totalPoints = data['totalPoints'] ?? 0;
    final badges = List<String>.from(data['badges'] ?? []);

    if (totalPoints >= 100 && !badges.contains(BadgeType.points100.name)) {
      await awardBadge(userId, BadgeType.points100);
    }
    if (totalPoints >= 500 && !badges.contains(BadgeType.points500.name)) {
      await awardBadge(userId, BadgeType.points500);
    }
    if (totalPoints >= 1000 && !badges.contains(BadgeType.points1000.name)) {
      await awardBadge(userId, BadgeType.points1000);
    }
  }

  /// Check if user earned streak-based badges
  Future<void> _checkStreakBadges(String userId, int streak) async {
    final userRef = _firestore.collection('users').doc(userId);
    final doc = await userRef.get();
    final data = doc.data() as Map<String, dynamic>;
    final badges = List<String>.from(data['badges'] ?? []);

    if (streak >= 7 && !badges.contains(BadgeType.streak7Days.name)) {
      await awardBadge(userId, BadgeType.streak7Days);
    }
    if (streak >= 30 && !badges.contains(BadgeType.streak30Days.name)) {
      await awardBadge(userId, BadgeType.streak30Days);
    }
  }

  /// Get leaderboard
  Future<List<UserModel>> getLeaderboard({int limit = 10}) async {
    try {
      final querySnapshot = await _firestore
          .collection('users')
          .orderBy('totalPoints', descending: true)
          .limit(limit)
          .get();

      return querySnapshot.docs
          .map((doc) => UserModel.fromFirestore(doc))
          .toList();
    } catch (e) {
      throw Exception('Failed to get leaderboard: $e');
    }
  }

  /// Get badge information
  Map<String, dynamic> getBadgeInfo(BadgeType badge) {
    switch (badge) {
      case BadgeType.firstPet:
        return {
          'name': 'First Pet',
          'description': 'Added your first pet',
          'icon': '🐾',
        };
      case BadgeType.firstDiagnosis:
        return {
          'name': 'First Diagnosis',
          'description': 'Used AI diagnosis for the first time',
          'icon': '🔬',
        };
      case BadgeType.streak7Days:
        return {
          'name': '7 Day Streak',
          'description': 'Logged in for 7 consecutive days',
          'icon': '🔥',
        };
      case BadgeType.streak30Days:
        return {
          'name': '30 Day Streak',
          'description': 'Logged in for 30 consecutive days',
          'icon': '⭐',
        };
      case BadgeType.points100:
        return {
          'name': '100 Points',
          'description': 'Earned 100 points',
          'icon': '💯',
        };
      case BadgeType.points500:
        return {
          'name': '500 Points',
          'description': 'Earned 500 points',
          'icon': '💎',
        };
      case BadgeType.points1000:
        return {
          'name': '1000 Points',
          'description': 'Earned 1000 points',
          'icon': '👑',
        };
      case BadgeType.vetVisit5:
        return {
          'name': '5 Vet Visits',
          'description': 'Recorded 5 vet visits',
          'icon': '🏥',
        };
      case BadgeType.healthChampion:
        return {
          'name': 'Health Champion',
          'description': 'Maintained excellent pet health',
          'icon': '🏆',
        };
    }
  }
}
