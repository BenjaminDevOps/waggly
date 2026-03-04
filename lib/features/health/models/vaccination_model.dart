import 'package:cloud_firestore/cloud_firestore.dart';

/// Vaccination record model
class VaccinationModel {
  final String id;
  final String petId;
  final String vaccineName;
  final DateTime date;
  final DateTime? nextDueDate;
  final String veterinarian;
  final String? batchNumber;
  final String? notes;

  VaccinationModel({
    required this.id,
    required this.petId,
    required this.vaccineName,
    required this.date,
    this.nextDueDate,
    required this.veterinarian,
    this.batchNumber,
    this.notes,
  });

  /// Check if vaccination is overdue
  bool get isOverdue {
    if (nextDueDate == null) return false;
    return DateTime.now().isAfter(nextDueDate!);
  }

  /// Check if vaccination is due soon (within 30 days)
  bool get isDueSoon {
    if (nextDueDate == null) return false;
    final daysUntilDue = nextDueDate!.difference(DateTime.now()).inDays;
    return daysUntilDue >= 0 && daysUntilDue <= 30;
  }

  /// From Firestore
  factory VaccinationModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return VaccinationModel(
      id: doc.id,
      petId: data['petId'] ?? '',
      vaccineName: data['vaccineName'] ?? '',
      date: (data['date'] as Timestamp).toDate(),
      nextDueDate: data['nextDueDate'] != null
          ? (data['nextDueDate'] as Timestamp).toDate()
          : null,
      veterinarian: data['veterinarian'] ?? '',
      batchNumber: data['batchNumber'],
      notes: data['notes'],
    );
  }

  /// To Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'petId': petId,
      'vaccineName': vaccineName,
      'date': Timestamp.fromDate(date),
      'nextDueDate':
          nextDueDate != null ? Timestamp.fromDate(nextDueDate!) : null,
      'veterinarian': veterinarian,
      'batchNumber': batchNumber,
      'notes': notes,
    };
  }
}
