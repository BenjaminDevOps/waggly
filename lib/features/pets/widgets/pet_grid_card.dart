import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/pet_model.dart';

/// Pet card widget for grid view
class PetGridCard extends StatelessWidget {
  final PetModel pet;
  final VoidCallback onTap;

  const PetGridCard({
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Pet Photo
            Expanded(
              flex: 3,
              child: Stack(
                children: [
                  // Photo or Initial
                  Hero(
                    tag: 'pet_photo_${pet.id}',
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(16),
                        ),
                        color: AppTheme.primaryColor.withOpacity(0.1),
                        image: pet.photoUrl != null
                            ? DecorationImage(
                                image: NetworkImage(pet.photoUrl!),
                                fit: BoxFit.cover,
                              )
                            : null,
                      ),
                      child: pet.photoUrl == null
                          ? Center(
                              child: Text(
                                pet.name[0].toUpperCase(),
                                style: TextStyle(
                                  fontSize: 48,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.primaryColor,
                                ),
                              ),
                            )
                          : null,
                    ),
                  ),

                  // Gender Badge
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                      child: _buildGenderIcon(),
                    ),
                  ),
                ],
              ),
            ),

            // Pet Info
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Name
                    Text(
                      pet.name,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),

                    // Species & Breed
                    Row(
                      children: [
                        _buildSpeciesIcon(),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            pet.breed,
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 13,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),

                    // Age
                    Row(
                      children: [
                        Icon(
                          Icons.cake_outlined,
                          size: 14,
                          color: Colors.grey[500],
                        ),
                        const SizedBox(width: 4),
                        Text(
                          pet.ageString,
                          style: TextStyle(
                            color: Colors.grey[500],
                            fontSize: 12,
                          ),
                        ),
                      ],
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

  Widget _buildGenderIcon() {
    if (pet.gender.toLowerCase() == 'male') {
      return const Icon(
        Icons.male,
        color: Colors.blue,
        size: 16,
      );
    } else if (pet.gender.toLowerCase() == 'female') {
      return const Icon(
        Icons.female,
        color: Colors.pink,
        size: 16,
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
      style: const TextStyle(fontSize: 16),
    );
  }
}
