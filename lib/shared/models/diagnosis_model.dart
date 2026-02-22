import 'package:cloud_firestore/cloud_firestore.dart';

enum DiagnosisSeverity { low, medium, high, emergency }

/// AI Diagnosis model
class DiagnosisModel {
  final String id;
  final String userId;
  final String petId;
  final String symptoms;
  final List<String>? photoUrls;
  final String aiResponse;
  final DiagnosisSeverity severity;
  final List<String> possibleConditions;
  final List<String> recommendations;
  final bool requiresVetVisit;
  final DateTime createdAt;
  final Map<String, dynamic>? metadata;

  DiagnosisModel({
    required this.id,
    required this.userId,
    required this.petId,
    required this.symptoms,
    this.photoUrls,
    required this.aiResponse,
    required this.severity,
    required this.possibleConditions,
    required this.recommendations,
    required this.requiresVetVisit,
    required this.createdAt,
    this.metadata,
  });

  // From Firestore
  factory DiagnosisModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return DiagnosisModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      petId: data['petId'] ?? '',
      symptoms: data['symptoms'] ?? '',
      photoUrls: data['photoUrls'] != null
          ? List<String>.from(data['photoUrls'])
          : null,
      aiResponse: data['aiResponse'] ?? '',
      severity: DiagnosisSeverity.values.firstWhere(
        (e) => e.name == data['severity'],
        orElse: () => DiagnosisSeverity.medium,
      ),
      possibleConditions: List<String>.from(data['possibleConditions'] ?? []),
      recommendations: List<String>.from(data['recommendations'] ?? []),
      requiresVetVisit: data['requiresVetVisit'] ?? false,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      metadata: data['metadata'],
    );
  }

  // To Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'petId': petId,
      'symptoms': symptoms,
      'photoUrls': photoUrls,
      'aiResponse': aiResponse,
      'severity': severity.name,
      'possibleConditions': possibleConditions,
      'recommendations': recommendations,
      'requiresVetVisit': requiresVetVisit,
      'createdAt': Timestamp.fromDate(createdAt),
      'metadata': metadata,
    };
  }
}
