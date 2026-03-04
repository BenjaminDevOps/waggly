import 'package:flutter/material.dart';

/// Category chip widget for filtering/sorting
class CategoryChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final bool isSelected;

  const CategoryChip({
    super.key,
    required this.label,
    required this.icon,
    required this.onTap,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      label: Text(label),
      avatar: Icon(icon, size: 18),
      onPressed: onTap,
      backgroundColor: isSelected ? Theme.of(context).primaryColor.withOpacity(0.1) : null,
      side: isSelected
          ? BorderSide(color: Theme.of(context).primaryColor)
          : null,
    );
  }
}
