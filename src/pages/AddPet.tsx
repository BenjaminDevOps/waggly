import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Turtle, Rat, Squirrel, Bird, Fish, Waves, Bug, PawPrint } from 'lucide-react';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { Button } from '../components/Button';
import { addPet } from '../services/petService';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import { takePhoto, uploadPhotoOrFallback } from '../services/photoService';
import type { PetGender, PetType } from '../models/types';

const petTypeIcons = [
  { key: 'reptile', Icon: Turtle },
  { key: 'rodent', Icon: Rat },
  { key: 'ferret', Icon: Squirrel },
  { key: 'bird', Icon: Bird },
  { key: 'fish', Icon: Fish },
  { key: 'amphibian', Icon: Waves },
  { key: 'invertebrate', Icon: Bug },
  { key: 'other', Icon: PawPrint },
] as const;

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
  const { firebaseUser } = useAuth();
  const { t } = useI18n();
  const [selectedType, setSelectedType] = useState('reptile');
  const [selectedGender, setSelectedGender] = useState('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoDownloadUrl, setPhotoDownloadUrl] = useState<string | undefined>(undefined);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handlePickPhoto() {
    const dataUrl = await takePhoto();
    if (!dataUrl) return;
    // Show it right away; the upload continues in the background so a slow or
    // failing Storage write never leaves the picker looking like a no-op.
    setPhotoPreview(dataUrl);
    setPhotoDownloadUrl(dataUrl);
    setPhotoUploading(true);
    const url = await uploadPhotoOrFallback(dataUrl, 'pets', name.trim() || 'pet');
    setPhotoDownloadUrl(url);
    setPhotoUploading(false);
  }

  const petTypeLabels: Record<string, string> = {
    reptile: t.addPet.reptile, rodent: t.addPet.rodent, ferret: t.addPet.ferret, bird: t.addPet.bird,
    fish: t.addPet.fish, amphibian: t.addPet.amphibian, invertebrate: t.addPet.invertebrate, other: t.addPet.other,
  };

  const handleSave = async () => {
    if (!firebaseUser || !name.trim() || !breed.trim() || !selectedGender) return;
    setSaving(true);
    try {
      await addPet(firebaseUser.uid, {
        name: name.trim(),
        type: selectedType as PetType,
        breed: breed.trim(),
        gender: selectedGender.toLowerCase() as PetGender,
        weight: weight ? parseFloat(weight) : undefined,
        microchipId: microchip || undefined,
        photoUrl: photoDownloadUrl,
      });
      navigate('/carnet');
    } catch (e) {
      console.error('Error adding pet:', e);
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: Colors.background }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: `${Spacing.lg}px ${Spacing.xl}px ${Spacing.md}px` }}>
        <button className="btn-press" onClick={() => navigate(-1)} style={{
          width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.surfaceSecondary,
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <ArrowLeft size={20} color={Colors.ink} />
        </button>
        <h1 style={{ fontSize: Font.title2, fontWeight: Weight.bold, color: Colors.ink, margin: 0, letterSpacing: -0.3 }}>
          {t.addPet.title}
        </h1>
      </div>

      <div className="slide-up" style={{ padding: `0 ${Spacing.xl}px 40px`, display: 'flex', flexDirection: 'column', gap: Spacing.xxl }}>
        {/* Photo */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: Spacing.sm }}>
          <div
            onClick={handlePickPhoto}
            style={{
              width: 110, height: 110, borderRadius: Radius.xxl + 4,
              backgroundColor: Colors.surfaceSecondary,
              border: `2px dashed ${Colors.hairline}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 6, cursor: 'pointer', overflow: 'hidden', position: 'relative',
            }}
          >
            {photoPreview ? (
              <>
                <img src={photoPreview} alt={name || 'Pet'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {photoUploading && (
                  <div style={{
                    position: 'absolute', inset: 0, backgroundColor: 'rgba(59,35,96,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div className="spinner" />
                  </div>
                )}
              </>
            ) : (
              <>
                <Camera size={28} color={Colors.inkTertiary} />
                <span style={{ fontSize: Font.xs + 1, fontWeight: Weight.semibold, color: Colors.inkTertiary }}>{t.addPet.addPhoto}</span>
              </>
            )}
          </div>
        </div>

        {/* Pet Type */}
        <div>
          <span style={labelStyle}>{t.addPet.petType}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {petTypeIcons.map(({ key, Icon }) => {
              const isActive = selectedType === key;
              return (
                <button key={key} className="btn-press" onClick={() => setSelectedType(key)} style={{
                  flex: '1 1 calc(25% - 8px)', minWidth: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: `14px ${Spacing.xs}px`, borderRadius: Radius.md,
                  backgroundColor: isActive ? Colors.primaryPale : Colors.surface,
                  border: isActive ? `2px solid ${Colors.primary}` : `1.5px solid ${Colors.hairline}`, cursor: 'pointer',
                }}>
                  <Icon size={28} color={isActive ? Colors.primary : Colors.inkTertiary} />
                  <span style={{ fontSize: Font.xs + 1, fontWeight: isActive ? Weight.bold : Weight.medium, color: isActive ? Colors.primary : Colors.inkSecondary }}>
                    {petTypeLabels[key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Name */}
        <div>
          <span style={labelStyle}>{t.addPet.name}</span>
          <input type="text" placeholder={t.addPet.namePlaceholder} value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </div>

        {/* Breed */}
        <div>
          <span style={labelStyle}>{t.addPet.breed}</span>
          <input type="text" placeholder={t.addPet.breedPlaceholder} value={breed} onChange={e => setBreed(e.target.value)} style={inputStyle} />
        </div>

        {/* Gender */}
        <div>
          <span style={labelStyle}>{t.addPet.gender}</span>
          <div style={{ display: 'flex', gap: Spacing.md }}>
            {[{ key: 'Male', label: t.addPet.male, symbol: '\u2642' }, { key: 'Female', label: t.addPet.female, symbol: '\u2640' }].map(g => {
              const isActive = selectedGender === g.key;
              return (
                <button key={g.key} className="btn-press" onClick={() => setSelectedGender(g.key)} style={{
                  flex: 1, padding: '14px 0', borderRadius: Radius.sm + 2, fontSize: Font.body,
                  fontWeight: isActive ? Weight.bold : Weight.medium,
                  backgroundColor: isActive ? Colors.primaryPale : Colors.surface,
                  color: isActive ? Colors.primary : Colors.inkSecondary,
                  border: isActive ? `2px solid ${Colors.primary}` : `1.5px solid ${Colors.hairline}`, cursor: 'pointer',
                }}>
                  {g.symbol} {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weight */}
        <div>
          <span style={labelStyle}>{t.addPet.weight}</span>
          <input type="number" placeholder={t.addPet.weightPlaceholder} value={weight} onChange={e => setWeight(e.target.value)} style={inputStyle} />
        </div>

        {/* Microchip */}
        <div>
          <span style={labelStyle}>{t.addPet.microchipId}</span>
          <input type="text" placeholder={t.addPet.microchipPlaceholder} value={microchip} onChange={e => setMicrochip(e.target.value)} style={inputStyle} />
        </div>

        {/* Save */}
        <div style={{ paddingTop: Spacing.sm }}>
          <Button label={t.addPet.savePet} onPress={handleSave} variant="primary" size="large" loading={saving} disabled={saving || !name.trim() || !breed.trim() || !selectedGender} />
        </div>
      </div>
    </div>
  );
}
