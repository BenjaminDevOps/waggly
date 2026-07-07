import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Home as HomeIcon, Utensils, Thermometer, Sparkles } from 'lucide-react';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { useI18n } from '../i18n';
import { SPECIES_GUIDE } from '../constants/speciesGuide';
import type { PetType } from '../models/types';

const SPECIES_LABEL_KEY: Record<PetType, 'reptile' | 'rodent' | 'ferret' | 'bird' | 'fish' | 'amphibian' | 'invertebrate' | 'other'> = {
  reptile: 'reptile', rodent: 'rodent', ferret: 'ferret', bird: 'bird',
  fish: 'fish', amphibian: 'amphibian', invertebrate: 'invertebrate', other: 'other',
};

export function SpeciesGuidePage() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const [expanded, setExpanded] = useState<PetType | null>(SPECIES_GUIDE[0]?.type ?? null);

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background, paddingBottom: Spacing.xxl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.speciesGuide.title}</span>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
        <p style={{ fontSize: Font.body, color: Colors.inkSecondary, margin: `0 0 ${Spacing.sm}px`, lineHeight: 1.5 }}>
          {t.speciesGuide.subtitle}
        </p>

        {SPECIES_GUIDE.map(sheet => {
          const isOpen = expanded === sheet.type;
          return (
            <div key={sheet.type} style={{ backgroundColor: Colors.surface, borderRadius: Radius.lg, boxShadow: Shadow.soft, overflow: 'hidden' }}>
              <button
                onClick={() => setExpanded(isOpen ? null : sheet.type)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: Spacing.md,
                  padding: Spacing.lg, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const,
                }}
              >
                <span style={{ fontSize: 28 }}>{sheet.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: Font.body, fontWeight: Weight.bold, color: Colors.ink }}>
                    {t.addPet[SPECIES_LABEL_KEY[sheet.type]]}
                  </div>
                  <div style={{ fontSize: Font.xs, color: Colors.inkTertiary, marginTop: 2 }}>{sheet.examples[locale]}</div>
                </div>
                <ChevronDown size={20} color={Colors.inkTertiary} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>

              {isOpen && (
                <div className="fade-in" style={{ padding: `0 ${Spacing.lg}px ${Spacing.lg}px`, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
                  <GuideRow icon={<HomeIcon size={18} color={Colors.primary} />} label={t.speciesGuide.habitat} value={sheet.habitat[locale]} />
                  <GuideRow icon={<Utensils size={18} color={Colors.primary} />} label={t.speciesGuide.diet} value={sheet.diet[locale]} />
                  <GuideRow icon={<Thermometer size={18} color={Colors.primary} />} label={t.speciesGuide.temperature} value={sheet.temperature[locale]} />
                  <GuideRow icon={<Sparkles size={18} color={Colors.primary} />} label={t.speciesGuide.maintenance} value={sheet.maintenance[locale]} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuideRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: Spacing.sm + 2 }}>
      <div style={{ marginTop: 2, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.ink }}>{label}</div>
        <div style={{ fontSize: Font.sm, color: Colors.inkSecondary, lineHeight: 1.5, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}
