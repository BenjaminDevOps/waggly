import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home as HomeIcon, Thermometer, Droplet, Plus, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useI18n } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { usePets } from '../hooks/usePets';
import { SPECIES_GUIDE } from '../constants/speciesGuide';
import { subscribeToJournalEntries, addJournalEntry } from '../services/nacJournalService';
import type { NacJournalEntry } from '../models/types';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: Spacing.md,
  borderRadius: Radius.md, border: `1.5px solid ${Colors.hairline}`,
  fontSize: Font.body, color: Colors.ink,
  backgroundColor: Colors.surfaceSecondary, outline: 'none',
  boxSizing: 'border-box',
};
const fieldLabelStyle: React.CSSProperties = {
  fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm,
};

export function PetHabitatPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const { pets, loading } = usePets();
  const { t, locale } = useI18n();
  const pet = pets.find((p) => p.id === petId);

  const [entries, setEntries] = useState<NacJournalEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [temp, setTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!petId) return;
    const unsub = subscribeToJournalEntries(petId, setEntries);
    return unsub;
  }, [petId]);

  const habitatEntries = entries.filter((e) => e.type === 'habitat');
  const sheet = pet ? SPECIES_GUIDE.find((s) => s.type === pet.type) : undefined;

  async function handleSave() {
    if (!firebaseUser || !petId) return;
    setSaving(true);
    try {
      await addJournalEntry(firebaseUser.uid, petId, {
        type: 'habitat',
        date,
        temperatureC: temp ? parseFloat(temp) : undefined,
        humidityPct: humidity ? parseFloat(humidity) : undefined,
        note: note.trim() || undefined,
      });
      setShowAdd(false);
      setTemp(''); setHumidity(''); setNote('');
    } catch (e) {
      console.error('Error saving habitat entry:', e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background, paddingBottom: Spacing.xxl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.carnet.navHabitat}</span>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
        {sheet && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.md }}>
              <HomeIcon size={18} color={Colors.primary} style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: Font.sm, color: Colors.ink, lineHeight: 1.5, margin: 0 }}>{sheet.habitat[locale]}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: Spacing.sm }}>
              <Thermometer size={18} color={Colors.warning} style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: Font.sm, color: Colors.ink, lineHeight: 1.5, margin: 0 }}>{sheet.temperature[locale]}</p>
            </div>
          </Card>
        )}

        <div>
          <div style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, marginBottom: Spacing.sm }}>
            {t.healthJournal.habitatTitle}
          </div>
          <Card>
            {habitatEntries.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm, padding: `${Spacing.lg}px 0` }}>
                <Thermometer size={20} color={Colors.inkTertiary} />
                <span style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>{t.healthJournal.habitatEmpty}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
                {habitatEntries.map((e) => (
                  <div key={e.id} style={{ display: 'flex', gap: Spacing.md, alignItems: 'center', padding: '8px 0', borderTop: `1px solid ${Colors.hairlineLight}` }}>
                    <div style={{ fontSize: Font.xs, color: Colors.inkTertiary, minWidth: 78 }}>{e.date}</div>
                    <div style={{ display: 'flex', gap: Spacing.md, flex: 1 }}>
                      {typeof e.temperatureC === 'number' && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: Font.sm, color: Colors.ink }}>
                          <Thermometer size={14} color={Colors.warning} />{e.temperatureC}°C
                        </span>
                      )}
                      {typeof e.humidityPct === 'number' && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: Font.sm, color: Colors.ink }}>
                          <Droplet size={14} color={Colors.sky} />{e.humidityPct}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: Spacing.md }}>
              <Button label={t.healthJournal.habitatAdd} onPress={() => setShowAdd(true)} variant="secondary" icon={<Plus size={16} color={Colors.primary} />} />
            </div>
          </Card>
        </div>
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: `0 ${Spacing.xl}px` }}>
          <div className="fade-in" style={{ backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.xl, width: '100%', maxWidth: 430, boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl }}>
              <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.healthJournal.habitatAdd}</span>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
                <X size={22} color={Colors.inkSecondary} />
              </button>
            </div>
            <div style={{ marginBottom: Spacing.lg }}>
              <div style={fieldLabelStyle}>{t.healthJournal.dateLabel}</div>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: Spacing.md, marginBottom: Spacing.lg }}>
              <div style={{ flex: 1 }}>
                <div style={fieldLabelStyle}>{t.healthJournal.habitatTempLabel}</div>
                <input type="number" inputMode="decimal" value={temp} onChange={(e) => setTemp(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={fieldLabelStyle}>{t.healthJournal.habitatHumidityLabel}</div>
                <input type="number" inputMode="decimal" value={humidity} onChange={(e) => setHumidity(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: Spacing.xl }}>
              <div style={fieldLabelStyle}>{t.healthJournal.habitatNoteLabel}</div>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', gap: Spacing.md }}>
              <Button label={t.common.cancel} onPress={() => setShowAdd(false)} variant="secondary" style={{ flex: 1 }} />
              <Button label={t.healthJournal.save} onPress={handleSave} variant="primary" loading={saving} style={{ flex: 1 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
