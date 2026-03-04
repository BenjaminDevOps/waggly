import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../shared/models/pet_model.dart';
import '../services/health_service.dart';
import '../models/vet_appointment_model.dart';

/// Appointments screen
class AppointmentsScreen extends ConsumerWidget {
  final PetModel pet;

  const AppointmentsScreen({super.key, required this.pet});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final healthService = HealthService();

    return Scaffold(
      appBar: AppBar(
        title: Text('${pet.name}\'s Appointments'),
      ),
      body: StreamBuilder<List<VetAppointmentModel>>(
        stream: healthService.getPetAppointments(pet.id),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final appointments = snapshot.data ?? [];

          if (appointments.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.calendar_today, size: 80, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text(
                    'No Appointments',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () => _showAddDialog(context, pet),
                    icon: const Icon(Icons.add),
                    label: const Text('Schedule Appointment'),
                  ),
                ],
              ),
            );
          }

          final upcoming = appointments.where((a) => !a.isPast).toList();
          final past = appointments.where((a) => a.isPast).toList();

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              if (upcoming.isNotEmpty) ...[
                const Text(
                  'Upcoming',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                ...upcoming.map((apt) => _AppointmentCard(appointment: apt)),
                const SizedBox(height: 16),
              ],
              if (past.isNotEmpty) ...[
                const Text(
                  'Past',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                ...past.map((apt) => _AppointmentCard(appointment: apt)),
              ],
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddDialog(context, pet),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showAddDialog(BuildContext context, PetModel pet) {
    final reasonController = TextEditingController();
    final vetController = TextEditingController();
    final clinicController = TextEditingController();
    DateTime selectedDate = DateTime.now().add(const Duration(days: 7));
    TimeOfDay selectedTime = TimeOfDay.now();

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Schedule Appointment'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: reasonController,
                  decoration: const InputDecoration(labelText: 'Reason'),
                ),
                TextField(
                  controller: vetController,
                  decoration: const InputDecoration(labelText: 'Veterinarian'),
                ),
                TextField(
                  controller: clinicController,
                  decoration: const InputDecoration(labelText: 'Clinic'),
                ),
                const SizedBox(height: 16),
                ListTile(
                  title: const Text('Date'),
                  subtitle: Text(DateFormat('MMM dd, yyyy').format(selectedDate)),
                  trailing: const Icon(Icons.calendar_today),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: selectedDate,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (date != null) setState(() => selectedDate = date);
                  },
                ),
                ListTile(
                  title: const Text('Time'),
                  subtitle: Text(selectedTime.format(context)),
                  trailing: const Icon(Icons.access_time),
                  onTap: () async {
                    final time = await showTimePicker(
                      context: context,
                      initialTime: selectedTime,
                    );
                    if (time != null) setState(() => selectedTime = time);
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                final dateTime = DateTime(
                  selectedDate.year,
                  selectedDate.month,
                  selectedDate.day,
                  selectedTime.hour,
                  selectedTime.minute,
                );

                final appointment = VetAppointmentModel(
                  id: '',
                  petId: pet.id,
                  dateTime: dateTime,
                  veterinarian: vetController.text.trim(),
                  clinic: clinicController.text.trim(),
                  reason: reasonController.text.trim(),
                );

                await HealthService().addAppointment(appointment);
                if (context.mounted) Navigator.pop(context);
              },
              child: const Text('Schedule'),
            ),
          ],
        ),
      ),
    );
  }
}

class _AppointmentCard extends StatelessWidget {
  final VetAppointmentModel appointment;

  const _AppointmentCard({required this.appointment});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor:
              appointment.completed ? Colors.green.withOpacity(0.2) : Colors.blue.withOpacity(0.2),
          child: Icon(
            appointment.completed ? Icons.check : Icons.calendar_today,
            color: appointment.completed ? Colors.green : Colors.blue,
          ),
        ),
        title: Text(appointment.reason),
        subtitle: Text(
          '${DateFormat('MMM dd, yyyy • HH:mm').format(appointment.dateTime)}\n${appointment.clinic}',
        ),
        isThreeLine: true,
        trailing: appointment.isUpcoming
            ? const Chip(
                label: Text('Soon', style: TextStyle(fontSize: 11)),
                padding: EdgeInsets.symmetric(horizontal: 4),
              )
            : null,
      ),
    );
  }
}
