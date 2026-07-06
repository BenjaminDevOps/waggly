import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/localization/language_provider.dart';
import '../../../core/localization/nac_strings.dart';
import '../../../core/theme/app_theme.dart';

class _ChecklistItem {
  final IconData icon;
  final String key;
  bool done;

  _ChecklistItem({required this.icon, required this.key, this.done = false});
}

/// Daily NAC husbandry checklist (habitat, water, temperature, food, etc.)
/// tied into the app's existing points-per-health-check gamification.
class CareChecklistScreen extends ConsumerStatefulWidget {
  const CareChecklistScreen({super.key});

  @override
  ConsumerState<CareChecklistScreen> createState() => _CareChecklistScreenState();
}

class _CareChecklistScreenState extends ConsumerState<CareChecklistScreen> {
  final List<_ChecklistItem> _items = [
    _ChecklistItem(icon: Icons.cleaning_services_outlined, key: 'checklist_item_habitat'),
    _ChecklistItem(icon: Icons.water_drop_outlined, key: 'checklist_item_water'),
    _ChecklistItem(icon: Icons.thermostat_outlined, key: 'checklist_item_temperature'),
    _ChecklistItem(icon: Icons.restaurant_outlined, key: 'checklist_item_food'),
    _ChecklistItem(icon: Icons.visibility_outlined, key: 'checklist_item_observation'),
    _ChecklistItem(icon: Icons.pets_outlined, key: 'checklist_item_enrichment'),
  ];

  int get _completedCount => _items.where((item) => item.done).length;

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider);
    final earnedPoints = _completedCount * AppConstants.pointsPerHealthCheck;

    return Scaffold(
      appBar: AppBar(
        title: Text(NacStrings.of(lang, 'checklist_title')),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  NacStrings.of(lang, 'checklist_subtitle'),
                  style: const TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: LinearProgressIndicator(
                        value: _items.isEmpty ? 0 : _completedCount / _items.length,
                        minHeight: 8,
                        color: AppTheme.successColor,
                        backgroundColor: AppTheme.successColor.withOpacity(0.15),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      '$_completedCount/${_items.length} ${NacStrings.of(lang, 'checklist_progress')}',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '⭐ $earnedPoints ${NacStrings.of(lang, 'checklist_points_earned')}',
                  style: const TextStyle(
                    color: AppTheme.secondaryColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _items.length,
              itemBuilder: (context, index) {
                final item = _items[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  child: CheckboxListTile(
                    value: item.done,
                    onChanged: (value) {
                      setState(() => item.done = value ?? false);
                    },
                    secondary: Icon(item.icon, color: AppTheme.primaryColor),
                    title: Text(NacStrings.of(lang, item.key)),
                    controlAffinity: ListTileControlAffinity.trailing,
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
