import React, { useState, useMemo } from 'react';
import { Search, X, Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../components/Badge';
import { Button } from '../components/Button';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { useI18n } from '../i18n';

type PetFilter = 'all' | 'dog' | 'cat' | 'nac';
type ShopCategory = 'food' | 'toys' | 'health' | 'accessories' | 'grooming' | 'training';

interface Product { id: string; name: string; desc: string; price: number; original?: number; rating: number; reviews: number; category: ShopCategory; pets: string[]; featured: boolean; isNew: boolean; affiliateUrl?: string; }

// To add a product: paste your amzn.to short link directly in affiliateUrl.
// Short links (amzn.to) already contain your affiliate tag — do NOT append ?tag=
// For long links (amazon.fr/dp/XXX), append ?tag=your-tag-21
const PRODUCTS: Product[] = [
  { id: '1', name: 'IAMS', desc: 'Nourriture pour chat Premium', price: 14.29, original: 19.99, rating: 4.8, reviews: 2340, category: 'food', pets: ['cat'], featured: true, isNew: false, affiliateUrl: 'https://amzn.to/42ekQkW' },
  { id: '2', name: 'Jouet Puzzle Interactif', desc: 'Stimulation mentale pour chiens et chats', price: 19.99, rating: 4.6, reviews: 890, category: 'toys', pets: ['dog', 'cat'], featured: true, isNew: true, affiliateUrl: '' },
  { id: '3', name: 'FURminator Brosse', desc: 'Brosse de toilettage professionnelle', price: 29.99, original: 39.99, rating: 4.9, reviews: 5420, category: 'grooming', pets: ['dog', 'cat'], featured: false, isNew: false, affiliateUrl: '' },
  { id: '4', name: 'Collier Seresto', desc: 'Protection anti-puces et tiques 8 mois', price: 54.99, rating: 4.7, reviews: 3210, category: 'health', pets: ['dog'], featured: true, isNew: false, affiliateUrl: '' },
  { id: '5', name: 'Friandises Whiskas', desc: 'Friandises croustillantes pour chats', price: 12.99, original: 15.99, rating: 4.5, reviews: 1560, category: 'food', pets: ['cat'], featured: false, isNew: false, affiliateUrl: '' },
  { id: '6', name: 'Collier LED', desc: 'Collier lumineux rechargeable', price: 14.99, rating: 4.4, reviews: 780, category: 'accessories', pets: ['dog'], featured: false, isNew: true, affiliateUrl: '' },
  { id: '7', name: 'Kit Clicker', desc: 'Kit d\'éducation canine', price: 9.99, rating: 4.3, reviews: 450, category: 'training', pets: ['dog', 'cat'], featured: false, isNew: false, affiliateUrl: '' },
  { id: '8', name: 'Foin Timothy', desc: 'Foin premium pour lapins', price: 16.99, original: 19.99, rating: 4.7, reviews: 920, category: 'food', pets: ['rabbit'], featured: false, isNew: false, affiliateUrl: '' },
  { id: '9', name: 'Bâtonnets Dentaires', desc: 'Friandises nettoyantes pour chiens', price: 22.99, rating: 4.6, reviews: 1890, category: 'health', pets: ['dog'], featured: true, isNew: false, affiliateUrl: '' },
  { id: '10', name: 'Arbre à Chat', desc: 'Tour multi-niveaux pour chat', price: 69.99, original: 89.99, rating: 4.8, reviews: 3450, category: 'accessories', pets: ['cat'], featured: true, isNew: false, affiliateUrl: '' },
];

const CATEGORIES: ShopCategory[] = ['food', 'toys', 'health', 'accessories', 'grooming', 'training'];
// Labels are set dynamically via i18n in the component

export function ShopPage() {
  const { t } = useI18n();
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
      <h1 style={{ fontSize: Font.largeTitle, fontWeight: Weight.bold, color: Colors.ink, padding: '0 16px', marginBottom: 8 }}>{t.shop.title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: Colors.surfaceSecondary, margin: '0 16px', borderRadius: 16, padding: '8px 12px', gap: 8, marginBottom: 8 }}>
        <Search size={20} color={Colors.inkTertiary} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.shop.searchProducts} style={{ flex: 1, fontSize: 15, color: Colors.ink, backgroundColor: 'transparent' }} />
        {search && <button onClick={() => setSearch('')}><X size={20} color={Colors.inkTertiary} /></button>}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', marginBottom: 8 }}>
        {(['all', 'dog', 'cat', 'nac'] as PetFilter[]).map(f => {
          const labels: Record<PetFilter, string> = { all: t.shop.all, dog: t.shop.dogs, cat: t.shop.cats, nac: t.shop.nac };
          return <Chip key={f} label={labels[f]} active={petFilter === f} onClick={() => setPetFilter(f)} />;
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', marginBottom: 16 }}>
        <Chip label={t.shop.all} active={!catFilter} onClick={() => setCatFilter(null)} />
        {CATEGORIES.map(c => {
          const catLabels: Record<ShopCategory, string> = { food: t.shop.food, toys: t.shop.toys, health: t.shop.health, accessories: t.shop.accessories, grooming: t.shop.grooming, training: t.shop.training };
          return <Chip key={c} label={catLabels[c]} active={catFilter === c} onClick={() => setCatFilter(c)} />;
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <Search size={64} color={Colors.hairline} />
          <div style={{ fontSize: 17, color: Colors.inkTertiary, marginTop: 16 }}>{t.shop.noProducts}</div>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '0 16px' }}>
          <div className="fade-in" onClick={e => e.stopPropagation()} style={{ backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: 28, width: '100%', maxWidth: 400, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={() => setSelectedProduct(null)} style={{ background: Colors.surfaceSecondary, border: 'none', cursor: 'pointer', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} color={Colors.inkSecondary} />
              </button>
            </div>
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
              <span style={{ color: Colors.inkSecondary, marginLeft: 4 }}>{selectedProduct.rating} ({selectedProduct.reviews} {t.shop.reviews})</span>
            </div>
            <p style={{ fontSize: 15, color: Colors.inkSecondary, lineHeight: 1.6, marginTop: 16 }}>{selectedProduct.desc}</p>
            {selectedProduct.affiliateUrl ? (
              <Button label={t.shop.viewOnAmazon} onPress={async () => {
                try {
                  const { Browser } = await import('@capacitor/browser');
                  await Browser.open({ url: selectedProduct!.affiliateUrl! });
                } catch {
                  window.open(selectedProduct!.affiliateUrl!, '_blank', 'noopener,noreferrer');
                }
                setSelectedProduct(null);
              }} icon={<ExternalLink size={22} color={Colors.inkInverse} />} size="large" style={{ marginTop: 28 }} />
            ) : (
              <div style={{ textAlign: 'center', color: Colors.inkTertiary, fontSize: 14, marginTop: 28, padding: 16 }}>
                {t.shop.comingSoon ?? 'Link coming soon'}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.secondaryPale, borderRadius: 16, padding: 12, marginTop: 12 }}>
              <Star size={16} color={Colors.secondary} />
              <span style={{ color: Colors.secondary, fontWeight: Weight.semibold, fontSize: 13 }}>{t.shop.earnPoints}</span>
            </div>
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
