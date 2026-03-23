import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';
import { ShopCategory, SHOP_EMOJI } from '../models/types';
import { StatusBadge } from '../components/Badge';

type PetFilter = 'all' | 'dog' | 'cat' | 'nac';

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  original?: number;
  rating: number;
  reviews: number;
  category: ShopCategory;
  pets: string[];
  featured: boolean;
  isNew: boolean;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Royal Canin Adult', desc: 'Premium dry food for adult dogs', price: 45.99, original: 54.99, rating: 4.8, reviews: 2340, category: 'food', pets: ['dog'], featured: true, isNew: false },
  { id: '2', name: 'Interactive Puzzle Feeder', desc: 'Mental stimulation toy for dogs & cats', price: 19.99, rating: 4.6, reviews: 890, category: 'toys', pets: ['dog', 'cat'], featured: true, isNew: true },
  { id: '3', name: 'FURminator Deshedding Tool', desc: 'Professional grooming brush', price: 29.99, original: 39.99, rating: 4.9, reviews: 5420, category: 'grooming', pets: ['dog', 'cat'], featured: false, isNew: false },
  { id: '4', name: 'Seresto Flea Collar', desc: '8-month flea & tick prevention', price: 54.99, rating: 4.7, reviews: 3210, category: 'health', pets: ['dog'], featured: true, isNew: false },
  { id: '5', name: 'Whiskas Temptations', desc: 'Crunchy & soft cat treats variety pack', price: 12.99, original: 15.99, rating: 4.5, reviews: 1560, category: 'food', pets: ['cat'], featured: false, isNew: false },
  { id: '6', name: 'LED Light-Up Collar', desc: 'Rechargeable safety collar for night walks', price: 14.99, rating: 4.4, reviews: 780, category: 'accessories', pets: ['dog'], featured: false, isNew: true },
  { id: '7', name: 'Clicker Training Kit', desc: 'Professional training set with guide', price: 9.99, rating: 4.3, reviews: 450, category: 'training', pets: ['dog', 'cat'], featured: false, isNew: false },
  { id: '8', name: 'Timothy Hay Premium', desc: 'Fresh timothy hay for rabbits & guinea pigs', price: 16.99, original: 19.99, rating: 4.7, reviews: 920, category: 'food', pets: ['rabbit'], featured: false, isNew: false },
  { id: '9', name: 'Dental Chew Sticks', desc: 'Teeth cleaning treats for dogs', price: 22.99, rating: 4.6, reviews: 1890, category: 'health', pets: ['dog'], featured: true, isNew: false },
  { id: '10', name: 'Cat Tree Tower', desc: 'Multi-level cat tower with scratching posts', price: 69.99, original: 89.99, rating: 4.8, reviews: 3450, category: 'accessories', pets: ['cat'], featured: true, isNew: false },
];

const CATEGORIES: ShopCategory[] = ['food', 'toys', 'health', 'accessories', 'grooming', 'training'];
const { width: W } = Dimensions.get('window');
const CARD_W = (W - Spacing.lg * 2 - Spacing.md) / 2;

