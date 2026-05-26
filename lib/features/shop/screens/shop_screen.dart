import 'package:flutter/material.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/services/purchase_service.dart';

class ShopScreen extends StatefulWidget {
  const ShopScreen({super.key});

  @override
  State<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends State<ShopScreen> {
  final PurchaseService _purchaseService = PurchaseService();

  @override
  void initState() {
    super.initState();
    _purchaseService.addListener(_onServiceUpdate);
    _initPurchases();
  }

  Future<void> _initPurchases() async {
    if (_purchaseService.isLoading) {
      await _purchaseService.initialize();
    }
  }

  void _onServiceUpdate() {
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _purchaseService.removeListener(_onServiceUpdate);
    super.dispose();
  }

  void _handleError() {
    final msg = _purchaseService.errorMessage;
    if (msg != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(msg), backgroundColor: AppTheme.errorColor),
      );
    }
  }

  Future<void> _buy(ProductDetails product) async {
    await _purchaseService.buyProduct(product);
    _handleError();
  }

  Future<void> _restore() async {
    await _purchaseService.restorePurchases();
    _handleError();
    if (_purchaseService.isPremium && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Premium restored successfully!'),
          backgroundColor: AppTheme.successColor,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Waggly Premium'),
        actions: [
          TextButton(
            onPressed: _purchaseService.isPurchasing ? null : _restore,
            child: const Text('Restore'),
          ),
        ],
      ),
      body: _purchaseService.isPremium
          ? const _PremiumActiveView()
          : _StoreView(
              isLoading: _purchaseService.isLoading,
              isAvailable: _purchaseService.isAvailable,
              isPurchasing: _purchaseService.isPurchasing,
              products: _purchaseService.products,
              onBuy: _buy,
              onRestore: _restore,
            ),
    );
  }
}

// ─────────────────────────────────────────────
// Premium already active
// ─────────────────────────────────────────────
class _PremiumActiveView extends StatelessWidget {
  const _PremiumActiveView();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                gradient: AppTheme.goldGradient,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.workspace_premium,
                  size: 64, color: Colors.white),
            ),
            const SizedBox(height: 24),
            const Text(
              'You\'re Premium!',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            const Text(
              'Enjoy unlimited AI diagnoses, priority vet search, exclusive rewards, and more.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────
// Main store view
// ─────────────────────────────────────────────
class _StoreView extends StatelessWidget {
  final bool isLoading;
  final bool isAvailable;
  final bool isPurchasing;
  final List<ProductDetails> products;
  final Future<void> Function(ProductDetails) onBuy;
  final Future<void> Function() onRestore;

  const _StoreView({
    required this.isLoading,
    required this.isAvailable,
    required this.isPurchasing,
    required this.products,
    required this.onBuy,
    required this.onRestore,
  });

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (!isAvailable) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32),
          child: Text(
            'The App Store is not available on this device.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: Colors.grey),
          ),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _HeroSection(),
          const SizedBox(height: 28),
          const _FeatureList(),
          const SizedBox(height: 28),
          if (isPurchasing) ...[
            const Center(child: CircularProgressIndicator()),
            const SizedBox(height: 16),
            const Center(child: Text('Processing purchase…')),
          ] else if (products.isEmpty) ...[
            const Center(
              child: Text(
                'Subscription plans could not be loaded.\nPlease check your internet connection.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey),
              ),
            ),
          ] else ...[
            ...products.map((p) => _ProductCard(product: p, onBuy: onBuy)),
          ],
          const SizedBox(height: 16),
          Center(
            child: TextButton(
              onPressed: isPurchasing ? null : onRestore,
              child: const Text('Restore previous purchase'),
            ),
          ),
          const SizedBox(height: 12),
          const _LegalFooter(),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// Hero header
// ─────────────────────────────────────────────
class _HeroSection extends StatelessWidget {
  const _HeroSection();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
      decoration: BoxDecoration(
        gradient: AppTheme.primaryGradient,
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Column(
        children: [
          Icon(Icons.workspace_premium, size: 56, color: Colors.white),
          SizedBox(height: 12),
          Text(
            'Waggly Premium',
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 6),
          Text(
            'Give your pet the best care with AI, rewards & more',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white70, fontSize: 14),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// Feature list
// ─────────────────────────────────────────────
class _FeatureList extends StatelessWidget {
  const _FeatureList();

  static const _features = [
    (Icons.psychology, 'Unlimited AI Diagnoses',
        'No cap on health checks for all your pets'),
    (Icons.local_hospital, 'Priority Vet Search',
        'Find nearby vets with premium filters'),
    (Icons.emoji_events, 'Exclusive Rewards & XP',
        'Double XP and premium-only badges'),
    (Icons.bar_chart, 'Detailed Health Reports',
        'Full history and trend analytics'),
    (Icons.discount, 'Exclusive Partner Offers',
        'Discounts on food, accessories & vet visits'),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'What\'s included',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        ..._features.map(
          (f) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(f.$1, color: AppTheme.primaryColor, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(f.$2,
                          style: const TextStyle(fontWeight: FontWeight.w600)),
                      Text(f.$3,
                          style: const TextStyle(
                              fontSize: 13, color: Colors.grey)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────
// Product card
// ─────────────────────────────────────────────
class _ProductCard extends StatelessWidget {
  final ProductDetails product;
  final Future<void> Function(ProductDetails) onBuy;

  const _ProductCard({required this.product, required this.onBuy});

  bool get _isYearly => product.id == AppConstants.productYearly;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: _isYearly ? AppTheme.primaryColor : Colors.grey.shade300,
          width: _isYearly ? 2 : 1,
        ),
      ),
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.title.replaceAll(RegExp(r'\s*\(.*?\)'), ''),
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        product.price,
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: _isYearly
                              ? AppTheme.primaryColor
                              : Colors.black87,
                        ),
                      ),
                      if (_isYearly)
                        const Text(
                          'Best value — save over 30%',
                          style: TextStyle(
                              fontSize: 12, color: AppTheme.primaryColor),
                        ),
                    ],
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isYearly
                        ? AppTheme.primaryColor
                        : Colors.black87,
                    foregroundColor: Colors.white,
                  ),
                  onPressed: () => onBuy(product),
                  child: const Text('Subscribe'),
                ),
              ],
            ),
          ),
          if (_isYearly)
            Positioned(
              top: 0,
              right: 12,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: const BoxDecoration(
                  color: AppTheme.primaryColor,
                  borderRadius: BorderRadius.vertical(
                    bottom: Radius.circular(8),
                  ),
                ),
                child: const Text(
                  'POPULAR',
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
    );
  }
}

// ─────────────────────────────────────────────
// Legal footer (required by Apple)
// ─────────────────────────────────────────────
class _LegalFooter extends StatelessWidget {
  const _LegalFooter();

  @override
  Widget build(BuildContext context) {
    return const Text(
      'Subscriptions auto-renew until cancelled. Payment is charged to your Apple ID account at purchase confirmation. '
      'Manage or cancel subscriptions in your App Store account settings. '
      'Cancellation takes effect at the end of the current billing period.',
      textAlign: TextAlign.center,
      style: TextStyle(fontSize: 11, color: Colors.grey),
    );
  }
}
