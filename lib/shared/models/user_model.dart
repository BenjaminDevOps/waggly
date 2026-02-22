import 'package:cloud_firestore/cloud_firestore.dart';

/// User model for Waggly app
class UserModel {
  final String id;
  final String email;
  final String displayName;
  final String? photoUrl;
  final DateTime createdAt;
  final bool isPremium;
  final int totalPoints;
  final int dailyStreak;
  final int aiDiagnosisUsed; // For freemium tracking
  final DateTime? lastActiveDate;
  final List<String> badges;

  UserModel({
    required this.id,
    required this.email,
    required this.displayName,
    this.photoUrl,
    required this.createdAt,
    this.isPremium = false,
    this.totalPoints = 0,
    this.dailyStreak = 0,
    this.aiDiagnosisUsed = 0,
    this.lastActiveDate,
    this.badges = const [],
  });

  // From Firestore
  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel(
      id: doc.id,
      email: data['email'] ?? '',
      displayName: data['displayName'] ?? '',
      photoUrl: data['photoUrl'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      isPremium: data['isPremium'] ?? false,
      totalPoints: data['totalPoints'] ?? 0,
      dailyStreak: data['dailyStreak'] ?? 0,
      aiDiagnosisUsed: data['aiDiagnosisUsed'] ?? 0,
      lastActiveDate: data['lastActiveDate'] != null
          ? (data['lastActiveDate'] as Timestamp).toDate()
          : null,
      badges: List<String>.from(data['badges'] ?? []),
    );
  }

  // To Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'email': email,
      'displayName': displayName,
      'photoUrl': photoUrl,
      'createdAt': Timestamp.fromDate(createdAt),
      'isPremium': isPremium,
      'totalPoints': totalPoints,
      'dailyStreak': dailyStreak,
      'aiDiagnosisUsed': aiDiagnosisUsed,
      'lastActiveDate':
          lastActiveDate != null ? Timestamp.fromDate(lastActiveDate!) : null,
      'badges': badges,
    };
  }

  // Copy with
  UserModel copyWith({
    String? id,
    String? email,
    String? displayName,
    String? photoUrl,
    DateTime? createdAt,
    bool? isPremium,
    int? totalPoints,
    int? dailyStreak,
    int? aiDiagnosisUsed,
    DateTime? lastActiveDate,
    List<String>? badges,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      displayName: displayName ?? this.displayName,
      photoUrl: photoUrl ?? this.photoUrl,
      createdAt: createdAt ?? this.createdAt,
      isPremium: isPremium ?? this.isPremium,
      totalPoints: totalPoints ?? this.totalPoints,
      dailyStreak: dailyStreak ?? this.dailyStreak,
      aiDiagnosisUsed: aiDiagnosisUsed ?? this.aiDiagnosisUsed,
      lastActiveDate: lastActiveDate ?? this.lastActiveDate,
      badges: badges ?? this.badges,
    );
  }
}
