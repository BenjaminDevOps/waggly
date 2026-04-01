import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Dog, Cat, Bird, Rabbit, PawPrint } from 'lucide-react';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { Button } from '../components/Button';

const petTypes = [
  { key: 'dog', label: 'Dog', Icon: Dog },
  { key: 'cat', label: 'Cat', Icon: Cat },
  { key: 'bird', label: 'Bird', Icon: Bird },
  { key: 'rabbit', label: 'Rabbit', Icon: Rabbit },
  { key: 'other', label: 'Other', Icon: PawPrint },
];

const genderOptions = ['Male', 'Female'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: `${Spacing.lg}px 18px`,
  fontSize: Font.body + 1,
  fontWeight: Weight.medium,
  color: Colors.ink,
  backgroundColor: Colors.surface,
  border: `1.5px solid ${Colors.hairline}`,
  borderRadius: Radius.sm + 2,
  outline: 'none',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  boxSizing: 'border-box' as const,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: Weight.semibold,
  color: Colors.inkSecondary,
  marginBottom: Spacing.sm,
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
    <div style={{ minHeight: '100vh', backgroundColor: Colors.background }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: `${Spacing.lg}px ${Spacing.xl}px ${Spacing.md}px`,
        }}
      >
        <button
          className="btn-press"
          onClick={() => navigate(-1)}
          style={{
            width: 40,
            height: 40,
            borderRadius: Radius.sm,
            backgroundColor: Colors.surfaceSecondary,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <ArrowLeft size={20} color={Colors.ink} />
        </button>
        <h1 style={{ fontSize: Font.title2, fontWeight: Weight.bold, color: Colors.ink, margin: 0, letterSpacing: -0.3 }}>
          Add New Pet
        </h1>
      </div>

      <div className="slide-up" style={{ padding: `0 ${Spacing.xl}px 40px`, display: 'flex', flexDirection: 'column', gap: Spacing.xxl }}>
        {/* Photo Placeholder */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: Spacing.sm }}>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: Radius.xxl + 4,
              backgroundColor: Colors.surfaceSecondary,
              border: `2px dashed ${Colors.hairline}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Camera size={28} color={Colors.inkTertiary} />
            <span style={{ fontSize: Font.xs + 1, fontWeight: Weight.semibold, color: Colors.inkTertiary }}>Add Photo</span>
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
                  className="btn-press"
                  onClick={() => setSelectedType(type.key)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: `14px ${Spacing.xs}px`,
                    borderRadius: Radius.md,
                    backgroundColor: isActive ? Colors.primaryPale : Colors.surface,
                    border: isActive ? `2px solid ${Colors.primary}` : `1.5px solid ${Colors.hairline}`,
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <type.Icon size={28} color={isActive ? Colors.primary : Colors.inkTertiary} />
                  <span
                    style={{
                      fontSize: Font.xs + 1,
                      fontWeight: isActive ? Weight.bold : Weight.medium,
                      color: isActive ? Colors.primary : Colors.inkSecondary,
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
          <div style={{ display: 'flex', gap: Spacing.md }}>
            {genderOptions.map((g) => {
              const isActive = selectedGender === g;
              return (
                <button
                  key={g}
                  className="btn-press"
                  onClick={() => setSelectedGender(g)}
                  style={{
                    flex: 1,
                    padding: '14px 0',
                    borderRadius: Radius.sm + 2,
                    fontSize: Font.body,
                    fontWeight: isActive ? Weight.bold : Weight.medium,
                    backgroundColor: isActive ? Colors.primaryPale : Colors.surface,
                    color: isActive ? Colors.primary : Colors.inkSecondary,
                    border: isActive ? `2px solid ${Colors.primary}` : `1.5px solid ${Colors.hairline}`,
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
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
        <div style={{ paddingTop: Spacing.sm }}>
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
