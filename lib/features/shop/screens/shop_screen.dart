import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/localization/language_provider.dart';
import '../../../core/localization/nac_strings.dart';
import '../../../core/theme/app_theme.dart';

class _ShopCategory {
  final IconData icon;
  final Color color;
  final String titleKey;
  final String descKey;

  const _ShopCategory({
    required this.icon,
    required this.color,
    required this.titleKey,
    required this.descKey,
  });
}

const _categories = [
  _ShopCategory(
    icon: Icons.yard_outlined,
    color: AppTheme.primaryColor,
    titleKey: 'shop_cat_terrariums_title',
    descKey: 'shop_cat_terrariums_desc',
  ),
  _ShopCategory(
    icon: Icons.grass_outlined,
    color: AppTheme.successColor,
    titleKey: 'shop_cat_substrate_title',
    descKey: 'shop_cat_substrate_desc',
  ),
  _ShopCategory(
    icon: Icons.wb_sunny_outlined,
    color: AppTheme.secondaryColor,
    titleKey: 'shop_cat_uv_title',
    descKey: 'shop_cat_uv_desc',
  ),
  _ShopCategory(
    icon: Icons.restaurant_outlined,
    color: AppTheme.accentColor,
    titleKey: 'shop_cat_food_title',
    descKey: 'shop_cat_food_desc',
  ),
  _ShopCategory(
    icon: Icons.toys_outlined,
    color: AppTheme.primaryColor,
    titleKey: 'shop_cat_accessories_title',
    descKey: 'shop_cat_accessories_desc',
  ),
];

/// NAC-specific shop: terrariums, substrate, UV/heating gear, exotic food
/// and enrichment accessories, in place of the generic dog/cat storefront.
class ShopScreen extends ConsumerWidget {
  const ShopScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(languageProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(NacStrings.of(lang, 'shop_title')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            NacStrings.of(lang, 'shop_subtitle'),
            style: const TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 16),
          ..._categories.map(
            (category) => Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                contentPadding: const EdgeInsets.all(12),
                leading: CircleAvatar(
                  backgroundColor: category.color.withOpacity(0.12),
                  child: Icon(category.icon, color: category.color),
                ),
                title: Text(
                  NacStrings.of(lang, category.titleKey),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                subtitle: Text(NacStrings.of(lang, category.descKey)),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
