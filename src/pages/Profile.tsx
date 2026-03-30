import React from 'react';
import { User, Diamond, ChevronRight, Bell, Shield, HelpCircle, LogOut, Lock, Stethoscope, Footprints, ShoppingBag } from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { BADGES, BadgeId } from '../models/types';

const EARNED_BADGES: BadgeId[] = ['firstPet', 'firstDiagnosis', 'streak7Days', 'points100', 'points500', 'vetVisit5'];
const LEADERBOARD = [
  { rank: 1, name: 'Sophie M.', points: 3450, icon: '👑' },
  { rank: 2, name: 'Lucas D.', points: 2890, icon: '🥈' },
  { rank: 3, name: 'Emma R.', points: 2340, icon: '🥉' },
  { rank: 4, name: 'You', points: 1250, icon: '🐾' },
  { rank: 5, name: 'Pierre L.', points: 980, icon: '' },
];

export function ProfilePage() {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #5B5EA6, #7B7FCC)', padding: '60px 16px 28px', textAlign: 'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.2)', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <User size={40} color="#fff" />
        </div>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginTop: 12 }}>Pet Lover</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginTop: 4 }}>Level 12 - Health Champion</div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: 20 }}>
          {[{ val: '1,250', lbl: 'Points' }, { val: '7', lbl: 'Day Streak' }, { val: '3', lbl: 'Pets' }, { val: '6', lbl: 'Badges' }].map(s => (
            <div key={s.lbl}>
              <div style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Level Progress */}
        <Card style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#2D2D3A' }}>Level 12</span>
            <span style={{ color: '#6B6B80', fontSize: 15 }}>1,250 / 2,000 XP</span>
          </div>
          <div style={{ height: 10, backgroundColor: '#F3F0EB', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: '62.5%', height: '100%', backgroundColor: '#5B5EA6', borderRadius: 5 }} />
          </div>
          <div style={{ color: '#9D9DAF', fontSize: 13, marginTop: 8 }}>750 XP to Level 13</div>
        </Card>

        {/* Premium */}
        <GradientCard colors={['#E8985E', '#D4726A']} style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Diamond size={28} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>Go Premium</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>Unlimited AI diagnoses, exclusive badges & more!</div>
          </div>
          <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
        </GradientCard>

        {/* Badges */}
        <SectionHeader title="My Badges" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {BADGES.map(badge => {
            const earned = EARNED_BADGES.includes(badge.id);
            return (
              <button key={badge.id} onClick={() => alert(`${badge.icon} ${badge.name}\n${badge.description}`)} style={{
                aspectRatio: '0.85', borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                backgroundColor: earned ? '#EDEDF7' : '#F3F0EB',
                border: `1px solid ${earned ? '#5B5EA630' : '#E8E4DF'}`, cursor: 'pointer',
              }}>
                <span style={{ fontSize: 28, opacity: earned ? 1 : 0.3 }}>{badge.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: earned ? '#2D2D3A' : '#9D9DAF', textAlign: 'center', marginTop: 8 }}>{badge.name}</span>
                {!earned && <Lock size={12} color="#9D9DAF" style={{ marginTop: 4 }} />}
              </button>
            );
          })}
        </div>

        {/* Leaderboard */}
        <SectionHeader title="Leaderboard" />
        <Card style={{ padding: 0, marginBottom: 28 }}>
          {LEADERBOARD.map(l => {
            const isYou = l.name === 'You';
            return (
              <div key={l.rank} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: isYou ? '#EDEDF7' : 'transparent' }}>
                <span style={{ width: 40, textAlign: 'center', fontSize: l.icon ? 18 : 14, fontWeight: 700 }}>{l.icon || `#${l.rank}`}</span>
                <span style={{ flex: 1, fontSize: 15, color: isYou ? '#5B5EA6' : '#2D2D3A', fontWeight: isYou ? 700 : 400 }}>{l.name}</span>
                <span style={{ fontWeight: 700, color: isYou ? '#5B5EA6' : '#6B6B80' }}>{l.points} pts</span>
              </div>
            );
          })}
        </Card>

        {/* Activity Summary */}
        <SectionHeader title="Activity Summary" />
        <Card style={{ marginBottom: 28 }}>
          {[{ icon: Stethoscope, label: 'AI Diagnoses', value: '8', color: '#5B5EA6' },
            { icon: Footprints, label: 'Walks', value: '42', color: '#6EAF7B' },
            { icon: Shield, label: 'Health Records', value: '15', color: '#D4726A' },
            { icon: ShoppingBag, label: 'Shop Visits', value: '23', color: '#E8985E' },
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                <item.icon size={22} color={item.color} />
                <span style={{ flex: 1, fontSize: 15, color: '#2D2D3A' }}>{item.label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#2D2D3A' }}>{item.value}</span>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, backgroundColor: '#F0EDE8' }} />}
            </React.Fragment>
          ))}
        </Card>

        {/* Account */}
        <SectionHeader title="Account" />
        <Card style={{ padding: 0 }}>
          {[{ icon: User, label: 'Edit Profile' }, { icon: Bell, label: 'Notifications' }, { icon: Shield, label: 'Privacy & Data' }, { icon: HelpCircle, label: 'Help & Support' }].map((item, i) => (
            <button key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', borderTop: i > 0 ? '1px solid #F0EDE8' : 'none', cursor: 'pointer' }}>
              <item.icon size={22} color="#6B6B80" />
              <span style={{ flex: 1, fontSize: 15, color: '#2D2D3A', textAlign: 'left' }}>{item.label}</span>
              <ChevronRight size={18} color="#9D9DAF" />
            </button>
          ))}
          <button onClick={() => alert('Are you sure you want to sign out?')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', borderTop: '1px solid #F0EDE8', cursor: 'pointer' }}>
            <LogOut size={22} color="#D4605A" />
            <span style={{ flex: 1, fontSize: 15, color: '#D4605A', textAlign: 'left' }}>Sign Out</span>
          </button>
        </Card>
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
