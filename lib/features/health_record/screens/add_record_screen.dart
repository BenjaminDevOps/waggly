import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/health_record_model.dart';

/// Screen for adding a new health record
class AddRecordScreen extends StatefulWidget {
  final String petId;
  final String petName;

  const AddRecordScreen({
    super.key,
    required this.petId,
    required this.petName,
  });

  @override
  State<AddRecordScreen> createState() => _AddRecordScreenState();
}

class _AddRecordScreenState extends State<AddRecordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _vetNameController = TextEditingController();
  final _weightController = TextEditingController();

  RecordType _selectedType = RecordType.vetVisit;
  DateTime _selectedDate = DateTime.now();
  DateTime? _nextDueDate;
  bool _isLoading = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _vetNameController.dispose();
    _weightController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Add Record for ${widget.petName}'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Record Type Selection
            const Text(
              'Record Type',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            _buildTypeSelector(),
            const SizedBox(height: 24),

            // Title
            TextFormField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Title',
                hintText: 'e.g., Annual Checkup',
                prefixIcon: Icon(Icons.title),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a title';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Description
            TextFormField(
              controller: _descriptionController,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Description / Notes',
                hintText: 'Add details...',
                prefixIcon: Icon(Icons.notes),
                alignLabelWithHint: true,
              ),
            ),
            const SizedBox(height: 16),

            // Date
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.calendar_today),
              title: Text(
                '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
              ),
              subtitle: const Text('Record date'),
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: _selectedDate,
                  firstDate: DateTime(2020),
                  lastDate: DateTime.now(),
                );
                if (date != null) setState(() => _selectedDate = date);
              },
            ),
            const Divider(),

            // Next Due Date (for vaccinations, deworming)
            if (_selectedType == RecordType.vaccination ||
                _selectedType == RecordType.deworming) ...[
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.event_upcoming),
                title: Text(
                  _nextDueDate != null
                      ? '${_nextDueDate!.day}/${_nextDueDate!.month}/${_nextDueDate!.year}'
                      : 'Set next due date',
                ),
                subtitle: const Text('Next appointment'),
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate:
                        DateTime.now().add(const Duration(days: 365)),
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
                  );
                  if (date != null) setState(() => _nextDueDate = date);
                },
              ),
              const Divider(),
            ],

            // Vet Name
            if (_selectedType == RecordType.vetVisit ||
                _selectedType == RecordType.surgery) ...[
              const SizedBox(height: 8),
              TextFormField(
                controller: _vetNameController,
                decoration: const InputDecoration(
                  labelText: 'Veterinarian',
                  hintText: 'Dr. Name',
                  prefixIcon: Icon(Icons.person_outline),
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Weight (for weight records)
            if (_selectedType == RecordType.weight) ...[
              const SizedBox(height: 8),
              TextFormField(
                controller: _weightController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Weight (kg)',
                  hintText: 'e.g., 25.5',
                  prefixIcon: Icon(Icons.monitor_weight_outlined),
                ),
                validator: (value) {
                  if (_selectedType == RecordType.weight &&
                      (value == null || value.isEmpty)) {
                    return 'Please enter weight';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
            ],

            const SizedBox(height: 24),

            // Save Button
            SizedBox(
              height: 56,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _saveRecord,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.save),
                          SizedBox(width: 8),
                          Text(
                            'Save Record',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeSelector() {
    final types = [
      {'type': RecordType.vaccination, 'icon': '💉', 'label': 'Vaccination'},
      {'type': RecordType.deworming, 'icon': '💊', 'label': 'Deworming'},
      {'type': RecordType.vetVisit, 'icon': '🏥', 'label': 'Vet Visit'},
      {'type': RecordType.weight, 'icon': '⚖️', 'label': 'Weight'},
      {'type': RecordType.medication, 'icon': '💊', 'label': 'Medication'},
      {'type': RecordType.surgery, 'icon': '🔬', 'label': 'Surgery'},
      {'type': RecordType.allergy, 'icon': '⚠️', 'label': 'Allergy'},
      {'type': RecordType.note, 'icon': '📝', 'label': 'Note'},
    ];

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: types.map((item) {
        final isSelected = _selectedType == item['type'];
        return GestureDetector(
          onTap: () => setState(() => _selectedType = item['type'] as RecordType),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: isSelected
                  ? AppTheme.primaryColor.withOpacity(0.15)
                  : Colors.grey[100],
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected ? AppTheme.primaryColor : Colors.transparent,
                width: 2,
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(item['icon'] as String, style: const TextStyle(fontSize: 18)),
                const SizedBox(width: 6),
                Text(
                  item['label'] as String,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    color: isSelected ? AppTheme.primaryColor : Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  void _saveRecord() {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Record saved successfully! +10 points'),
            backgroundColor: AppTheme.successColor,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        );
        Navigator.pop(context);
      }
    });
  }
}
