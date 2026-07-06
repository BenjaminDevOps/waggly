import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/localization/app_language.dart';
import '../../../core/localization/language_provider.dart';
import '../../../core/localization/nac_strings.dart';
import '../../../core/theme/app_theme.dart';
import '../../ai_diagnosis/screens/ai_diagnosis_screen.dart';
import '../../care_checklist/screens/care_checklist_screen.dart';
import '../../pets/screens/pets_screen.dart';
import '../../profile/screens/profile_screen.dart';
import '../../shop/screens/shop_screen.dart';
import '../../species_guide/screens/species_guide_screen.dart';

/// Main home screen with bottom navigation
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentIndex = 0;

  void _goToTab(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider);

    final screens = [
      DashboardScreen(onNavigateToTab: _goToTab),
      const PetsScreen(),
      const AiDiagnosisScreen(),
      const ShopScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _goToTab,
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.home_outlined),
            selectedIcon: const Icon(Icons.home),
            label: NacStrings.of(lang, 'nav_home'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.pets_outlined),
            selectedIcon: const Icon(Icons.pets),
            label: NacStrings.of(lang, 'nav_pets'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.medical_services_outlined),
            selectedIcon: const Icon(Icons.medical_services),
            label: NacStrings.of(lang, 'nav_diagnosis'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.shopping_bag_outlined),
            selectedIcon: const Icon(Icons.shopping_bag),
            label: NacStrings.of(lang, 'nav_shop'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.person_outlined),
            selectedIcon: const Icon(Icons.person),
            label: NacStrings.of(lang, 'nav_profile'),
          ),
        ],
      ),
    );
  }
}

/// Dashboard screen with gamification elements
class DashboardScreen extends ConsumerWidget {
  final ValueChanged<int> onNavigateToTab;

  const DashboardScreen({super.key, required this.onNavigateToTab});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(languageProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(NacStrings.of(lang, 'app_name')),
        actions: [
          PopupMenuButton<AppLanguage>(
            tooltip: NacStrings.of(lang, 'language_picker_title'),
            initialValue: lang,
            onSelected: (value) => ref.read(languageProvider.notifier).state = value,
            itemBuilder: (context) => AppLanguage.values
                .map(
                  (value) => PopupMenuItem(
                    value: value,
                    child: Text('${value.flag}  ${value.label}'),
                  ),
                )
                .toList(),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Center(child: Text(lang.flag, style: const TextStyle(fontSize: 22))),
            ),
          ),
          // Points Display
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            margin: const EdgeInsets.only(right: 8),
            decoration: BoxDecoration(
              gradient: AppTheme.goldGradient,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              children: [
                Icon(Icons.star, color: Colors.white, size: 20),
                SizedBox(width: 4),
                Text(
                  '1,250',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    NacStrings.of(lang, 'home_welcome'),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    NacStrings.of(lang, 'home_subtitle'),
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Streak Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.secondaryColor.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Text('🔥', style: TextStyle(fontSize: 32)),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            NacStrings.of(lang, 'home_streak_title'),
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            NacStrings.of(lang, 'home_streak_subtitle'),
                            style: const TextStyle(
                              color: Colors.grey,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(
                      Icons.arrow_forward_ios,
                      color: Colors.grey,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Quick Actions
            Text(
              NacStrings.of(lang, 'home_quick_actions'),
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: _QuickActionCard(
                    icon: Icons.medical_services,
                    label: NacStrings.of(lang, 'action_diagnosis'),
                    color: AppTheme.primaryColor,
                    onTap: () => onNavigateToTab(2),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _QuickActionCard(
                    icon: Icons.pets,
                    label: NacStrings.of(lang, 'action_add_pet'),
                    color: AppTheme.secondaryColor,
                    onTap: () => onNavigateToTab(1),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: _QuickActionCard(
                    icon: Icons.menu_book_outlined,
                    label: NacStrings.of(lang, 'action_species_guide'),
                    color: AppTheme.accentColor,
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const SpeciesGuideScreen()),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _QuickActionCard(
                    icon: Icons.checklist,
                    label: NacStrings.of(lang, 'action_checklist'),
                    color: AppTheme.successColor,
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const CareChecklistScreen()),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: _QuickActionCard(
                    icon: Icons.shopping_bag,
                    label: NacStrings.of(lang, 'action_shop'),
                    color: AppTheme.primaryColor,
                    onTap: () => onNavigateToTab(3),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _QuickActionCard(
                    icon: Icons.emoji_events,
                    label: NacStrings.of(lang, 'action_badges'),
                    color: AppTheme.secondaryColor,
                    onTap: () {},
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, color: color, size: 32),
              const SizedBox(height: 8),
              Text(
                label,
                style: const TextStyle(fontWeight: FontWeight.w500),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
