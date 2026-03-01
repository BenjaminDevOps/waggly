import 'package:cloud_firestore/cloud_firestore.dart';

/// Diagnosis model for storing AI diagnosis data
class DiagnosisModel {
  final String id;
  final String userId;
  final String petId;
  final String petName; // Denormalized for easy display
  final String symptoms; // User's initial description
  final List<String> photoUrls; // Photos uploaded
  final String aiAnalysis; // Gemini's diagnosis
  final String recommendations; // AI recommendations
  final String severity; // Low, Medium, High, Critical
  final DateTime createdAt;
  final Map<String, dynamic>? conversationHistory; // Chat messages

  DiagnosisModel({
    required this.id,
    required this.userId,
    required this.petId,
    required this.petName,
    required this.symptoms,
    this.photoUrls = const [],
    required this.aiAnalysis,
    required this.recommendations,
    required this.severity,
    required this.createdAt,
    this.conversationHistory,
  });

  /// Get severity color
  String get severityColor {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'green';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      case 'critical':
        return 'darkred';
      default:
        return 'gray';
    }
  }

  /// Get severity emoji
  String get severityEmoji {
    switch (severity.toLowerCase()) {
      case 'low':
        return '✅';
      case 'medium':
        return '⚠️';
      case 'high':
        return '🚨';
      case 'critical':
        return '🆘';
      default:
        return 'ℹ️';
    }
  }

  /// From Firestore
  factory DiagnosisModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return DiagnosisModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      petId: data['petId'] ?? '',
      petName: data['petName'] ?? '',
      symptoms: data['symptoms'] ?? '',
      photoUrls: List<String>.from(data['photoUrls'] ?? []),
      aiAnalysis: data['aiAnalysis'] ?? '',
      recommendations: data['recommendations'] ?? '',
      severity: data['severity'] ?? 'Low',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      conversationHistory: data['conversationHistory'],
    );
  }

  /// To Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'petId': petId,
      'petName': petName,
      'symptoms': symptoms,
      'photoUrls': photoUrls,
      'aiAnalysis': aiAnalysis,
      'recommendations': recommendations,
      'severity': severity,
      'createdAt': Timestamp.fromDate(createdAt),
      'conversationHistory': conversationHistory,
    };
  }

  /// Copy with
  DiagnosisModel copyWith({
    String? id,
    String? userId,
    String? petId,
    String? petName,
    String? symptoms,
    List<String>? photoUrls,
    String? aiAnalysis,
    String? recommendations,
    String? severity,
    DateTime? createdAt,
    Map<String, dynamic>? conversationHistory,
  }) {
    return DiagnosisModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      petId: petId ?? this.petId,
      petName: petName ?? this.petName,
      symptoms: symptoms ?? this.symptoms,
      photoUrls: photoUrls ?? this.photoUrls,
      aiAnalysis: aiAnalysis ?? this.aiAnalysis,
      recommendations: recommendations ?? this.recommendations,
      severity: severity ?? this.severity,
      createdAt: createdAt ?? this.createdAt,
      conversationHistory: conversationHistory ?? this.conversationHistory,
    );
  }
}
