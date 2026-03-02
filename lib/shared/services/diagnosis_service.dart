import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'dart:io';
import '../models/diagnosis_model.dart';
import '../../core/config/firebase_config.dart';

/// Service for managing AI diagnoses
class DiagnosisService {
  FirebaseFirestore? get _firestore =>
      FirebaseConfig.isAvailable ? FirebaseFirestore.instance : null;
  FirebaseStorage? get _storage =>
      FirebaseConfig.isAvailable ? FirebaseStorage.instance : null;

  // Freemium limits
  static const int FREE_DIAGNOSES_PER_MONTH = 3;

  void _checkFirebaseAvailability() {
    if (!FirebaseConfig.isAvailable) {
      throw Exception('Firebase is not available');
    }
  }

  /// Save a diagnosis to Firestore
  Future<DiagnosisModel> saveDiagnosis(DiagnosisModel diagnosis) async {
    _checkFirebaseAvailability();

    try {
      final docRef = await _firestore!.collection('diagnoses').add(diagnosis.toFirestore());
      return diagnosis.copyWith(id: docRef.id);
    } catch (e) {
      throw Exception('Failed to save diagnosis: $e');
    }
  }

  /// Upload diagnosis photos
  Future<List<String>> uploadPhotos(String diagnosisId, List<File> photos) async {
    _checkFirebaseAvailability();

    try {
      final urls = <String>[];
      
      for (int i = 0; i < photos.length; i++) {
        final fileName = 'diagnosis_${diagnosisId}_photo_$i.jpg';
        final ref = _storage!.ref().child('diagnoses/$diagnosisId/$fileName');
        
        await ref.putFile(photos[i]);
        final url = await ref.getDownloadURL();
        urls.add(url);
      }

      return urls;
    } catch (e) {
      throw Exception('Failed to upload photos: $e');
    }
  }

  /// Get user's diagnosis history
  Stream<List<DiagnosisModel>> getUserDiagnoses(String userId) {
    _checkFirebaseAvailability();

    return _firestore!
        .collection('diagnoses')
        .where('userId', isEqualTo: userId)
        .snapshots()
        .map((snapshot) {
      final diagnoses = snapshot.docs
          .map((doc) => DiagnosisModel.fromFirestore(doc))
          .toList();
      // Sort by date descending (newest first) on client side
      diagnoses.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return diagnoses;
    });
  }

  /// Get diagnoses for a specific pet
  Stream<List<DiagnosisModel>> getPetDiagnoses(String petId) {
    _checkFirebaseAvailability();

    return _firestore!
        .collection('diagnoses')
        .where('petId', isEqualTo: petId)
        .snapshots()
        .map((snapshot) {
      final diagnoses = snapshot.docs
          .map((doc) => DiagnosisModel.fromFirestore(doc))
          .toList();
      diagnoses.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return diagnoses;
    });
  }

  /// Get single diagnosis by ID
  Future<DiagnosisModel?> getDiagnosis(String diagnosisId) async {
    _checkFirebaseAvailability();

    try {
      final doc = await _firestore!.collection('diagnoses').doc(diagnosisId).get();
      if (!doc.exists) return null;
      return DiagnosisModel.fromFirestore(doc);
    } catch (e) {
      throw Exception('Failed to get diagnosis: $e');
    }
  }

  /// Delete a diagnosis
  Future<void> deleteDiagnosis(String diagnosisId) async {
    _checkFirebaseAvailability();

    try {
      await _firestore!.collection('diagnoses').doc(diagnosisId).delete();

      // Delete photos from storage
      try {
        final ref = _storage!.ref().child('diagnoses/$diagnosisId');
        final listResult = await ref.listAll();
        for (var item in listResult.items) {
          await item.delete();
        }
      } catch (e) {
        // Ignore storage errors
      }
    } catch (e) {
      throw Exception('Failed to delete diagnosis: $e');
    }
  }

  /// Get diagnosis count for current month (for freemium check)
  ///
  /// IMPORTANT: Requires Firestore composite index on 'diagnoses':
  /// - userId (Ascending)
  /// - createdAt (Ascending)
  ///
  /// Create via Firebase Console > Firestore > Indexes
  Future<int> getMonthlyDiagnosisCount(String userId) async {
    // If Firebase is not available, return 0 (allow unlimited diagnoses)
    if (!FirebaseConfig.isAvailable) {
      return 0;
    }

    try {
      final now = DateTime.now();
      final startOfMonth = DateTime(now.year, now.month, 1);

      // Optimized server-side query (requires composite index)
      final snapshot = await _firestore!
          .collection('diagnoses')
          .where('userId', isEqualTo: userId)
          .where('createdAt', isGreaterThanOrEqualTo: Timestamp.fromDate(startOfMonth))
          .get();

      return snapshot.docs.length;
    } catch (e) {
      // If index not created yet or other error, fall back to client-side filtering
      print('Warning: Falling back to client-side filtering: $e');

      try {
        final now = DateTime.now();
        final startOfMonth = DateTime(now.year, now.month, 1);

        final snapshot = await _firestore!
            .collection('diagnoses')
            .where('userId', isEqualTo: userId)
            .get();

        final monthlyDocs = snapshot.docs.where((doc) {
          final data = doc.data();
          final createdAt = (data['createdAt'] as Timestamp).toDate();
          return createdAt.isAfter(startOfMonth) || createdAt.isAtSameMomentAs(startOfMonth);
        });

        return monthlyDocs.length;
      } catch (e2) {
        // If all fails, allow diagnosis
        print('Error: Could not check diagnosis quota: $e2');
        return 0;
      }
    }
  }

  /// Check if user can create a new diagnosis (freemium check)
  Future<bool> canCreateDiagnosis(String userId, bool isPremium) async {
    if (isPremium) return true;

    final count = await getMonthlyDiagnosisCount(userId);
    return count < FREE_DIAGNOSES_PER_MONTH;
  }

  /// Get remaining free diagnoses for the month
  Future<int> getRemainingFreeDiagnoses(String userId, bool isPremium) async {
    if (isPremium) return -1; // Unlimited for premium

    final count = await getMonthlyDiagnosisCount(userId);
    return (FREE_DIAGNOSES_PER_MONTH - count).clamp(0, FREE_DIAGNOSES_PER_MONTH);
  }
}
