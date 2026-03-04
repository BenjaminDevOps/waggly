import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/pet_model.dart';
import '../services/health_service.dart';
import '../models/vaccination_model.dart';
import 'add_vaccination_screen.dart';

/// Vaccination list screen
class VaccinationListScreen extends ConsumerWidget {
  final PetModel pet;

  const VaccinationListScreen({
    super.key,
    required this.pet,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final healthService = HealthService();

    return Scaffold(
      appBar: AppBar(
        title: Text('${pet.name}\'s Vaccinations'),
      ),
      body: StreamBuilder<List<VaccinationModel>>(
        stream: healthService.getPetVaccinations(pet.id),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final vaccinations = snapshot.data ?? [];

          if (vaccinations.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.vaccines, size: 80, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text(
                    'No Vaccinations Yet',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Add vaccination records to track ${pet.name}\'s health',
                    style: TextStyle(color: Colors.grey[600]),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => AddVaccinationScreen(pet: pet),
                        ),
                      );
                    },
                    icon: const Icon(Icons.add),
                    label: const Text('Add Vaccination'),
                  ),
                ],
              ),
            );
          }

          // Separate overdue and upcoming
          final overdue = vaccinations.where((v) => v.isOverdue).toList();
          final upcoming = vaccinations.where((v) => v.isDueSoon && !v.isOverdue).toList();
          final others = vaccinations.where((v) => !v.isOverdue && !v.isDueSoon).toList();

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Overdue
              if (overdue.isNotEmpty) ...[
                _SectionHeader(
                  title: 'Overdue',
                  color: Colors.red,
                  icon: Icons.warning,
                ),
                ...overdue.map((vac) => _VaccinationCard(
                      vaccination: vac,
                      pet: pet,
                    )),
                const SizedBox(height: 16),
              ],

              // Due Soon
              if (upcoming.isNotEmpty) ...[
                _SectionHeader(
                  title: 'Due Soon',
                  color: Colors.orange,
                  icon: Icons.schedule,
                ),
                ...upcoming.map((vac) => _VaccinationCard(
                      vaccination: vac,
                      pet: pet,
                    )),
                const SizedBox(height: 16),
              ],

              // All Others
              if (others.isNotEmpty) ...[
                _SectionHeader(
                  title: 'All Vaccinations',
                  color: AppTheme.primaryColor,
                  icon: Icons.vaccines,
                ),
                ...others.map((vac) => _VaccinationCard(
                      vaccination: vac,
                      pet: pet,
                    )),
              ],
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => AddVaccinationScreen(pet: pet),
            ),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final Color color;
  final IconData icon;

  const _SectionHeader({
    required this.title,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 8),
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

class _VaccinationCard extends StatelessWidget {
  final VaccinationModel vaccination;
  final PetModel pet;

  const _VaccinationCard({
    required this.vaccination,
    required this.pet,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ExpansionTile(
        leading: CircleAvatar(
          backgroundColor: _getColor().withOpacity(0.2),
          child: Icon(Icons.vaccines, color: _getColor()),
        ),
        title: Text(vaccination.vaccineName),
        subtitle: Text(
          'Given: ${DateFormat('MMM dd, yyyy').format(vaccination.date)}',
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _InfoRow('Veterinarian', vaccination.veterinarian),
                if (vaccination.nextDueDate != null)
                  _InfoRow(
                    'Next Due',
                    DateFormat('MMM dd, yyyy').format(vaccination.nextDueDate!),
                  ),
                if (vaccination.batchNumber != null)
                  _InfoRow('Batch Number', vaccination.batchNumber!),
                if (vaccination.notes != null) ...[
                  const SizedBox(height: 8),
                  const Text(
                    'Notes:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(vaccination.notes!),
                ],
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton.icon(
                      onPressed: () {
                        _deleteVaccination(context, vaccination);
                      },
                      icon: const Icon(Icons.delete, color: Colors.red),
                      label: const Text('Delete', style: TextStyle(color: Colors.red)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getColor() {
    if (vaccination.isOverdue) return Colors.red;
    if (vaccination.isDueSoon) return Colors.orange;
    return AppTheme.primaryColor;
  }

  Widget _InfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: TextStyle(color: Colors.grey[600]),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteVaccination(
    BuildContext context,
    VaccinationModel vaccination,
  ) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Vaccination?'),
        content: Text(
          'Are you sure you want to delete ${vaccination.vaccineName}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      await HealthService().deleteVaccination(vaccination.id);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Vaccination deleted')),
        );
      }
    }
  }
}
