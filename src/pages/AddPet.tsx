import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button } from '../components/Button';

const C = {
  primary: '#5B5EA6', primaryPale: '#EDEDF7',
  secondary: '#E8985E', secondaryPale: '#FDF2E9',
  accent: '#D4726A', success: '#6EAF7B', warning: '#E5A84B',
  background: '#FAF8F5', surface: '#FFFFFF', surfaceSecondary: '#F3F0EB',
  ink: '#2D2D3A', inkSecondary: '#6B6B80', inkTertiary: '#9D9DAF',
  hairline: '#E8E4DF',
};

const petTypes = [
  { key: 'dog', label: 'Dog', emoji: '🐕' },
  { key: 'cat', label: 'Cat', emoji: '🐈' },
  { key: 'bird', label: 'Bird', emoji: '🐦' },
  { key: 'rabbit', label: 'Rabbit', emoji: '🐰' },
  { key: 'other', label: 'Other', emoji: '🐾' },
];

const genderOptions = ['Male', 'Female'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px 18px',
  fontSize: 16,
  fontWeight: 500,
  color: C.ink,
  backgroundColor: C.surface,
  border: `1.5px solid ${C.hairline}`,
  borderRadius: 14,
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: C.inkSecondary,
  marginBottom: 8,
  display: 'block',
};

export function AddPetPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('dog');
  const [selectedGender, setSelectedGender] = useState('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [microchip, setMicrochip] = useState('');

  const handleSave = () => {
    navigate('/pets');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.background }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 20px 12px',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: C.surfaceSecondary,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={20} color={C.ink} />
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0, letterSpacing: -0.3 }}>
          Add New Pet
        </h1>
      </div>

      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Photo Placeholder */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 36,
              backgroundColor: C.surfaceSecondary,
              border: `2px dashed ${C.hairline}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Camera size={28} color={C.inkTertiary} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.inkTertiary }}>Add Photo</span>
          </div>
        </div>

        {/* Pet Type Selector */}
        <div>
          <span style={labelStyle}>Pet Type</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {petTypes.map((type) => {
              const isActive = selectedType === type.key;
              return (
                <button
                  key={type.key}
                  onClick={() => setSelectedType(type.key)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '14px 4px',
                    borderRadius: 16,
                    backgroundColor: isActive ? C.primaryPale : C.surface,
                    border: isActive ? `2px solid ${C.primary}` : `1.5px solid ${C.hairline}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{type.emoji}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? C.primary : C.inkSecondary,
                    }}
                  >
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Name */}
        <div>
          <span style={labelStyle}>Name</span>
          <input
            type="text"
            placeholder="e.g. Luna"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Breed */}
        <div>
          <span style={labelStyle}>Breed</span>
          <input
            type="text"
            placeholder="e.g. Golden Retriever"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Gender */}
        <div>
          <span style={labelStyle}>Gender</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {genderOptions.map((g) => {
              const isActive = selectedGender === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  style={{
                    flex: 1,
                    padding: '14px 0',
                    borderRadius: 14,
                    fontSize: 15,
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? C.primaryPale : C.surface,
                    color: isActive ? C.primary : C.inkSecondary,
                    border: isActive ? `2px solid ${C.primary}` : `1.5px solid ${C.hairline}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {g === 'Male' ? '\u2642 ' : '\u2640 '}{g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weight */}
        <div>
          <span style={labelStyle}>Weight (kg)</span>
          <input
            type="number"
            placeholder="e.g. 28.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Microchip */}
        <div>
          <span style={labelStyle}>Microchip ID (optional)</span>
          <input
            type="text"
            placeholder="e.g. 900123456789012"
            value={microchip}
            onChange={(e) => setMicrochip(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Save Button */}
        <div style={{ paddingTop: 8 }}>
          <Button
            label="Save Pet"
            onPress={handleSave}
            variant="primary"
            size="large"
            disabled={!name.trim() || !breed.trim() || !selectedGender}
          />
        </div>
      </div>
    </div>
  );
}
