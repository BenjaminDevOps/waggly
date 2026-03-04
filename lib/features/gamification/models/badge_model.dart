import 'package:flutter/material.dart';

/// Badge definition model
class Badge {
  final String id;
  final String name;
  final String description;
  final IconData icon;
  final Color color;
  final int requiredPoints;

  const Badge({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.color,
    required this.requiredPoints,
  });
}

/// Predefined badges
class Badges {
  static const List<Badge> all = [
    Badge(
      id: 'first_pet',
      name: 'Pet Parent',
      description: 'Added your first pet',
      icon: Icons.pets,
      color: Colors.blue,
      requiredPoints: 0,
    ),
    Badge(
      id: 'first_diagnosis',
      name: 'AI Explorer',
      description: 'Completed first AI diagnosis',
      icon: Icons.psychology,
      color: Colors.purple,
      requiredPoints: 0,
    ),
    Badge(
      id: 'week_streak',
      name: 'Dedicated',
      description: '7 day streak',
      icon: Icons.local_fire_department,
      color: Colors.orange,
      requiredPoints: 0,
    ),
    Badge(
      id: 'health_tracker',
      name: 'Health Keeper',
      description: 'Added 5 health records',
      icon: Icons.health_and_safety,
      color: Colors.green,
      requiredPoints: 0,
    ),
    Badge(
      id: 'shopaholic',
      name: 'Shopaholic',
      description: 'Viewed 20 products',
      icon: Icons.shopping_bag,
      color: Colors.pink,
      requiredPoints: 0,
    ),
    Badge(
      id: 'points_100',
      name: 'Rising Star',
      description: 'Earned 100 points',
      icon: Icons.star,
      color: Colors.amber,
      requiredPoints: 100,
    ),
    Badge(
      id: 'points_500',
      name: 'Champion',
      description: 'Earned 500 points',
      icon: Icons.emoji_events,
      color: Colors.amber,
      requiredPoints: 500,
    ),
    Badge(
      id: 'points_1000',
      name: 'Legend',
      description: 'Earned 1000 points',
      icon: Icons.military_tech,
      color: Colors.deepOrange,
      requiredPoints: 1000,
    ),
  ];

  static Badge? getById(String id) {
    try {
      return all.firstWhere((badge) => badge.id == id);
    } catch (e) {
      return null;
    }
  }
}
