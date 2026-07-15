import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Sparkles, Plus, X, Stethoscope } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useI18n } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { subscribeToJournalEntries, addJournalEntry } from '../services/nacJournalService';
import type { NacJournalEntry } from '../models/types';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: Spacing.md,
  borderRadius: Radius.md, border: `1.5px solid ${Colors.hairline}`,
  fontSize: Font.body, color: Colors.ink,
  backgroundColor: Colors.surfaceSecondary, outline: 'none',
  boxSizing: 'border-box',
};

export function PetBehaviorPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const { t } = useI18n();

  const [entries, setEntries] = useState<NacJournalEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!petId) return;
    const unsub = subscribeToJournalEntries(petId, setEntries);
    return unsub;
  }, [petId]);

  const sheddingEntries = entries.filter((e) => e.type === 'shedding');

  const warningSigns = [
    t.diagnosis.lossOfAppetite, t.diagnosis.lethargy, t.diagnosis.abnormalShedding,
    t.diagnosis.breathingDifficulty, t.diagnosis.abnormalDroppings, t.diagnosis.weightLoss,
  ];

  async function handleSave() {
    if (!firebaseUser || !petId || !note.trim()) return;
    setSaving(true);
    try {
      await addJournalEntry(firebaseUser.uid, petId, { type: 'shedding', date, note: note.trim() });
      setShowAdd(false);
      setNote('');
    } catch (e) {
      console.error('Error saving behavior entry:', e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background, paddingBottom: Spacing.xxl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.carnet.navBehavior}</span>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
        <Card style={{ backgroundColor: Colors.warningPale, border: `1px solid ${Colors.warning}40` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm }}>
            <AlertTriangle size={18} color={Colors.warning} />
            <span style={{ fontSize: Font.body, fontWeight: Weight.bold, color: Colors.ink }}>{t.diagnosisIntro.title}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.md }}>
            {warningSigns.map((s) => (
              <span key={s} style={{ fontSize: Font.xs, backgroundColor: Colors.surface, color: Colors.inkSecondary, padding: '4px 10px', borderRadius: Radius.pill }}>{s}</span>
            ))}
          </div>
          <Button
            label={t.diagnosisIntro.start}
            onPress={() => navigate(`/diagnosis?petId=${petId}`)}
            variant="secondary"
            icon={<Stethoscope size={16} color={Colors.primary} />}
          />
        </Card>

        <div>
          <div style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, marginBottom: Spacing.sm }}>
            {t.healthJournal.sheddingTitle}
          </div>
          <Card>
            {sheddingEntries.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm, padding: `${Spacing.lg}px 0` }}>
                <Sparkles size={20} color={Colors.inkTertiary} />
                <span style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>{t.healthJournal.sheddingEmpty}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
                {sheddingEntries.map((e) => (
                  <div key={e.id} style={{ display: 'flex', gap: Spacing.sm, alignItems: 'flex-start', padding: '8px 0', borderTop: `1px solid ${Colors.hairlineLight}` }}>
                    <Sparkles size={16} color={Colors.lavender} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: Font.xs, color: Colors.inkTertiary }}>{e.date}</div>
                      {e.note && <div style={{ fontSize: Font.sm, color: Colors.ink }}>{e.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: Spacing.md }}>
              <Button label={t.healthJournal.sheddingAdd} onPress={() => setShowAdd(true)} variant="secondary" icon={<Plus size={16} color={Colors.primary} />} />
            </div>
          </Card>
        </div>
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: `0 ${Spacing.xl}px` }}>
          <div className="fade-in" style={{ backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.xl, width: '100%', maxWidth: 430, boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl }}>
              <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.healthJournal.sheddingAdd}</span>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
                <X size={22} color={Colors.inkSecondary} />
              </button>
            </div>
            <div style={{ marginBottom: Spacing.lg }}>
              <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>{t.healthJournal.dateLabel}</div>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: Spacing.xl }}>
              <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>{t.healthJournal.sheddingNoteLabel}</div>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.healthJournal.sheddingNotePlaceholder} rows={3} style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', gap: Spacing.md }}>
              <Button label={t.common.cancel} onPress={() => setShowAdd(false)} variant="secondary" style={{ flex: 1 }} />
              <Button label={t.healthJournal.save} onPress={handleSave} variant="primary" loading={saving} disabled={!note.trim()} style={{ flex: 1 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
