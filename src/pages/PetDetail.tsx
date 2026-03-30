import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Plus, Syringe, ChevronRight } from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/Badge';
import { Button } from '../components/Button';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';

const petData = {
  id: '1',
  name: 'Luna',
  type: 'dog' as const,
  breed: 'Golden Retriever',
  emoji: '🐕',
  age: '5 yrs',
  weight: '28.5 kg',
  gender: 'Female',
  healthScore: 92,
};

const healthRecords = [
  { id: '1', emoji: '💉', title: 'Rabies Vaccination', date: 'Mar 15, 2026', type: 'vaccination', status: 'Completed' },
  { id: '2', emoji: '🏥', title: 'Annual Checkup', date: 'Feb 28, 2026', type: 'vetVisit', status: 'Completed' },
  { id: '3', emoji: '💊', title: 'Deworming Treatment', date: 'Jan 10, 2026', type: 'deworming', status: 'Upcoming' },
];

const quickActions = [
  { icon: <Heart size={22} color={Colors.accent} />, label: 'Health Record', bg: Colors.accentPale },
  { icon: <Plus size={22} color={Colors.primary} />, label: 'Add Record', bg: Colors.primaryPale },
  { icon: <Syringe size={22} color={Colors.success} />, label: 'Vaccine', bg: Colors.successPale },
];

export function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pet = petData;

  const statsData = [
    { label: 'Age', value: pet.age, emoji: '🎂' },
    { label: 'Weight', value: pet.weight, emoji: '⚖️' },
    { label: 'Gender', value: pet.gender, emoji: '♀️' },
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
              fontSize: 44,
              marginBottom: Spacing.md,
            }}
          >
            {pet.emoji}
          </div>
          <span style={{ fontSize: Font.title1, fontWeight: Weight.bold, color: Colors.inkInverse, marginBottom: Spacing.xs }}>{pet.name}</span>
          <span style={{ fontSize: Font.body, color: 'rgba(255,255,255,0.8)', fontWeight: Weight.medium }}>{pet.breed}</span>
        </div>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, marginTop: -20 }}>
        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: Spacing.md, marginBottom: Spacing.xl + 4 }}>
          {statsData.map((stat) => (
            <Card key={stat.label} style={{ textAlign: 'center', padding: Spacing.lg }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.emoji}</div>
              <div style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, marginBottom: 2 }}>{stat.value}</div>
              <div style={{ fontSize: Font.xs + 1, color: Colors.inkTertiary, fontWeight: Weight.medium }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Health Score */}
        <SectionHeader title="Health Score" />
        <Card style={{ marginBottom: Spacing.xl + 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
            <span style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink }}>Overall Health</span>
            <span style={{ fontSize: Font.title1, fontWeight: Weight.heavy, color: Colors.success }}>{pet.healthScore}</span>
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
                width: `${pet.healthScore}%`,
                height: '100%',
                borderRadius: 6,
                background: `linear-gradient(90deg, ${Colors.success}, #4A9E5C, #3D8B4F)`,
                transition: 'width 0.8s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: Spacing.sm }}>
            <span style={{ fontSize: Font.xs + 1, color: Colors.inkTertiary }}>Poor</span>
            <span style={{ fontSize: Font.xs + 1, color: Colors.inkTertiary }}>Excellent</span>
          </div>
        </Card>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
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
        <SectionHeader title="Health Records" actionLabel="See All" onAction={() => {}} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md, paddingBottom: Spacing.xxxl + 4 }}>
          {healthRecords.map((record) => (
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
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                {record.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink, marginBottom: Spacing.xs }}>
                  {record.title}
                </div>
                <div style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>{record.date}</div>
              </div>
              <StatusBadge
                label={record.status}
                color={record.status === 'Completed' ? Colors.success : Colors.warning}
                small
              />
              <ChevronRight size={18} color={Colors.inkTertiary} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
