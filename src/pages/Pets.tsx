import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, PawPrint } from 'lucide-react';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Shadow, Font, Weight, Radius } from '../theme/spacing';
import { Card } from '../components/Card';
import { usePets } from '../hooks/usePets';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import { useI18n } from '../i18n';

export function PetsPage() {
  const navigate = useNavigate();
  const { pets, loading } = usePets();
  const { t } = useI18n();

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background }}>
      {/* Header */}
      <div style={{ padding: `${Spacing.xl}px ${Spacing.xl}px ${Spacing.md}px` }}>
        <h1 style={{ fontSize: Font.title1, fontWeight: Weight.bold, color: Colors.ink, margin: 0, letterSpacing: -0.3 }}>
          My Pets
        </h1>
        <p style={{ fontSize: Font.body, color: Colors.inkSecondary, margin: '6px 0 0', lineHeight: 1.4 }}>
          {t.pets.subtitle.replace('{count}', String(pets.length))}
        </p>
      </div>

      {/* Pet Cards */}
      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: Colors.inkSecondary, fontSize: Font.body, padding: Spacing.xl }}>{t.common.loading}</p>
        ) : pets.length === 0 ? (
          <p style={{ textAlign: 'center', color: Colors.inkSecondary, fontSize: Font.body, padding: Spacing.xl }}>{t.pets.noPetsDesc}</p>
        ) : pets.map((pet) => {
          const PetIcon = PET_ICON_MAP[pet.type] || PawPrint;
          const petColor = PET_COLOR_MAP[pet.type] || Colors.lavender;
          return (
          <Card
            key={pet.id}
            className="card-interactive"
            onClick={() => navigate(`/pet/${pet.id}`)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.lg,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: Spacing.massive,
                height: Spacing.massive,
                borderRadius: Radius.lg,
                backgroundColor: petColor + '18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PetIcon size={32} color={petColor} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, marginBottom: 6 }}>
                <span style={{ fontSize: 18, fontWeight: Weight.bold, color: Colors.ink }}>{pet.name}</span>
              </div>
              <span style={{ fontSize: 14, color: Colors.inkSecondary, display: 'block', marginBottom: 10 }}>
                {pet.breed || pet.type}
              </span>
              {/* Chips */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: pet.weight ? `${pet.weight} kg` : '-', color: Colors.secondary },
                  { label: pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1), color: Colors.accent },
                  { label: pet.breed || pet.type, color: Colors.primary },
                ].map((chip, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-block',
                      backgroundColor: chip.color + '14',
                      color: chip.color,
                      fontSize: Font.xs + 1,
                      fontWeight: Weight.semibold,
                      padding: `${Spacing.xs}px 10px`,
                      borderRadius: Radius.pill,
                    }}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            <ChevronRight size={20} color={Colors.inkTertiary} style={{ flexShrink: 0 }} />
          </Card>
          );
        })}
      </div>

      {/* FAB - Add Pet */}
      <button
        className="btn-press"
        onClick={() => navigate('/add-pet')}
        style={{
          position: 'fixed',
          bottom: 104,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: Radius.lg,
          background: `linear-gradient(135deg, ${Gradients.primary[0]}, ${Gradients.primary[1]})`,
          boxShadow: Shadow.glow(Colors.primary),
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Plus size={28} color={Colors.inkInverse} strokeWidth={2.5} />
      </button>
    </div>
  );
}
