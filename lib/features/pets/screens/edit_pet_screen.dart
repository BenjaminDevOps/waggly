import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/services/pet_service.dart';
import '../../../shared/models/pet_model.dart';

/// Screen for editing an existing pet
class EditPetScreen extends StatefulWidget {
  final PetModel pet;

  const EditPetScreen({
    super.key,
    required this.pet,
  });

  @override
  State<EditPetScreen> createState() => _EditPetScreenState();
}

class _EditPetScreenState extends State<EditPetScreen> {
  final _formKey = GlobalKey<FormState>();
  final _petService = PetService();
  final _imagePicker = ImagePicker();

  // Controllers
  late final TextEditingController _nameController;
  late final TextEditingController _breedController;
  late final TextEditingController _microchipController;
  late final TextEditingController _notesController;

  // Form data
  late String _selectedSpecies;
  late String _selectedGender;
  late DateTime _selectedDate;
  double? _weight;
  File? _selectedImage;
  bool _isLoading = false;

  final List<String> _species = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];
  final List<String> _genders = ['Male', 'Female'];

  @override
  void initState() {
    super.initState();

    // Initialize with existing pet data
    _nameController = TextEditingController(text: widget.pet.name);
    _breedController = TextEditingController(text: widget.pet.breed);
    _microchipController = TextEditingController(text: widget.pet.microchipNumber ?? '');
    _notesController = TextEditingController(text: widget.pet.notes ?? '');

    _selectedSpecies = widget.pet.species;
    _selectedGender = widget.pet.gender;
    _selectedDate = widget.pet.dateOfBirth;
    _weight = widget.pet.weight;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _breedController.dispose();
    _microchipController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final pickedFile = await _imagePicker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 85,
    );

    if (pickedFile != null) {
      setState(() {
        _selectedImage = File(pickedFile.path);
      });
    }
  }

  Future<void> _selectDate() async {
    final pickedDate = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(1990),
      lastDate: DateTime.now(),
    );

    if (pickedDate != null) {
      setState(() {
        _selectedDate = pickedDate;
      });
    }
  }

  Future<void> _updatePet() async {
    if (!_formKey.currentState!.validate()) return;

    _formKey.currentState!.save();

    setState(() => _isLoading = true);

    try {
      // Create updated pet model
      PetModel updatedPet = widget.pet.copyWith(
        name: _nameController.text.trim(),
        species: _selectedSpecies,
        breed: _breedController.text.trim(),
        dateOfBirth: _selectedDate,
        gender: _selectedGender,
        weight: _weight,
        microchipNumber: _microchipController.text.trim().isEmpty
            ? null
            : _microchipController.text.trim(),
        notes: _notesController.text.trim().isEmpty
            ? null
            : _notesController.text.trim(),
      );

      // Update pet in Firestore
      await _petService.updatePet(updatedPet);

      // Upload new photo if selected
      if (_selectedImage != null) {
        await _petService.uploadPetPhoto(updatedPet.id, _selectedImage!);
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Pet updated successfully!')),
        );
        Navigator.of(context).pop(true); // Return true to indicate success
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error updating pet: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Edit ${widget.pet.name}'),
        actions: [
          if (_isLoading)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                ),
              ),
            )
          else
            TextButton(
              onPressed: _updatePet,
              child: const Text('Save', style: TextStyle(color: Colors.white)),
            ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Photo Section
            Center(
              child: Stack(
                children: [
                  GestureDetector(
                    onTap: _pickImage,
                    child: CircleAvatar(
                      radius: 60,
                      backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                      backgroundImage: _selectedImage != null
                          ? FileImage(_selectedImage!)
                          : (widget.pet.photoUrl != null
                              ? NetworkImage(widget.pet.photoUrl!)
                              : null) as ImageProvider?,
                      child: _selectedImage == null && widget.pet.photoUrl == null
                          ? Icon(
                              Icons.pets,
                              size: 60,
                              color: AppTheme.primaryColor,
                            )
                          : null,
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: CircleAvatar(
                      backgroundColor: AppTheme.primaryColor,
                      radius: 20,
                      child: IconButton(
                        icon: const Icon(Icons.camera_alt, size: 20, color: Colors.white),
                        onPressed: _pickImage,
                        padding: EdgeInsets.zero,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Center(
              child: Text(
                'Tap to change photo',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Pet Name
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Pet Name *',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.pets),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter your pet\'s name';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Species
            DropdownButtonFormField<String>(
              value: _selectedSpecies,
              decoration: const InputDecoration(
                labelText: 'Species *',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.category),
              ),
              items: _species.map((species) {
                return DropdownMenuItem(
                  value: species,
                  child: Text(species),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedSpecies = value!;
                });
              },
            ),
            const SizedBox(height: 16),

            // Breed
            TextFormField(
              controller: _breedController,
              decoration: const InputDecoration(
                labelText: 'Breed *',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.pets_outlined),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter the breed';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Gender
            DropdownButtonFormField<String>(
              value: _selectedGender,
              decoration: const InputDecoration(
                labelText: 'Gender *',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.wc),
              ),
              items: _genders.map((gender) {
                return DropdownMenuItem(
                  value: gender,
                  child: Text(gender),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedGender = value!;
                });
              },
            ),
            const SizedBox(height: 16),

            // Date of Birth
            InkWell(
              onTap: _selectDate,
              child: InputDecorator(
                decoration: const InputDecoration(
                  labelText: 'Date of Birth *',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.cake),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(DateFormat('MMM dd, yyyy').format(_selectedDate)),
                    const Icon(Icons.calendar_today, size: 20),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Weight
            TextFormField(
              initialValue: _weight?.toString(),
              decoration: const InputDecoration(
                labelText: 'Weight (kg)',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.monitor_weight_outlined),
                hintText: 'e.g., 5.5',
              ),
              keyboardType: TextInputType.numberWithOptions(decimal: true),
              onSaved: (value) {
                if (value != null && value.isNotEmpty) {
                  _weight = double.tryParse(value);
                }
              },
            ),
            const SizedBox(height: 16),

            // Microchip Number
            TextFormField(
              controller: _microchipController,
              decoration: const InputDecoration(
                labelText: 'Microchip Number',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.qr_code),
                hintText: 'Optional',
              ),
            ),
            const SizedBox(height: 16),

            // Notes
            TextFormField(
              controller: _notesController,
              decoration: const InputDecoration(
                labelText: 'Notes',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.notes),
                hintText: 'Any additional information...',
                alignLabelWithHint: true,
              ),
              maxLines: 4,
            ),
            const SizedBox(height: 32),

            // Save Button
            ElevatedButton(
              onPressed: _isLoading ? null : _updatePet,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(16),
              ),
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Update Pet', style: TextStyle(fontSize: 16)),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
