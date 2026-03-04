import 'package:cloud_firestore/cloud_firestore.dart';

/// Weight record model for tracking pet weight over time
class WeightRecordModel {
  final String id;
  final String petId;
  final double weight; // in kg
  final DateTime date;
  final String? notes;

  WeightRecordModel({
    required this.id,
    required this.petId,
    required this.weight,
    required this.date,
    this.notes,
  });

  /// From Firestore
  factory WeightRecordModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return WeightRecordModel(
      id: doc.id,
      petId: data['petId'] ?? '',
      weight: (data['weight'] as num).toDouble(),
      date: (data['date'] as Timestamp).toDate(),
      notes: data['notes'],
    );
  }

  /// To Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'petId': petId,
      'weight': weight,
      'date': Timestamp.fromDate(date),
      'notes': notes,
    };
  }
}
