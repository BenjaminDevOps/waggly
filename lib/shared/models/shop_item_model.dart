import 'package:cloud_firestore/cloud_firestore.dart';

enum ShopCategory { food, toys, health, accessories, grooming, training }

enum PetFilter { all, dog, cat, nac }

/// Shop item model
class ShopItemModel {
  final String id;
  final String name;
  final String description;
  final double price;
  final double? originalPrice;
  final String imageUrl;
  final ShopCategory category;
  final List<String> petTypes; // dog, cat, bird, rabbit, etc.
  final double rating;
  final int reviewCount;
  final String? affiliateUrl;
  final bool isFeatured;
  final bool isNew;
  final Map<String, dynamic>? metadata;

  ShopItemModel({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.originalPrice,
    required this.imageUrl,
    required this.category,
    required this.petTypes,
    this.rating = 0.0,
    this.reviewCount = 0,
    this.affiliateUrl,
    this.isFeatured = false,
    this.isNew = false,
    this.metadata,
  });

  double? get discountPercent {
    if (originalPrice == null || originalPrice! <= price) return null;
    return ((originalPrice! - price) / originalPrice! * 100).roundToDouble();
  }

  String get categoryLabel {
    switch (category) {
      case ShopCategory.food:
        return 'Food';
      case ShopCategory.toys:
        return 'Toys';
      case ShopCategory.health:
        return 'Health';
      case ShopCategory.accessories:
        return 'Accessories';
      case ShopCategory.grooming:
        return 'Grooming';
      case ShopCategory.training:
        return 'Training';
    }
  }

  String get categoryIcon {
    switch (category) {
      case ShopCategory.food:
        return '🍖';
      case ShopCategory.toys:
        return '🧸';
      case ShopCategory.health:
        return '💊';
      case ShopCategory.accessories:
        return '🎀';
      case ShopCategory.grooming:
        return '✂️';
      case ShopCategory.training:
        return '🎯';
    }
  }

  factory ShopItemModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ShopItemModel(
      id: doc.id,
      name: data['name'] ?? '',
      description: data['description'] ?? '',
      price: (data['price'] ?? 0.0).toDouble(),
      originalPrice: data['originalPrice']?.toDouble(),
      imageUrl: data['imageUrl'] ?? '',
      category: ShopCategory.values.firstWhere(
        (e) => e.name == data['category'],
        orElse: () => ShopCategory.accessories,
      ),
      petTypes: List<String>.from(data['petTypes'] ?? []),
      rating: (data['rating'] ?? 0.0).toDouble(),
      reviewCount: data['reviewCount'] ?? 0,
      affiliateUrl: data['affiliateUrl'],
      isFeatured: data['isFeatured'] ?? false,
      isNew: data['isNew'] ?? false,
      metadata: data['metadata'],
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'name': name,
      'description': description,
      'price': price,
      'originalPrice': originalPrice,
      'imageUrl': imageUrl,
      'category': category.name,
      'petTypes': petTypes,
      'rating': rating,
      'reviewCount': reviewCount,
      'affiliateUrl': affiliateUrl,
      'isFeatured': isFeatured,
      'isNew': isNew,
      'metadata': metadata,
    };
  }
}
