import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import '../../core/constants/app_constants.dart';

class PurchaseService extends ChangeNotifier {
  static final PurchaseService _instance = PurchaseService._internal();
  factory PurchaseService() => _instance;
  PurchaseService._internal();

  final InAppPurchase _iap = InAppPurchase.instance;
  StreamSubscription<List<PurchaseDetails>>? _subscription;

  List<ProductDetails> _products = [];
  List<ProductDetails> get products => _products;

  bool _isAvailable = false;
  bool get isAvailable => _isAvailable;

  bool _isPremium = false;
  bool get isPremium => _isPremium;

  bool _isPurchasing = false;
  bool get isPurchasing => _isPurchasing;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  bool _isLoading = true;
  bool get isLoading => _isLoading;

  Future<void> initialize() async {
    _isAvailable = await _iap.isAvailable();

    if (!_isAvailable) {
      _isLoading = false;
      notifyListeners();
      return;
    }

    _subscription = _iap.purchaseStream.listen(
      _onPurchaseUpdate,
      onDone: () => _subscription?.cancel(),
      onError: (Object error) {
        _errorMessage = 'Store connection error. Please try again.';
        _isPurchasing = false;
        notifyListeners();
      },
    );

    await _loadProducts();

    // Check for existing active subscriptions on launch
    await _iap.restorePurchases();

    _isLoading = false;
    notifyListeners();
  }

  Future<void> _loadProducts() async {
    final ProductDetailsResponse response =
        await _iap.queryProductDetails(AppConstants.allProductIds);

    if (response.error != null) {
      _errorMessage = 'Could not load subscription plans: ${response.error!.message}';
    }

    _products = response.productDetails
      ..sort((a, b) => a.rawPrice.compareTo(b.rawPrice));
  }

  void _onPurchaseUpdate(List<PurchaseDetails> purchases) async {
    for (final purchase in purchases) {
      switch (purchase.status) {
        case PurchaseStatus.pending:
          _isPurchasing = true;
          _errorMessage = null;
          notifyListeners();

        case PurchaseStatus.purchased:
        case PurchaseStatus.restored:
          _isPurchasing = false;
          if (_isValidProductId(purchase.productID)) {
            await _activatePremium();
          }
          notifyListeners();

        case PurchaseStatus.error:
          _isPurchasing = false;
          _errorMessage = _friendlyError(purchase.error);
          notifyListeners();

        case PurchaseStatus.canceled:
          _isPurchasing = false;
          notifyListeners();
      }

      if (purchase.pendingCompletePurchase) {
        await _iap.completePurchase(purchase);
      }
    }
  }

  bool _isValidProductId(String id) => AppConstants.allProductIds.contains(id);

  Future<void> _activatePremium() async {
    _isPremium = true;
    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      try {
        await FirebaseFirestore.instance
            .collection(AppConstants.collectionUsers)
            .doc(user.uid)
            .update({'isPremium': true});
      } catch (_) {
        // Firestore update failure doesn't block premium access locally
      }
    }
  }

  Future<void> buyProduct(ProductDetails product) async {
    _errorMessage = null;
    notifyListeners();
    try {
      final param = PurchaseParam(productDetails: product);
      // Subscriptions are non-consumable purchases on iOS
      await _iap.buyNonConsumable(purchaseParam: param);
    } catch (e) {
      _errorMessage = 'Could not initiate purchase. Please try again.';
      _isPurchasing = false;
      notifyListeners();
    }
  }

  Future<void> restorePurchases() async {
    _errorMessage = null;
    _isPurchasing = true;
    notifyListeners();
    try {
      await _iap.restorePurchases();
    } catch (e) {
      _errorMessage = 'Restore failed. Please try again.';
      _isPurchasing = false;
      notifyListeners();
    }
  }

  String _friendlyError(IAPError? error) {
    if (error == null) return 'Purchase failed. Please try again.';
    // SKErrorPaymentCancelled = 2
    if (error.code == 'storekit_duplicate_product_object') {
      return 'Purchase already in progress.';
    }
    return 'Purchase failed: ${error.message}';
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}
