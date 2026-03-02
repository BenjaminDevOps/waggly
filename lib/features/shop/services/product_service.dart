import '../models/product_model.dart';

/// Service for managing pet products (using mock data for now)
/// TODO: Replace with real API calls when backend is ready
class ProductService {
  /// Get all products
  List<ProductModel> getAllProducts() {
    return _mockProducts;
  }

  /// Get products by category
  List<ProductModel> getProductsByCategory(String category) {
    return _mockProducts.where((p) => p.category == category).toList();
  }

  /// Get recommended products for a pet species
  List<ProductModel> getRecommendedProducts(String species) {
    return _mockProducts
        .where((p) => p.isSuitableFor(species) && p.isRecommended)
        .toList();
  }

  /// Get products suitable for a species
  List<ProductModel> getProductsForSpecies(String species) {
    return _mockProducts.where((p) => p.isSuitableFor(species)).toList();
  }

  /// Get on-sale products
  List<ProductModel> getOnSaleProducts() {
    return _mockProducts.where((p) => p.isOnSale).toList();
  }

  /// Search products
  List<ProductModel> searchProducts(String query) {
    final lowerQuery = query.toLowerCase();
    return _mockProducts
        .where((p) =>
            p.name.toLowerCase().contains(lowerQuery) ||
            p.description.toLowerCase().contains(lowerQuery) ||
            p.category.toLowerCase().contains(lowerQuery))
        .toList();
  }

