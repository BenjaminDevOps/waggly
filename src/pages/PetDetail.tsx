import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Plus, Syringe, ChevronRight, PawPrint, Cake, Scale, User, Building2, Pill, FileText, Download, Bug, X, Check } from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { usePets } from '../hooks/usePets';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import { subscribeToHealthRecords, addHealthRecord } from '../services/healthRecordService';
import { generateHealthReport } from '../services/healthReportService';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import type { HealthRecord, RecordType } from '../models/types';
import type { LucideIcon } from 'lucide-react';

const RECORD_ICON_MAP: Record<string, LucideIcon> = {
  vaccination: Syringe,
  vetVisit: Building2,
  deworming: Pill,
  medication: Pill,
  tickTreatment: Bug,
  note: FileText,
};

const RECORD_TYPES: { type: RecordType | 'tickTreatment'; icon: LucideIcon; color: string; bg: string }[] = [
  { type: 'vaccination', icon: Syringe, color: Colors.success, bg: Colors.successPale },
  { type: 'deworming', icon: Pill, color: Colors.accent, bg: Colors.accentPale },
  { type: 'tickTreatment' as RecordType, icon: Bug, color: Colors.warning, bg: Colors.warningPale ?? '#FFF3E0' },
  { type: 'vetVisit', icon: Building2, color: Colors.primary, bg: Colors.primaryPale },
  { type: 'medication', icon: Heart, color: Colors.secondary, bg: Colors.secondaryPale },
  { type: 'note', icon: FileText, color: Colors.lavender, bg: Colors.lavender + '20' },
];

