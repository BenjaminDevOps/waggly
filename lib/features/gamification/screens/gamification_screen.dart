import 'package:flutter/material.dart' hide Badge;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/services/user_service.dart';
import '../../../shared/models/user_model.dart';
import '../models/badge_model.dart';

/// Gamification screen with badges and achievements
class GamificationScreen extends ConsumerWidget {
  const GamificationScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = FirebaseAuth.instance.currentUser;

    if (user == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Achievements')),
        body: const Center(child: Text('Please log in')),
      );
    }

    return StreamBuilder<UserModel?>(
      stream: UserService().getUser(user.uid),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Scaffold(
            appBar: AppBar(title: const Text('Achievements')),
            body: const Center(child: CircularProgressIndicator()),
          );
        }

        final userData = snapshot.data;
        if (userData == null) {
          return Scaffold(
            appBar: AppBar(title: const Text('Achievements')),
            body: const Center(child: Text('User not found')),
          );
        }

        final unlockedBadges = userData.badges;

        return Scaffold(
          body: CustomScrollView(
            slivers: [
              // Header
              SliverAppBar(
                expandedHeight: 200,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  title: const Text('Achievements'),
                  background: Container(
                    decoration: BoxDecoration(
                      gradient: AppTheme.primaryGradient,
                    ),
                    child: SafeArea(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const SizedBox(height: 40),
                          Text(
                            '${userData.totalPoints}',
                            style: const TextStyle(
                              fontSize: 48,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const Text(
                            'Total Points',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white70,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Stats
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Expanded(
                        child: _StatCard(
                          icon: Icons.emoji_events,
                          value: '${unlockedBadges.length}',
                          label: 'Badges',
                          color: Colors.amber,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _StatCard(
                          icon: Icons.local_fire_department,
                          value: '${userData.dailyStreak}',
                          label: 'Day Streak',
                          color: Colors.orange,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Badges Grid
              SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    childAspectRatio: 0.85,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final badge = Badges.all[index];
                      final isUnlocked = unlockedBadges.contains(badge.id);

                      return _BadgeCard(
                        badge: badge,
                        isUnlocked: isUnlocked,
                      );
                    },
                    childCount: Badges.all.length,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

/// Stat card
class _StatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Badge card
class _BadgeCard extends StatelessWidget {
  final Badge badge;
  final bool isUnlocked;

  const _BadgeCard({
    required this.badge,
    required this.isUnlocked,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: isUnlocked ? 3 : 1,
      child: InkWell(
        onTap: () {
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: Row(
                children: [
                  Icon(
                    badge.icon,
                    color: isUnlocked ? badge.color : Colors.grey,
                  ),
                  const SizedBox(width: 8),
                  Expanded(child: Text(badge.name)),
                ],
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(badge.description),
                  if (!isUnlocked) ...[
                    const SizedBox(height: 16),
                    Text(
                      'Keep exploring to unlock this badge!',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 12,
                      ),
                    ),
                  ],
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Close'),
                ),
              ],
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                badge.icon,
                size: 40,
                color: isUnlocked ? badge.color : Colors.grey[300],
              ),
              const SizedBox(height: 8),
              Text(
                badge.name,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isUnlocked ? Colors.black87 : Colors.grey,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              if (isUnlocked)
                Container(
                  margin: const EdgeInsets.only(top: 4),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: badge.color.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'UNLOCKED',
                    style: TextStyle(
                      fontSize: 8,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
