import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/services/walk_service.dart';

/// Pedometer / Walk tracking screen
class WalkScreen extends StatefulWidget {
  const WalkScreen({super.key});

  @override
  State<WalkScreen> createState() => _WalkScreenState();
}

class _WalkScreenState extends State<WalkScreen>
    with SingleTickerProviderStateMixin {
  bool _isWalking = false;
  int _steps = 0;
  int _seconds = 0;
  Timer? _timer;
  Timer? _stepSimulator;
  String? _selectedPet;
  int _dailyGoal = 5000;
  int _todayTotalSteps = 2340;

  // Weekly data (demo)
  final List<int> _weeklySteps = [3200, 4100, 2800, 5200, 3900, 4500, 2340];

  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _stepSimulator?.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Walk'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: _showWalkHistory,
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: _showGoalSettings,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Main Step Counter Circle
            _buildStepCounter(),
            const SizedBox(height: 24),

            // Pet Selector
            _buildPetSelector(),
            const SizedBox(height: 24),

            // Start/Stop Button
            _buildWalkButton(),
            const SizedBox(height: 24),

            // Current Walk Stats
            if (_isWalking) ...[
              _buildCurrentWalkStats(),
              const SizedBox(height: 24),
            ],

            // Today's Stats
            _buildTodayStats(),
            const SizedBox(height: 24),

            // Weekly Chart
            _buildWeeklyChart(),
            const SizedBox(height: 24),

            // Achievements
            _buildWalkAchievements(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildStepCounter() {
    final totalSteps = _todayTotalSteps + _steps;
    final progress = (totalSteps / _dailyGoal).clamp(0.0, 1.0);

    return Center(
      child: SizedBox(
        width: 220,
        height: 220,
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Background circle
            SizedBox(
              width: 220,
              height: 220,
              child: CircularProgressIndicator(
                value: 1.0,
                strokeWidth: 12,
                color: Colors.grey[200],
              ),
            ),
            // Progress circle
            SizedBox(
              width: 220,
              height: 220,
              child: TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: progress),
                duration: const Duration(milliseconds: 800),
                builder: (context, value, _) {
                  return CircularProgressIndicator(
                    value: value,
                    strokeWidth: 12,
                    strokeCap: StrokeCap.round,
                    color: progress >= 1.0
                        ? AppTheme.successColor
                        : AppTheme.primaryColor,
                  );
                },
              ),
            ),
            // Center text
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _isWalking ? Icons.directions_walk : Icons.pets,
                  color: AppTheme.primaryColor,
                  size: 28,
                ),
                const SizedBox(height: 4),
                Text(
                  '${totalSteps}',
                  style: const TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'of $_dailyGoal steps',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
                if (progress >= 1.0) ...[
                  const SizedBox(height: 4),
                  const Text(
                    'Goal reached! 🎉',
                    style: TextStyle(
                      color: AppTheme.successColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPetSelector() {
    final pets = [
      {'name': 'Luna', 'emoji': '🐕'},
      {'name': 'Milo', 'emoji': '🐈'},
      {'name': 'Coco', 'emoji': '🐰'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Walking with',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 50,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: pets.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final pet = pets[index];
              final isSelected = _selectedPet == pet['name'];
              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedPet =
                        isSelected ? null : pet['name'] as String;
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppTheme.primaryColor.withOpacity(0.15)
                        : Colors.grey[100],
                    borderRadius: BorderRadius.circular(25),
                    border: Border.all(
                      color: isSelected
                          ? AppTheme.primaryColor
                          : Colors.transparent,
                      width: 2,
                    ),
                  ),
                  child: Row(
                    children: [
                      Text(pet['emoji']!, style: const TextStyle(fontSize: 20)),
                      const SizedBox(width: 8),
                      Text(
                        pet['name']!,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: isSelected
                              ? AppTheme.primaryColor
                              : Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildWalkButton() {
    return SizedBox(
      width: double.infinity,
      height: 64,
      child: ElevatedButton(
        onPressed: _toggleWalk,
        style: ElevatedButton.styleFrom(
          backgroundColor:
              _isWalking ? AppTheme.errorColor : AppTheme.successColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          elevation: 4,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(_isWalking ? Icons.stop : Icons.play_arrow, size: 32),
            const SizedBox(width: 12),
            Text(
              _isWalking ? 'Stop Walk' : 'Start Walk',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentWalkStats() {
    final distance = WalkService.estimateDistanceKm(_steps);
    final calories = WalkService.estimateCalories(_steps, null);
    final minutes = _seconds ~/ 60;
    final secs = _seconds % 60;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppTheme.primaryGradient,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          const Text(
            'Current Walk',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
              fontFamily: 'monospace',
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _WalkStatItem(
                icon: Icons.directions_walk,
                value: '$_steps',
                label: 'Steps',
              ),
              _WalkStatItem(
                icon: Icons.straighten,
                value: distance.toStringAsFixed(2),
                label: 'km',
              ),
              _WalkStatItem(
                icon: Icons.local_fire_department,
                value: '$calories',
                label: 'cal',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTodayStats() {
    final totalSteps = _todayTotalSteps + _steps;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Today\'s Summary',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _StatMiniCard(
                icon: Icons.directions_walk,
                value: '$totalSteps',
                label: 'Total Steps',
                color: AppTheme.primaryColor,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _StatMiniCard(
                icon: Icons.straighten,
                value: WalkService.estimateDistanceKm(totalSteps)
                    .toStringAsFixed(1),
                label: 'km walked',
                color: AppTheme.successColor,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _StatMiniCard(
                icon: Icons.local_fire_department,
                value: '${WalkService.estimateCalories(totalSteps, null)}',
                label: 'Calories',
                color: AppTheme.accentColor,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildWeeklyChart() {
    final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final maxSteps = _weeklySteps.reduce(max).toDouble();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'This Week',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 180,
          child: Card(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  maxY: maxSteps * 1.2,
                  barTouchData: BarTouchData(enabled: false),
                  titlesData: FlTitlesData(
                    show: true,
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          return Text(
                            days[value.toInt()],
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey[600],
                            ),
                          );
                        },
                      ),
                    ),
                    leftTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    rightTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    topTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  gridData: const FlGridData(show: false),
                  barGroups: List.generate(7, (index) {
                    final isToday = index == 6;
                    return BarChartGroupData(
                      x: index,
                      barRods: [
                        BarChartRodData(
                          toY: _weeklySteps[index].toDouble(),
                          color: isToday
                              ? AppTheme.primaryColor
                              : AppTheme.primaryColor.withOpacity(0.4),
                          width: 20,
                          borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(6),
                          ),
                        ),
                      ],
                    );
                  }),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildWalkAchievements() {
    final achievements = [
      {
        'icon': '🏃',
        'title': 'First Walk',
        'desc': 'Complete your first walk',
        'done': true,
      },
      {
        'icon': '🎯',
        'title': '5K Steps',
        'desc': 'Walk 5,000 steps in a day',
        'done': true,
      },
      {
        'icon': '🔥',
        'title': '7 Day Streak',
        'desc': 'Walk every day for a week',
        'done': false,
      },
      {
        'icon': '🏆',
        'title': 'Marathon Walker',
        'desc': 'Walk 42 km total',
        'done': false,
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Walk Achievements',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        ...achievements.map((a) {
          final done = a['done'] as bool;
          return Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: Text(
                a['icon'] as String,
                style: TextStyle(
                  fontSize: 28,
                  color: done ? null : Colors.grey,
                ),
              ),
              title: Text(
                a['title'] as String,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: done ? null : Colors.grey,
                ),
              ),
              subtitle: Text(a['desc'] as String),
              trailing: done
                  ? const Icon(Icons.check_circle,
                      color: AppTheme.successColor, size: 28)
                  : Icon(Icons.circle_outlined,
                      color: Colors.grey[300], size: 28),
            ),
          );
        }),
      ],
    );
  }

  void _toggleWalk() {
    setState(() {
      if (_isWalking) {
        // Stop walk
        _timer?.cancel();
        _stepSimulator?.cancel();
        _pulseController.stop();
        _isWalking = false;

        // Show summary
        _showWalkSummary();
      } else {
        // Start walk
        _steps = 0;
        _seconds = 0;
        _isWalking = true;
        _pulseController.repeat(reverse: true);

        _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
          setState(() => _seconds++);
        });

        // Simulate steps (in real app, this uses pedometer sensor)
        _stepSimulator = Timer.periodic(const Duration(milliseconds: 600), (timer) {
          setState(() => _steps += Random().nextInt(3) + 1);
        });
      }
    });
  }

  void _showWalkSummary() {
    final points = WalkService.calculatePoints(_steps, _seconds ~/ 60);

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('🎉', style: TextStyle(fontSize: 48)),
              const SizedBox(height: 12),
              const Text(
                'Great Walk!',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _SummaryItem(label: 'Steps', value: '$_steps'),
                  _SummaryItem(
                    label: 'Distance',
                    value:
                        '${WalkService.estimateDistanceKm(_steps).toStringAsFixed(2)} km',
                  ),
                  _SummaryItem(
                    label: 'Time',
                    value: '${_seconds ~/ 60} min',
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: AppTheme.goldGradient,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.star, color: Colors.white),
                    const SizedBox(width: 8),
                    Text(
                      '+$points points earned!',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _todayTotalSteps += _steps;
                      _steps = 0;
                      _seconds = 0;
                    });
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text('Done',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  void _showWalkHistory() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final history = [
          {'date': 'Today', 'steps': '2,340', 'dist': '1.64 km', 'time': '28 min'},
          {'date': 'Yesterday', 'steps': '4,500', 'dist': '3.15 km', 'time': '45 min'},
          {'date': '19 Mar', 'steps': '3,900', 'dist': '2.73 km', 'time': '38 min'},
          {'date': '18 Mar', 'steps': '5,200', 'dist': '3.64 km', 'time': '52 min'},
          {'date': '17 Mar', 'steps': '2,800', 'dist': '1.96 km', 'time': '30 min'},
        ];

        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Walk History',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              ...history.map((h) => Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  leading: const Icon(Icons.directions_walk,
                      color: AppTheme.primaryColor),
                  title: Text('${h['steps']} steps'),
                  subtitle: Text('${h['dist']} - ${h['time']}'),
                  trailing: Text(
                    h['date']!,
                    style: TextStyle(color: Colors.grey[500]),
                  ),
                ),
              )),
            ],
          ),
        );
      },
    );
  }

  void _showGoalSettings() {
    showDialog(
      context: context,
      builder: (context) {
        int goal = _dailyGoal;
        return AlertDialog(
          title: const Text('Daily Step Goal'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '$goal steps',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              StatefulBuilder(
                builder: (context, setDialogState) {
                  return Slider(
                    value: goal.toDouble(),
                    min: 1000,
                    max: 20000,
                    divisions: 19,
                    label: '$goal',
                    onChanged: (value) {
                      setDialogState(() => goal = value.toInt());
                    },
                  );
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                setState(() => _dailyGoal = goal);
                Navigator.pop(context);
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }
}

class _WalkStatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _WalkStatItem({
    required this.icon,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: Colors.white70, size: 20),
        const SizedBox(height: 4),
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

class _StatMiniCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatMiniCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              label,
              style: TextStyle(fontSize: 11, color: Colors.grey[600]),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _SummaryItem extends StatelessWidget {
  final String label;
  final String value;

  const _SummaryItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        Text(label, style: TextStyle(color: Colors.grey[600])),
      ],
    );
  }
}
