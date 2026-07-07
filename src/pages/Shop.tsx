import React, { useState, useMemo } from 'react';
import { Search, X, Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { useI18n } from '../i18n';
import type { PetType } from '../models/types';

type PetFilter = 'all' | PetType;
type ShopCategory = 'terrariums' | 'substrate' | 'heatingLighting' | 'food' | 'accessories';

interface Product { id: string; name: string; desc: string; price: number; original?: number; rating: number; reviews: number; category: ShopCategory; pets: PetType[]; featured: boolean; isNew: boolean; affiliateUrl?: string; imageUrl?: string; }

// To add a product: paste your amzn.to short link directly in affiliateUrl.
// Short links (amzn.to) already contain your affiliate tag — do NOT append ?tag=
// For long links (amazon.fr/dp/XXX), append ?tag=your-tag-21
// To add images: right-click the product image on Amazon → "Copy image address" → paste in imageUrl
const PRODUCTS: Product[] = [
  { id: '1', name: 'Terrarium en verre 45x45x60cm', desc: 'Terrarium ventilé avec portes coulissantes, idéal reptiles', price: 89.99, original: 109.99, rating: 4.7, reviews: 340, category: 'terrariums', pets: ['reptile'], featured: true, isNew: false },
  { id: '2', name: 'Kit rampe UVB 10.0 + support', desc: 'Éclairage UVB indispensable à la synthèse de vitamine D3', price: 34.99, rating: 4.6, reviews: 210, category: 'heatingLighting', pets: ['reptile'], featured: true, isNew: false },
  { id: '3', name: 'Tapis chauffant terrarium', desc: 'Chauffage de fond thermostatable pour point chaud', price: 18.99, original: 24.99, rating: 4.5, reviews: 560, category: 'heatingLighting', pets: ['reptile', 'amphibian', 'invertebrate'], featured: false, isNew: false },
  { id: '4', name: 'Substrat fibre de coco 5kg', desc: 'Substrat fouisseur naturel, retient bien l\'humidité', price: 12.99, rating: 4.4, reviews: 180, category: 'substrate', pets: ['reptile', 'amphibian', 'invertebrate'], featured: false, isNew: true },
  { id: '5', name: 'Litière chanvre pour rongeurs', desc: 'Litière absorbante et peu poussiéreuse 10L', price: 9.99, rating: 4.6, reviews: 430, category: 'substrate', pets: ['rodent'], featured: false, isNew: false },
  { id: '6', name: 'Foin Timothy premium 1kg', desc: 'Foin de qualité supérieure riche en fibres', price: 8.99, original: 11.99, rating: 4.7, reviews: 920, category: 'food', pets: ['rodent'], featured: false, isNew: false },
  { id: '7', name: 'Grillons vivants nourrissants (x50)', desc: 'Proies vivantes gut-loaded pour reptiles et amphibiens', price: 6.99, rating: 4.5, reviews: 150, category: 'food', pets: ['reptile', 'amphibian', 'invertebrate'], featured: false, isNew: false },
  { id: '8', name: 'Croquettes furet haute protéine', desc: 'Alimentation carnée adaptée aux besoins du furet', price: 24.99, rating: 4.8, reviews: 310, category: 'food', pets: ['ferret'], featured: true, isNew: false },
  { id: '9', name: 'Hamac 3 niveaux pour furet', desc: 'Hamac suspendu confortable pour cage multi-niveaux', price: 15.99, rating: 4.6, reviews: 260, category: 'accessories', pets: ['ferret'], featured: false, isNew: true },
  { id: '10', name: 'Assortiment de perchoirs naturels', desc: 'Perchoirs de diamètres variés pour la santé des pattes', price: 13.99, rating: 4.5, reviews: 190, category: 'accessories', pets: ['bird'], featured: false, isNew: false },
  { id: '11', name: 'Filtre externe aquarium 240L/h', desc: 'Filtration silencieuse pour aquariums jusqu\'à 60L', price: 39.99, original: 49.99, rating: 4.7, reviews: 410, category: 'terrariums', pets: ['fish'], featured: true, isNew: false },
  { id: '12', name: 'Thermomètre-hygromètre digital', desc: 'Sonde double pour surveiller température et humidité', price: 11.99, rating: 4.6, reviews: 380, category: 'heatingLighting', pets: ['reptile', 'amphibian', 'invertebrate', 'fish'], featured: false, isNew: false },
];

const CATEGORIES: ShopCategory[] = ['terrariums', 'substrate', 'heatingLighting', 'food', 'accessories'];
const PET_FILTERS: PetFilter[] = ['all', 'reptile', 'rodent', 'ferret', 'bird', 'fish', 'amphibian', 'invertebrate'];
// Labels are set dynamically via i18n in the component

export function ShopPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [petFilter, setPetFilter] = useState<PetFilter>('all');
  const [catFilter, setCatFilter] = useState<ShopCategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    if (catFilter && p.category !== catFilter) return false;
    if (petFilter !== 'all' && !p.pets.includes(petFilter)) return false;
    if (search) { const q = search.toLowerCase(); return p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q); }
    return true;
  }), [search, petFilter, catFilter]);

  const petLabels: Record<PetFilter, string> = {
    all: t.shop.all, reptile: t.shop.reptiles, rodent: t.shop.rodents, ferret: t.shop.ferrets,
    bird: t.shop.birds, fish: t.shop.fish, amphibian: t.shop.amphibians, invertebrate: t.shop.invertebrates,
    other: t.addPet.other,
  };
  const catLabels: Record<ShopCategory, string> = {
    terrariums: t.shop.terrariums, substrate: t.shop.substrate, heatingLighting: t.shop.heatingLighting,
    food: t.shop.food, accessories: t.shop.accessories,
  };

  return (
    <div style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
      <h1 style={{ fontSize: Font.largeTitle, fontWeight: Weight.bold, color: Colors.ink, padding: '0 16px', marginBottom: 8 }}>{t.shop.title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: Colors.surfaceSecondary, margin: '0 16px', borderRadius: 16, padding: '8px 12px', gap: 8, marginBottom: 8 }}>
        <Search size={20} color={Colors.inkTertiary} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.shop.searchProducts} style={{ flex: 1, fontSize: 15, color: Colors.ink, backgroundColor: 'transparent' }} />
        {search && <button onClick={() => setSearch('')}><X size={20} color={Colors.inkTertiary} /></button>}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', marginBottom: 8 }}>
        {PET_FILTERS.map(f => (
          <Chip key={f} label={petLabels[f]} active={petFilter === f} onClick={() => setPetFilter(f)} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', marginBottom: 16 }}>
        <Chip label={t.shop.all} active={!catFilter} onClick={() => setCatFilter(null)} />
        {CATEGORIES.map(c => (
          <Chip key={c} label={catLabels[c]} active={catFilter === c} onClick={() => setCatFilter(c)} />
        ))}
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
            <div style={{ height: 180, backgroundColor: Colors.primaryPale, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' }}>
              <ProductImage src={selectedProduct.imageUrl} name={selectedProduct.name} size={180} />
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

function ProductImage({ src, name, size = 110 }: { src?: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setFailed(true)} />;
  }
  return <ShoppingCart size={size > 130 ? 56 : 36} color={Colors.primary + '40'} />;
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const discount = product.original ? Math.round(((product.original - product.price) / product.original) * 100) : 0;
  return (
    <button className="card-interactive" onClick={onClick} style={{ backgroundColor: Colors.surface, borderRadius: 20, overflow: 'hidden', boxShadow: Shadow.soft, textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 110, backgroundColor: Colors.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <ProductImage src={product.imageUrl} name={product.name} />
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
