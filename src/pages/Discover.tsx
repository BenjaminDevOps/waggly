import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, BookOpen, Salad, MapPin, Stethoscope, Dog, Scissors, Store, ChevronRight,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useI18n } from '../i18n';
import { openMapsSearch } from '../services/locationService';
import type { Locale } from '../i18n';

const PRO_QUERIES: Record<string, Record<Locale, string>> = {
  vetsNac: { fr: 'vétérinaire NAC', en: 'exotic pet veterinarian', es: 'veterinario de animales exóticos' },
  petSitting: { fr: 'garde animaux', en: 'pet sitting', es: 'cuidado de mascotas' },
  grooming: { fr: 'toilettage animaux', en: 'pet grooming', es: 'peluquería de mascotas' },
  shops: { fr: 'animalerie NAC', en: 'exotic pet store', es: 'tienda de mascotas exóticas' },
};

export function DiscoverPage() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();

  const links = [
    { icon: ShoppingBag, title: t.discover.shopTitle, desc: t.discover.shopDesc, color: Colors.secondary, bg: Colors.secondaryPale, path: '/shop' },
    { icon: BookOpen, title: t.discover.speciesGuideTitle, desc: t.discover.speciesGuideDesc, color: Colors.mint, bg: Colors.mintPale, path: '/species-guide' },
    { icon: Salad, title: t.discover.foodGuideTitle, desc: t.discover.foodGuideDesc, color: Colors.success, bg: Colors.successPale, path: '/aliments' },
  ];

  const professionals = [
    { key: 'vetsNac', icon: Stethoscope, label: t.discover.proVetsNac },
    { key: 'petSitting', icon: Dog, label: t.discover.proPetSitting },
    { key: 'grooming', icon: Scissors, label: t.discover.proGrooming },
    { key: 'shops', icon: Store, label: t.discover.proShops },
  ];

  return (
    <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh', paddingBottom: Spacing.xxl }}>
      <div style={{ padding: `${Spacing.lg}px ${Spacing.xl}px 0` }}>
        <h1 style={{ fontSize: Font.title1, fontWeight: Weight.bold, color: Colors.ink, margin: 0, letterSpacing: -0.3 }}>
          {t.discover.title}
        </h1>
        <p style={{ fontSize: Font.body, color: Colors.inkSecondary, margin: '6px 0 0', lineHeight: 1.4 }}>
          {t.discover.subtitle}
        </p>
      </div>

      <div style={{ padding: `${Spacing.xl}px ${Spacing.xl}px 0`, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
        {links.map((link) => (
          <Card
            key={link.path}
            className="card-interactive"
            onClick={() => navigate(link.path)}
            style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}
          >
            <div style={{ width: 48, height: 48, borderRadius: Radius.md, backgroundColor: link.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <link.icon size={22} color={link.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: Font.body, fontWeight: Weight.bold, color: Colors.ink }}>{link.title}</div>
              <div style={{ fontSize: Font.sm, color: Colors.inkSecondary, marginTop: 2 }}>{link.desc}</div>
            </div>
            <ChevronRight size={18} color={Colors.inkTertiary} />
          </Card>
        ))}
      </div>

      <div style={{ padding: `${Spacing.xl}px ${Spacing.xl}px 0` }}>
        <div style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, marginBottom: 2 }}>
          {t.discover.professionalsTitle}
        </div>
        <p style={{ fontSize: Font.sm, color: Colors.inkTertiary, margin: '0 0 12px' }}>{t.discover.professionalsSubtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.sm }}>
          {professionals.map((pro) => (
            <button
              key={pro.key}
              className="card-interactive"
              onClick={() => openMapsSearch(PRO_QUERIES[pro.key][locale])}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm,
                padding: Spacing.lg, borderRadius: Radius.lg, border: 'none', cursor: 'pointer',
                backgroundColor: Colors.surface, boxShadow: '0 4px 12px rgba(45,45,58,0.06)',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <pro.icon size={20} color={Colors.primary} />
              </div>
              <span style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.ink, textAlign: 'center' }}>{pro.label}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: Font.xs, color: Colors.inkTertiary }}>
                <MapPin size={12} color={Colors.inkTertiary} />
                Maps
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
