import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/nac_species.dart';
import '../../../core/localization/language_provider.dart';
import '../../../core/localization/nac_strings.dart';
import '../../../core/theme/app_theme.dart';

/// Care-sheet reference for every NAC (exotic pet) species category.
class SpeciesGuideScreen extends ConsumerWidget {
  const SpeciesGuideScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(languageProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(NacStrings.of(lang, 'species_guide_title')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            NacStrings.of(lang, 'species_guide_subtitle'),
            style: const TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 16),
          ...NacSpeciesCatalog.all.map(
            (sheet) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Card(
                clipBehavior: Clip.antiAlias,
                child: ExpansionTile(
                  leading: Text(sheet.emoji, style: const TextStyle(fontSize: 28)),
                  title: Text(
                    sheet.nameFor(lang),
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(sheet.examplesFor(lang)),
                  children: [
                    _CareRow(
                      icon: Icons.home_outlined,
                      label: NacStrings.of(lang, 'care_habitat'),
                      value: sheet.habitatFor(lang),
                    ),
                    _CareRow(
                      icon: Icons.restaurant_outlined,
                      label: NacStrings.of(lang, 'care_diet'),
                      value: sheet.dietFor(lang),
                    ),
                    _CareRow(
                      icon: Icons.thermostat_outlined,
                      label: NacStrings.of(lang, 'care_temperature'),
                      value: sheet.temperatureFor(lang),
                    ),
                    _CareRow(
                      icon: Icons.cleaning_services_outlined,
                      label: NacStrings.of(lang, 'care_maintenance'),
                      value: sheet.maintenanceFor(lang),
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CareRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _CareRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: AppTheme.primaryColor),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(fontSize: 13, color: Colors.black87),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
