import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'dart:io';
import '../models/pet_model.dart';
import '../../core/config/firebase_config.dart';

/// Service for managing pets in Firestore
class PetService {
  FirebaseFirestore? get _firestore =>
      FirebaseConfig.isAvailable ? FirebaseFirestore.instance : null;
  FirebaseStorage? get _storage =>
      FirebaseConfig.isAvailable ? FirebaseStorage.instance : null;

  /// Check if Firebase is available
  void _checkFirebaseAvailability() {
    if (!FirebaseConfig.isAvailable) {
      throw Exception(
          'Firebase is not available. The app is running in OFFLINE MODE.');
    }
  }

  /// Add a new pet
  Future<PetModel> addPet(PetModel pet) async {
    _checkFirebaseAvailability();

    try {
      final docRef = await _firestore!.collection('pets').add(pet.toFirestore());

      return pet.copyWith(id: docRef.id);
    } catch (e) {
      throw Exception('Failed to add pet: $e');
    }
  }

  /// Upload pet photo to Firebase Storage
  Future<String> uploadPetPhoto(String petId, File imageFile) async {
    _checkFirebaseAvailability();

    try {
      final fileName = 'pet_${petId}_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final ref = _storage!.ref().child('pets/$petId/$fileName');

      await ref.putFile(imageFile);
      final downloadUrl = await ref.getDownloadURL();

      return downloadUrl;
    } catch (e) {
      throw Exception('Failed to upload photo: $e');
    }
  }

  /// Get all pets for a user
  Stream<List<PetModel>> getUserPets(String userId) {
    _checkFirebaseAvailability();

    return _firestore!
        .collection('pets')
        .where('userId', isEqualTo: userId)
        .snapshots()
        .map((snapshot) {
      final pets = snapshot.docs.map((doc) => PetModel.fromFirestore(doc)).toList();
      // Sort by createdAt descending (newest first) on client side
      pets.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return pets;
    });
  }

  /// Get a single pet by ID
  Future<PetModel?> getPet(String petId) async {
    _checkFirebaseAvailability();

    try {
      final doc = await _firestore!.collection('pets').doc(petId).get();
      if (!doc.exists) return null;
      return PetModel.fromFirestore(doc);
    } catch (e) {
      throw Exception('Failed to get pet: $e');
    }
  }

  /// Update a pet
  Future<void> updatePet(PetModel pet) async {
    _checkFirebaseAvailability();

    try {
      await _firestore!
          .collection('pets')
          .doc(pet.id)
          .update(pet.toFirestore());
    } catch (e) {
      throw Exception('Failed to update pet: $e');
    }
  }

  /// Delete a pet
  Future<void> deletePet(String petId) async {
    _checkFirebaseAvailability();

    try {
      // Delete pet document
      await _firestore!.collection('pets').doc(petId).delete();

      // Delete pet photos from storage
      try {
        final ref = _storage!.ref().child('pets/$petId');
        final listResult = await ref.listAll();
        for (var item in listResult.items) {
          await item.delete();
        }
      } catch (e) {
        // Ignore storage errors (photos might not exist)
      }
    } catch (e) {
      throw Exception('Failed to delete pet: $e');
    }
  }

  /// Get pet count for a user
  Future<int> getUserPetCount(String userId) async {
    _checkFirebaseAvailability();

    try {
      final snapshot = await _firestore!
          .collection('pets')
          .where('userId', isEqualTo: userId)
          .get();
      return snapshot.docs.length;
    } catch (e) {
      throw Exception('Failed to get pet count: $e');
    }
  }
}
