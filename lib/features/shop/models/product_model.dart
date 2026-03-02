/// Product model for shop items
class ProductModel {
  final String id;
  final String name;
  final String description;
  final String category; // Food, Toys, Care, Accessories
  final double price;
  final String currency;
  final String imageUrl;
  final double rating;
  final int reviewCount;
  final List<String> suitableFor; // Dog, Cat, Bird, etc.
  final String affiliateLink; // Amazon or Zooplus link
  final String affiliateSource; // 'amazon' or 'zooplus'
  final bool isRecommended;
  final bool isOnSale;
  final double? originalPrice;

  ProductModel({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.price,
    this.currency = '€',
    required this.imageUrl,
    this.rating = 0.0,
    this.reviewCount = 0,
    required this.suitableFor,
    required this.affiliateLink,
    this.affiliateSource = 'amazon',
    this.isRecommended = false,
    this.isOnSale = false,
    this.originalPrice,
  });

  /// Calculate discount percentage
  int? get discountPercentage {
    if (originalPrice != null && originalPrice! > price) {
      return (((originalPrice! - price) / originalPrice!) * 100).round();
    }
    return null;
  }

  /// Check if suitable for specific species
  bool isSuitableFor(String species) {
    return suitableFor.contains(species) || suitableFor.contains('All');
  }

  /// From JSON (for mock data or API)
  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      category: json['category'] as String,
      price: (json['price'] as num).toDouble(),
      currency: json['currency'] as String? ?? '€',
      imageUrl: json['imageUrl'] as String,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewCount: json['reviewCount'] as int? ?? 0,
      suitableFor: List<String>.from(json['suitableFor'] as List),
      affiliateLink: json['affiliateLink'] as String,
      affiliateSource: json['affiliateSource'] as String? ?? 'amazon',
      isRecommended: json['isRecommended'] as bool? ?? false,
      isOnSale: json['isOnSale'] as bool? ?? false,
      originalPrice: (json['originalPrice'] as num?)?.toDouble(),
    );
  }

  /// To JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'category': category,
      'price': price,
      'currency': currency,
      'imageUrl': imageUrl,
      'rating': rating,
      'reviewCount': reviewCount,
      'suitableFor': suitableFor,
      'affiliateLink': affiliateLink,
      'affiliateSource': affiliateSource,
      'isRecommended': isRecommended,
      'isOnSale': isOnSale,
      'originalPrice': originalPrice,
    };
  }
}
