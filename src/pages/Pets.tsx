import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';

const C = {
  primary: '#5B5EA6', primaryPale: '#EDEDF7',
  secondary: '#E8985E', secondaryPale: '#FDF2E9',
  accent: '#D4726A', success: '#6EAF7B', warning: '#E5A84B',
  background: '#FAF8F5', surface: '#FFFFFF', surfaceSecondary: '#F3F0EB',
  ink: '#2D2D3A', inkSecondary: '#6B6B80', inkTertiary: '#9D9DAF',
  hairline: '#E8E4DF',
};

const shadow = '0 4px 12px rgba(45,45,58,0.06)';

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
    <div style={{ minHeight: '100vh', backgroundColor: C.background }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 12px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.ink, margin: 0, letterSpacing: -0.3 }}>
          My Pets
        </h1>
        <p style={{ fontSize: 15, color: C.inkSecondary, margin: '6px 0 0', lineHeight: 1.4 }}>
          {pets.length} furry {pets.length === 1 ? 'friend' : 'friends'} in your family
        </p>
      </div>

      {/* Pet Cards */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {pets.map((pet) => (
          <div
            key={pet.id}
            onClick={() => navigate(`/pet/${pet.id}`)}
            style={{
              backgroundColor: C.surface,
              borderRadius: 20,
              boxShadow: shadow,
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{pet.name}</span>
              </div>
              <span style={{ fontSize: 14, color: C.inkSecondary, display: 'block', marginBottom: 10 }}>
                {pet.breed}
              </span>
              {/* Chips */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: pet.age, color: C.primary },
                  { label: pet.weight, color: C.secondary },
                  { label: pet.gender, color: C.accent },
                ].map((chip) => (
                  <span
                    key={chip.label}
                    style={{
                      display: 'inline-block',
                      backgroundColor: chip.color + '14',
                      color: chip.color,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 999,
                    }}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            <ChevronRight size={20} color={C.inkTertiary} style={{ flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* FAB - Add Pet */}
      <button
        onClick={() => navigate('/add-pet')}
        style={{
          position: 'fixed',
          bottom: 104,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #5B5EA6, #7B7FCC)',
          boxShadow: '0 8px 24px rgba(91, 94, 166, 0.35)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          transition: 'transform 0.15s ease',
        }}
      >
        <Plus size={28} color="#fff" strokeWidth={2.5} />
      </button>
    </div>
  );
}
