import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Shadow, Font, Weight, Radius } from '../theme/spacing';
import { Card } from '../components/Card';

const pets = [
  {
    id: '1', name: 'Luna', type: 'dog', breed: 'Golden Retriever', emoji: '🐕',
    age: '5 yrs', weight: '28.5 kg', gender: 'Female', color: '#5B5EA6',
  },
  {
    id: '2', name: 'Milo', type: 'cat', breed: 'British Shorthair', emoji: '🐈',
    age: '3 yrs', weight: '5.2 kg', gender: 'Male', color: '#D4726A',
  },
  {
    id: '3', name: 'Coco', type: 'rabbit', breed: 'Holland Lop', emoji: '🐰',
    age: '2 yrs', weight: '1.8 kg', gender: 'Female', color: '#E8985E',
  },
];

export function PetsPage() {
  const navigate = useNavigate();

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background }}>
      {/* Header */}
      <div style={{ padding: `${Spacing.xl}px ${Spacing.xl}px ${Spacing.md}px` }}>
        <h1 style={{ fontSize: Font.title1, fontWeight: Weight.bold, color: Colors.ink, margin: 0, letterSpacing: -0.3 }}>
          My Pets
        </h1>
        <p style={{ fontSize: Font.body, color: Colors.inkSecondary, margin: '6px 0 0', lineHeight: 1.4 }}>
          {pets.length} furry {pets.length === 1 ? 'friend' : 'friends'} in your family
        </p>
      </div>

      {/* Pet Cards */}
      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {pets.map((pet) => (
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
                backgroundColor: pet.color + '18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                flexShrink: 0,
              }}
            >
              {pet.emoji}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, marginBottom: 6 }}>
                <span style={{ fontSize: 18, fontWeight: Weight.bold, color: Colors.ink }}>{pet.name}</span>
              </div>
              <span style={{ fontSize: 14, color: Colors.inkSecondary, display: 'block', marginBottom: 10 }}>
                {pet.breed}
              </span>
              {/* Chips */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: pet.age, color: Colors.primary },
                  { label: pet.weight, color: Colors.secondary },
                  { label: pet.gender, color: Colors.accent },
                ].map((chip) => (
                  <span
                    key={chip.label}
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
        ))}
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
