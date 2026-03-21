import 'package:cloud_firestore/cloud_firestore.dart';

enum RecordType { vaccination, deworming, vetVisit, weight, medication, surgery, allergy, note }

/// Health record entry for a pet
class HealthRecordModel {
  final String id;
  final String petId;
  final String userId;
  final RecordType type;
  final String title;
  final String? description;
  final DateTime date;
  final DateTime? nextDueDate;
  final String? vetName;
  final double? weight;
  final List<String>? attachmentUrls;
  final DateTime createdAt;

  HealthRecordModel({
    required this.id,
    required this.petId,
    required this.userId,
    required this.type,
    required this.title,
    this.description,
    required this.date,
    this.nextDueDate,
    this.vetName,
    this.weight,
    this.attachmentUrls,
    required this.createdAt,
  });

  factory HealthRecordModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return HealthRecordModel(
      id: doc.id,
      petId: data['petId'] ?? '',
      userId: data['userId'] ?? '',
      type: RecordType.values.firstWhere(
        (e) => e.name == data['type'],
        orElse: () => RecordType.note,
      ),
      title: data['title'] ?? '',
      description: data['description'],
      date: (data['date'] as Timestamp).toDate(),
      nextDueDate: data['nextDueDate'] != null
          ? (data['nextDueDate'] as Timestamp).toDate()
          : null,
      vetName: data['vetName'],
      weight: data['weight']?.toDouble(),
      attachmentUrls: data['attachmentUrls'] != null
          ? List<String>.from(data['attachmentUrls'])
          : null,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'petId': petId,
      'userId': userId,
      'type': type.name,
      'title': title,
      'description': description,
      'date': Timestamp.fromDate(date),
      'nextDueDate': nextDueDate != null ? Timestamp.fromDate(nextDueDate!) : null,
      'vetName': vetName,
      'weight': weight,
      'attachmentUrls': attachmentUrls,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }

  String get typeLabel {
    switch (type) {
      case RecordType.vaccination:
        return 'Vaccination';
      case RecordType.deworming:
        return 'Deworming';
      case RecordType.vetVisit:
        return 'Vet Visit';
      case RecordType.weight:
        return 'Weight';
      case RecordType.medication:
        return 'Medication';
      case RecordType.surgery:
        return 'Surgery';
      case RecordType.allergy:
        return 'Allergy';
      case RecordType.note:
        return 'Note';
    }
  }

  String get typeIcon {
    switch (type) {
      case RecordType.vaccination:
        return '💉';
      case RecordType.deworming:
        return '💊';
      case RecordType.vetVisit:
        return '🏥';
      case RecordType.weight:
        return '⚖️';
      case RecordType.medication:
        return '💊';
      case RecordType.surgery:
        return '🔬';
      case RecordType.allergy:
        return '⚠️';
      case RecordType.note:
        return '📝';
    }
  }
}
