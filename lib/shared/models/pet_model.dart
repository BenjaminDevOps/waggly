import 'package:cloud_firestore/cloud_firestore.dart';

enum PetType { dog, cat, bird, rabbit, other }

enum PetGender { male, female, unknown }

/// Pet model for Waggly app
class PetModel {
  final String id;
  final String userId;
  final String name;
  final PetType type;
  final String? breed;
  final PetGender gender;
  final DateTime? birthDate;
  final double? weight; // in kg
  final String? photoUrl;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? microchipId;
  final Map<String, dynamic>? medicalNotes;

  PetModel({
    required this.id,
    required this.userId,
    required this.name,
    required this.type,
    this.breed,
    this.gender = PetGender.unknown,
    this.birthDate,
    this.weight,
    this.photoUrl,
    required this.createdAt,
    required this.updatedAt,
    this.microchipId,
    this.medicalNotes,
  });

  // Age in years
  int? get age {
    if (birthDate == null) return null;
    final now = DateTime.now();
    return now.year - birthDate!.year;
  }

  // From Firestore
  factory PetModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return PetModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      name: data['name'] ?? '',
      type: PetType.values.firstWhere(
        (e) => e.name == data['type'],
        orElse: () => PetType.other,
      ),
      breed: data['breed'],
      gender: PetGender.values.firstWhere(
        (e) => e.name == data['gender'],
        orElse: () => PetGender.unknown,
      ),
      birthDate: data['birthDate'] != null
          ? (data['birthDate'] as Timestamp).toDate()
          : null,
      weight: data['weight']?.toDouble(),
      photoUrl: data['photoUrl'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      updatedAt: (data['updatedAt'] as Timestamp).toDate(),
      microchipId: data['microchipId'],
      medicalNotes: data['medicalNotes'],
    );
  }

  // To Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'name': name,
      'type': type.name,
      'breed': breed,
      'gender': gender.name,
      'birthDate':
          birthDate != null ? Timestamp.fromDate(birthDate!) : null,
      'weight': weight,
      'photoUrl': photoUrl,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
      'microchipId': microchipId,
      'medicalNotes': medicalNotes,
    };
  }

  // Copy with
  PetModel copyWith({
    String? id,
    String? userId,
    String? name,
    PetType? type,
    String? breed,
    PetGender? gender,
    DateTime? birthDate,
    double? weight,
    String? photoUrl,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? microchipId,
    Map<String, dynamic>? medicalNotes,
  }) {
    return PetModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      type: type ?? this.type,
      breed: breed ?? this.breed,
      gender: gender ?? this.gender,
      birthDate: birthDate ?? this.birthDate,
      weight: weight ?? this.weight,
      photoUrl: photoUrl ?? this.photoUrl,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      microchipId: microchipId ?? this.microchipId,
      medicalNotes: medicalNotes ?? this.medicalNotes,
    );
  }
}
