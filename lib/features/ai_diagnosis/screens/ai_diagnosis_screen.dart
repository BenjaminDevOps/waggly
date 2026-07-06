import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/constants/nac_species.dart';
import '../../../core/localization/app_language.dart';
import '../../../core/localization/language_provider.dart';
import '../../../core/localization/nac_strings.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/diagnosis_model.dart' show DiagnosisSeverity;
import '../../../shared/models/pet_model.dart';
import '../../../shared/services/gemini_service.dart';

/// NAC-specific AI diagnosis: lets the owner pick their exotic pet's
/// species category, describe symptoms and optionally attach photos,
/// then runs it through [GeminiService] with a species-aware prompt.
class AiDiagnosisScreen extends ConsumerStatefulWidget {
  const AiDiagnosisScreen({super.key});

  @override
  ConsumerState<AiDiagnosisScreen> createState() => _AiDiagnosisScreenState();
}

class _AiDiagnosisScreenState extends ConsumerState<AiDiagnosisScreen> {
  final _ageController = TextEditingController();
  final _symptomsController = TextEditingController();
  final _geminiService = GeminiService();
  final _picker = ImagePicker();

  PetType _selectedType = NacSpeciesCatalog.all.first.type;
  final List<XFile> _pickedImages = [];

  bool _isLoading = false;
  DiagnosisResult? _result;
  String? _errorMessage;

  @override
  void dispose() {
    _ageController.dispose();
    _symptomsController.dispose();
    super.dispose();
  }

  Future<void> _pickImages() async {
    final images = await _picker.pickMultiImage(imageQuality: 80);
    if (images.isEmpty) return;
    setState(() {
      _pickedImages.addAll(images);
      if (_pickedImages.length > 3) {
        _pickedImages.removeRange(0, _pickedImages.length - 3);
      }
    });
  }

  Future<void> _submit() async {
    final lang = ref.read(languageProvider);

    if (_symptomsController.text.trim().isEmpty) {
      setState(() => _errorMessage = NacStrings.of(lang, 'diagnosis_missing_symptoms'));
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _result = null;
    });

    try {
      final images = <Uint8List>[
        for (final file in _pickedImages) await file.readAsBytes(),
      ];
      final sheet = NacSpeciesCatalog.forType(_selectedType);

      final result = await _geminiService.analyzePetSymptoms(
        petType: sheet.nameFor(AppLanguage.en),
        petAge: _ageController.text.trim(),
        symptoms: _symptomsController.text.trim(),
        images: images.isEmpty ? null : images,
      );

      if (!mounted) return;
      setState(() => _result = result);
    } catch (_) {
      if (!mounted) return;
      setState(() => _errorMessage = NacStrings.of(lang, 'diagnosis_error'));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Color _severityColor(DiagnosisSeverity severity) {
    switch (severity) {
      case DiagnosisSeverity.low:
        return AppTheme.successColor;
      case DiagnosisSeverity.medium:
        return AppTheme.warningColor;
      case DiagnosisSeverity.high:
      case DiagnosisSeverity.emergency:
        return AppTheme.errorColor;
    }
  }

  String _severityLabel(AppLanguage lang, DiagnosisSeverity severity) {
    switch (severity) {
      case DiagnosisSeverity.low:
        return NacStrings.of(lang, 'severity_low');
      case DiagnosisSeverity.medium:
        return NacStrings.of(lang, 'severity_medium');
      case DiagnosisSeverity.high:
        return NacStrings.of(lang, 'severity_high');
      case DiagnosisSeverity.emergency:
        return NacStrings.of(lang, 'severity_emergency');
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(NacStrings.of(lang, 'diagnosis_title')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              NacStrings.of(lang, 'diagnosis_intro'),
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 20),

            Text(
              NacStrings.of(lang, 'diagnosis_species_label'),
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<PetType>(
              value: _selectedType,
              items: NacSpeciesCatalog.all
                  .map(
                    (sheet) => DropdownMenuItem(
                      value: sheet.type,
                      child: Text('${sheet.emoji} ${sheet.nameFor(lang)}'),
                    ),
                  )
                  .toList(),
              onChanged: (value) {
                if (value != null) setState(() => _selectedType = value);
              },
            ),
            const SizedBox(height: 16),

            Text(
              NacStrings.of(lang, 'diagnosis_age_label'),
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _ageController,
              decoration: InputDecoration(
                hintText: NacStrings.of(lang, 'diagnosis_age_hint'),
              ),
            ),
            const SizedBox(height: 16),

            Text(
              NacStrings.of(lang, 'diagnosis_symptoms_label'),
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _symptomsController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: NacStrings.of(lang, 'diagnosis_symptoms_hint'),
              ),
            ),
            const SizedBox(height: 16),

            OutlinedButton.icon(
              onPressed: _isLoading ? null : _pickImages,
              icon: const Icon(Icons.add_a_photo_outlined),
              label: Text(NacStrings.of(lang, 'diagnosis_add_photo')),
            ),
            if (_pickedImages.isNotEmpty) ...[
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _pickedImages
                    .map(
                      (file) => Chip(
                        avatar: const Icon(Icons.image_outlined, size: 18),
                        label: Text(file.name, overflow: TextOverflow.ellipsis),
                        onDeleted: () => setState(() => _pickedImages.remove(file)),
                      ),
                    )
                    .toList(),
              ),
            ],
            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                ),
                child: _isLoading
                    ? Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(NacStrings.of(lang, 'diagnosis_analyzing')),
                        ],
                      )
                    : Text(NacStrings.of(lang, 'diagnosis_submit')),
              ),
            ),
            const SizedBox(height: 16),

            Text(
              NacStrings.of(lang, 'diagnosis_disclaimer'),
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),

            if (_errorMessage != null) ...[
              const SizedBox(height: 16),
              Text(
                _errorMessage!,
                style: const TextStyle(color: AppTheme.errorColor),
              ),
            ],

            if (_result != null) ...[
              const SizedBox(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        NacStrings.of(lang, 'diagnosis_result_title'),
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Text(
                            '${NacStrings.of(lang, 'diagnosis_severity_label')}: ',
                            style: const TextStyle(fontWeight: FontWeight.w600),
                          ),
                          Chip(
                            label: Text(
                              _severityLabel(lang, _result!.severity),
                              style: const TextStyle(color: Colors.white),
                            ),
                            backgroundColor: _severityColor(_result!.severity),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        NacStrings.of(lang, 'diagnosis_conditions_label'),
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 4),
                      ..._result!.possibleConditions.map(
                        (condition) => Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Text('• $condition'),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        NacStrings.of(lang, 'diagnosis_recommendations_label'),
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 4),
                      ..._result!.recommendations.map(
                        (recommendation) => Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Text('• $recommendation'),
                        ),
                      ),
                      if (_result!.requiresVetVisit) ...[
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.errorColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            NacStrings.of(lang, 'diagnosis_vet_warning'),
                            style: const TextStyle(
                              color: AppTheme.errorColor,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
