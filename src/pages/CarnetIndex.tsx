import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, PawPrint } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { usePets } from '../hooks/usePets';
import { useI18n } from '../i18n';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import { PetAvatar } from '../components/PetAvatar';

/** Entry point for the Santé tab: routes straight to the pet's carnet when
 * there is exactly one, otherwise lets the owner pick which NAC to open. */
export function CarnetIndexPage() {
  const navigate = useNavigate();
  const { pets, loading } = usePets();
  const { t } = useI18n();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: Colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: Colors.inkSecondary, fontSize: Font.body }}>{t.common.loading}</p>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: Colors.background, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xl }}>
        <PawPrint size={40} color={Colors.inkTertiary} />
        <p style={{ color: Colors.ink, fontSize: Font.bodyLarge, fontWeight: Weight.bold, margin: 0, textAlign: 'center' }}>{t.pets.noPetsTitle}</p>
        <p style={{ color: Colors.inkSecondary, fontSize: Font.body, margin: 0, textAlign: 'center' }}>{t.pets.noPetsDesc}</p>
        <Button label={t.pets.addFirstPet} onPress={() => navigate('/add-pet')} variant="primary" icon={<Plus size={16} color="#fff" />} />
      </div>
    );
  }

  if (pets.length === 1) {
    return <Navigate to={`/carnet/${pets[0].id}`} replace />;
  }

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background }}>
      <div style={{ padding: `${Spacing.xl}px ${Spacing.xl}px ${Spacing.md}px` }}>
        <h1 style={{ fontSize: Font.title1, fontWeight: Weight.bold, color: Colors.ink, margin: 0, letterSpacing: -0.3 }}>
          {t.tabs.pets}
        </h1>
      </div>
      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: Spacing.xxxl }}>
        {pets.map((pet) => {
          const Icon = PET_ICON_MAP[pet.type] || PawPrint;
          const color = PET_COLOR_MAP[pet.type] || Colors.lavender;
          return (
            <Card
              key={pet.id}
              className="card-interactive"
              onClick={() => navigate(`/carnet/${pet.id}`)}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: Spacing.lg }}
            >
              <PetAvatar pet={pet} size={56} radius={Radius.lg} iconSize={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: Weight.bold, color: Colors.ink }}>{pet.name}</div>
                <div style={{ fontSize: 14, color: Colors.inkSecondary }}>{pet.breed || pet.type}</div>
              </div>
              <ChevronRight size={20} color={Colors.inkTertiary} style={{ flexShrink: 0 }} />
            </Card>
          );
        })}
        <button
          className="btn-press"
          onClick={() => navigate('/add-pet')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
            padding: Spacing.lg, borderRadius: Radius.md, border: `2px dashed ${Colors.hairline}`,
            background: 'none', cursor: 'pointer', color: Colors.inkSecondary, fontSize: Font.body, fontWeight: Weight.semibold,
          }}
        >
          <Plus size={18} color={Colors.inkTertiary} />
          {t.pets.addFirstPet}
        </button>
      </div>
    </div>
  );
}
