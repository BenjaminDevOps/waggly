import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/pet_model.dart';
import 'add_record_screen.dart';

/// Health record / Carnet de Sante screen
class HealthRecordScreen extends StatefulWidget {
  final PetModel pet;

  const HealthRecordScreen({super.key, required this.pet});

  @override
  State<HealthRecordScreen> createState() => _HealthRecordScreenState();
}

class _HealthRecordScreenState extends State<HealthRecordScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.pet.name}\'s Health'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(text: 'Overview'),
            Tab(text: 'Vaccinations'),
            Tab(text: 'Visits'),
            Tab(text: 'Timeline'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _OverviewTab(pet: widget.pet),
          _VaccinationsTab(petName: widget.pet.name),
          _VisitsTab(petName: widget.pet.name),
          _TimelineTab(petName: widget.pet.name),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => AddRecordScreen(
                petId: widget.pet.id,
                petName: widget.pet.name,
              ),
            ),
          );
        },
        backgroundColor: AppTheme.primaryColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}

class _OverviewTab extends StatelessWidget {
  final PetModel pet;

  const _OverviewTab({required this.pet});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Upcoming Reminders
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.notifications_active, color: Colors.white),
                    SizedBox(width: 8),
                    Text(
                      'Upcoming Reminders',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _ReminderItem(
                  icon: '💉',
                  title: 'Rabies Booster',
                  date: '15 Apr 2026',
                  daysLeft: 25,
                ),
                const SizedBox(height: 8),
                _ReminderItem(
                  icon: '💊',
                  title: 'Deworming',
                  date: '01 May 2026',
                  daysLeft: 41,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Health Summary Cards
          const Text(
            'Health Summary',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _SummaryCard(
                  icon: '💉',
                  title: 'Vaccinations',
                  value: '5/5',
                  subtitle: 'Up to date',
                  color: AppTheme.successColor,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _SummaryCard(
                  icon: '💊',
                  title: 'Deworming',
                  value: '4',
                  subtitle: 'This year',
                  color: AppTheme.primaryColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _SummaryCard(
                  icon: '🏥',
                  title: 'Vet Visits',
                  value: '3',
                  subtitle: 'This year',
                  color: AppTheme.accentColor,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _SummaryCard(
                  icon: '⚖️',
                  title: 'Weight',
                  value: '${pet.weight ?? "N/A"} kg',
                  subtitle: 'Healthy range',
                  color: AppTheme.secondaryColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Allergies & Notes
          const Text(
            'Allergies & Notes',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _AllergyChip(label: 'Chicken', severity: 'Moderate'),
                  const SizedBox(height: 8),
                  _AllergyChip(label: 'Pollen', severity: 'Mild'),
                  const SizedBox(height: 12),
                  Text(
                    'Notes: Sensitive stomach - avoid grain-heavy foods. Prefers wet food.',
                    style: TextStyle(color: Colors.grey[600], height: 1.4),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ReminderItem extends StatelessWidget {
  final String icon;
  final String title;
  final String date;
  final int daysLeft;

  const _ReminderItem({
    required this.icon,
    required this.title,
    required this.date,
    required this.daysLeft,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Text(icon, style: const TextStyle(fontSize: 24)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(
                        color: Colors.white, fontWeight: FontWeight.bold)),
                Text(date, style: const TextStyle(color: Colors.white70, fontSize: 12)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              'In $daysLeft days',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String icon;
  final String title;
  final String value;
  final String subtitle;
  final Color color;

  const _SummaryCard({
    required this.icon,
    required this.title,
    required this.value,
    required this.subtitle,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(icon, style: const TextStyle(fontSize: 20)),
                const SizedBox(width: 8),
                Text(title, style: TextStyle(color: Colors.grey[600], fontSize: 13)),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(subtitle, style: TextStyle(color: Colors.grey[500], fontSize: 12)),
          ],
        ),
      ),
    );
  }
}

class _AllergyChip extends StatelessWidget {
  final String label;
  final String severity;

  const _AllergyChip({required this.label, required this.severity});

  @override
  Widget build(BuildContext context) {
    final color = severity == 'Moderate' ? AppTheme.warningColor : Colors.orange[300]!;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text('⚠️ ', style: TextStyle(fontSize: 14)),
          Text(
            '$label ($severity)',
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}

class _VaccinationsTab extends StatelessWidget {
  final String petName;

  const _VaccinationsTab({required this.petName});

  @override
  Widget build(BuildContext context) {
    final vaccinations = [
      {'name': 'Rabies', 'date': '15 Mar 2026', 'next': '15 Mar 2027', 'status': 'Current'},
      {'name': 'DHPP', 'date': '20 Jan 2026', 'next': '20 Jan 2027', 'status': 'Current'},
      {'name': 'Leptospirosis', 'date': '20 Jan 2026', 'next': '20 Jul 2026', 'status': 'Current'},
      {'name': 'Bordetella', 'date': '10 Dec 2025', 'next': '10 Jun 2026', 'status': 'Current'},
      {'name': 'Lyme Disease', 'date': '05 Nov 2025', 'next': '05 Nov 2026', 'status': 'Current'},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: vaccinations.length,
      itemBuilder: (context, index) {
        final vax = vaccinations[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text('💉', style: TextStyle(fontSize: 24)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        vax['name']!,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.successColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        vax['status']!,
                        style: const TextStyle(
                          color: AppTheme.successColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _DateInfo(label: 'Done', date: vax['date']!),
                    const SizedBox(width: 24),
                    _DateInfo(label: 'Next Due', date: vax['next']!),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _DateInfo extends StatelessWidget {
  final String label;
  final String date;

  const _DateInfo({required this.label, required this.date});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[500])),
        Text(date, style: const TextStyle(fontWeight: FontWeight.w500)),
      ],
    );
  }
}

class _VisitsTab extends StatelessWidget {
  final String petName;

  const _VisitsTab({required this.petName});

  @override
  Widget build(BuildContext context) {
    final visits = [
      {
        'date': '20 Jan 2026',
        'vet': 'Dr. Martin',
        'clinic': 'PetCare Clinic',
        'reason': 'Annual checkup',
        'notes': 'All tests normal. Weight slightly above average.',
        'cost': '85',
      },
      {
        'date': '15 Nov 2025',
        'vet': 'Dr. Martin',
        'clinic': 'PetCare Clinic',
        'reason': 'Skin irritation',
        'notes': 'Prescribed antihistamines. Follow up in 2 weeks.',
        'cost': '120',
      },
      {
        'date': '03 Aug 2025',
        'vet': 'Dr. Dupont',
        'clinic': 'VetEmergency',
        'reason': 'Limping after walk',
        'notes': 'Minor sprain. Rest recommended for 1 week.',
        'cost': '95',
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: visits.length,
      itemBuilder: (context, index) {
        final visit = visits[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text('🏥', style: TextStyle(fontSize: 24)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            visit['reason']!,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            '${visit['vet']} - ${visit['clinic']}',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      visit['date']!,
                      style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    visit['notes']!,
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey[700],
                      height: 1.4,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    '${visit['cost']} EUR',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _TimelineTab extends StatelessWidget {
  final String petName;

  const _TimelineTab({required this.petName});

  @override
  Widget build(BuildContext context) {
    final events = [
      {'date': '15 Mar 2026', 'icon': '💉', 'title': 'Rabies Vaccine', 'type': 'Vaccination'},
      {'date': '01 Feb 2026', 'icon': '💊', 'title': 'Deworming', 'type': 'Deworming'},
      {'date': '20 Jan 2026', 'icon': '🏥', 'title': 'Annual Checkup', 'type': 'Vet Visit'},
      {'date': '20 Jan 2026', 'icon': '⚖️', 'title': 'Weight: 28.5 kg', 'type': 'Weight'},
      {'date': '15 Nov 2025', 'icon': '🏥', 'title': 'Skin Irritation', 'type': 'Vet Visit'},
      {'date': '10 Dec 2025', 'icon': '💉', 'title': 'Bordetella Vaccine', 'type': 'Vaccination'},
      {'date': '05 Nov 2025', 'icon': '💉', 'title': 'Lyme Disease Vaccine', 'type': 'Vaccination'},
      {'date': '03 Aug 2025', 'icon': '🏥', 'title': 'Limping Treatment', 'type': 'Vet Visit'},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: events.length,
      itemBuilder: (context, index) {
        final event = events[index];
        return IntrinsicHeight(
          child: Row(
            children: [
              // Timeline line
              SizedBox(
                width: 40,
                child: Column(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                    if (index < events.length - 1)
                      Expanded(
                        child: Container(
                          width: 2,
                          color: AppTheme.primaryColor.withOpacity(0.3),
                        ),
                      ),
                  ],
                ),
              ),
              // Event card
              Expanded(
                child: Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        Text(event['icon']!, style: const TextStyle(fontSize: 24)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                event['title']!,
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                              Text(
                                event['type']!,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[500],
                                ),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          event['date']!,
                          style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                        ),
                      ],
                    ),
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
