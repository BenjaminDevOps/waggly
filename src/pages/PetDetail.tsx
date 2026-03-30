import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Plus, Syringe, ChevronRight } from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/Badge';
import { Button } from '../components/Button';

const COLORS = {
  primary: '#5B5EA6',
  primaryPale: '#EDEDF7',
  primaryDark: '#44478A',
  secondary: '#E8985E',
  secondaryPale: '#FDF2E9',
  accent: '#D4726A',
  success: '#6EAF7B',
  successPale: '#E7F4EA',
  warning: '#E5A84B',
  error: '#D4605A',
  background: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F0EB',
  ink: '#2D2D3A',
  inkSecondary: '#6B6B80',
  inkTertiary: '#9D9DAF',
  hairline: '#E8E4DF',
};

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
  { icon: <Heart size={22} color={COLORS.accent} />, label: 'Health Record', bg: '#FBEAE9' },
  { icon: <Plus size={22} color={COLORS.primary} />, label: 'Add Record', bg: COLORS.primaryPale },
  { icon: <Syringe size={22} color={COLORS.success} />, label: 'Vaccine', bg: COLORS.successPale },
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
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.background }}>
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #5B5EA6, #7B7FCC, #9B9EE6)',
          padding: '20px 20px 40px',
          borderRadius: '0 0 32px 32px',
          position: 'relative',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 12,
            padding: 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={22} color="#fff" />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 16 }}>
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
              marginBottom: 12,
            }}
          >
            {pet.emoji}
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{pet.name}</span>
          <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{pet.breed}</span>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginTop: -20 }}>
        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {statsData.map((stat) => (
            <Card key={stat.label} style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.emoji}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.ink, marginBottom: 2 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: COLORS.inkTertiary, fontWeight: 500 }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Health Score */}
        <SectionHeader title="Health Score" />
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink }}>Overall Health</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: COLORS.success }}>{pet.healthScore}</span>
          </div>
          <div
            style={{
              height: 12,
              borderRadius: 6,
              background: COLORS.surfaceSecondary,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${pet.healthScore}%`,
                height: '100%',
                borderRadius: 6,
                background: 'linear-gradient(90deg, #6EAF7B, #4A9E5C, #3D8B4F)',
                transition: 'width 0.8s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: COLORS.inkTertiary }}>Poor</span>
            <span style={{ fontSize: 12, color: COLORS.inkTertiary }}>Excellent</span>
          </div>
        </Card>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {quickActions.map((action) => (
            <Card
              key={action.label}
              onClick={() => {}}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                padding: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: action.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {action.icon}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink, textAlign: 'center' }}>
                {action.label}
              </span>
            </Card>
          ))}
        </div>

        {/* Health Records */}
        <SectionHeader title="Health Records" actionLabel="See All" onAction={() => {}} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 40 }}>
          {healthRecords.map((record) => (
            <Card
              key={record.id}
              onClick={() => {}}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: COLORS.primaryPale,
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
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink, marginBottom: 4 }}>
                  {record.title}
                </div>
                <div style={{ fontSize: 13, color: COLORS.inkTertiary }}>{record.date}</div>
              </div>
              <StatusBadge
                label={record.status}
                color={record.status === 'Completed' ? COLORS.success : COLORS.warning}
                small
              />
              <ChevronRight size={18} color={COLORS.inkTertiary} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