export function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, loading } = usePets();
  const { firebaseUser } = useAuth();
  const { t, locale } = useI18n();
  const pet = pets.find(p => p.id === id);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<RecordType>('vaccination');
  const [addTitle, setAddTitle] = useState('');
  const [addDate, setAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [addNextDue, setAddNextDue] = useState('');
  const [addNotes, setAddNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToHealthRecords(id, setRecords);
    return unsub;
  }, [id]);

  const healthScore = Math.min(100, 60 + records.length * 5);

  const openAddModal = (type: RecordType) => {
    setAddType(type);
    setAddTitle('');
    setAddDate(new Date().toISOString().split('T')[0]);
    setAddNextDue('');
    setAddNotes('');
    setSaved(false);
    setShowAddModal(true);
  };

  const handleSaveRecord = async () => {
    if (!firebaseUser || !id || !addTitle.trim()) return;
    setSaving(true);
    try {
      await addHealthRecord(firebaseUser.uid, id, {
        type: addType,
        title: addTitle.trim(),
        description: addNotes.trim() || undefined,
        date: addDate,
        nextDueDate: addNextDue || undefined,
      });
      setSaved(true);
      setTimeout(() => setShowAddModal(false), 800);
    } catch (e) {
      console.error('Error saving health record:', e);
    } finally {
      setSaving(false);
    }
  };

  const typeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      vaccination: t.petDetail.vaccination,
      deworming: t.petDetail.deworming,
      tickTreatment: t.petDetail.tickTreatment,
      vetVisit: t.petDetail.vetVisit,
      medication: t.petDetail.healthRecord,
      note: 'Note',
    };
    return labels[type] ?? type;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: Colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: Colors.inkSecondary, fontSize: Font.body }}>{t.common.loading}</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: Colors.background, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: Spacing.md }}>
        <p style={{ color: Colors.inkSecondary, fontSize: Font.body }}>Pet not found</p>
        <Button label={t.common.back} onPress={() => navigate(-1)} variant="secondary" />
      </div>
    );
  }

  const PetIcon = PET_ICON_MAP[pet.type] || PawPrint;
  const petColor = PET_COLOR_MAP[pet.type] || Colors.lavender;

  const statsData = [
    { label: t.addPet.petType, value: pet.type.charAt(0).toUpperCase() + pet.type.slice(1), Icon: Cake },
    { label: t.petDetail.weightLabel, value: pet.weight ? `${pet.weight} kg` : '-', Icon: Scale },
    { label: t.petDetail.genderLabel, value: pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1), Icon: User },
  ];

  // Group records by type for summary
  const vaccinations = records.filter(r => r.type === 'vaccination');
  const dewormings = records.filter(r => r.type === 'deworming' || r.type === ('tickTreatment' as RecordType));

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background }}>
      {/* Hero Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${Gradients.primary[0]}, ${Gradients.primary[1]}, #9B9EE6)`,
          padding: `${Spacing.xl}px ${Spacing.xl}px ${Spacing.xxxl + 4}px`,
          borderRadius: `0 0 ${Radius.xxl}px ${Radius.xxl}px`,
          position: 'relative',
        }}
      >
        <button
          className="btn-press"
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: Radius.sm,
            padding: Spacing.sm + 2,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={22} color={Colors.inkInverse} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: Spacing.lg }}>
          <div
            style={{
              width: 88, height: 88, borderRadius: 44,
              background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: Spacing.md,
            }}
          >
            <PetIcon size={44} color="#fff" />
          </div>
          <span style={{ fontSize: Font.title1, fontWeight: Weight.bold, color: Colors.inkInverse, marginBottom: Spacing.xs }}>{pet.name}</span>
          <span style={{ fontSize: Font.body, color: 'rgba(255,255,255,0.8)', fontWeight: Weight.medium }}>{pet.breed || pet.type}</span>
        </div>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, marginTop: -20 }}>
        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: Spacing.md, marginBottom: Spacing.xl + 4 }}>
          {statsData.map((stat) => (
            <Card key={stat.label} style={{ textAlign: 'center', padding: Spacing.lg }}>
              <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}><stat.Icon size={24} color={Colors.primary} /></div>
              <div style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, marginBottom: 2 }}>{stat.value}</div>
              <div style={{ fontSize: Font.xs + 1, color: Colors.inkTertiary, fontWeight: Weight.medium }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Health Score */}
        <SectionHeader title={t.petDetail.healthScore} />
        <Card style={{ marginBottom: Spacing.xl + 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
            <span style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink }}>Overall Health</span>
            <span style={{ fontSize: Font.title1, fontWeight: Weight.heavy, color: Colors.success }}>{healthScore}</span>
          </div>
          <div style={{ height: 12, borderRadius: 6, background: Colors.surfaceSecondary, overflow: 'hidden' }}>
            <div style={{ width: `${healthScore}%`, height: '100%', borderRadius: 6, background: `linear-gradient(90deg, ${Colors.success}, #4A9E5C, #3D8B4F)`, transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: Spacing.sm }}>
            <span style={{ fontSize: Font.xs + 1, color: Colors.inkTertiary }}>{t.petDetail.needsAttention}</span>
            <span style={{ fontSize: Font.xs + 1, color: Colors.inkTertiary }}>{t.petDetail.excellent}</span>
          </div>
        </Card>

        {/* Quick Actions — Add Records */}
        <SectionHeader title={t.petDetail.quickActions} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: Spacing.md, marginBottom: Spacing.xl + 4 }}>
          {[
            { type: 'vaccination' as RecordType, icon: <Syringe size={22} color={Colors.success} />, label: t.petDetail.vaccination, bg: Colors.successPale },
            { type: 'deworming' as RecordType, icon: <Pill size={22} color={Colors.accent} />, label: t.petDetail.deworming, bg: Colors.accentPale },
            { type: 'vetVisit' as RecordType, icon: <Building2 size={22} color={Colors.primary} />, label: t.petDetail.vetVisit, bg: Colors.primaryPale },
          ].map((action) => (
            <Card
              key={action.type}
              className="card-interactive"
              onClick={() => openAddModal(action.type)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm + 2, padding: Spacing.lg }}
            >
              <div style={{ width: Spacing.huge, height: Spacing.huge, borderRadius: 14, backgroundColor: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {action.icon}
              </div>
              <span style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.ink, textAlign: 'center' }}>
                {action.label}
              </span>
            </Card>
          ))}
        </div>

        {/* Vaccination & Treatment Summary */}
        {(vaccinations.length > 0 || dewormings.length > 0) && (
          <>
            <SectionHeader title={t.petDetail.vaccination + ' & ' + t.petDetail.deworming} />
            <Card style={{ marginBottom: Spacing.xl + 4, padding: 0 }}>
              {[...vaccinations.slice(0, 3), ...dewormings.slice(0, 3)].map((record, i) => {
                const RecordIcon = RECORD_ICON_MAP[record.type] || FileText;
                return (
                  <div key={record.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: i > 0 ? `1px solid ${Colors.hairlineLight}` : 'none' }}>
                    <RecordIcon size={20} color={record.type === 'vaccination' ? Colors.success : Colors.accent} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink }}>{record.title}</div>
                      <div style={{ fontSize: Font.xs, color: Colors.inkTertiary }}>{record.date}{record.nextDueDate ? ` → ${record.nextDueDate}` : ''}</div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </>
        )}

        {/* Download Health Report PDF */}
        <Button
          label={generatingPdf ? '...' : 'Download Health Report (PDF)'}
          onPress={async () => {
            if (!pet || generatingPdf) return;
            setGeneratingPdf(true);
            try {
              await generateHealthReport(pet, records, [], locale);
            } catch (e) {
              console.error('Error generating PDF:', e);
            } finally {
              setGeneratingPdf(false);
            }
          }}
          variant="secondary"
          size="large"
          disabled={generatingPdf}
          loading={generatingPdf}
          icon={<Download size={18} color={Colors.primary} />}
        />
        <div style={{ height: Spacing.md }} />

        {/* Health Records */}
        <SectionHeader title={t.petDetail.healthHistory} actionLabel={t.petDetail.addRecord} onAction={() => openAddModal('vaccination')} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md, paddingBottom: Spacing.xxxl + 4 }}>
          {records.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: Spacing.xxl }}>
              <FileText size={32} color={Colors.inkTertiary} style={{ margin: '0 auto 12px' }} />
              <p style={{ color: Colors.inkSecondary, fontSize: Font.body, margin: 0 }}>{t.petDetail.noRecords}</p>
              <p style={{ color: Colors.inkTertiary, fontSize: Font.sm, margin: '8px 0 16px' }}>{t.petDetail.noRecordsDesc}</p>
              <Button label={t.petDetail.addRecord} onPress={() => openAddModal('vaccination')} variant="primary" icon={<Plus size={16} color="#fff" />} />
            </Card>
          ) : records.map((record) => {
            const RecordIcon = RECORD_ICON_MAP[record.type] || FileText;
            return (
              <Card
                key={record.id}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, padding: Spacing.lg }}
              >
                <div style={{ width: Spacing.huge, height: Spacing.huge, borderRadius: 14, backgroundColor: Colors.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <RecordIcon size={24} color={Colors.primary} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink, marginBottom: Spacing.xs }}>
                    {record.title}
                  </div>
                  <div style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>
                    {record.date}
                    {record.nextDueDate && <span style={{ color: Colors.warning }}> — {t.petDetail.nextDueDate}: {record.nextDueDate}</span>}
                  </div>
                </div>
                <ChevronRight size={18} color={Colors.inkTertiary} />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: `0 ${Spacing.xl}px` }}>
          <div className="fade-in" style={{ backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.xl, width: '100%', maxWidth: 430, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl }}>
              <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.petDetail.addRecord}</span>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
                <X size={22} color={Colors.inkSecondary} />
              </button>
            </div>

            {saved ? (
              <div style={{ textAlign: 'center', padding: Spacing.xxl }}>
                <Check size={48} color={Colors.success} style={{ margin: '0 auto' }} />
                <p style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, marginTop: Spacing.md }}>{t.petDetail.recordSaved}</p>
              </div>
            ) : (
              <>
                {/* Record Type Selector */}
                <div style={{ marginBottom: Spacing.xl }}>
                  <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>{t.petDetail.recordType}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.sm }}>
                    {RECORD_TYPES.map(rt => {
                      const active = addType === rt.type;
                      return (
                        <button
                          key={rt.type}
                          onClick={() => setAddType(rt.type as RecordType)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: `${Spacing.sm}px ${Spacing.md}px`,
                            borderRadius: Radius.pill,
                            border: `1.5px solid ${active ? rt.color : Colors.hairline}`,
                            backgroundColor: active ? rt.bg : 'transparent',
                            color: active ? rt.color : Colors.ink,
                            fontSize: Font.sm, fontWeight: active ? Weight.bold : Weight.regular,
                            cursor: 'pointer',
                          }}
                        >
                          <rt.icon size={14} color={active ? rt.color : Colors.inkSecondary} />
                          {typeLabel(rt.type)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div style={{ marginBottom: Spacing.lg }}>
                  <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>{t.petDetail.recordTitle}</div>
                  <input
                    type="text"
                    value={addTitle}
                    onChange={e => setAddTitle(e.target.value)}
                    placeholder={t.petDetail.recordTitlePlaceholder}
                    maxLength={100}
                    style={{
                      width: '100%', padding: Spacing.md,
                      borderRadius: Radius.md, border: `1.5px solid ${Colors.hairline}`,
                      fontSize: Font.body, color: Colors.ink,
                      backgroundColor: Colors.surfaceSecondary, outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Date */}
                <div style={{ display: 'flex', gap: Spacing.md, marginBottom: Spacing.lg }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>{t.petDetail.recordDate}</div>
                    <input
                      type="date"
                      value={addDate}
                      onChange={e => setAddDate(e.target.value)}
                      style={{
                        width: '100%', padding: Spacing.md,
                        borderRadius: Radius.md, border: `1.5px solid ${Colors.hairline}`,
                        fontSize: Font.body, color: Colors.ink,
                        backgroundColor: Colors.surfaceSecondary, outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>{t.petDetail.nextDueDate}</div>
                    <input
                      type="date"
                      value={addNextDue}
                      onChange={e => setAddNextDue(e.target.value)}
                      style={{
                        width: '100%', padding: Spacing.md,
                        borderRadius: Radius.md, border: `1.5px solid ${Colors.hairline}`,
                        fontSize: Font.body, color: Colors.ink,
                        backgroundColor: Colors.surfaceSecondary, outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div style={{ marginBottom: Spacing.xl }}>
                  <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>{t.petDetail.notes}</div>
                  <textarea
                    value={addNotes}
                    onChange={e => setAddNotes(e.target.value)}
                    placeholder={t.petDetail.notesPlaceholder}
                    rows={3}
                    maxLength={500}
                    style={{
                      width: '100%', padding: Spacing.md,
                      borderRadius: Radius.md, border: `1.5px solid ${Colors.hairline}`,
                      fontSize: Font.body, color: Colors.ink,
                      backgroundColor: Colors.surfaceSecondary, outline: 'none',
                      resize: 'none', fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: Spacing.md }}>
                  <Button label={t.petDetail.cancel} onPress={() => setShowAddModal(false)} variant="secondary" style={{ flex: 1 }} />
                  <Button label={t.petDetail.save} onPress={handleSaveRecord} variant="primary" loading={saving} disabled={!addTitle.trim()} style={{ flex: 1 }} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
