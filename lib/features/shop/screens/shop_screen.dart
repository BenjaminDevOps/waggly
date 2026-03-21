import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/shop_item_model.dart';

/// Shop screen with categories and product listings
class ShopScreen extends StatefulWidget {
  const ShopScreen({super.key});

  @override
  State<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends State<ShopScreen> {
  ShopCategory? _selectedCategory;
  PetFilter _petFilter = PetFilter.all;
  final _searchController = TextEditingController();

  // Demo products
  final List<Map<String, dynamic>> _products = [
    {
      'name': 'Royal Canin Adult',
      'desc': 'Premium dry food for adult dogs',
      'price': 45.99,
      'original': 54.99,
      'rating': 4.8,
      'reviews': 2340,
      'category': ShopCategory.food,
      'pets': ['dog'],
      'featured': true,
      'new': false,
    },
    {
      'name': 'Interactive Puzzle Feeder',
      'desc': 'Mental stimulation toy for dogs & cats',
      'price': 19.99,
      'original': null,
      'rating': 4.6,
      'reviews': 890,
      'category': ShopCategory.toys,
      'pets': ['dog', 'cat'],
      'featured': true,
      'new': true,
    },
    {
      'name': 'FURminator Deshedding Tool',
      'desc': 'Professional grooming brush',
      'price': 29.99,
      'original': 39.99,
      'rating': 4.9,
      'reviews': 5420,
      'category': ShopCategory.grooming,
      'pets': ['dog', 'cat'],
      'featured': false,
      'new': false,
    },
    {
      'name': 'Seresto Flea Collar',
      'desc': '8-month flea & tick prevention',
      'price': 54.99,
      'original': null,
      'rating': 4.7,
      'reviews': 3210,
      'category': ShopCategory.health,
      'pets': ['dog'],
      'featured': true,
      'new': false,
    },
    {
      'name': 'Whiskas Temptations',
      'desc': 'Crunchy & soft cat treats variety pack',
      'price': 12.99,
      'original': 15.99,
      'rating': 4.5,
      'reviews': 1560,
      'category': ShopCategory.food,
      'pets': ['cat'],
      'featured': false,
      'new': false,
    },
    {
      'name': 'LED Light-Up Collar',
      'desc': 'Rechargeable safety collar for night walks',
      'price': 14.99,
      'original': null,
      'rating': 4.4,
      'reviews': 780,
      'category': ShopCategory.accessories,
      'pets': ['dog'],
      'featured': false,
      'new': true,
    },
    {
      'name': 'Clicker Training Kit',
      'desc': 'Professional training set with guide',
      'price': 9.99,
      'original': null,
      'rating': 4.3,
      'reviews': 450,
      'category': ShopCategory.training,
      'pets': ['dog', 'cat'],
      'featured': false,
      'new': false,
    },
    {
      'name': 'Timothy Hay Premium',
      'desc': 'Fresh timothy hay for rabbits & guinea pigs',
      'price': 16.99,
      'original': 19.99,
      'rating': 4.7,
      'reviews': 920,
      'category': ShopCategory.food,
      'pets': ['rabbit'],
      'featured': false,
      'new': false,
    },
    {
      'name': 'Dental Chew Sticks',
      'desc': 'Teeth cleaning treats for dogs',
      'price': 22.99,
      'original': null,
      'rating': 4.6,
      'reviews': 1890,
      'category': ShopCategory.health,
      'pets': ['dog'],
      'featured': true,
      'new': false,
    },
    {
      'name': 'Cat Tree Tower',
      'desc': 'Multi-level cat tower with scratching posts',
      'price': 69.99,
      'original': 89.99,
      'rating': 4.8,
      'reviews': 3450,
      'category': ShopCategory.accessories,
      'pets': ['cat'],
      'featured': true,
      'new': false,
    },
  ];

  List<Map<String, dynamic>> get _filteredProducts {
    return _products.where((p) {
      if (_selectedCategory != null && p['category'] != _selectedCategory) {
        return false;
      }
      if (_petFilter != PetFilter.all) {
        final pets = p['pets'] as List<String>;
        if (_petFilter == PetFilter.nac) {
          if (!pets.contains('rabbit') && !pets.contains('bird')) return false;
        } else {
          if (!pets.contains(_petFilter.name)) return false;
        }
      }
      if (_searchController.text.isNotEmpty) {
        final query = _searchController.text.toLowerCase();
        return (p['name'] as String).toLowerCase().contains(query) ||
            (p['desc'] as String).toLowerCase().contains(query);
      }
      return true;
    }).toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Shop'),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search products...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          setState(() {});
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
              ),
              onChanged: (_) => setState(() {}),
            ),
          ),

          // Pet Filter
          SizedBox(
            height: 42,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _FilterChip(
                  label: 'All',
                  isSelected: _petFilter == PetFilter.all,
                  onTap: () => setState(() => _petFilter = PetFilter.all),
                ),
                _FilterChip(
                  label: '🐕 Dogs',
                  isSelected: _petFilter == PetFilter.dog,
                  onTap: () => setState(() => _petFilter = PetFilter.dog),
                ),
                _FilterChip(
                  label: '🐈 Cats',
                  isSelected: _petFilter == PetFilter.cat,
                  onTap: () => setState(() => _petFilter = PetFilter.cat),
                ),
                _FilterChip(
                  label: '🐰 NAC',
                  isSelected: _petFilter == PetFilter.nac,
                  onTap: () => setState(() => _petFilter = PetFilter.nac),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Category Filter
          SizedBox(
            height: 42,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _FilterChip(
                  label: 'All',
                  isSelected: _selectedCategory == null,
                  onTap: () => setState(() => _selectedCategory = null),
                ),
                ...ShopCategory.values.map((cat) {
                  final icons = {
                    ShopCategory.food: '🍖',
                    ShopCategory.toys: '🧸',
                    ShopCategory.health: '💊',
                    ShopCategory.accessories: '🎀',
                    ShopCategory.grooming: '✂️',
                    ShopCategory.training: '🎯',
                  };
                  return _FilterChip(
                    label: '${icons[cat]} ${cat.name[0].toUpperCase()}${cat.name.substring(1)}',
                    isSelected: _selectedCategory == cat,
                    onTap: () => setState(() => _selectedCategory = cat),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Products Grid
          Expanded(
            child: _filteredProducts.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off, size: 64, color: Colors.grey[300]),
                        const SizedBox(height: 16),
                        Text(
                          'No products found',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.65,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: _filteredProducts.length,
                    itemBuilder: (context, index) {
                      return _ProductCard(product: _filteredProducts[index]);
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor.withOpacity(0.15)
              : Colors.grey[100],
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppTheme.primaryColor : Colors.transparent,
            width: 1.5,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            color: isSelected ? AppTheme.primaryColor : Colors.grey[700],
          ),
        ),
      ),
    );
  }
}

class _ProductCard extends StatelessWidget {
  final Map<String, dynamic> product;

  const _ProductCard({required this.product});

  @override
  Widget build(BuildContext context) {
    final hasDiscount = product['original'] != null;
    final discount = hasDiscount
        ? (((product['original'] - product['price']) / product['original']) * 100)
            .round()
        : 0;
    final isNew = product['new'] as bool;
    final isFeatured = product['featured'] as bool;

    // Get category icon for product image placeholder
    final categoryIcons = {
      ShopCategory.food: Icons.restaurant,
      ShopCategory.toys: Icons.smart_toy,
      ShopCategory.health: Icons.medical_services,
      ShopCategory.accessories: Icons.style,
      ShopCategory.grooming: Icons.content_cut,
      ShopCategory.training: Icons.school,
    };

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => _showProductDetail(context),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image Area
            Stack(
              children: [
                Container(
                  height: 120,
                  width: double.infinity,
                  color: AppTheme.primaryColor.withOpacity(0.08),
                  child: Icon(
                    categoryIcons[product['category']] ?? Icons.shopping_bag,
                    size: 48,
                    color: AppTheme.primaryColor.withOpacity(0.4),
                  ),
                ),
                if (hasDiscount)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.errorColor,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '-$discount%',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                if (isNew)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.successColor,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'NEW',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                if (isFeatured && !isNew)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.secondaryColor,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'TOP',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            // Product Info
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product['name'],
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Expanded(
                      child: Text(
                        product['desc'],
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey[600],
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    // Rating
                    Row(
                      children: [
                        const Icon(Icons.star, size: 14, color: AppTheme.secondaryColor),
                        const SizedBox(width: 2),
                        Text(
                          '${product['rating']}',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          ' (${product['reviews']})',
                          style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    // Price
                    Row(
                      children: [
                        Text(
                          '\$${(product['price'] as double).toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                        if (hasDiscount) ...[
                          const SizedBox(width: 6),
                          Text(
                            '\$${(product['original'] as double).toStringAsFixed(2)}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[500],
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showProductDetail(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.7,
          minChildSize: 0.5,
          maxChildSize: 0.9,
          expand: false,
          builder: (context, scrollController) {
            return ListView(
              controller: scrollController,
              padding: const EdgeInsets.all(24),
              children: [
                // Handle
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Product Image
                Container(
                  height: 180,
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(
                    Icons.shopping_bag,
                    size: 64,
                    color: AppTheme.primaryColor.withOpacity(0.4),
                  ),
                ),
                const SizedBox(height: 20),

                // Product Name & Price
                Text(
                  product['name'],
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      '\$${(product['price'] as double).toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                    if (product['original'] != null) ...[
                      const SizedBox(width: 12),
                      Text(
                        '\$${(product['original'] as double).toStringAsFixed(2)}',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey[500],
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 12),

                // Rating
                Row(
                  children: [
                    ...List.generate(5, (i) {
                      return Icon(
                        i < (product['rating'] as double).floor()
                            ? Icons.star
                            : Icons.star_border,
                        color: AppTheme.secondaryColor,
                        size: 20,
                      );
                    }),
                    const SizedBox(width: 8),
                    Text(
                      '${product['rating']} (${product['reviews']} reviews)',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Description
                Text(
                  product['desc'],
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[700],
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 24),

                // Buy Button
                SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: const Text('Redirecting to purchase...'),
                          backgroundColor: AppTheme.primaryColor,
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.shopping_cart),
                        SizedBox(width: 8),
                        Text(
                          'Buy Now',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Points info
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.secondaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.star, color: AppTheme.secondaryColor, size: 18),
                      SizedBox(width: 6),
                      Text(
                        'Earn 15 Waggly points with this purchase!',
                        style: TextStyle(
                          color: AppTheme.secondaryColor,
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }
}