export function ShopScreen() {
  const [search, setSearch] = useState('');
  const [petFilter, setPetFilter] = useState<PetFilter>('all');
  const [catFilter, setCatFilter] = useState<ShopCategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (catFilter && p.category !== catFilter) return false;
      if (petFilter !== 'all') {
        if (petFilter === 'nac') {
          if (!p.pets.includes('rabbit') && !p.pets.includes('bird')) return false;
        } else if (!p.pets.includes(petFilter)) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, petFilter, catFilter]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Shop</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={Colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={Colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Pet filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {(['all', 'dog', 'cat', 'nac'] as PetFilter[]).map((f) => {
          const labels: Record<PetFilter, string> = { all: 'All', dog: '🐕 Dogs', cat: '🐈 Cats', nac: '🐰 NAC' };
          return (
            <FilterChip
              key={f}
              label={labels[f]}
              active={petFilter === f}
              onPress={() => setPetFilter(f)}
            />
          );
        })}
      </ScrollView>

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <FilterChip label="All" active={!catFilter} onPress={() => setCatFilter(null)} />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            label={`${SHOP_EMOJI[c]} ${c[0].toUpperCase() + c.slice(1)}`}
            active={catFilter === c}
            onPress={() => setCatFilter(c)}
          />
        ))}
      </ScrollView>

      {/* Products Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: Spacing.md }}
        contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => setSelectedProduct(item)} />
        )}
      />

      {/* Product Detail Modal */}
      <Modal visible={!!selectedProduct} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            {selectedProduct && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalImg}>
                  <Ionicons name="bag-outline" size={56} color={Colors.primary + '40'} />
                </View>
                <Text style={styles.modalName}>{selectedProduct.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm }}>
                  <Text style={styles.modalPrice}>
                    ${selectedProduct.price.toFixed(2)}
                  </Text>
                  {selectedProduct.original && (
                    <Text style={styles.modalOldPrice}>${selectedProduct.original.toFixed(2)}</Text>
                  )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < Math.floor(selectedProduct.rating) ? 'star' : 'star-outline'}
                      size={18}
                      color={Colors.secondary}
                    />
                  ))}
                  <Text style={styles.modalReviews}>
                    {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                  </Text>
                </View>
                <Text style={styles.modalDesc}>{selectedProduct.desc}</Text>

                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => {
                    setSelectedProduct(null);
                    Alert.alert('Purchase', 'Redirecting to purchase...');
                  }}
                >
                  <Ionicons name="cart" size={22} color="#fff" />
                  <Text style={styles.buyBtnText}>Buy Now</Text>
                </TouchableOpacity>

                <View style={styles.pointsInfo}>
                  <Ionicons name="star" size={16} color={Colors.secondary} />
                  <Text style={styles.pointsInfoText}>
                    Earn 15 Waggly points with this purchase!
                  </Text>
                </View>

                <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && { color: Colors.primary, fontWeight: '700' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  const discount = product.original
    ? Math.round(((product.original - product.price) / product.original) * 100)
    : 0;

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.productImg}>
        <Ionicons name="bag-outline" size={36} color={Colors.primary + '40'} />
        {discount > 0 && (
          <View style={[styles.badge, { backgroundColor: Colors.error }]}>
            <Text style={styles.badgeText}>-{discount}%</Text>
          </View>
        )}
        {product.isNew && (
          <View style={[styles.badge, { backgroundColor: Colors.success, right: Spacing.sm, left: undefined }]}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
        {product.featured && !product.isNew && (
          <View style={[styles.badge, { backgroundColor: Colors.secondary, right: Spacing.sm, left: undefined }]}>
            <Text style={styles.badgeText}>TOP</Text>
          </View>
        )}
      </View>
      <View style={{ padding: Spacing.sm, flex: 1 }}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.productDesc} numberOfLines={2}>{product.desc}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="star" size={12} color={Colors.secondary} />
          <Text style={styles.productRating}> {product.rating}</Text>
          <Text style={styles.productReviews}> ({product.reviews})</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          {product.original && (
            <Text style={styles.productOldPrice}>${product.original.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text, paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.text },
  filterRow: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: { backgroundColor: Colors.primary + '15', borderColor: Colors.primary },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: FontSize.lg, color: Colors.textLight, marginTop: Spacing.lg },
  productCard: {
    width: CARD_W,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  productImg: {
    height: 110,
    backgroundColor: Colors.primary + '0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: { color: '#fff', fontSize: FontSize.xs, fontWeight: '700' },
  productName: { fontWeight: '700', fontSize: FontSize.md, color: Colors.text },
  productDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  productRating: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.text },
  productReviews: { fontSize: FontSize.xs, color: Colors.textLight },
  productPrice: { fontSize: FontSize.base, fontWeight: '700', color: Colors.primary },
  productOldPrice: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xxl,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  modalImg: {
    height: 160,
    backgroundColor: Colors.primary + '0A',
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalName: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text },
  modalPrice: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.primary },
  modalOldPrice: {
    fontSize: FontSize.lg,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
    marginLeft: Spacing.md,
  },
  modalReviews: { color: Colors.textSecondary, marginLeft: Spacing.sm },
  modalDesc: { fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 24, marginTop: Spacing.lg },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.xxl,
  },
  buyBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  pointsInfoText: { color: Colors.secondary, fontWeight: '600', fontSize: FontSize.sm },
  closeBtn: { alignItems: 'center', paddingVertical: Spacing.lg },
  closeBtnText: { color: Colors.textSecondary, fontWeight: '600' },
});
