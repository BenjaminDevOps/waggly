import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:uuid/uuid.dart';
import '../models/walk_model.dart';

/// Service for managing walk sessions
class WalkService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final _uuid = const Uuid();

  static const String _collection = 'walks';

  /// Points calculation
  static int calculatePoints(int steps, int durationMinutes) {
    int points = 0;
    points += (steps / 100).floor(); // 1 point per 100 steps
    points += (durationMinutes / 5).floor() * 2; // 2 points per 5 min
    if (steps >= 5000) points += 20; // bonus for 5k steps
    if (steps >= 10000) points += 50; // bonus for 10k steps
    if (durationMinutes >= 30) points += 15; // bonus for 30 min walk
    return points;
  }

  /// Estimate calories burned (rough estimate)
  static int estimateCalories(int steps, double? petWeightKg) {
    // Average: 0.04 calories per step for a person walking with a pet
    return (steps * 0.04).round();
  }

  /// Estimate distance from steps (average stride ~0.7m)
  static double estimateDistanceKm(int steps) {
    return (steps * 0.7) / 1000;
  }

  /// Save a completed walk
  Future<WalkModel> saveWalk({
    required String userId,
    String? petId,
    String? petName,
    required DateTime startTime,
    required DateTime endTime,
    required int steps,
  }) async {
    final walkId = _uuid.v4();
    final durationMinutes = endTime.difference(startTime).inMinutes;
    final distanceKm = estimateDistanceKm(steps);
    final calories = estimateCalories(steps, null);
    final points = calculatePoints(steps, durationMinutes);

    final walk = WalkModel(
      id: walkId,
      userId: userId,
      petId: petId,
      petName: petName,
      startTime: startTime,
      endTime: endTime,
      steps: steps,
      distanceKm: distanceKm,
      durationMinutes: durationMinutes,
      caloriesBurned: calories,
      pointsEarned: points,
    );

    await _firestore.collection(_collection).doc(walkId).set(walk.toFirestore());

    return walk;
  }

  /// Get walks for a user
  Future<List<WalkModel>> getUserWalks(String userId, {int limit = 20}) async {
    final querySnapshot = await _firestore
        .collection(_collection)
        .where('userId', isEqualTo: userId)
        .orderBy('startTime', descending: true)
        .limit(limit)
        .get();

    return querySnapshot.docs.map((doc) => WalkModel.fromFirestore(doc)).toList();
  }

  /// Get today's walk stats
  Future<Map<String, dynamic>> getTodayStats(String userId) async {
    final now = DateTime.now();
    final startOfDay = DateTime(now.year, now.month, now.day);

    final querySnapshot = await _firestore
        .collection(_collection)
        .where('userId', isEqualTo: userId)
        .where('startTime', isGreaterThanOrEqualTo: Timestamp.fromDate(startOfDay))
        .get();

    int totalSteps = 0;
    double totalDistance = 0;
    int totalDuration = 0;
    int totalCalories = 0;
    int totalPoints = 0;

    for (final doc in querySnapshot.docs) {
      final walk = WalkModel.fromFirestore(doc);
      totalSteps += walk.steps;
      totalDistance += walk.distanceKm;
      totalDuration += walk.durationMinutes;
      totalCalories += walk.caloriesBurned;
      totalPoints += walk.pointsEarned;
    }

    return {
      'steps': totalSteps,
      'distance': totalDistance,
      'duration': totalDuration,
      'calories': totalCalories,
      'points': totalPoints,
      'walkCount': querySnapshot.docs.length,
    };
  }

  /// Get weekly walk stats
  Future<List<Map<String, dynamic>>> getWeeklyStats(String userId) async {
    final now = DateTime.now();
    final weekAgo = now.subtract(const Duration(days: 7));

    final querySnapshot = await _firestore
        .collection(_collection)
        .where('userId', isEqualTo: userId)
        .where('startTime', isGreaterThanOrEqualTo: Timestamp.fromDate(weekAgo))
        .orderBy('startTime')
        .get();

    // Group by day
    final Map<String, Map<String, dynamic>> dailyStats = {};
    for (int i = 0; i < 7; i++) {
      final date = now.subtract(Duration(days: 6 - i));
      final key = '${date.year}-${date.month}-${date.day}';
      dailyStats[key] = {'steps': 0, 'distance': 0.0, 'day': date.weekday};
    }

    for (final doc in querySnapshot.docs) {
      final walk = WalkModel.fromFirestore(doc);
      final key =
          '${walk.startTime.year}-${walk.startTime.month}-${walk.startTime.day}';
      if (dailyStats.containsKey(key)) {
        dailyStats[key]!['steps'] =
            (dailyStats[key]!['steps'] as int) + walk.steps;
        dailyStats[key]!['distance'] =
            (dailyStats[key]!['distance'] as double) + walk.distanceKm;
      }
    }

    return dailyStats.values.toList();
  }
}
