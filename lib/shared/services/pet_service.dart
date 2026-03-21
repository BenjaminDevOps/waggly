import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:uuid/uuid.dart';
import '../models/pet_model.dart';
import '../models/health_record_model.dart';
import '../../core/constants/app_constants.dart';

/// Service for managing pets and health records
class PetService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final _uuid = const Uuid();

  // ==================== PET CRUD ====================

  /// Add a new pet
  Future<PetModel> addPet({
    required String userId,
    required String name,
    required PetType type,
    String? breed,
    PetGender gender = PetGender.unknown,
    DateTime? birthDate,
    double? weight,
    String? photoUrl,
    String? microchipId,
  }) async {
    final now = DateTime.now();
    final petId = _uuid.v4();

    final pet = PetModel(
      id: petId,
      userId: userId,
      name: name,
      type: type,
      breed: breed,
      gender: gender,
      birthDate: birthDate,
      weight: weight,
      photoUrl: photoUrl,
      createdAt: now,
      updatedAt: now,
      microchipId: microchipId,
    );

    await _firestore
        .collection(AppConstants.collectionPets)
        .doc(petId)
        .set(pet.toFirestore());

    return pet;
  }

  /// Get all pets for a user
  Future<List<PetModel>> getUserPets(String userId) async {
    final querySnapshot = await _firestore
        .collection(AppConstants.collectionPets)
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .get();

    return querySnapshot.docs.map((doc) => PetModel.fromFirestore(doc)).toList();
  }

  /// Get a specific pet
  Future<PetModel?> getPet(String petId) async {
    final doc = await _firestore
        .collection(AppConstants.collectionPets)
        .doc(petId)
        .get();

    if (!doc.exists) return null;
    return PetModel.fromFirestore(doc);
  }

  /// Update a pet
  Future<void> updatePet(PetModel pet) async {
    await _firestore
        .collection(AppConstants.collectionPets)
        .doc(pet.id)
        .update(pet.copyWith(updatedAt: DateTime.now()).toFirestore());
  }

  /// Delete a pet and its records
  Future<void> deletePet(String petId) async {
    // Delete health records
    final records = await _firestore
        .collection(AppConstants.collectionHealthRecords)
        .where('petId', isEqualTo: petId)
        .get();

    for (final doc in records.docs) {
      await doc.reference.delete();
    }

    // Delete pet
    await _firestore.collection(AppConstants.collectionPets).doc(petId).delete();
  }

  /// Stream pets for real-time updates
  Stream<List<PetModel>> streamUserPets(String userId) {
    return _firestore
        .collection(AppConstants.collectionPets)
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => PetModel.fromFirestore(doc)).toList());
  }

  // ==================== HEALTH RECORDS ====================

  /// Add a health record
  Future<HealthRecordModel> addHealthRecord({
    required String petId,
    required String userId,
    required RecordType type,
    required String title,
    String? description,
    required DateTime date,
    DateTime? nextDueDate,
    String? vetName,
    double? weight,
    List<String>? attachmentUrls,
  }) async {
    final recordId = _uuid.v4();
    final now = DateTime.now();

    final record = HealthRecordModel(
      id: recordId,
      petId: petId,
      userId: userId,
      type: type,
      title: title,
      description: description,
      date: date,
      nextDueDate: nextDueDate,
      vetName: vetName,
      weight: weight,
      attachmentUrls: attachmentUrls,
      createdAt: now,
    );

    await _firestore
        .collection(AppConstants.collectionHealthRecords)
        .doc(recordId)
        .set(record.toFirestore());

    // Update pet weight if it's a weight record
    if (type == RecordType.weight && weight != null) {
      await _firestore
          .collection(AppConstants.collectionPets)
          .doc(petId)
          .update({'weight': weight, 'updatedAt': Timestamp.fromDate(now)});
    }

    return record;
  }

  /// Get health records for a pet
  Future<List<HealthRecordModel>> getPetHealthRecords(String petId) async {
    final querySnapshot = await _firestore
        .collection(AppConstants.collectionHealthRecords)
        .where('petId', isEqualTo: petId)
        .orderBy('date', descending: true)
        .get();

    return querySnapshot.docs
        .map((doc) => HealthRecordModel.fromFirestore(doc))
        .toList();
  }

  /// Get upcoming due records (vaccinations, dewormings)
  Future<List<HealthRecordModel>> getUpcomingRecords(String userId) async {
    final now = DateTime.now();
    final querySnapshot = await _firestore
        .collection(AppConstants.collectionHealthRecords)
        .where('userId', isEqualTo: userId)
        .where('nextDueDate', isGreaterThanOrEqualTo: Timestamp.fromDate(now))
        .orderBy('nextDueDate')
        .limit(10)
        .get();

    return querySnapshot.docs
        .map((doc) => HealthRecordModel.fromFirestore(doc))
        .toList();
  }

  /// Get weight history for chart
  Future<List<HealthRecordModel>> getWeightHistory(String petId) async {
    final querySnapshot = await _firestore
        .collection(AppConstants.collectionHealthRecords)
        .where('petId', isEqualTo: petId)
        .where('type', isEqualTo: RecordType.weight.name)
        .orderBy('date')
        .get();

    return querySnapshot.docs
        .map((doc) => HealthRecordModel.fromFirestore(doc))
        .toList();
  }

  /// Delete a health record
  Future<void> deleteHealthRecord(String recordId) async {
    await _firestore
        .collection(AppConstants.collectionHealthRecords)
        .doc(recordId)
        .delete();
  }
}
