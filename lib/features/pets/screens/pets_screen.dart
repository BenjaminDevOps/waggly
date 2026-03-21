import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/pet_model.dart';
import 'add_pet_screen.dart';
import 'pet_detail_screen.dart';

/// Pets management screen
class PetsScreen extends ConsumerStatefulWidget {
  const PetsScreen({super.key});

  @override
  ConsumerState<PetsScreen> createState() => _PetsScreenState();
}

class _PetsScreenState extends ConsumerState<PetsScreen> {
  // Demo data for showcase
  final List<PetModel> _pets = [
    PetModel(
      id: '1',
      userId: 'demo',
      name: 'Luna',
      type: PetType.dog,
      breed: 'Golden Retriever',
      gender: PetGender.female,
      birthDate: DateTime(2021, 3, 15),
      weight: 28.5,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    ),
    PetModel(
      id: '2',
      userId: 'demo',
      name: 'Milo',
      type: PetType.cat,
      breed: 'British Shorthair',
      gender: PetGender.male,
      birthDate: DateTime(2022, 7, 20),
      weight: 5.2,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    ),
    PetModel(
      id: '3',
      userId: 'demo',
      name: 'Coco',
      type: PetType.rabbit,
      breed: 'Holland Lop',
      gender: PetGender.female,
      birthDate: DateTime(2023, 1, 10),
      weight: 1.8,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Pets'),
        actions: [
          IconButton(
            icon: const Icon(Icons.sort),
            onPressed: () {},
          ),
        ],
      ),
      body: _pets.isEmpty ? _buildEmptyState() : _buildPetsList(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddPetScreen()),
          );
        },
        icon: const Icon(Icons.add),
        label: const Text('Add Pet'),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.pets,
              size: 64,
              color: AppTheme.primaryColor,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'No pets yet!',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'Add your first companion to get started',
            style: TextStyle(fontSize: 16, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  Widget _buildPetsList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _pets.length,
      itemBuilder: (context, index) {
        final pet = _pets[index];
        return _PetCard(
          pet: pet,
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => PetDetailScreen(pet: pet),
              ),
            );
          },
        );
      },
    );
  }
}

class _PetCard extends StatelessWidget {
  final PetModel pet;
  final VoidCallback onTap;

  const _PetCard({required this.pet, required this.onTap});

  String _getPetEmoji(PetType type) {
    switch (type) {
      case PetType.dog:
        return '🐕';
      case PetType.cat:
        return '🐈';
      case PetType.bird:
        return '🐦';
      case PetType.rabbit:
        return '🐰';
      case PetType.other:
        return '🐾';
    }
  }

  Color _getPetColor(PetType type) {
    switch (type) {
      case PetType.dog:
        return const Color(0xFF6366F1);
      case PetType.cat:
        return const Color(0xFFEC4899);
      case PetType.bird:
        return const Color(0xFF10B981);
      case PetType.rabbit:
        return const Color(0xFFF59E0B);
      case PetType.other:
        return const Color(0xFF8B5CF6);
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getPetColor(pet.type);
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Pet Avatar
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Center(
                  child: Text(
                    _getPetEmoji(pet.type),
                    style: const TextStyle(fontSize: 36),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Pet Info
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
                    const SizedBox(height: 4),
                    Text(
                      pet.breed ?? pet.type.name.toUpperCase(),
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        _InfoChip(
                          icon: Icons.cake_outlined,
                          label: pet.age != null ? '${pet.age} yrs' : 'N/A',
                        ),
                        const SizedBox(width: 8),
                        _InfoChip(
                          icon: Icons.monitor_weight_outlined,
                          label: pet.weight != null
                              ? '${pet.weight} kg'
                              : 'N/A',
                        ),
                        const SizedBox(width: 8),
                        _InfoChip(
                          icon: pet.gender == PetGender.male
                              ? Icons.male
                              : pet.gender == PetGender.female
                                  ? Icons.female
                                  : Icons.question_mark,
                          label: pet.gender.name,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right, color: Colors.grey[400]),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.grey[600]),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(fontSize: 12, color: Colors.grey[700]),
          ),
        ],
      ),
    );
  }
}
