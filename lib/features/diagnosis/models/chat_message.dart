import 'dart:io';

/// Types of chat messages
enum MessageType { user, ai, system }

/// Chat message model for diagnosis conversation
class ChatMessage {
  final String id;
  final MessageType type;
  final String text;
  final List<File> photos;
  final DateTime timestamp;
  final bool isLoading;

  ChatMessage({
    required this.id,
    required this.type,
    required this.text,
    this.photos = const [],
    DateTime? timestamp,
    this.isLoading = false,
  }) : timestamp = timestamp ?? DateTime.now();

  /// Copy with
  ChatMessage copyWith({
    String? id,
    MessageType? type,
    String? text,
    List<File>? photos,
    DateTime? timestamp,
    bool? isLoading,
  }) {
    return ChatMessage(
      id: id ?? this.id,
      type: type ?? this.type,
      text: text ?? this.text,
      photos: photos ?? this.photos,
      timestamp: timestamp ?? this.timestamp,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  /// Create a user message
  factory ChatMessage.user({
    required String text,
    List<File> photos = const [],
  }) {
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      type: MessageType.user,
      text: text,
      photos: photos,
    );
  }

  /// Create an AI message
  factory ChatMessage.ai({
    required String text,
    bool isLoading = false,
  }) {
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      type: MessageType.ai,
      text: text,
      isLoading: isLoading,
    );
  }

  /// Create a system message
  factory ChatMessage.system({required String text}) {
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      type: MessageType.system,
      text: text,
    );
  }

  /// Convert to JSON for storage
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type.name,
      'text': text,
      'timestamp': timestamp.toIso8601String(),
      'photoCount': photos.length,
    };
  }

  /// From JSON
  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'],
      type: MessageType.values.firstWhere((e) => e.name == json['type']),
      text: json['text'],
      timestamp: DateTime.parse(json['timestamp']),
    );
  }
}
