import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../shared/models/pet_model.dart';
import '../services/health_service.dart';
import '../models/weight_record_model.dart';

/// Weight tracking screen
class WeightTrackingScreen extends ConsumerWidget {
  final PetModel pet;

  const WeightTrackingScreen({super.key, required this.pet});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final healthService = HealthService();

    return Scaffold(
      appBar: AppBar(
        title: Text('${pet.name}\'s Weight'),
      ),
      body: StreamBuilder<List<WeightRecordModel>>(
        stream: healthService.getPetWeightRecords(pet.id),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final records = snapshot.data ?? [];

          if (records.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.monitor_weight, size: 80, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text(
                    'No Weight Records',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () => _showAddDialog(context, pet),
                    icon: const Icon(Icons.add),
                    label: const Text('Add Weight Record'),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: records.length,
            itemBuilder: (context, index) {
              final record = records[index];
              return Card(
                child: ListTile(
                  leading: CircleAvatar(
                    child: Text('${record.weight.toStringAsFixed(1)}'),
                  ),
                  title: Text('${record.weight} kg'),
                  subtitle: Text(DateFormat('MMM dd, yyyy').format(record.date)),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red),
                    onPressed: () async {
                      await healthService.deleteWeightRecord(record.id);
                    },
                  ),
                ),
              );
            },
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
    final weightController = TextEditingController();
    final notesController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Weight Record'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: weightController,
              decoration: const InputDecoration(labelText: 'Weight (kg)'),
              keyboardType: TextInputType.numberWithOptions(decimal: true),
            ),
            TextField(
              controller: notesController,
              decoration: const InputDecoration(labelText: 'Notes (optional)'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final weight = double.tryParse(weightController.text);
              if (weight == null) return;

              final record = WeightRecordModel(
                id: '',
                petId: pet.id,
                weight: weight,
                date: DateTime.now(),
                notes: notesController.text.trim().isEmpty
                    ? null
                    : notesController.text.trim(),
              );

              await HealthService().addWeightRecord(record);
              if (context.mounted) Navigator.pop(context);
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }
}
