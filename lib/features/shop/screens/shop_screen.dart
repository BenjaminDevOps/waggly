import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/pet_model.dart';
import '../../../shared/services/pet_service.dart';
import '../models/product_model.dart';
import '../services/product_service.dart';
import '../widgets/product_card.dart';
import '../widgets/category_chip.dart';
import 'product_details_screen.dart';

/// Main shop screen with products and categories
class ShopScreen extends ConsumerStatefulWidget {
  const ShopScreen({super.key});

  @override
  ConsumerState<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends ConsumerState<ShopScreen>
    with SingleTickerProviderStateMixin {
  final _productService = ProductService();
  final _petService = PetService();
  final _searchController = TextEditingController();

  late TabController _tabController;
  String _selectedCategory = 'All';
  List<ProductModel> _filteredProducts = [];
  List<PetModel> _userPets = [];
  bool _showOnlyRecommended = false;

  final List<String> _categories = [
    'All',
    'Food',
    'Toys',
    'Care',
    'Accessories',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _categories.length, vsync: this);
    _loadProducts();
    _loadUserPets();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadUserPets() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      _petService.getUserPets(user.uid).listen((pets) {
        if (mounted) {
          setState(() {
            _userPets = pets;
          });
        }
      });
    }
  }

  void _loadProducts() {
    setState(() {
      _filteredProducts = _productService.getAllProducts();
    });
  }

  void _filterByCategory(String category) {
    setState(() {
      _selectedCategory = category;
      if (category == 'All') {
        _filteredProducts = _productService.getAllProducts();
      } else {
        _filteredProducts = _productService.getProductsByCategory(category);
      }
      _applyFilters();
    });
  }

  void _searchProducts(String query) {
    if (query.isEmpty) {
      _filterByCategory(_selectedCategory);
    } else {
      setState(() {
        _filteredProducts = _productService.searchProducts(query);
        _applyFilters();
      });
    }
  }

  void _applyFilters() {
    if (_showOnlyRecommended && _userPets.isNotEmpty) {
      final species = _userPets.map((p) => p.species).toSet();
      setState(() {
        _filteredProducts = _filteredProducts
            .where((p) => species.any((s) => p.isSuitableFor(s)) && p.isRecommended)
            .toList();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pet Shop'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(110),
          child: Column(
            children: [
              // Search Bar
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
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
                              _searchProducts('');
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onChanged: _searchProducts,
                ),
              ),

              // Category Tabs
              TabBar(
                controller: _tabController,
                isScrollable: true,
                onTap: (index) {
                  _filterByCategory(_categories[index]);
                },
                tabs: _categories.map((category) {
                  return Tab(
                    child: Row(
                      children: [
                        _getCategoryIcon(category),
                        const SizedBox(width: 4),
                        Text(category),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
      body: Column(
        children: [
          // Filter Chips
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  // Recommended Filter
                  if (_userPets.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: const Text('For My Pets'),
                        selected: _showOnlyRecommended,
                        onSelected: (selected) {
                          setState(() {
                            _showOnlyRecommended = selected;
                            _applyFilters();
                          });
                        },
                        avatar: const Icon(Icons.pets, size: 18),
                      ),
                    ),

                  // On Sale Filter
                  FilterChip(
                    label: const Text('On Sale'),
                    selected: false,
                    onSelected: (selected) {
                      if (selected) {
                        setState(() {
                          _filteredProducts = _productService.getOnSaleProducts();
                        });
                      } else {
                        _filterByCategory(_selectedCategory);
                      }
                    },
                    avatar: const Icon(Icons.local_offer, size: 18),
                  ),
                  const SizedBox(width: 8),

                  // Sort Chips
                  CategoryChip(
                    label: 'High Rated',
                    icon: Icons.star,
                    onTap: () {
                      setState(() {
                        _filteredProducts.sort((a, b) => b.rating.compareTo(a.rating));
                      });
                    },
                  ),
                  const SizedBox(width: 8),
                  CategoryChip(
                    label: 'Price Low-High',
                    icon: Icons.arrow_upward,
                    onTap: () {
                      setState(() {
                        _filteredProducts.sort((a, b) => a.price.compareTo(b.price));
                      });
                    },
                  ),
                ],
              ),
            ),
          ),

          // Products Grid
          Expanded(
            child: _filteredProducts.isEmpty
                ? _buildEmptyState()
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
                      final product = _filteredProducts[index];
                      return ProductCard(
                        product: product,
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => ProductDetailsScreen(product: product),
                            ),
                          );
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.shopping_bag_outlined,
              size: 80,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'No Products Found',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Try adjusting your filters or search',
              style: TextStyle(color: Colors.grey[600]),
            ),
          ],
        ),
      ),
    );
  }

  Icon _getCategoryIcon(String category) {
    switch (category) {
      case 'Food':
        return const Icon(Icons.restaurant, size: 18);
      case 'Toys':
        return const Icon(Icons.toys, size: 18);
      case 'Care':
        return const Icon(Icons.health_and_safety, size: 18);
      case 'Accessories':
        return const Icon(Icons.shopping_bag, size: 18);
      default:
        return const Icon(Icons.apps, size: 18);
    }
  }
}
