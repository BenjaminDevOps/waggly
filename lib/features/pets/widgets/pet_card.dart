import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/pet_model.dart';

/// Pet card widget for list view
class PetCard extends StatelessWidget {
  final PetModel pet;
  final VoidCallback onTap;

  const PetCard({
    super.key,
    required this.pet,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Pet Photo
              Hero(
                tag: 'pet_photo_${pet.id}',
                child: CircleAvatar(
                  radius: 36,
                  backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                  backgroundImage:
                      pet.photoUrl != null ? NetworkImage(pet.photoUrl!) : null,
                  child: pet.photoUrl == null
                      ? Text(
                          pet.name[0].toUpperCase(),
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryColor,
                          ),
                        )
                      : null,
                ),
              ),
              const SizedBox(width: 16),

              // Pet Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            pet.name,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        _buildGenderIcon(),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        _buildSpeciesIcon(),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            '${pet.species} • ${pet.breed}',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 15,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Icon(
                          Icons.cake_outlined,
                          size: 16,
                          color: Colors.grey[500],
                        ),
                        const SizedBox(width: 4),
                        Text(
                          pet.ageString,
                          style: TextStyle(
                            color: Colors.grey[500],
                            fontSize: 14,
                          ),
                        ),
                        if (pet.weight != null) ...[
                          const SizedBox(width: 12),
                          Icon(
                            Icons.monitor_weight_outlined,
                            size: 16,
                            color: Colors.grey[500],
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${pet.weight} kg',
                            style: TextStyle(
                              color: Colors.grey[500],
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),

              // Arrow
              Icon(
                Icons.arrow_forward_ios,
                color: Colors.grey[400],
                size: 18,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGenderIcon() {
    if (pet.gender.toLowerCase() == 'male') {
      return const Icon(
        Icons.male,
        color: Colors.blue,
        size: 20,
      );
    } else if (pet.gender.toLowerCase() == 'female') {
      return const Icon(
        Icons.female,
        color: Colors.pink,
        size: 20,
      );
    }
    return const SizedBox.shrink();
  }

  Widget _buildSpeciesIcon() {
    String emoji;
    switch (pet.species.toLowerCase()) {
      case 'dog':
        emoji = '🐕';
        break;
      case 'cat':
        emoji = '🐈';
        break;
      case 'bird':
        emoji = '🦜';
        break;
      case 'rabbit':
        emoji = '🐰';
        break;
      case 'hamster':
        emoji = '🐹';
        break;
      case 'fish':
        emoji = '🐠';
        break;
      case 'reptile':
        emoji = '🦎';
        break;
      default:
        emoji = '🐾';
    }
    return Text(
      emoji,
      style: const TextStyle(fontSize: 18),
    );
  }
}
