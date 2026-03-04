import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../shared/models/pet_model.dart';
import '../services/health_service.dart';
import '../models/vaccination_model.dart';

/// Add vaccination screen
class AddVaccinationScreen extends StatefulWidget {
  final PetModel pet;

  const AddVaccinationScreen({super.key, required this.pet});

  @override
  State<AddVaccinationScreen> createState() => _AddVaccinationScreenState();
}

class _AddVaccinationScreenState extends State<AddVaccinationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _vetController = TextEditingController();
  final _batchController = TextEditingController();
  final _notesController = TextEditingController();

  DateTime _date = DateTime.now();
  DateTime? _nextDueDate;
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _vetController.dispose();
    _batchController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Vaccination'),
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _save,
            child: const Text('Save', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Vaccine Name *',
                border: OutlineInputBorder(),
              ),
              validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            ListTile(
              title: const Text('Date Given'),
              subtitle: Text(DateFormat('MMM dd, yyyy').format(_date)),
              trailing: const Icon(Icons.calendar_today),
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: _date,
                  firstDate: DateTime(2000),
                  lastDate: DateTime.now(),
                );
                if (date != null) setState(() => _date = date);
              },
            ),
            const Divider(),
            ListTile(
              title: const Text('Next Due Date (Optional)'),
              subtitle: Text(_nextDueDate == null
                  ? 'Not set'
                  : DateFormat('MMM dd, yyyy').format(_nextDueDate!)),
              trailing: const Icon(Icons.calendar_today),
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: _nextDueDate ?? DateTime.now().add(const Duration(days: 365)),
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 3650)),
                );
                if (date != null) setState(() => _nextDueDate = date);
              },
            ),
            const Divider(),
            const SizedBox(height: 16),
            TextFormField(
              controller: _vetController,
              decoration: const InputDecoration(
                labelText: 'Veterinarian *',
                border: OutlineInputBorder(),
              ),
              validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _batchController,
              decoration: const InputDecoration(
                labelText: 'Batch Number',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _notesController,
              decoration: const InputDecoration(
                labelText: 'Notes',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _isLoading ? null : _save,
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Add Vaccination'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final vaccination = VaccinationModel(
        id: '',
        petId: widget.pet.id,
        vaccineName: _nameController.text.trim(),
        date: _date,
        nextDueDate: _nextDueDate,
        veterinarian: _vetController.text.trim(),
        batchNumber: _batchController.text.trim().isEmpty
            ? null
            : _batchController.text.trim(),
        notes:
            _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      );

      await HealthService().addVaccination(vaccination);

      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Vaccination added!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }
}
