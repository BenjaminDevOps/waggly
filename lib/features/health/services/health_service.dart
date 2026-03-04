import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/config/firebase_config.dart';
import '../models/vaccination_model.dart';
import '../models/weight_record_model.dart';
import '../models/vet_appointment_model.dart';

/// Service for managing pet health records
class HealthService {
  final FirebaseFirestore? _firestore = FirebaseConfig.isAvailable
      ? FirebaseFirestore.instance
      : null;

  // ==================== VACCINATIONS ====================

  /// Get all vaccinations for a pet
  Stream<List<VaccinationModel>> getPetVaccinations(String petId) {
    if (_firestore == null) return Stream.value([]);

    return _firestore!
        .collection('vaccinations')
        .where('petId', isEqualTo: petId)
        .orderBy('date', descending: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => VaccinationModel.fromFirestore(doc)).toList());
  }

  /// Add vaccination record
  Future<void> addVaccination(VaccinationModel vaccination) async {
    if (_firestore == null) return;

    await _firestore!.collection('vaccinations').add(vaccination.toFirestore());
  }

  /// Update vaccination record
  Future<void> updateVaccination(VaccinationModel vaccination) async {
    if (_firestore == null) return;

    await _firestore!
        .collection('vaccinations')
        .doc(vaccination.id)
        .update(vaccination.toFirestore());
  }

  /// Delete vaccination record
  Future<void> deleteVaccination(String vaccinationId) async {
    if (_firestore == null) return;

    await _firestore!.collection('vaccinations').doc(vaccinationId).delete();
  }

  // ==================== WEIGHT RECORDS ====================

  /// Get all weight records for a pet
  Stream<List<WeightRecordModel>> getPetWeightRecords(String petId) {
    if (_firestore == null) return Stream.value([]);

    return _firestore!
        .collection('weight_records')
        .where('petId', isEqualTo: petId)
        .orderBy('date', descending: false) // Ascending for chart
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => WeightRecordModel.fromFirestore(doc)).toList());
  }

  /// Add weight record
  Future<void> addWeightRecord(WeightRecordModel record) async {
    if (_firestore == null) return;

    await _firestore!.collection('weight_records').add(record.toFirestore());
  }

  /// Update weight record
  Future<void> updateWeightRecord(WeightRecordModel record) async {
    if (_firestore == null) return;

    await _firestore!
        .collection('weight_records')
        .doc(record.id)
        .update(record.toFirestore());
  }

  /// Delete weight record
  Future<void> deleteWeightRecord(String recordId) async {
    if (_firestore == null) return;

    await _firestore!.collection('weight_records').doc(recordId).delete();
  }

  // ==================== VET APPOINTMENTS ====================

  /// Get all appointments for a pet
  Stream<List<VetAppointmentModel>> getPetAppointments(String petId) {
    if (_firestore == null) return Stream.value([]);

    return _firestore!
        .collection('vet_appointments')
        .where('petId', isEqualTo: petId)
        .orderBy('dateTime', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => VetAppointmentModel.fromFirestore(doc))
            .toList());
  }

  /// Get upcoming appointments for a pet
  Stream<List<VetAppointmentModel>> getUpcomingAppointments(String petId) {
    if (_firestore == null) return Stream.value([]);

    return _firestore!
        .collection('vet_appointments')
        .where('petId', isEqualTo: petId)
        .where('completed', isEqualTo: false)
        .where('dateTime', isGreaterThan: Timestamp.now())
        .orderBy('dateTime', descending: false)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => VetAppointmentModel.fromFirestore(doc))
            .toList());
  }

  /// Add appointment
  Future<void> addAppointment(VetAppointmentModel appointment) async {
    if (_firestore == null) return;

    await _firestore!
        .collection('vet_appointments')
        .add(appointment.toFirestore());
  }

  /// Update appointment
  Future<void> updateAppointment(VetAppointmentModel appointment) async {
    if (_firestore == null) return;

    await _firestore!
        .collection('vet_appointments')
        .doc(appointment.id)
        .update(appointment.toFirestore());
  }

  /// Mark appointment as completed
  Future<void> completeAppointment(String appointmentId) async {
    if (_firestore == null) return;

    await _firestore!.collection('vet_appointments').doc(appointmentId).update({
      'completed': true,
    });
  }

  /// Delete appointment
  Future<void> deleteAppointment(String appointmentId) async {
    if (_firestore == null) return;

    await _firestore!.collection('vet_appointments').doc(appointmentId).delete();
  }
}
