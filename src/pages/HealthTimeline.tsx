import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Syringe, Pill, Building2, FileText, Bug, Scale, Heart,
  TrendingUp, TrendingDown, Minus, CheckCircle2, ChevronRight, X, Plus, Download,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useI18n } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { usePets } from '../hooks/usePets';
import { subscribeToHealthRecords, addHealthRecord } from '../services/healthRecordService';
import type { HealthRecord, RecordType } from '../models/types';
import type { LucideIcon } from 'lucide-react';

type Filter = 'all' | 'treatments' | 'weight' | 'vaccines' | 'docs';

const RECORD_ICON_MAP: Record<RecordType, LucideIcon> = {
  vaccination: Syringe,
  deworming: Pill,
  tickTreatment: Bug,
  vetVisit: Building2,
  medication: Pill,
  weight: Scale,
  surgery: Heart,
  allergy: Heart,
  note: FileText,
};

const RECORD_TYPES: { type: RecordType; icon: LucideIcon; color: string; bg: string }[] = [
  { type: 'vaccination', icon: Syringe, color: Colors.success, bg: Colors.successPale },
  { type: 'deworming', icon: Pill, color: Colors.accent, bg: Colors.accentPale },
  { type: 'tickTreatment', icon: Bug, color: Colors.warning, bg: Colors.warningPale },
  { type: 'vetVisit', icon: Building2, color: Colors.primary, bg: Colors.primaryPale },
  { type: 'weight', icon: Scale, color: Colors.sky, bg: Colors.skyPale },
  { type: 'note', icon: FileText, color: Colors.lavender, bg: Colors.lavenderPale },
];

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

