import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/models/diagnosis_model.dart';
import '../../../shared/services/diagnosis_service.dart';
import '../widgets/severity_badge.dart';
import 'diagnosis_history_screen.dart';

/// Screen showing diagnosis results and report
class DiagnosisResultScreen extends ConsumerStatefulWidget {
  final DiagnosisModel diagnosis;
  final List<File> photos;

  const DiagnosisResultScreen({
    super.key,
    required this.diagnosis,
    this.photos = const [],
  });

  @override
  ConsumerState<DiagnosisResultScreen> createState() =>
      _DiagnosisResultScreenState();
}

class _DiagnosisResultScreenState extends ConsumerState<DiagnosisResultScreen> {
  final DiagnosisService _diagnosisService = DiagnosisService();
  bool _isSaving = false;
  bool _isSaved = false;

  Future<void> _saveDiagnosis() async {
    setState(() => _isSaving = true);

    try {
      // Upload photos first
      List<String> photoUrls = [];
      if (widget.photos.isNotEmpty) {
        photoUrls = await _diagnosisService.uploadPhotos(
          widget.diagnosis.id,
          widget.photos,
        );
      }

      // Save diagnosis with photo URLs
      final diagnosisToSave = widget.diagnosis.copyWith(
        photoUrls: photoUrls,
      );

      await _diagnosisService.saveDiagnosis(diagnosisToSave);

      setState(() {
        _isSaving = false;
        _isSaved = true;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Diagnosis saved successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() => _isSaving = false);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to save: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Diagnosis Report'),
        actions: [
          if (!_isSaved)
            TextButton.icon(
              onPressed: _isSaving ? null : _saveDiagnosis,
              icon: _isSaving
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(Icons.save, color: Colors.white),
              label: Text(
                _isSaving ? 'Saving...' : 'Save',
                style: const TextStyle(color: Colors.white),
              ),
            ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Header with pet name and severity
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.pets, size: 32),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.diagnosis.petName,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Diagnosis Report',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                      SeverityBadge(severity: widget.diagnosis.severity),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Generated: ${_formatDate(widget.diagnosis.createdAt)}',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Symptoms
          _buildSection(
            icon: Icons.healing,
            title: 'Symptoms Reported',
            content: widget.diagnosis.symptoms,
          ),

          const SizedBox(height: 16),

          // AI Analysis
          _buildSection(
            icon: Icons.psychology,
            title: 'AI Analysis',
            content: widget.diagnosis.aiAnalysis,
          ),

          const SizedBox(height: 16),

          // Recommendations
          _buildSection(
            icon: Icons.recommend,
            title: 'Recommendations',
            content: widget.diagnosis.recommendations,
            color: Colors.green,
          ),

          const SizedBox(height: 16),

          // Legal disclaimer
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.amber[50],
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.amber[200]!),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.warning_amber, color: Colors.amber[800]),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    '⚠️ **Important Disclaimer**\n\n'
                    'This AI analysis is for informational purposes only and does not constitute professional veterinary advice. '
                    'Always consult with a licensed veterinarian for medical concerns about your pet.',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.amber[900],
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Action buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  icon: const Icon(Icons.home),
                  label: const Text('Home'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _isSaved
                      ? () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  const DiagnosisHistoryScreen(),
                            ),
                          );
                        }
                      : null,
                  icon: const Icon(Icons.history),
                  label: const Text('View History'),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Find veterinarian button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                // TODO: Navigate to vet finder
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Vet finder coming soon!'),
                  ),
                );
              },
              icon: const Icon(Icons.local_hospital),
              label: const Text('Find a Veterinarian'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection({
    required IconData icon,
    required String title,
    required String content,
    Color? color,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color ?? Theme.of(context).primaryColor),
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
            Text(
              content,
              style: const TextStyle(
                fontSize: 15,
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} at ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
}
