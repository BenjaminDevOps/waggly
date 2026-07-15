import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, ChevronDown, AlertTriangle, PawPrint } from 'lucide-react';
import { Card } from '../components/Card';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { useI18n } from '../i18n';
import { FOOD_GUIDE } from '../constants/foodGuide';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import type { PetType } from '../models/types';
import type { FoodItem } from '../constants/foodGuide';

/** General, species-by-species browsing of the food guide (reached from Découvrir).
 * The per-pet, species-scoped version lives at /carnet/:petId/food. */
export function FoodGuideBrowsePage() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const [search, setSearch] = useState('');
  const [expandedSpecies, setExpandedSpecies] = useState<PetType | null>(FOOD_GUIDE[0]?.type ?? null);

  const filteredGuides = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return FOOD_GUIDE;
    return FOOD_GUIDE
      .map((g) => ({
        ...g,
        allowed: g.allowed.filter((i) => i.name[locale].toLowerCase().includes(q)),
        limit: g.limit.filter((i) => i.name[locale].toLowerCase().includes(q)),
        toxic: g.toxic.filter((i) => i.name[locale].toLowerCase().includes(q)),
      }))
      .filter((g) => g.allowed.length + g.limit.length + g.toxic.length > 0);
  }, [search, locale]);

  return (
    <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh', paddingBottom: Spacing.xxl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.discover.foodGuideTitle}</span>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.md, padding: '8px 12px', gap: 8 }}>
          <Search size={18} color={Colors.inkTertiary} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.foodGuide.searchPlaceholder}
            style={{ flex: 1, fontSize: Font.body, color: Colors.ink, backgroundColor: 'transparent', border: 'none', outline: 'none' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <X size={18} color={Colors.inkTertiary} />
            </button>
          )}
        </div>

        {filteredGuides.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: Spacing.xxl }}>
            <Search size={28} color={Colors.inkTertiary} style={{ margin: '0 auto 12px' }} />
            <p style={{ color: Colors.inkSecondary, fontSize: Font.body, margin: 0 }}>{t.foodGuide.noResults}</p>
          </Card>
        ) : filteredGuides.map((guide) => {
          const isOpen = search.trim() ? true : expandedSpecies === guide.type;
          const Icon = PET_ICON_MAP[guide.type] || PawPrint;
          const color = PET_COLOR_MAP[guide.type] || Colors.primary;
          return (
            <div key={guide.type} style={{ backgroundColor: Colors.surface, borderRadius: Radius.lg, boxShadow: Shadow.soft, overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedSpecies(isOpen && !search.trim() ? null : guide.type)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <span style={{ flex: 1, fontSize: Font.body, fontWeight: Weight.bold, color: Colors.ink }}>{t.addPet[guide.type]}</span>
                {!search.trim() && (
                  <ChevronDown size={18} color={Colors.inkTertiary} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                )}
              </button>
              {isOpen && (
                <div style={{ padding: `0 ${Spacing.lg}px ${Spacing.lg}px`, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
                  <FoodCategory label={t.foodGuide.allowed} color={Colors.success} bg={Colors.successPale} items={guide.allowed} locale={locale} />
                  <FoodCategory label={t.foodGuide.limit} color={Colors.warning} bg={Colors.warningPale} items={guide.limit} locale={locale} />
                  <FoodCategory label={t.foodGuide.toxic} color={Colors.error} bg={Colors.errorPale} items={guide.toxic} locale={locale} icon={<AlertTriangle size={14} />} />
                </div>
              )}
            </div>
          );
        })}

        {!search.trim() && (
          <Card style={{ display: 'flex', gap: Spacing.md, alignItems: 'flex-start' }}>
            <AlertTriangle size={20} color={Colors.inkTertiary} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: Font.sm, color: Colors.inkSecondary, lineHeight: 1.5, margin: 0 }}>{t.foodGuide.otherSpeciesNotice}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function FoodCategory({ label, color, bg, items, locale, icon }: {
  label: string; color: string; bg: string; items: FoodItem[]; locale: string; icon?: React.ReactNode;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: Spacing.sm }}>
        {icon}
        <span style={{ fontSize: Font.sm, fontWeight: Weight.bold, color }}>{label}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((food, i) => (
          <div key={i} style={{ backgroundColor: bg, borderRadius: Radius.sm, padding: '8px 12px' }}>
            <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.ink }}>{food.name[locale as 'en' | 'fr' | 'es']}</div>
            {food.note && <div style={{ fontSize: Font.xs, color: Colors.inkSecondary, marginTop: 2 }}>{food.note[locale as 'en' | 'fr' | 'es']}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
