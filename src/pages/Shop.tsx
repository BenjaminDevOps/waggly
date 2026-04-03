import React, { useState, useMemo } from 'react';
import { Search, X, Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../components/Badge';
import { Button } from '../components/Button';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { AFFILIATE } from '../constants/app';

type PetFilter = 'all' | 'dog' | 'cat' | 'nac';
type ShopCategory = 'food' | 'toys' | 'health' | 'accessories' | 'grooming' | 'training';

interface Product { id: string; name: string; desc: string; price: number; original?: number; rating: number; reviews: number; category: ShopCategory; pets: string[]; featured: boolean; isNew: boolean; affiliateUrl?: string; }

const PRODUCTS: Product[] = [
  { id: '1', name: 'Royal Canin Adult', desc: 'Premium dry food for adult dogs', price: 45.99, original: 54.99, rating: 4.8, reviews: 2340, category: 'food', pets: ['dog'], featured: true, isNew: false, affiliateUrl: `https://www.amazon.com/dp/B0002DJONY?tag=${AFFILIATE.amazonId}` },
  { id: '2', name: 'Interactive Puzzle Feeder', desc: 'Mental stimulation toy for dogs & cats', price: 19.99, rating: 4.6, reviews: 890, category: 'toys', pets: ['dog', 'cat'], featured: true, isNew: true, affiliateUrl: `https://www.amazon.com/dp/B0038WP1MC?tag=${AFFILIATE.amazonId}` },
  { id: '3', name: 'FURminator Deshedding Tool', desc: 'Professional grooming brush', price: 29.99, original: 39.99, rating: 4.9, reviews: 5420, category: 'grooming', pets: ['dog', 'cat'], featured: false, isNew: false, affiliateUrl: `https://www.amazon.com/dp/B0040QS3PO?tag=${AFFILIATE.amazonId}` },
  { id: '4', name: 'Seresto Flea Collar', desc: '8-month flea & tick prevention', price: 54.99, rating: 4.7, reviews: 3210, category: 'health', pets: ['dog'], featured: true, isNew: false, affiliateUrl: `https://www.amazon.com/dp/B00B8CG5NK?tag=${AFFILIATE.amazonId}` },
  { id: '5', name: 'Whiskas Temptations', desc: 'Crunchy & soft cat treats', price: 12.99, original: 15.99, rating: 4.5, reviews: 1560, category: 'food', pets: ['cat'], featured: false, isNew: false, affiliateUrl: `https://www.amazon.com/dp/B001G96GBY?tag=${AFFILIATE.amazonId}` },
  { id: '6', name: 'LED Light-Up Collar', desc: 'Rechargeable safety collar', price: 14.99, rating: 4.4, reviews: 780, category: 'accessories', pets: ['dog'], featured: false, isNew: true, affiliateUrl: `https://www.amazon.com/dp/B07B4M2YPT?tag=${AFFILIATE.amazonId}` },
  { id: '7', name: 'Clicker Training Kit', desc: 'Professional training set', price: 9.99, rating: 4.3, reviews: 450, category: 'training', pets: ['dog', 'cat'], featured: false, isNew: false, affiliateUrl: `https://www.amazon.com/dp/B000NFHKWI?tag=${AFFILIATE.amazonId}` },
  { id: '8', name: 'Timothy Hay Premium', desc: 'Fresh timothy hay for rabbits', price: 16.99, original: 19.99, rating: 4.7, reviews: 920, category: 'food', pets: ['rabbit'], featured: false, isNew: false, affiliateUrl: `https://www.amazon.com/dp/B00CRXCI38?tag=${AFFILIATE.amazonId}` },
  { id: '9', name: 'Dental Chew Sticks', desc: 'Teeth cleaning treats for dogs', price: 22.99, rating: 4.6, reviews: 1890, category: 'health', pets: ['dog'], featured: true, isNew: false, affiliateUrl: `https://www.amazon.com/dp/B0084EXQAS?tag=${AFFILIATE.amazonId}` },
  { id: '10', name: 'Cat Tree Tower', desc: 'Multi-level cat tower', price: 69.99, original: 89.99, rating: 4.8, reviews: 3450, category: 'accessories', pets: ['cat'], featured: true, isNew: false, affiliateUrl: `https://www.amazon.com/dp/B003BYQ100?tag=${AFFILIATE.amazonId}` },
];

const CATEGORIES: ShopCategory[] = ['food', 'toys', 'health', 'accessories', 'grooming', 'training'];
const CAT_LABELS: Record<ShopCategory, string> = { food: 'Food', toys: 'Toys', health: 'Health', accessories: 'Accessories', grooming: 'Grooming', training: 'Training' };

export function ShopPage() {
  const [search, setSearch] = useState('');
  const [petFilter, setPetFilter] = useState<PetFilter>('all');
  const [catFilter, setCatFilter] = useState<ShopCategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    if (catFilter && p.category !== catFilter) return false;
    if (petFilter !== 'all') {
      if (petFilter === 'nac') { if (!p.pets.includes('rabbit') && !p.pets.includes('bird')) return false; }
      else if (!p.pets.includes(petFilter)) return false;
    }
    if (search) { const q = search.toLowerCase(); return p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q); }
    return true;
  }), [search, petFilter, catFilter]);

  return (
    <div style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
      <h1 style={{ fontSize: Font.largeTitle, fontWeight: Weight.bold, color: Colors.ink, padding: '0 16px', marginBottom: 8 }}>Shop</h1>

      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: Colors.surfaceSecondary, margin: '0 16px', borderRadius: 16, padding: '8px 12px', gap: 8, marginBottom: 8 }}>
        <Search size={20} color={Colors.inkTertiary} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, fontSize: 15, color: Colors.ink, backgroundColor: 'transparent' }} />
        {search && <button onClick={() => setSearch('')}><X size={20} color={Colors.inkTertiary} /></button>}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', marginBottom: 8 }}>
        {(['all', 'dog', 'cat', 'nac'] as PetFilter[]).map(f => {
          const labels: Record<PetFilter, string> = { all: 'All', dog: 'Dogs', cat: 'Cats', nac: 'NAC' };
          return <Chip key={f} label={labels[f]} active={petFilter === f} onClick={() => setPetFilter(f)} />;
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', marginBottom: 16 }}>
        <Chip label="All" active={!catFilter} onClick={() => setCatFilter(null)} />
        {CATEGORIES.map(c => <Chip key={c} label={CAT_LABELS[c]} active={catFilter === c} onClick={() => setCatFilter(c)} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <Search size={64} color={Colors.hairline} />
          <div style={{ fontSize: 17, color: Colors.inkTertiary, marginTop: 16 }}>No products found</div>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ padding: 28, width: '100%', maxWidth: 430, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ width: 40, height: 4, backgroundColor: Colors.hairline, borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ height: 160, backgroundColor: Colors.primaryPale, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <ShoppingCart size={56} color={Colors.primary + '40'} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: Weight.bold, color: Colors.ink }}>{selectedProduct.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 28, fontWeight: Weight.bold, color: Colors.primary }}>${selectedProduct.price.toFixed(2)}</span>
              {selectedProduct.original && <span style={{ fontSize: 17, color: Colors.inkTertiary, textDecoration: 'line-through' }}>${selectedProduct.original.toFixed(2)}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} color={Colors.secondary} fill={i < Math.floor(selectedProduct.rating) ? Colors.secondary : 'none'} />)}
              <span style={{ color: Colors.inkSecondary, marginLeft: 4 }}>{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
            </div>
            <p style={{ fontSize: 15, color: Colors.inkSecondary, lineHeight: 1.6, marginTop: 16 }}>{selectedProduct.desc}</p>
            <Button label="View on Amazon" onPress={() => {
              if (selectedProduct.affiliateUrl) {
                window.open(selectedProduct.affiliateUrl, '_blank', 'noopener,noreferrer');
              }
              setSelectedProduct(null);
            }} icon={<ExternalLink size={22} color={Colors.inkInverse} />} size="large" style={{ marginTop: 28 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.secondaryPale, borderRadius: 16, padding: 12, marginTop: 12 }}>
              <Star size={16} color={Colors.secondary} />
              <span style={{ color: Colors.secondary, fontWeight: Weight.semibold, fontSize: 13 }}>Earn 15 Waggly points with this purchase!</span>
            </div>
            <button onClick={() => setSelectedProduct(null)} style={{ width: '100%', textAlign: 'center', padding: 16, color: Colors.inkSecondary, fontWeight: Weight.semibold }}>Close</button>
          </div>
        </div>
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button className="chip-interactive" onClick={onClick} style={{
      padding: '8px 12px', borderRadius: 999, whiteSpace: 'nowrap', fontSize: 13, cursor: 'pointer',
      backgroundColor: active ? Colors.primaryPale : Colors.surfaceSecondary,
      border: `1.5px solid ${active ? Colors.primary : 'transparent'}`,
      color: active ? Colors.primary : Colors.inkSecondary, fontWeight: active ? 700 : 400,
    }}>
      {label}
    </button>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const discount = product.original ? Math.round(((product.original - product.price) / product.original) * 100) : 0;
  return (
    <button className="card-interactive" onClick={onClick} style={{ backgroundColor: Colors.surface, borderRadius: 20, overflow: 'hidden', boxShadow: Shadow.soft, textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 110, backgroundColor: Colors.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <ShoppingCart size={36} color={Colors.primary + '40'} />
        {discount > 0 && <span style={{ position: 'absolute', top: 8, left: 8, backgroundColor: Colors.error, color: Colors.inkInverse, fontSize: 11, fontWeight: Weight.bold, padding: '2px 8px', borderRadius: 12 }}>-{discount}%</span>}
        {product.isNew && <span style={{ position: 'absolute', top: 8, right: 8, backgroundColor: Colors.success, color: Colors.inkInverse, fontSize: 11, fontWeight: Weight.bold, padding: '2px 8px', borderRadius: 12 }}>NEW</span>}
        {product.featured && !product.isNew && <span style={{ position: 'absolute', top: 8, right: 8, backgroundColor: Colors.secondary, color: Colors.inkInverse, fontSize: 11, fontWeight: Weight.bold, padding: '2px 8px', borderRadius: 12 }}>TOP</span>}
      </div>
      <div style={{ padding: 8, flex: 1 }}>
        <div style={{ fontWeight: Weight.bold, fontSize: 15, color: Colors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
        <div style={{ fontSize: 11, color: Colors.inkSecondary, marginTop: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
          <Star size={12} color={Colors.secondary} fill={Colors.secondary} /><span style={{ fontSize: 11, fontWeight: Weight.bold }}>{product.rating}</span>
          <span style={{ fontSize: 11, color: Colors.inkTertiary }}>({product.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <span style={{ fontSize: 15, fontWeight: Weight.bold, color: Colors.primary }}>${product.price.toFixed(2)}</span>
          {product.original && <span style={{ fontSize: 11, color: Colors.inkTertiary, textDecoration: 'line-through' }}>${product.original.toFixed(2)}</span>}
        </div>
      </div>
    </button>
  );
}