  /// Mock products data
  static final List<ProductModel> _mockProducts = [
    // DOG FOOD
    ProductModel(
      id: '1',
      name: 'Royal Canin Adult Dog Food',
      description: 'Premium nutrition for adult dogs, helps maintain ideal weight and supports joint health.',
      category: 'Food',
      price: 45.99,
      imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500',
      rating: 4.7,
      reviewCount: 2341,
      suitableFor: ['Dog'],
      affiliateLink: 'https://amazon.com/royal-canin-adult',
      affiliateSource: 'amazon',
      isRecommended: true,
    ),

    ProductModel(
      id: '2',
      name: 'Hill\'s Science Diet Puppy Food',
      description: 'Scientifically formulated for puppies with DHA for brain development.',
      category: 'Food',
      price: 39.99,
      originalPrice: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500',
      rating: 4.8,
      reviewCount: 1823,
      suitableFor: ['Dog'],
      affiliateLink: 'https://amazon.com/hills-puppy',
      affiliateSource: 'amazon',
      isOnSale: true,
      isRecommended: true,
    ),

    // CAT FOOD
    ProductModel(
      id: '3',
      name: 'Purina Pro Plan Cat Food',
      description: 'High protein formula for healthy muscles and organs in adult cats.',
      category: 'Food',
      price: 32.99,
      imageUrl: 'https://images.unsplash.com/photo-1589652727195-030f2c28c02c?w=500',
      rating: 4.6,
      reviewCount: 3201,
      suitableFor: ['Cat'],
      affiliateLink: 'https://zooplus.com/purina-pro-plan',
      affiliateSource: 'zooplus',
      isRecommended: true,
    ),

    ProductModel(
      id: '4',
      name: 'Whiskas Adult Wet Food Variety Pack',
      description: '24 pack variety of delicious wet food flavors cats love.',
      category: 'Food',
      price: 18.99,
      originalPrice: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=500',
      rating: 4.4,
      reviewCount: 1567,
      suitableFor: ['Cat'],
      affiliateLink: 'https://amazon.com/whiskas-variety',
      affiliateSource: 'amazon',
      isOnSale: true,
    ),

    // DOG TOYS
    ProductModel(
      id: '5',
      name: 'KONG Classic Dog Toy',
      description: 'Durable rubber toy for chewing and treat dispensing. Keeps dogs entertained for hours.',
      category: 'Toys',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1603212362787-9e84ef300434?w=500',
      rating: 4.9,
      reviewCount: 8932,
      suitableFor: ['Dog'],
      affiliateLink: 'https://amazon.com/kong-classic',
      affiliateSource: 'amazon',
      isRecommended: true,
    ),

    ProductModel(
      id: '6',
      name: 'Chuckit! Ball Launcher',
      description: 'Hands-free ball launcher for fetch games. Includes 2 tennis balls.',
      category: 'Toys',
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500',
      rating: 4.7,
      reviewCount: 2134,
      suitableFor: ['Dog'],
      affiliateLink: 'https://amazon.com/chuckit-launcher',
      affiliateSource: 'amazon',
    ),

    // CAT TOYS
    ProductModel(
      id: '7',
      name: 'Interactive Cat Feather Wand',
      description: 'Engaging feather toy on a wand for interactive play. Retractable design.',
      category: 'Toys',
      price: 8.99,
      imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500',
      rating: 4.5,
      reviewCount: 1456,
      suitableFor: ['Cat'],
      affiliateLink: 'https://zooplus.com/cat-feather-wand',
      affiliateSource: 'zooplus',
      isRecommended: true,
    ),

    ProductModel(
      id: '8',
      name: 'Cat Laser Pointer Toy',
      description: 'Automatic rotating laser toy to keep your cat active and entertained.',
      category: 'Toys',
      price: 19.99,
      originalPrice: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=500',
      rating: 4.3,
      reviewCount: 987,
      suitableFor: ['Cat'],
      affiliateLink: 'https://amazon.com/cat-laser',
      affiliateSource: 'amazon',
      isOnSale: true,
    ),

    // GROOMING & CARE
    ProductModel(
      id: '9',
      name: 'FURminator Deshedding Tool',
      description: 'Professional-grade grooming tool reduces shedding by up to 90%.',
      category: 'Care',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500',
      rating: 4.8,
      reviewCount: 5421,
      suitableFor: ['Dog', 'Cat'],
      affiliateLink: 'https://amazon.com/furminator',
      affiliateSource: 'amazon',
      isRecommended: true,
    ),

    ProductModel(
      id: '10',
      name: 'Pet Shampoo & Conditioner Set',
      description: 'Natural, hypoallergenic formula for sensitive skin. Pleasant lavender scent.',
      category: 'Care',
      price: 22.99,
      imageUrl: 'https://images.unsplash.com/photo-1628198387714-31fa22b95be7?w=500',
      rating: 4.6,
      reviewCount: 1234,
      suitableFor: ['Dog', 'Cat'],
      affiliateLink: 'https://zooplus.com/pet-shampoo',
      affiliateSource: 'zooplus',
    ),

    ProductModel(
      id: '11',
      name: 'Nail Clippers for Pets',
      description: 'Professional-grade stainless steel nail clippers with safety guard.',
      category: 'Care',
      price: 9.99,
      imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500',
      rating: 4.4,
      reviewCount: 876,
      suitableFor: ['Dog', 'Cat', 'Rabbit'],
      affiliateLink: 'https://amazon.com/nail-clippers',
      affiliateSource: 'amazon',
    ),

    // ACCESSORIES
    ProductModel(
      id: '12',
      name: 'Premium Pet Bed - Orthopedic',
      description: 'Memory foam pet bed for ultimate comfort. Removable washable cover.',
      category: 'Accessories',
      price: 59.99,
      originalPrice: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500',
      rating: 4.9,
      reviewCount: 3421,
      suitableFor: ['Dog', 'Cat'],
      affiliateLink: 'https://amazon.com/orthopedic-bed',
      affiliateSource: 'amazon',
      isOnSale: true,
      isRecommended: true,
    ),

    ProductModel(
      id: '13',
      name: 'Adjustable Dog Harness',
      description: 'No-pull harness with reflective strips for nighttime safety.',
      category: 'Accessories',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      rating: 4.7,
      reviewCount: 2341,
      suitableFor: ['Dog'],
      affiliateLink: 'https://zooplus.com/dog-harness',
      affiliateSource: 'zooplus',
      isRecommended: true,
    ),

    ProductModel(
      id: '14',
      name: 'Stainless Steel Pet Bowls',
      description: 'Set of 2 non-slip bowls for food and water. Dishwasher safe.',
      category: 'Accessories',
      price: 14.99,
      imageUrl: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=500',
      rating: 4.6,
      reviewCount: 1567,
      suitableFor: ['Dog', 'Cat'],
      affiliateLink: 'https://amazon.com/steel-bowls',
      affiliateSource: 'amazon',
    ),

    ProductModel(
      id: '15',
      name: 'Cat Scratching Post',
      description: 'Tall sisal scratching post with platform and hanging toys.',
      category: 'Accessories',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500',
      rating: 4.5,
      reviewCount: 1987,
      suitableFor: ['Cat'],
      affiliateLink: 'https://zooplus.com/scratching-post',
      affiliateSource: 'zooplus',
    ),

    // BIRD PRODUCTS
    ProductModel(
      id: '16',
      name: 'Premium Bird Seed Mix',
      description: 'Nutritious blend of seeds for parakeets, canaries, and finches.',
      category: 'Food',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500',
      rating: 4.6,
      reviewCount: 432,
      suitableFor: ['Bird'],
      affiliateLink: 'https://amazon.com/bird-seed',
      affiliateSource: 'amazon',
    ),

    ProductModel(
      id: '17',
      name: 'Bird Cage Swing Toy',
      description: 'Colorful wooden swing with bell for small to medium birds.',
      category: 'Toys',
      price: 7.99,
      imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=500',
      rating: 4.4,
      reviewCount: 234,
      suitableFor: ['Bird'],
      affiliateLink: 'https://zooplus.com/bird-swing',
      affiliateSource: 'zooplus',
    ),
  ];
}
