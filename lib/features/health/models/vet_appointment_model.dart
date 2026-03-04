import 'package:cloud_firestore/cloud_firestore.dart';

/// Veterinary appointment model
class VetAppointmentModel {
  final String id;
  final String petId;
  final DateTime dateTime;
  final String veterinarian;
  final String clinic;
  final String reason;
  final String? notes;
  final bool completed;

  VetAppointmentModel({
    required this.id,
    required this.petId,
    required this.dateTime,
    required this.veterinarian,
    required this.clinic,
    required this.reason,
    this.notes,
    this.completed = false,
  });

  /// Check if appointment is upcoming (within 7 days)
  bool get isUpcoming {
    if (completed) return false;
    final now = DateTime.now();
    return dateTime.isAfter(now) &&
        dateTime.difference(now).inDays <= 7;
  }

  /// Check if appointment is past
  bool get isPast {
    return DateTime.now().isAfter(dateTime);
  }

  /// From Firestore
  factory VetAppointmentModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return VetAppointmentModel(
      id: doc.id,
      petId: data['petId'] ?? '',
      dateTime: (data['dateTime'] as Timestamp).toDate(),
      veterinarian: data['veterinarian'] ?? '',
      clinic: data['clinic'] ?? '',
      reason: data['reason'] ?? '',
      notes: data['notes'],
      completed: data['completed'] ?? false,
    );
  }

  /// To Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'petId': petId,
      'dateTime': Timestamp.fromDate(dateTime),
      'veterinarian': veterinarian,
      'clinic': clinic,
      'reason': reason,
      'notes': notes,
      'completed': completed,
    };
  }

  /// Copy with
  VetAppointmentModel copyWith({
    String? id,
    String? petId,
    DateTime? dateTime,
    String? veterinarian,
    String? clinic,
    String? reason,
    String? notes,
    bool? completed,
  }) {
    return VetAppointmentModel(
      id: id ?? this.id,
      petId: petId ?? this.petId,
      dateTime: dateTime ?? this.dateTime,
      veterinarian: veterinarian ?? this.veterinarian,
      clinic: clinic ?? this.clinic,
      reason: reason ?? this.reason,
      notes: notes ?? this.notes,
      completed: completed ?? this.completed,
    );
  }
}