export function HealthTimelinePage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const { pets } = usePets();
  const { t, locale } = useI18n();
  const pet = pets.find((p) => p.id === petId);

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<RecordType>('vaccination');
  const [addTitle, setAddTitle] = useState('');
  const [addDate, setAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [addWeight, setAddWeight] = useState('');
  const [addNotes, setAddNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!petId || !firebaseUser) return;
    const unsub = subscribeToHealthRecords(petId, firebaseUser.uid, setRecords);
    return unsub;
  }, [petId, firebaseUser]);

  const filtered = useMemo(() => records.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'weight') return r.type === 'weight';
    if (filter === 'vaccines') return r.type === 'vaccination';
    if (filter === 'docs') return r.type === 'note';
    return r.type !== 'weight' && r.type !== 'vaccination' && r.type !== 'note';
  }), [records, filter]);

  const weightsByDate = useMemo(
    () => records.filter((r) => r.type === 'weight').slice().sort((a, b) => a.date.localeCompare(b.date)),
    [records],
  );

  function weightTrend(record: HealthRecord): 'up' | 'down' | 'flat' | null {
    if (record.type !== 'weight' || typeof record.weight !== 'number') return null;
    const idx = weightsByDate.findIndex((r) => r.id === record.id);
    if (idx <= 0) return null;
    const prev = weightsByDate[idx - 1].weight;
    if (typeof prev !== 'number') return null;
    if (record.weight > prev) return 'up';
    if (record.weight < prev) return 'down';
    return 'flat';
  }

  function openAdd() {
    setAddType('vaccination');
    setAddTitle('');
    setAddDate(new Date().toISOString().split('T')[0]);
    setAddWeight('');
    setAddNotes('');
    setShowAdd(true);
  }

  async function handleSave() {
    if (!firebaseUser || !petId) return;
    if (addType === 'weight') {
      const grams = parseFloat(addWeight);
      if (!grams) return;
    } else if (!addTitle.trim()) return;

    setSaving(true);
    try {
      await addHealthRecord(firebaseUser.uid, petId, {
        type: addType,
        title: addType === 'weight' ? t.healthJournal.weightEntryTitle : addTitle.trim(),
        date: addDate,
        description: addNotes.trim() || undefined,
        weight: addType === 'weight' ? parseFloat(addWeight) : undefined,
      });
      setShowAdd(false);
    } catch (e) {
      console.error('Error saving record:', e);
    } finally {
      setSaving(false);
    }
  }

  const typeLabel = (type: RecordType): string => {
    const labels: Partial<Record<RecordType, string>> = {
      vaccination: t.petDetail.vaccination,
      deworming: t.petDetail.deworming,
      tickTreatment: t.petDetail.tickTreatment,
      vetVisit: t.petDetail.vetVisit,
      weight: t.healthJournal.weightValueLabel,
      note: t.healthTimeline.filterDocs,
    };
    return labels[type] ?? type;
  };

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background, paddingBottom: Spacing.xxl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.healthTimeline.title}</span>
      </div>

      <div style={{ display: 'flex', gap: Spacing.sm, padding: `0 ${Spacing.xl}px ${Spacing.md}px`, overflowX: 'auto' }}>
        {([
          { key: 'all' as Filter, label: t.healthTimeline.filterAll },
          { key: 'treatments' as Filter, label: t.healthTimeline.filterTreatments },
          { key: 'weight' as Filter, label: t.healthTimeline.filterWeight },
          { key: 'vaccines' as Filter, label: t.healthTimeline.filterVaccines },
          { key: 'docs' as Filter, label: t.healthTimeline.filterDocs },
        ]).map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              className="chip-interactive"
              onClick={() => setFilter(f.key)}
              style={{
                padding: '8px 14px', borderRadius: Radius.pill, whiteSpace: 'nowrap', fontSize: 13, cursor: 'pointer',
                backgroundColor: active ? Colors.primaryPale : Colors.surfaceSecondary,
                border: `1.5px solid ${active ? Colors.primary : 'transparent'}`,
                color: active ? Colors.primary : Colors.inkSecondary, fontWeight: active ? 700 : 400,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px` }}>
        <div style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, margin: `${Spacing.md}px 0` }}>
          {t.healthTimeline.historyTitle}
        </div>

        {filtered.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: Spacing.xxl, marginBottom: Spacing.xl }}>
            <FileText size={28} color={Colors.inkTertiary} style={{ margin: '0 auto 12px' }} />
            <p style={{ color: Colors.inkSecondary, fontSize: Font.body, margin: 0 }}>{t.healthTimeline.empty}</p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md, marginBottom: Spacing.xl }}>
            {filtered.map((record) => {
              const Icon = RECORD_ICON_MAP[record.type] || FileText;
              const trend = weightTrend(record);
              return (
                <Card key={record.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: Spacing.lg }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={Colors.primary} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>{record.date}</div>
                    <div style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink }}>{record.title}</div>
                    {record.description && <div style={{ fontSize: Font.sm, color: Colors.inkSecondary, marginTop: 2 }}>{record.description}</div>}
                    {record.type === 'weight' && typeof record.weight === 'number' && (
                      <div style={{ fontSize: Font.sm, color: Colors.inkSecondary, marginTop: 2 }}>{record.weight} g</div>
                    )}
                  </div>
                  {trend === 'up' && <TrendingUp size={18} color={Colors.success} />}
                  {trend === 'down' && <TrendingDown size={18} color={Colors.error} />}
                  {trend === 'flat' && <Minus size={18} color={Colors.inkTertiary} />}
                  {trend === null && record.type !== 'note' && <CheckCircle2 size={18} color={Colors.success} />}
                  {record.type === 'note' && <ChevronRight size={18} color={Colors.inkTertiary} />}
                </Card>
              );
            })}
          </div>
        )}

        <Button label={t.healthTimeline.addEntry} onPress={openAdd} variant="primary" icon={<Plus size={18} color="#fff" />} />
        <div style={{ height: Spacing.md }} />
        <Button
          label={generatingPdf ? '...' : t.healthTimeline.downloadReport}
          onPress={async () => {
            if (!pet || generatingPdf) return;
            setGeneratingPdf(true);
            try {
              const { generateHealthReport } = await import('../services/healthReportService');
              await generateHealthReport(pet, records, [], locale);
            } catch (e) {
              console.error('Error generating PDF:', e);
            } finally {
              setGeneratingPdf(false);
            }
          }}
          variant="secondary"
          disabled={!pet || generatingPdf}
          loading={generatingPdf}
          icon={<Download size={18} color={Colors.primary} />}
        />
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: `0 ${Spacing.xl}px` }}>
          <div className="fade-in" style={{ backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.xl, width: '100%', maxWidth: 430, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl }}>
              <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.healthTimeline.addEntry}</span>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
                <X size={22} color={Colors.inkSecondary} />
              </button>
            </div>

            <div style={{ marginBottom: Spacing.xl }}>
              <div style={fieldLabelStyle}>{t.petDetail.recordType}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.sm }}>
                {RECORD_TYPES.map((rt) => {
                  const active = addType === rt.type;
                  return (
                    <button
                      key={rt.type}
                      onClick={() => setAddType(rt.type)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: `${Spacing.sm}px ${Spacing.md}px`, borderRadius: Radius.pill,
                        border: `1.5px solid ${active ? rt.color : Colors.hairline}`,
                        backgroundColor: active ? rt.bg : 'transparent',
                        color: active ? rt.color : Colors.ink,
                        fontSize: Font.sm, fontWeight: active ? Weight.bold : Weight.regular, cursor: 'pointer',
                      }}
                    >
                      <rt.icon size={14} color={active ? rt.color : Colors.inkSecondary} />
                      {typeLabel(rt.type)}
                    </button>
                  );
                })}
              </div>
            </div>

            {addType === 'weight' ? (
              <div style={{ marginBottom: Spacing.lg }}>
                <div style={fieldLabelStyle}>{t.healthJournal.weightValueLabel}</div>
                <input type="number" inputMode="decimal" value={addWeight} onChange={(e) => setAddWeight(e.target.value)} placeholder={t.healthJournal.weightValuePlaceholder} style={inputStyle} />
              </div>
            ) : (
              <div style={{ marginBottom: Spacing.lg }}>
                <div style={fieldLabelStyle}>{t.petDetail.recordTitle}</div>
                <input type="text" value={addTitle} onChange={(e) => setAddTitle(e.target.value)} placeholder={t.petDetail.recordTitlePlaceholder} maxLength={100} style={inputStyle} />
              </div>
            )}

            <div style={{ marginBottom: Spacing.lg }}>
              <div style={fieldLabelStyle}>{t.healthJournal.dateLabel}</div>
              <input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: Spacing.xl }}>
              <div style={fieldLabelStyle}>{t.petDetail.notes}</div>
              <textarea value={addNotes} onChange={(e) => setAddNotes(e.target.value)} placeholder={t.petDetail.notesPlaceholder} rows={3} maxLength={500} style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', gap: Spacing.md }}>
              <Button label={t.petDetail.cancel} onPress={() => setShowAdd(false)} variant="secondary" style={{ flex: 1 }} />
              <Button label={t.healthTimeline.saveEntry} onPress={handleSave} variant="primary" loading={saving} style={{ flex: 1 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
