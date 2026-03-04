import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/pet_model.dart';
import '../services/health_service.dart';
import '../models/vaccination_model.dart';
import '../models/vet_appointment_model.dart';
import '../models/weight_record_model.dart';
import 'vaccination_list_screen.dart';
import 'weight_tracking_screen.dart';
import 'appointments_screen.dart';

/// Health dashboard for a specific pet
class PetHealthDashboard extends ConsumerWidget {
  final PetModel pet;

  const PetHealthDashboard({
    super.key,
    required this.pet,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final healthService = HealthService();

    return Scaffold(
      appBar: AppBar(
        title: Text('${pet.name}\'s Health'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              _showAddMenu(context);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Pet Info Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                      backgroundImage:
                          pet.photoUrl != null ? NetworkImage(pet.photoUrl!) : null,
                      child: pet.photoUrl == null
                          ? Text(
                              pet.name[0].toUpperCase(),
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.primaryColor,
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            pet.name,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            '${pet.species} • ${pet.ageString}',
                            style: TextStyle(color: Colors.grey[600]),
                          ),
                          if (pet.weight != null)
                            Text(
                              'Current Weight: ${pet.weight} kg',
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 12,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Quick Stats
            Row(
              children: [
                Expanded(
                  child: _QuickStatCard(
                    icon: Icons.vaccines,
                    label: 'Vaccinations',
                    stream: healthService.getPetVaccinations(pet.id),
                    color: Colors.blue,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => VaccinationListScreen(pet: pet),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _QuickStatCard(
                    icon: Icons.calendar_today,
                    label: 'Appointments',
                    stream: healthService.getPetAppointments(pet.id),
                    color: Colors.orange,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => AppointmentsScreen(pet: pet),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Upcoming Vaccinations
            const Text(
              'Upcoming Vaccinations',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            StreamBuilder<List<VaccinationModel>>(
              stream: healthService.getPetVaccinations(pet.id),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                final vaccinations = snapshot.data ?? [];
                final upcoming = vaccinations
                    .where((v) => v.nextDueDate != null && !v.isOverdue)
                    .take(3)
                    .toList();

                if (upcoming.isEmpty) {
                  return _EmptyState(
                    icon: Icons.vaccines,
                    message: 'No upcoming vaccinations',
                  );
                }

                return Column(
                  children: upcoming.map((vac) {
                    return _VaccinationCard(vaccination: vac);
                  }).toList(),
                );
              },
            ),
            const SizedBox(height: 24),

            // Upcoming Appointments
            const Text(
              'Upcoming Appointments',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            StreamBuilder<List<VetAppointmentModel>>(
              stream: healthService.getUpcomingAppointments(pet.id),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                final appointments = snapshot.data ?? [];

                if (appointments.isEmpty) {
                  return _EmptyState(
                    icon: Icons.calendar_today,
                    message: 'No upcoming appointments',
                  );
                }

                return Column(
                  children: appointments.take(3).map((apt) {
                    return _AppointmentCard(appointment: apt);
                  }).toList(),
                );
              },
            ),
            const SizedBox(height: 24),

            // Weight Tracking
            const Text(
              'Weight Tracking',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            StreamBuilder<List<WeightRecordModel>>(
              stream: healthService.getPetWeightRecords(pet.id),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                final records = snapshot.data ?? [];

                if (records.isEmpty) {
                  return _EmptyState(
                    icon: Icons.monitor_weight,
                    message: 'No weight records yet',
                    action: TextButton(
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => WeightTrackingScreen(pet: pet),
                          ),
                        );
                      },
                      child: const Text('Add First Record'),
                    ),
                  );
                }

                return Card(
                  child: InkWell(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => WeightTrackingScreen(pet: pet),
                        ),
                      );
                    },
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Icon(Icons.show_chart, color: AppTheme.primaryColor),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'View Weight Chart',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${records.length} records',
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                              ],
                            ),
                          ),
                          const Icon(Icons.arrow_forward_ios, size: 16),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }

  void _showAddMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.vaccines),
              title: const Text('Add Vaccination'),
              onTap: () {
                Navigator.pop(context);
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => VaccinationListScreen(pet: pet),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.calendar_today),
              title: const Text('Schedule Appointment'),
              onTap: () {
                Navigator.pop(context);
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => AppointmentsScreen(pet: pet),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.monitor_weight),
              title: const Text('Log Weight'),
              onTap: () {
                Navigator.pop(context);
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => WeightTrackingScreen(pet: pet),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

/// Quick stat card widget
class _QuickStatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Stream<List> stream;
  final Color color;
  final VoidCallback onTap;

  const _QuickStatCard({
    required this.icon,
    required this.label,
    required this.stream,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, color: color, size: 32),
              const SizedBox(height: 8),
              StreamBuilder<List>(
                stream: stream,
                builder: (context, snapshot) {
                  final count = snapshot.data?.length ?? 0;
                  return Text(
                    count.toString(),
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  );
                },
              ),
              Text(
                label,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 12,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Vaccination card widget
class _VaccinationCard extends StatelessWidget {
  final VaccinationModel vaccination;

  const _VaccinationCard({required this.vaccination});

  @override
  Widget build(BuildContext context) {
    final daysUntil =
        vaccination.nextDueDate!.difference(DateTime.now()).inDays;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: vaccination.isDueSoon
              ? Colors.orange.withOpacity(0.2)
              : Colors.blue.withOpacity(0.2),
          child: Icon(
            Icons.vaccines,
            color: vaccination.isDueSoon ? Colors.orange : Colors.blue,
          ),
        ),
        title: Text(vaccination.vaccineName),
        subtitle: Text(
          'Due: ${DateFormat('MMM dd, yyyy').format(vaccination.nextDueDate!)}',
        ),
        trailing: vaccination.isDueSoon
            ? Chip(
                label: Text(
                  '$daysUntil days',
                  style: const TextStyle(fontSize: 12),
                ),
                backgroundColor: Colors.orange.withOpacity(0.2),
              )
            : null,
      ),
    );
  }
}

/// Appointment card widget
class _AppointmentCard extends StatelessWidget {
  final VetAppointmentModel appointment;

  const _AppointmentCard({required this.appointment});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AppTheme.primaryColor.withOpacity(0.2),
          child: Icon(Icons.calendar_today, color: AppTheme.primaryColor),
        ),
        title: Text(appointment.reason),
        subtitle: Text(
          '${DateFormat('MMM dd, yyyy • HH:mm').format(appointment.dateTime)}\n${appointment.clinic}',
        ),
        isThreeLine: true,
        trailing: appointment.isUpcoming
            ? const Chip(
                label: Text('Soon', style: TextStyle(fontSize: 12)),
                backgroundColor: Colors.orange,
              )
            : null,
      ),
    );
  }
}

/// Empty state widget
class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String message;
  final Widget? action;

  const _EmptyState({
    required this.icon,
    required this.message,
    this.action,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Icon(icon, size: 48, color: Colors.grey[400]),
            const SizedBox(height: 8),
            Text(
              message,
              style: TextStyle(color: Colors.grey[600]),
            ),
            if (action != null) ...[
              const SizedBox(height: 8),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}
