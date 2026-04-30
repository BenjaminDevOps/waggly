import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { COLLECTIONS } from '../constants/app';

const AVATARS = [
  { id: 'dog1', emoji: '\u{1F436}' },
  { id: 'cat1', emoji: '\u{1F431}' },
  { id: 'rabbit1', emoji: '\u{1F430}' },
  { id: 'bird1', emoji: '\u{1F426}' },
  { id: 'fox1', emoji: '\u{1F98A}' },
  { id: 'bear1', emoji: '\u{1F43B}' },
  { id: 'panda1', emoji: '\u{1F43C}' },
  { id: 'koala1', emoji: '\u{1F428}' },
  { id: 'lion1', emoji: '\u{1F981}' },
  { id: 'unicorn1', emoji: '\u{1F984}' },
  { id: 'owl1', emoji: '\u{1F989}' },
  { id: 'paw1', emoji: '\u{1F43E}' },
];

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user, firebaseUser } = useAuth();
  const { t } = useI18n();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.photoUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!firebaseUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.users, firebaseUser.uid), {
        displayName: displayName.trim() || 'Pet Lover',
        photoUrl: selectedAvatar,
      });
      setSaved(true);
      setTimeout(() => navigate(-1), 800);
    } catch (e) {
      console.error('Error updating profile:', e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.profile.editProfile}</span>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 100, height: 100, borderRadius: 50, margin: '0 auto',
            background: selectedAvatar
              ? Colors.primaryPale
              : `linear-gradient(135deg, ${Colors.primary}, ${Colors.primaryLight})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `3px solid ${Colors.primary}`,
            fontSize: 48,
          }}>
            {selectedAvatar
              ? AVATARS.find(a => a.id === selectedAvatar)?.emoji ?? '\u{1F43E}'
              : '\u{1F43E}'}
          </div>
        </div>

        <Card>
          <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>Avatar</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: Spacing.sm }}>
            {AVATARS.map(avatar => {
              const active = selectedAvatar === avatar.id;
              return (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(active ? '' : avatar.id)}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: Radius.md,
                    border: `2px solid ${active ? Colors.primary : Colors.hairline}`,
                    backgroundColor: active ? Colors.primaryPale : Colors.surfaceSecondary,
                    cursor: 'pointer', fontSize: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {avatar.emoji}
                  {active && (
                    <div style={{
                      position: 'absolute', top: -4, right: -4,
                      width: 20, height: 20, borderRadius: 10,
                      backgroundColor: Colors.primary,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={12} color="#fff" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>
            {t.addPet.name}
          </div>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Pet Lover"
            maxLength={30}
            style={{
              width: '100%', padding: `${Spacing.md}px ${Spacing.lg}px`,
              borderRadius: Radius.md, border: `1.5px solid ${Colors.hairline}`,
              fontSize: Font.body, color: Colors.ink,
              backgroundColor: Colors.surfaceSecondary, outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </Card>

        {saved && (
          <Card style={{ backgroundColor: Colors.successPale, textAlign: 'center' as const }}>
            <Check size={20} color={Colors.success} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            <span style={{ color: Colors.success, fontWeight: Weight.semibold }}>Saved!</span>
          </Card>
        )}

        <Button
          label={saving ? '...' : t.addPet.savePet}
          onPress={handleSave}
          variant="primary"
          size="large"
          loading={saving}
        />
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
