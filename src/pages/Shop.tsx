import React, { useState, useMemo } from 'react';
import { Search, X, Star, ShoppingCart } from 'lucide-react';
import { StatusBadge } from '../components/Badge';
import { Button } from '../components/Button';

type PetFilter = 'all' | 'dog' | 'cat' | 'nac';
type ShopCategory = 'food' | 'toys' | 'health' | 'accessories' | 'grooming' | 'training';

interface Product { id: string; name: string; desc: string; price: number; original?: number; rating: number; reviews: number; category: ShopCategory; pets: string[]; featured: boolean; isNew: boolean; }

const PRODUCTS: Product[] = [
  { id: '1', name: 'Royal Canin Adult', desc: 'Premium dry food for adult dogs', price: 45.99, original: 54.99, rating: 4.8, reviews: 2340, category: 'food', pets: ['dog'], featured: true, isNew: false },
  { id: '2', name: 'Interactive Puzzle Feeder', desc: 'Mental stimulation toy for dogs & cats', price: 19.99, rating: 4.6, reviews: 890, category: 'toys', pets: ['dog', 'cat'], featured: true, isNew: true },
  { id: '3', name: 'FURminator Deshedding Tool', desc: 'Professional grooming brush', price: 29.99, original: 39.99, rating: 4.9, reviews: 5420, category: 'grooming', pets: ['dog', 'cat'], featured: false, isNew: false },
  { id: '4', name: 'Seresto Flea Collar', desc: '8-month flea & tick prevention', price: 54.99, rating: 4.7, reviews: 3210, category: 'health', pets: ['dog'], featured: true, isNew: false },
  { id: '5', name: 'Whiskas Temptations', desc: 'Crunchy & soft cat treats', price: 12.99, original: 15.99, rating: 4.5, reviews: 1560, category: 'food', pets: ['cat'], featured: false, isNew: false },
  { id: '6', name: 'LED Light-Up Collar', desc: 'Rechargeable safety collar', price: 14.99, rating: 4.4, reviews: 780, category: 'accessories', pets: ['dog'], featured: false, isNew: true },
  { id: '7', name: 'Clicker Training Kit', desc: 'Professional training set', price: 9.99, rating: 4.3, reviews: 450, category: 'training', pets: ['dog', 'cat'], featured: false, isNew: false },
  { id: '8', name: 'Timothy Hay Premium', desc: 'Fresh timothy hay for rabbits', price: 16.99, original: 19.99, rating: 4.7, reviews: 920, category: 'food', pets: ['rabbit'], featured: false, isNew: false },
  { id: '9', name: 'Dental Chew Sticks', desc: 'Teeth cleaning treats for dogs', price: 22.99, rating: 4.6, reviews: 1890, category: 'health', pets: ['dog'], featured: true, isNew: false },
  { id: '10', name: 'Cat Tree Tower', desc: 'Multi-level cat tower', price: 69.99, original: 89.99, rating: 4.8, reviews: 3450, category: 'accessories', pets: ['cat'], featured: true, isNew: false },
];

