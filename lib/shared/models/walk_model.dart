import 'package:cloud_firestore/cloud_firestore.dart';

/// Walk session model for pedometer feature
class WalkModel {
  final String id;
  final String userId;
  final String? petId;
  final String? petName;
  final DateTime startTime;
  final DateTime? endTime;
  final int steps;
  final double distanceKm;
  final int durationMinutes;
  final int caloriesBurned;
  final int pointsEarned;
  final String? mood; // happy, neutral, tired

  WalkModel({
    required this.id,
    required this.userId,
    this.petId,
    this.petName,
    required this.startTime,
    this.endTime,
    this.steps = 0,
    this.distanceKm = 0.0,
    this.durationMinutes = 0,
    this.caloriesBurned = 0,
    this.pointsEarned = 0,
    this.mood,
  });

  factory WalkModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return WalkModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      petId: data['petId'],
      petName: data['petName'],
      startTime: (data['startTime'] as Timestamp).toDate(),
      endTime: data['endTime'] != null
          ? (data['endTime'] as Timestamp).toDate()
          : null,
      steps: data['steps'] ?? 0,
      distanceKm: (data['distanceKm'] ?? 0.0).toDouble(),
      durationMinutes: data['durationMinutes'] ?? 0,
      caloriesBurned: data['caloriesBurned'] ?? 0,
      pointsEarned: data['pointsEarned'] ?? 0,
      mood: data['mood'],
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'petId': petId,
      'petName': petName,
      'startTime': Timestamp.fromDate(startTime),
      'endTime': endTime != null ? Timestamp.fromDate(endTime!) : null,
      'steps': steps,
      'distanceKm': distanceKm,
      'durationMinutes': durationMinutes,
      'caloriesBurned': caloriesBurned,
      'pointsEarned': pointsEarned,
      'mood': mood,
    };
  }

  WalkModel copyWith({
    String? id,
    String? userId,
    String? petId,
    String? petName,
    DateTime? startTime,
    DateTime? endTime,
    int? steps,
    double? distanceKm,
    int? durationMinutes,
    int? caloriesBurned,
    int? pointsEarned,
    String? mood,
  }) {
    return WalkModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      petId: petId ?? this.petId,
      petName: petName ?? this.petName,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      steps: steps ?? this.steps,
      distanceKm: distanceKm ?? this.distanceKm,
      durationMinutes: durationMinutes ?? this.durationMinutes,
      caloriesBurned: caloriesBurned ?? this.caloriesBurned,
      pointsEarned: pointsEarned ?? this.pointsEarned,
      mood: mood ?? this.mood,
    );
  }
}
