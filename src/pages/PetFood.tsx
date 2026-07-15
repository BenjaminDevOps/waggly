import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card } from '../components/Card';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useI18n } from '../i18n';
import { usePets } from '../hooks/usePets';
import { FOOD_GUIDE } from '../constants/foodGuide';
import type { FoodItem } from '../constants/foodGuide';

export function PetFoodPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { pets, loading } = usePets();
  const { t, locale } = useI18n();
  const pet = pets.find((p) => p.id === petId);

  if (loading) return null;
  if (!pet) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: Colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => navigate('/carnet')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
      </div>
    );
  }

  const guide = FOOD_GUIDE.find((g) => g.type === pet.type);

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background, paddingBottom: Spacing.xxl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.carnet.navFood}</span>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
        <p style={{ fontSize: Font.body, color: Colors.inkSecondary, margin: `0 0 ${Spacing.sm}px` }}>
          {pet.name} — {t.addPet[pet.type]}
        </p>

        {guide ? (
          <>
            <FoodCategory label={t.foodGuide.allowed} color={Colors.success} bg={Colors.successPale} items={guide.allowed} locale={locale} />
            <FoodCategory label={t.foodGuide.limit} color={Colors.warning} bg={Colors.warningPale} items={guide.limit} locale={locale} />
            <FoodCategory label={t.foodGuide.toxic} color={Colors.error} bg={Colors.errorPale} items={guide.toxic} locale={locale} icon={<AlertTriangle size={14} />} />
          </>
        ) : (
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
