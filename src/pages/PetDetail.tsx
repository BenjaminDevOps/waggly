import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Plus, Syringe, ChevronRight, PawPrint, Cake, Scale, User, Building2, Pill, FileText } from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/Badge';
import { Button } from '../components/Button';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { usePets } from '../hooks/usePets';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import { subscribeToHealthRecords } from '../services/healthRecordService';
import { useI18n } from '../i18n';
import type { HealthRecord } from '../models/types';
import type { LucideIcon } from 'lucide-react';

const RECORD_ICON_MAP: Record<string, LucideIcon> = {
  vaccination: Syringe,
  vetVisit: Building2,
  deworming: Pill,
  medication: Pill,
  note: FileText,
};

const quickActions = [
  { icon: <Heart size={22} color={Colors.accent} />, label: 'Health Record', bg: Colors.accentPale },
  { icon: <Plus size={22} color={Colors.primary} />, label: 'Add Record', bg: Colors.primaryPale },
  { icon: <Syringe size={22} color={Colors.success} />, label: 'Vaccine', bg: Colors.successPale },
];

export function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, loading } = usePets();
  const { t } = useI18n();
  const pet = pets.find(p => p.id === id);
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToHealthRecords(id, setRecords);
    return unsub;
  }, [id]);

  const healthScore = Math.min(100, 60 + records.length * 5);

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
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <ArrowLeft size={22} color={Colors.inkInverse} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: Spacing.lg }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              background: 'rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
          <div
            style={{
              height: 12,
              borderRadius: 6,
              background: Colors.surfaceSecondary,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${healthScore}%`,
                height: '100%',
                borderRadius: 6,
                background: `linear-gradient(90deg, ${Colors.success}, #4A9E5C, #3D8B4F)`,
                transition: 'width 0.8s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: Spacing.sm }}>
            <span style={{ fontSize: Font.xs + 1, color: Colors.inkTertiary }}>{t.petDetail.needsAttention}</span>
            <span style={{ fontSize: Font.xs + 1, color: Colors.inkTertiary }}>{t.petDetail.excellent}</span>
          </div>
        </Card>

        {/* Quick Actions */}
        <SectionHeader title={t.petDetail.quickActions} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: Spacing.md, marginBottom: Spacing.xl + 4 }}>
          {quickActions.map((action) => (
            <Card
              key={action.label}
              className="card-interactive"
              onClick={() => {}}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: Spacing.sm + 2,
                padding: Spacing.lg,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div
                style={{
                  width: Spacing.huge,
                  height: Spacing.huge,
                  borderRadius: 14,
                  backgroundColor: action.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {action.icon}
              </div>
              <span style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.ink, textAlign: 'center' }}>
                {action.label}
              </span>
            </Card>
          ))}
        </div>

        {/* Health Records */}
        <SectionHeader title={t.petDetail.healthHistory} actionLabel={t.common.seeAll} onAction={() => {}} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md, paddingBottom: Spacing.xxxl + 4 }}>
          {records.length === 0 ? (
            <p style={{ textAlign: 'center', color: Colors.inkSecondary, fontSize: Font.body, padding: Spacing.xl }}>{t.petDetail.noRecords}</p>
          ) : records.map((record) => {
            const RecordIcon = RECORD_ICON_MAP[record.type] || FileText;
            return (
            <Card
              key={record.id}
              className="card-interactive"
              onClick={() => {}}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: Spacing.lg,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div
                style={{
                  width: Spacing.huge,
                  height: Spacing.huge,
                  borderRadius: 14,
                  backgroundColor: Colors.primaryPale,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <RecordIcon size={24} color={Colors.primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink, marginBottom: Spacing.xs }}>
                  {record.title}
                </div>
                <div style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>{record.date}</div>
              </div>
              <ChevronRight size={18} color={Colors.inkTertiary} />
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