const CATEGORIES: ShopCategory[] = ['food', 'toys', 'health', 'accessories', 'grooming', 'training'];
const CAT_EMOJI: Record<ShopCategory, string> = { food: '🍖', toys: '🧸', health: '💊', accessories: '🎀', grooming: '✂️', training: '🎯' };

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
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 34, fontWeight: 700, color: '#2D2D3A', padding: '0 16px', marginBottom: 8 }}>Shop</h1>

      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F3F0EB', margin: '0 16px', borderRadius: 16, padding: '8px 12px', gap: 8, marginBottom: 8 }}>
        <Search size={20} color="#9D9DAF" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, fontSize: 15, color: '#2D2D3A', backgroundColor: 'transparent' }} />
        {search && <button onClick={() => setSearch('')}><X size={20} color="#9D9DAF" /></button>}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', marginBottom: 8 }}>
        {(['all', 'dog', 'cat', 'nac'] as PetFilter[]).map(f => {
          const labels: Record<PetFilter, string> = { all: 'All', dog: '🐕 Dogs', cat: '🐈 Cats', nac: '🐰 NAC' };
          return <Chip key={f} label={labels[f]} active={petFilter === f} onClick={() => setPetFilter(f)} />;
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', marginBottom: 16 }}>
        <Chip label="All" active={!catFilter} onClick={() => setCatFilter(null)} />
        {CATEGORIES.map(c => <Chip key={c} label={`${CAT_EMOJI[c]} ${c[0].toUpperCase() + c.slice(1)}`} active={catFilter === c} onClick={() => setCatFilter(c)} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <Search size={64} color="#E8E4DF" />
          <div style={{ fontSize: 17, color: '#9D9DAF', marginTop: 16 }}>No products found</div>
        </div>
      )}

      {selectedProduct && (
        <div onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(45,45,58,0.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '32px 32px 0 0', padding: 28, width: '100%', maxWidth: 430, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ width: 40, height: 4, backgroundColor: '#E8E4DF', borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ height: 160, backgroundColor: '#EDEDF7', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <ShoppingCart size={56} color="#5B5EA640" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#2D2D3A' }}>{selectedProduct.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#5B5EA6' }}>${selectedProduct.price.toFixed(2)}</span>
              {selectedProduct.original && <span style={{ fontSize: 17, color: '#9D9DAF', textDecoration: 'line-through' }}>${selectedProduct.original.toFixed(2)}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} color="#E8985E" fill={i < Math.floor(selectedProduct.rating) ? '#E8985E' : 'none'} />)}
              <span style={{ color: '#6B6B80', marginLeft: 4 }}>{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
            </div>
            <p style={{ fontSize: 15, color: '#6B6B80', lineHeight: 1.6, marginTop: 16 }}>{selectedProduct.desc}</p>
            <Button label="Buy Now" onPress={() => { setSelectedProduct(null); alert('Redirecting to purchase...'); }} icon={<ShoppingCart size={22} color="#fff" />} size="large" style={{ marginTop: 28 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FDF2E9', borderRadius: 16, padding: 12, marginTop: 12 }}>
              <Star size={16} color="#E8985E" />
              <span style={{ color: '#E8985E', fontWeight: 600, fontSize: 13 }}>Earn 15 Waggly points with this purchase!</span>
            </div>
            <button onClick={() => setSelectedProduct(null)} style={{ width: '100%', textAlign: 'center', padding: 16, color: '#6B6B80', fontWeight: 600 }}>Close</button>
          </div>
        </div>
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 12px', borderRadius: 999, whiteSpace: 'nowrap', fontSize: 13, cursor: 'pointer',
      backgroundColor: active ? '#EDEDF7' : '#F3F0EB',
      border: `1.5px solid ${active ? '#5B5EA6' : 'transparent'}`,
      color: active ? '#5B5EA6' : '#6B6B80', fontWeight: active ? 700 : 400,
    }}>
      {label}
    </button>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const discount = product.original ? Math.round(((product.original - product.price) / product.original) * 100) : 0;
  return (
    <button onClick={onClick} style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 12px rgba(45,45,58,0.06)', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 110, backgroundColor: '#EDEDF7', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <ShoppingCart size={36} color="#5B5EA640" />
        {discount > 0 && <span style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#D4605A', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>-{discount}%</span>}
        {product.isNew && <span style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#6EAF7B', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>NEW</span>}
        {product.featured && !product.isNew && <span style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#E8985E', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>TOP</span>}
      </div>
      <div style={{ padding: 8, flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#2D2D3A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
        <div style={{ fontSize: 11, color: '#6B6B80', marginTop: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
          <Star size={12} color="#E8985E" fill="#E8985E" /><span style={{ fontSize: 11, fontWeight: 700 }}>{product.rating}</span>
          <span style={{ fontSize: 11, color: '#9D9DAF' }}>({product.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#5B5EA6' }}>${product.price.toFixed(2)}</span>
          {product.original && <span style={{ fontSize: 11, color: '#9D9DAF', textDecoration: 'line-through' }}>${product.original.toFixed(2)}</span>}
        </div>
      </div>
    </button>
  );
}
