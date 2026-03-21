import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/services/gamification_service.dart';

/// Profile screen with gamification, badges, leaderboard
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Profile Header
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 20),
                      // Avatar
                      Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 3),
                        ),
                        child: const Center(
                          child: Icon(Icons.person, size: 44, color: Colors.white),
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Pet Lover',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Level 12 - Health Champion',
                        style: TextStyle(color: Colors.white70, fontSize: 14),
                      ),
                      const SizedBox(height: 16),
                      // Stats Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _ProfileStat(value: '1,250', label: 'Points'),
                          _ProfileStat(value: '7', label: 'Day Streak'),
                          _ProfileStat(value: '3', label: 'Pets'),
                          _ProfileStat(value: '6', label: 'Badges'),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.settings),
                onPressed: () {},
              ),
            ],
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Level Progress
                  _LevelProgressCard(),
                  const SizedBox(height: 24),

                  // Premium Card
                  _PremiumCard(),
                  const SizedBox(height: 24),

                  // Badges
                  const Text(
                    'My Badges',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  _BadgesGrid(),
                  const SizedBox(height: 24),

                  // Leaderboard
                  const Text(
                    'Leaderboard',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  _LeaderboardCard(),
                  const SizedBox(height: 24),

                  // Activity Summary
                  const Text(
                    'Activity Summary',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  _ActivitySummary(),
                  const SizedBox(height: 24),

                  // Account Actions
                  const Text(
                    'Account',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  _AccountActions(),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileStat extends StatelessWidget {
  final String value;
  final String label;

  const _ProfileStat({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 12),
        ),
      ],
    );
  }
}

class _LevelProgressCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Level 12',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Text(
                  '1,250 / 2,000 XP',
                  style: TextStyle(color: Colors.grey[600], fontSize: 14),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: 0.625,
                minHeight: 10,
                backgroundColor: Colors.grey[200],
                valueColor: const AlwaysStoppedAnimation(AppTheme.primaryColor),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '750 XP to Level 13',
              style: TextStyle(color: Colors.grey[500], fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }
}

class _PremiumCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.workspace_premium,
                color: Colors.white, size: 32),
          ),
          const SizedBox(width: 16),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Go Premium',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Unlimited AI diagnoses, exclusive badges & more!',
                  style: TextStyle(color: Colors.white70, fontSize: 13),
                ),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios, color: Colors.white70),
        ],
      ),
    );
  }
}

class _BadgesGrid extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final gamificationService = GamificationService();
    final allBadges = BadgeType.values;
    final earnedBadges = [
      BadgeType.firstPet,
      BadgeType.firstDiagnosis,
      BadgeType.streak7Days,
      BadgeType.points100,
      BadgeType.points500,
      BadgeType.vetVisit5,
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 0.85,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: allBadges.length,
      itemBuilder: (context, index) {
        final badge = allBadges[index];
        final info = gamificationService.getBadgeInfo(badge);
        final isEarned = earnedBadges.contains(badge);

        return GestureDetector(
          onTap: () {
            showDialog(
              context: context,
              builder: (ctx) => AlertDialog(
                title: Text(info['name']),
                content: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(info['icon'], style: const TextStyle(fontSize: 48)),
                    const SizedBox(height: 12),
                    Text(info['description']),
                    if (!isEarned) ...[
                      const SizedBox(height: 8),
                      Text(
                        'Not yet earned',
                        style: TextStyle(color: Colors.grey[500]),
                      ),
                    ],
                  ],
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text('OK'),
                  ),
                ],
              ),
            );
          },
          child: Container(
            decoration: BoxDecoration(
              color: isEarned
                  ? AppTheme.primaryColor.withOpacity(0.1)
                  : Colors.grey[100],
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isEarned
                    ? AppTheme.primaryColor.withOpacity(0.3)
                    : Colors.grey[200]!,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  info['icon'],
                  style: TextStyle(
                    fontSize: 32,
                    color: isEarned ? null : Colors.grey,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  info['name'],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: isEarned ? Colors.black87 : Colors.grey[400],
                  ),
                ),
                if (!isEarned)
                  Icon(Icons.lock, size: 14, color: Colors.grey[400]),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _LeaderboardCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final leaders = [
      {'rank': 1, 'name': 'Sophie M.', 'points': 3450, 'icon': '👑'},
      {'rank': 2, 'name': 'Lucas D.', 'points': 2890, 'icon': '🥈'},
      {'rank': 3, 'name': 'Emma R.', 'points': 2340, 'icon': '🥉'},
      {'rank': 4, 'name': 'You', 'points': 1250, 'icon': '🐾'},
      {'rank': 5, 'name': 'Pierre L.', 'points': 980, 'icon': ''},
    ];

    return Card(
      child: Column(
        children: leaders.map((leader) {
          final isYou = leader['name'] == 'You';
          return Container(
            decoration: BoxDecoration(
              color: isYou ? AppTheme.primaryColor.withOpacity(0.05) : null,
            ),
            child: ListTile(
              leading: SizedBox(
                width: 40,
                child: Center(
                  child: Text(
                    leader['icon'] as String != ''
                        ? leader['icon'] as String
                        : '#${leader['rank']}',
                    style: TextStyle(
                      fontSize: leader['icon'] as String != '' ? 20 : 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              title: Text(
                leader['name'] as String,
                style: TextStyle(
                  fontWeight: isYou ? FontWeight.bold : FontWeight.normal,
                  color: isYou ? AppTheme.primaryColor : null,
                ),
              ),
              trailing: Text(
                '${leader['points']} pts',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: isYou ? AppTheme.primaryColor : Colors.grey[600],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _ActivitySummary extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _ActivityRow(
              icon: Icons.medical_services,
              label: 'AI Diagnoses',
              value: '8',
              color: AppTheme.primaryColor,
            ),
            const Divider(),
            _ActivityRow(
              icon: Icons.directions_walk,
              label: 'Walks',
              value: '42',
              color: AppTheme.successColor,
            ),
            const Divider(),
            _ActivityRow(
              icon: Icons.vaccines,
              label: 'Health Records',
              value: '15',
              color: AppTheme.accentColor,
            ),
            const Divider(),
            _ActivityRow(
              icon: Icons.shopping_bag,
              label: 'Shop Visits',
              value: '23',
              color: AppTheme.secondaryColor,
            ),
          ],
        ),
      ),
    );
  }
}

class _ActivityRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _ActivityRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Text(label, style: const TextStyle(fontSize: 15)),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

class _AccountActions extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          ListTile(
            leading: const Icon(Icons.person_outline),
            title: const Text('Edit Profile'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.notifications_outlined),
            title: const Text('Notifications'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.privacy_tip_outlined),
            title: const Text('Privacy & Data'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.help_outline),
            title: const Text('Help & Support'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const Divider(height: 1),
          ListTile(
            leading: Icon(Icons.logout, color: AppTheme.errorColor),
            title: Text(
              'Sign Out',
              style: TextStyle(color: AppTheme.errorColor),
            ),
            onTap: () {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Sign Out'),
                  content: const Text('Are you sure you want to sign out?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Cancel'),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(ctx);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.errorColor,
                      ),
                      child: const Text('Sign Out',
                          style: TextStyle(color: Colors.white)),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
