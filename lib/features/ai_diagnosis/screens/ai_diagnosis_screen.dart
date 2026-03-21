import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/pet_model.dart';

/// AI Diagnosis screen with Gemini integration
class AiDiagnosisScreen extends ConsumerStatefulWidget {
  const AiDiagnosisScreen({super.key});

  @override
  ConsumerState<AiDiagnosisScreen> createState() => _AiDiagnosisScreenState();
}

class _AiDiagnosisScreenState extends ConsumerState<AiDiagnosisScreen> {
  final _symptomsController = TextEditingController();
  PetType _selectedPetType = PetType.dog;
  String _selectedPetName = 'Luna';
  bool _isAnalyzing = false;
  bool _showResults = false;
  int _freeUsesLeft = 3;

  @override
  void dispose() {
    _symptomsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Diagnosis'),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: _freeUsesLeft > 0
                  ? AppTheme.successColor.withOpacity(0.1)
                  : AppTheme.errorColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.auto_awesome,
                  size: 16,
                  color: _freeUsesLeft > 0
                      ? AppTheme.successColor
                      : AppTheme.errorColor,
                ),
                const SizedBox(width: 4),
                Text(
                  '$_freeUsesLeft/3 free',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: _freeUsesLeft > 0
                        ? AppTheme.successColor
                        : AppTheme.errorColor,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: _showResults ? _buildResults() : _buildDiagnosisForm(),
    );
  }

  Widget _buildDiagnosisForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Info Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue[50],
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.blue[200]!),
            ),
            child: Row(
              children: [
                Icon(Icons.info_outline, color: Colors.blue[700]),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'AI diagnosis is not a substitute for professional veterinary care. Always consult a vet for serious symptoms.',
                    style: TextStyle(fontSize: 13, color: Colors.blue[800]),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Select Pet
          const Text(
            'Select Pet',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          _buildPetSelector(),
          const SizedBox(height: 24),

          // Symptom Categories (quick select)
          const Text(
            'Common Symptoms',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          _buildSymptomChips(),
          const SizedBox(height: 24),

          // Describe Symptoms
          const Text(
            'Describe the Symptoms',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _symptomsController,
            maxLines: 5,
            decoration: InputDecoration(
              hintText:
                  'Describe what you\'ve observed...\n\ne.g., "My dog has been scratching a lot, has red patches on belly, and seems lethargic since yesterday"',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Photo Upload
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              border: Border.all(
                color: Colors.grey[300]!,
                style: BorderStyle.solid,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                Icon(Icons.camera_alt_outlined,
                    size: 40, color: Colors.grey[400]),
                const SizedBox(height: 8),
                Text(
                  'Add a photo (optional)',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Photos help improve diagnosis accuracy',
                  style: TextStyle(color: Colors.grey[400], fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Analyze Button
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: _isAnalyzing ? null : _startAnalysis,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: _isAnalyzing
                  ? const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        ),
                        SizedBox(width: 12),
                        Text('Analyzing with Gemini AI...'),
                      ],
                    )
                  : const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.auto_awesome),
                        SizedBox(width: 8),
                        Text(
                          'Analyze Symptoms',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
          const SizedBox(height: 24),

          // History
          const Text(
            'Recent Diagnoses',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          _buildDiagnosisHistory(),
        ],
      ),
    );
  }

  Widget _buildPetSelector() {
    final pets = [
      {'name': 'Luna', 'type': PetType.dog, 'emoji': '🐕'},
      {'name': 'Milo', 'type': PetType.cat, 'emoji': '🐈'},
      {'name': 'Coco', 'type': PetType.rabbit, 'emoji': '🐰'},
    ];

    return SizedBox(
      height: 80,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: pets.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final pet = pets[index];
          final isSelected = _selectedPetName == pet['name'];
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedPetName = pet['name'] as String;
                _selectedPetType = pet['type'] as PetType;
              });
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppTheme.primaryColor.withOpacity(0.15)
                    : Colors.grey[100],
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected ? AppTheme.primaryColor : Colors.transparent,
                  width: 2,
                ),
              ),
              child: Row(
                children: [
                  Text(pet['emoji'] as String,
                      style: const TextStyle(fontSize: 28)),
                  const SizedBox(width: 8),
                  Text(
                    pet['name'] as String,
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
    );
  }

  Widget _buildSymptomChips() {
    final symptoms = [
      'Vomiting',
      'Diarrhea',
      'Scratching',
      'Limping',
      'Not Eating',
      'Coughing',
      'Sneezing',
      'Lethargy',
      'Hair Loss',
      'Eye Discharge',
      'Swelling',
      'Bad Breath',
    ];

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: symptoms.map((symptom) {
        return ActionChip(
          label: Text(symptom),
          onPressed: () {
            final current = _symptomsController.text;
            if (current.isNotEmpty && !current.endsWith(', ')) {
              _symptomsController.text = '$current, $symptom';
            } else {
              _symptomsController.text = '$current$symptom';
            }
          },
        );
      }).toList(),
    );
  }

  Widget _buildDiagnosisHistory() {
    final history = [
      {
        'pet': '🐕 Luna',
        'symptoms': 'Scratching, red skin patches',
        'severity': 'Medium',
        'date': '18 Mar 2026',
        'color': AppTheme.warningColor,
      },
      {
        'pet': '🐈 Milo',
        'symptoms': 'Sneezing, watery eyes',
        'severity': 'Low',
        'date': '10 Mar 2026',
        'color': AppTheme.successColor,
      },
    ];

    return Column(
      children: history.map((item) {
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: Text(
              (item['pet'] as String).split(' ').first,
              style: const TextStyle(fontSize: 28),
            ),
            title: Text(item['symptoms'] as String),
            subtitle: Text(item['date'] as String),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: (item['color'] as Color).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                item['severity'] as String,
                style: TextStyle(
                  color: item['color'] as Color,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildResults() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Severity Banner
          Container(
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
                  child: const Icon(Icons.warning_amber_rounded,
                      color: Colors.white, size: 32),
                ),
                const SizedBox(width: 16),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Moderate Severity',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Monitor closely, vet visit recommended',
                        style: TextStyle(color: Colors.white70),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Assessment
          _ResultSection(
            icon: Icons.search,
            title: 'Assessment',
            color: AppTheme.primaryColor,
            content:
                'Based on the symptoms described (scratching, red patches on belly, lethargy), your dog may be experiencing a dermatological issue. The combination of these symptoms suggests a possible allergic reaction or skin infection.',
          ),
          const SizedBox(height: 16),

          // Possible Conditions
          _ResultSection(
            icon: Icons.list_alt,
            title: 'Possible Conditions',
            color: AppTheme.secondaryColor,
            child: Column(
              children: [
                _ConditionTile(
                  name: 'Atopic Dermatitis',
                  probability: 0.65,
                  description: 'Allergic skin condition common in dogs',
                ),
                _ConditionTile(
                  name: 'Contact Allergy',
                  probability: 0.45,
                  description: 'Reaction to environmental allergen',
                ),
                _ConditionTile(
                  name: 'Bacterial Skin Infection',
                  probability: 0.30,
                  description: 'Secondary infection from scratching',
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Recommendations
          _ResultSection(
            icon: Icons.lightbulb_outline,
            title: 'Recommendations',
            color: AppTheme.successColor,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _RecommendationItem(
                  text: 'Keep affected area clean and dry',
                  urgency: 'Now',
                ),
                _RecommendationItem(
                  text: 'Prevent scratching with an e-collar if needed',
                  urgency: 'Now',
                ),
                _RecommendationItem(
                  text: 'Schedule a vet appointment within 48 hours',
                  urgency: 'Soon',
                ),
                _RecommendationItem(
                  text: 'Note any new foods or environmental changes',
                  urgency: 'Track',
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Emergency Signs
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.errorColor.withOpacity(0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.errorColor.withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.emergency, color: AppTheme.errorColor),
                    const SizedBox(width: 8),
                    Text(
                      'Seek Immediate Help If:',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppTheme.errorColor,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                _EmergencySign('Rapid swelling of face or throat'),
                _EmergencySign('Difficulty breathing'),
                _EmergencySign('Excessive bleeding from skin lesions'),
                _EmergencySign('High fever or refusal to eat/drink'),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Action Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    setState(() {
                      _showResults = false;
                      _symptomsController.clear();
                    });
                  },
                  icon: const Icon(Icons.refresh),
                  label: const Text('New Diagnosis'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.save),
                  label: const Text('Save Result'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Points Earned
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: AppTheme.goldGradient,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.star, color: Colors.white),
                SizedBox(width: 8),
                Text(
                  '+10 points earned!',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  void _startAnalysis() {
    if (_symptomsController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Please describe the symptoms first'),
          backgroundColor: AppTheme.errorColor,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      );
      return;
    }

    setState(() => _isAnalyzing = true);

    // Simulate AI analysis
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isAnalyzing = false;
          _showResults = true;
          _freeUsesLeft = (_freeUsesLeft - 1).clamp(0, 3);
        });
      }
    });
  }
}

class _ResultSection extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;
  final String? content;
  final Widget? child;

  const _ResultSection({
    required this.icon,
    required this.title,
    required this.color,
    this.content,
    this.child,
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
                Icon(icon, color: color),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (content != null)
              Text(content!, style: const TextStyle(height: 1.5)),
            if (child != null) child!,
          ],
        ),
      ),
    );
  }
}

class _ConditionTile extends StatelessWidget {
  final String name;
  final double probability;
  final String description;

  const _ConditionTile({
    required this.name,
    required this.probability,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    final color = probability > 0.5
        ? AppTheme.warningColor
        : probability > 0.3
            ? AppTheme.secondaryColor
            : Colors.grey;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                '${(probability * 100).round()}%',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name,
                    style: const TextStyle(fontWeight: FontWeight.w600)),
                Text(
                  description,
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _RecommendationItem extends StatelessWidget {
  final String text;
  final String urgency;

  const _RecommendationItem({
    required this.text,
    required this.urgency,
  });

  @override
  Widget build(BuildContext context) {
    final color = urgency == 'Now'
        ? AppTheme.errorColor
        : urgency == 'Soon'
            ? AppTheme.warningColor
            : AppTheme.successColor;

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              urgency,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(text, style: const TextStyle(fontSize: 14)),
          ),
        ],
      ),
    );
  }
}

class _EmergencySign extends StatelessWidget {
  final String text;

  const _EmergencySign(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Icon(Icons.circle, size: 6, color: AppTheme.errorColor),
          const SizedBox(width: 8),
          Expanded(
            child: Text(text, style: const TextStyle(fontSize: 14)),
          ),
        ],
      ),
    );
  }
}
