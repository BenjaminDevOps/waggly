import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:image_picker/image_picker.dart';
import 'package:uuid/uuid.dart';
import '../../../shared/models/pet_model.dart';
import '../../../shared/models/diagnosis_model.dart';
import '../../../shared/services/gemini_service.dart';
import '../../../shared/services/diagnosis_service.dart';
import '../models/chat_message.dart';
import '../widgets/message_bubble.dart';
import '../widgets/photo_preview.dart';
import '../widgets/typing_indicator.dart';
import 'diagnosis_result_screen.dart';

/// Main AI diagnosis screen with chat interface
class AiDiagnosisScreen extends ConsumerStatefulWidget {
  final PetModel pet;

  const AiDiagnosisScreen({super.key, required this.pet});

  @override
  ConsumerState<AiDiagnosisScreen> createState() => _AiDiagnosisScreenState();
}

class _AiDiagnosisScreenState extends ConsumerState<AiDiagnosisScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final ImagePicker _imagePicker = ImagePicker();
  final GeminiService _geminiService = GeminiService();
  final DiagnosisService _diagnosisService = DiagnosisService();

  final List<ChatMessage> _messages = [];
  final List<File> _selectedPhotos = [];
  bool _isAiResponding = false;
  String _fullConversation = '';

  @override
  void initState() {
    super.initState();
    _addWelcomeMessage();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _addWelcomeMessage() {
    final welcomeMessage = ChatMessage.system(
      text: '👋 Hello! I\'m your AI veterinary assistant.\n\n'
          'I\'ll help analyze ${widget.pet.name}\'s symptoms. '
          'Please describe what you\'ve noticed, and feel free to upload photos if relevant.\n\n'
          '⚠️ **Important**: This is not a replacement for professional veterinary care. '
          'For serious concerns, please consult a licensed veterinarian.',
    );

    setState(() {
      _messages.add(welcomeMessage);
    });
  }

  Future<void> _pickImage() async {
    if (_selectedPhotos.length >= 3) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Maximum 3 photos allowed')),
      );
      return;
    }

    try {
      final XFile? image = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 80,
      );

      if (image != null) {
        setState(() {
          _selectedPhotos.add(File(image.path));
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to pick image: $e')),
        );
      }
    }
  }

  Future<void> _takePhoto() async {
    if (_selectedPhotos.length >= 3) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Maximum 3 photos allowed')),
      );
      return;
    }

    try {
      final XFile? photo = await _imagePicker.pickImage(
        source: ImageSource.camera,
        imageQuality: 80,
      );

      if (photo != null) {
        setState(() {
          _selectedPhotos.add(File(photo.path));
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to take photo: $e')),
        );
      }
    }
  }

  void _removePhoto(int index) {
    setState(() {
      _selectedPhotos.removeAt(index);
    });
  }

  Future<void> _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty && _selectedPhotos.isEmpty) return;

    final photos = List<File>.from(_selectedPhotos);

    // Add user message
    final userMessage = ChatMessage.user(
      text: text.isNotEmpty ? text : '📸 [Photo attached]',
      photos: photos,
    );

    setState(() {
      _messages.add(userMessage);
      _messageController.clear();
      _selectedPhotos.clear();
      _isAiResponding = true;
    });

    _scrollToBottom();

    // Get AI response
    try {
      String aiResponse;

      if (photos.isNotEmpty) {
        // Use vision model with first photo
        aiResponse = await _geminiService.analyzeWithPhoto(
          petName: widget.pet.name,
          species: widget.pet.species,
          breed: widget.pet.breed,
          ageYears: widget.pet.ageYears,
          symptoms: text,
          photoFile: photos.first,
        );
      } else if (_messages.length <= 2) {
        // First analysis (no photo)
        aiResponse = await _geminiService.analyzeSymptoms(
          petName: widget.pet.name,
          species: widget.pet.species,
          breed: widget.pet.breed,
          ageYears: widget.pet.ageYears,
          symptoms: text,
        );
      } else {
        // Follow-up question
        aiResponse = await _geminiService.askFollowUp(
          conversationContext: _fullConversation,
          userQuestion: text,
        );
      }

      // Update conversation history
      _fullConversation += 'User: $text\n\nAI: $aiResponse\n\n';

      // Add AI message
      final aiMessage = ChatMessage.ai(text: aiResponse);

      setState(() {
        _messages.add(aiMessage);
        _isAiResponding = false;
      });

      _scrollToBottom();
    } catch (e) {
      setState(() => _isAiResponding = false);

      final errorMessage = ChatMessage.ai(
        text: '❌ Sorry, I encountered an error: $e\n\n'
            'Please make sure your Gemini API key is configured correctly in the .env file.',
      );

      setState(() {
        _messages.add(errorMessage);
      });

      _scrollToBottom();
    }
  }

  Future<void> _generateFinalReport() async {
    if (_messages.length < 3) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please have at least one conversation before generating a report'),
        ),
      );
      return;
    }

    setState(() => _isAiResponding = true);

    try {
      final report = await _geminiService.generateDiagnosisReport(
        fullConversation: _fullConversation,
        petName: widget.pet.name,
      );

      final firebaseUser = FirebaseAuth.instance.currentUser;
      if (firebaseUser == null) throw Exception('User not logged in');

      // Create diagnosis model
      final diagnosis = DiagnosisModel(
        id: const Uuid().v4(),
        userId: firebaseUser.uid,
        petId: widget.pet.id,
        petName: widget.pet.name,
        symptoms: _messages
            .where((m) => m.type == MessageType.user)
            .map((m) => m.text)
            .join('; '),
        photoUrls: [], // Will be uploaded separately
        aiAnalysis: report['analysis'] ?? '',
        recommendations: report['recommendations'] ?? '',
        severity: report['severity'] ?? 'Low',
        createdAt: DateTime.now(),
        conversationHistory: {
          'messages': _messages.map((m) => m.toJson()).toList(),
        },
      );

      setState(() => _isAiResponding = false);

      // Navigate to result screen
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => DiagnosisResultScreen(
              diagnosis: diagnosis,
              photos: _messages
                  .expand((m) => m.photos)
                  .toList(),
            ),
          ),
        );
      }
    } catch (e) {
      setState(() => _isAiResponding = false);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to generate report: $e')),
        );
      }
    }
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('AI Diagnosis'),
            Text(
              widget.pet.name,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.normal),
            ),
          ],
        ),
        actions: [
          if (_messages.length > 2)
            IconButton(
              icon: const Icon(Icons.article),
              onPressed: _isAiResponding ? null : _generateFinalReport,
              tooltip: 'Generate Report',
            ),
        ],
      ),
      body: Column(
        children: [
          // Chat messages
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_isAiResponding ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length) {
                  return const TypingIndicator();
                }

                final message = _messages[index];
                return MessageBubble(message: message);
              },
            ),
          ),

          // Photo preview
          if (_selectedPhotos.isNotEmpty)
            Container(
              height: 100,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _selectedPhotos.length,
                itemBuilder: (context, index) {
                  return PhotoPreview(
                    photo: _selectedPhotos[index],
                    onRemove: () => _removePhoto(index),
                  );
                },
              ),
            ),

          // Input area
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -5),
                ),
              ],
            ),
            child: SafeArea(
              child: Row(
                children: [
                  // Photo button
                  IconButton(
                    icon: const Icon(Icons.photo_library),
                    onPressed: _isAiResponding ? null : _pickImage,
                  ),
                  // Camera button
                  IconButton(
                    icon: const Icon(Icons.camera_alt),
                    onPressed: _isAiResponding ? null : _takePhoto,
                  ),
                  const SizedBox(width: 8),
                  // Text input
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      enabled: !_isAiResponding,
                      decoration: InputDecoration(
                        hintText: 'Describe symptoms...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                      ),
                      maxLines: null,
                      textCapitalization: TextCapitalization.sentences,
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Send button
                  CircleAvatar(
                    backgroundColor: Theme.of(context).primaryColor,
                    child: IconButton(
                      icon: const Icon(Icons.send, color: Colors.white),
                      onPressed: _isAiResponding ? null : _sendMessage,
                    ),
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
