import 'package:flutter/material.dart';

/// Badge showing diagnosis severity level
class SeverityBadge extends StatelessWidget {
  final String severity;
  final bool large;

  const SeverityBadge({
    super.key,
    required this.severity,
    this.large = false,
  });

  Color _getSeverityColor() {
    switch (severity.toLowerCase()) {
      case 'low':
        return Colors.green;
      case 'medium':
        return Colors.orange;
      case 'high':
        return Colors.red;
      case 'critical':
        return Colors.red[900]!;
      default:
        return Colors.grey;
    }
  }

  String _getSeverityEmoji() {
    switch (severity.toLowerCase()) {
      case 'low':
        return '✅';
      case 'medium':
        return '⚠️';
      case 'high':
        return '🚨';
      case 'critical':
        return '🆘';
      default:
        return 'ℹ️';
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getSeverityColor();
    final emoji = _getSeverityEmoji();

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: large ? 16 : 12,
        vertical: large ? 10 : 6,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color, width: 2),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            emoji,
            style: TextStyle(fontSize: large ? 20 : 16),
          ),
          const SizedBox(width: 6),
          Text(
            severity.toUpperCase(),
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: large ? 16 : 12,
            ),
          ),
        ],
      ),
    );
  }
}
