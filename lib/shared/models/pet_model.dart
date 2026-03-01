import 'package:cloud_firestore/cloud_firestore.dart';

/// Pet model for storing animal information
class PetModel {
  final String id;
  final String userId; // Owner's user ID
  final String name;
  final String species; // Dog, Cat, Bird, etc.
  final String breed;
  final DateTime dateOfBirth;
  final String gender; // Male, Female
  final double? weight; // in kg
  final String? photoUrl;
  final String? microchipNumber;
  final String? notes;
  final DateTime createdAt;
  final DateTime? lastVetVisit;

  PetModel({
    required this.id,
    required this.userId,
    required this.name,
    required this.species,
    required this.breed,
    required this.dateOfBirth,
    required this.gender,
    this.weight,
    this.photoUrl,
    this.microchipNumber,
    this.notes,
    required this.createdAt,
    this.lastVetVisit,
  });

  /// Calculate pet's age in years
  int get ageInYears {
    final now = DateTime.now();
    int age = now.year - dateOfBirth.year;
    if (now.month < dateOfBirth.month ||
        (now.month == dateOfBirth.month && now.day < dateOfBirth.day)) {
      age--;
    }
    return age;
  }

  /// Get age as a formatted string (e.g., "2 years", "6 months")
  String get ageString {
    final now = DateTime.now();
    final difference = now.difference(dateOfBirth);
    final years = (difference.inDays / 365).floor();
    final months = ((difference.inDays % 365) / 30).floor();

    if (years > 0) {
      return years == 1 ? '1 year' : '$years years';
    } else if (months > 0) {
      return months == 1 ? '1 month' : '$months months';
    } else {
      final days = difference.inDays;
      return days == 1 ? '1 day' : '$days days';
    }
  }

  /// From Firestore
  factory PetModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return PetModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      name: data['name'] ?? '',
      species: data['species'] ?? '',
      breed: data['breed'] ?? '',
      dateOfBirth: (data['dateOfBirth'] as Timestamp).toDate(),
      gender: data['gender'] ?? '',
      weight: data['weight']?.toDouble(),
      photoUrl: data['photoUrl'],
      microchipNumber: data['microchipNumber'],
      notes: data['notes'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      lastVetVisit: data['lastVetVisit'] != null
          ? (data['lastVetVisit'] as Timestamp).toDate()
          : null,
    );
  }

  /// To Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'name': name,
      'species': species,
      'breed': breed,
      'dateOfBirth': Timestamp.fromDate(dateOfBirth),
      'gender': gender,
      'weight': weight,
      'photoUrl': photoUrl,
      'microchipNumber': microchipNumber,
      'notes': notes,
      'createdAt': Timestamp.fromDate(createdAt),
      'lastVetVisit':
          lastVetVisit != null ? Timestamp.fromDate(lastVetVisit!) : null,
    };
  }

  /// Copy with
  PetModel copyWith({
    String? id,
    String? userId,
    String? name,
    String? species,
    String? breed,
    DateTime? dateOfBirth,
    String? gender,
    double? weight,
    String? photoUrl,
    String? microchipNumber,
    String? notes,
    DateTime? createdAt,
    DateTime? lastVetVisit,
  }) {
    return PetModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      species: species ?? this.species,
      breed: breed ?? this.breed,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      gender: gender ?? this.gender,
      weight: weight ?? this.weight,
      photoUrl: photoUrl ?? this.photoUrl,
      microchipNumber: microchipNumber ?? this.microchipNumber,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      lastVetVisit: lastVetVisit ?? this.lastVetVisit,
    );
  }
}
