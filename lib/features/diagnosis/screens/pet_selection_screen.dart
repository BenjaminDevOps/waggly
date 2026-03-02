import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../shared/models/pet_model.dart';
import '../../../shared/models/user_model.dart';
import '../../../shared/services/pet_service.dart';
import '../../../shared/services/diagnosis_service.dart';
import '../../../shared/services/auth_service.dart';
import '../widgets/pet_selection_card.dart';
import 'ai_diagnosis_screen.dart';

/// Screen for selecting which pet to diagnose
class PetSelectionScreen extends ConsumerStatefulWidget {
  const PetSelectionScreen({super.key});

  @override
  ConsumerState<PetSelectionScreen> createState() => _PetSelectionScreenState();
}

class _PetSelectionScreenState extends ConsumerState<PetSelectionScreen> {
  final PetService _petService = PetService();
  final DiagnosisService _diagnosisService = DiagnosisService();
  final AuthService _authService = AuthService();

  bool _isCheckingQuota = false;
  int _remainingDiagnoses = 0;
  UserModel? _currentUser;

  @override
  void initState() {
    super.initState();
    _loadUserAndCheckQuota();
  }

  Future<void> _loadUserAndCheckQuota() async {
    final firebaseUser = FirebaseAuth.instance.currentUser;
    if (firebaseUser == null) return;

    // Get user data from Firestore
    try {
      _currentUser = await _authService.getUserData(firebaseUser.uid);
      await _checkQuota();
    } catch (e) {
      // If user data fetch fails, continue with basic Firebase user
      _currentUser = UserModel(
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName: firebaseUser.displayName ?? 'User',
        createdAt: DateTime.now(),
      );
    }
  }

  Future<void> _checkQuota() async {
    if (_currentUser == null) return;

    setState(() => _isCheckingQuota = true);

    try {
      final remaining = await _diagnosisService.getRemainingFreeDiagnoses(
        _currentUser!.id,
        _currentUser!.isPremium,
      );
      setState(() {
        _remainingDiagnoses = remaining;
        _isCheckingQuota = false;
      });
    } catch (e) {
      setState(() => _isCheckingQuota = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to check quota: $e')),
        );
      }
    }
  }

  Future<void> _selectPet(PetModel pet) async {
    if (_currentUser == null) return;

    // Check quota before proceeding
    setState(() => _isCheckingQuota = true);

    try {
      final canDiagnose = await _diagnosisService.canCreateDiagnosis(
        _currentUser!.id,
        _currentUser!.isPremium,
      );

      setState(() => _isCheckingQuota = false);

      if (!canDiagnose) {
        _showPremiumModal();
        return;
      }

      // Navigate to diagnosis screen
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => AiDiagnosisScreen(pet: pet),
          ),
        );
      }
    } catch (e) {
      setState(() => _isCheckingQuota = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  void _showPremiumModal() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.stars, color: Colors.amber, size: 28),
            SizedBox(width: 8),
            Text('Upgrade to Premium'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'You\'ve used all your free diagnoses for this month.',
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            const Text(
              'Premium Benefits:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            _premiumFeature('🤖 Unlimited AI diagnoses'),
            _premiumFeature('📊 Complete diagnosis history'),
            _premiumFeature('📸 Multi-photo analysis'),
            _premiumFeature('💬 Extended conversations with AI'),
            _premiumFeature('🎯 Priority support'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Maybe Later'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: Navigate to premium upgrade screen
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Premium upgrade coming soon!'),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.amber,
              foregroundColor: Colors.black,
            ),
            child: const Text('Upgrade Now'),
          ),
        ],
      ),
    );
  }

  Widget _premiumFeature(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          const Icon(Icons.check_circle, color: Colors.green, size: 20),
          const SizedBox(width: 8),
          Expanded(child: Text(text)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final firebaseUser = FirebaseAuth.instance.currentUser;

    if (firebaseUser == null || _currentUser == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Select Pet')),
        body: const Center(child: Text('Please login first')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Pet Diagnosis'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withOpacity(0.1),
            ),
            child: Row(
              children: [
                const Icon(Icons.psychology, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: _currentUser!.isPremium
                      ? const Text(
                          '✨ Premium: Unlimited diagnoses',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        )
                      : _isCheckingQuota
                          ? const Text('Checking quota...')
                          : Text(
                              '$_remainingDiagnoses/${DiagnosisService.FREE_DIAGNOSES_PER_MONTH} free diagnoses remaining',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                ),
              ],
            ),
          ),
        ),
      ),
      body: StreamBuilder<List<PetModel>>(
        stream: _petService.getUserPets(_currentUser!.id),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  Text('Error: ${snapshot.error}'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => setState(() {}),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          final pets = snapshot.data ?? [];

          if (pets.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.pets,
                    size: 100,
                    color: Colors.grey[300],
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'No pets found',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Add a pet first to get started',
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      // TODO: Navigate to add pet screen
                    },
                    icon: const Icon(Icons.add),
                    label: const Text('Add Pet'),
                  ),
                ],
              ),
            );
          }

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              const Text(
                'Select a pet to diagnose:',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              ...pets.map((pet) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: PetSelectionCard(
                      pet: pet,
                      onTap: () => _selectPet(pet),
                      isLoading: _isCheckingQuota,
                    ),
                  )),
            ],
          );
        },
      ),
    );
  }
}
