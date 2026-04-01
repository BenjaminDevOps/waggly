import React from 'react';
import { User, Diamond, ChevronRight, Bell, Shield, HelpCircle, LogOut, Lock, Stethoscope, Footprints, ShoppingBag, Crown, Medal, PawPrint, Flame, Star as StarIcon, Award, Building2, Trophy, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { BADGES, BadgeId } from '../models/types';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';

const EARNED_BADGES: BadgeId[] = ['firstPet', 'firstDiagnosis', 'streak7Days', 'points100', 'points500', 'vetVisit5'];

const BADGE_ICON_MAP: Record<string, LucideIcon> = {
  PawPrint, Stethoscope, Flame, 'Star': StarIcon, Award, Diamond, Crown, Building2, Trophy, Footprints, Target, Medal,
};
const LEADERBOARD = [
  { rank: 1, name: 'Sophie M.', points: 3450, Icon: Crown, color: '#E5A84B' },
  { rank: 2, name: 'Lucas D.', points: 2890, Icon: Medal, color: '#9D9DAF' },
  { rank: 3, name: 'Emma R.', points: 2340, Icon: Medal, color: '#D4726A' },
  { rank: 4, name: 'You', points: 1250, Icon: PawPrint, color: '#5B5EA6' },
  { rank: 5, name: 'Pierre L.', points: 980, Icon: null as any, color: '#6B6B80' },
];

export function ProfilePage() {
  return (
    <div style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${Colors.primary}, ${Colors.primaryLight})`, padding: '60px 16px 28px', textAlign: 'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.2)', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <User size={40} color={Colors.inkInverse} />
        </div>
        <div style={{ color: Colors.inkInverse, fontSize: Font.title2, fontWeight: Weight.bold, marginTop: 12 }}>Pet Lover</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: Font.body, marginTop: 4 }}>Level 12 - Health Champion</div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: 20 }}>
          {[{ val: '1,250', lbl: 'Points' }, { val: '7', lbl: 'Day Streak' }, { val: '3', lbl: 'Pets' }, { val: '6', lbl: 'Badges' }].map(s => (
            <div key={s.lbl}>
              <div style={{ color: Colors.inkInverse, fontSize: Font.title3, fontWeight: Weight.bold }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: Font.xs }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="fade-in" style={{ padding: 16 }}>
        {/* Level Progress */}
        <Card style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink }}>Level 12</span>
            <span style={{ color: Colors.inkSecondary, fontSize: Font.body }}>1,250 / 2,000 XP</span>
          </div>
          <div style={{ height: 10, backgroundColor: Colors.surfaceSecondary, borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: '62.5%', height: '100%', backgroundColor: Colors.primary, borderRadius: 5 }} />
          </div>
          <div style={{ color: Colors.inkTertiary, fontSize: Font.sm, marginTop: 8 }}>750 XP to Level 13</div>
        </Card>

        {/* Premium */}
        <GradientCard colors={[Colors.secondary, Colors.accent]} style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Diamond size={28} color={Colors.inkInverse} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: Colors.inkInverse, fontSize: Font.title3, fontWeight: Weight.bold }}>Go Premium</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: Font.sm, marginTop: 4 }}>Unlimited AI diagnoses, exclusive badges & more!</div>
          </div>
          <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
        </GradientCard>

        {/* Badges */}
        <SectionHeader title="My Badges" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {BADGES.map(badge => {
            const earned = EARNED_BADGES.includes(badge.id);
            const BadgeIcon = BADGE_ICON_MAP[badge.icon] || PawPrint;
            return (
              <button className="btn-press" key={badge.id} onClick={() => alert(`${badge.name}\n${badge.description}`)} style={{
                aspectRatio: '0.85', borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                backgroundColor: earned ? Colors.primaryPale : Colors.surfaceSecondary,
                border: `1px solid ${earned ? Colors.primary + '30' : Colors.hairline}`, cursor: 'pointer',
              }}>
                <BadgeIcon size={28} color={earned ? Colors.primary : Colors.inkTertiary} style={{ opacity: earned ? 1 : 0.3 }} />
                <span style={{ fontSize: Font.xs, fontWeight: Weight.semibold, color: earned ? Colors.ink : Colors.inkTertiary, textAlign: 'center', marginTop: 8 }}>{badge.name}</span>
                {!earned && <Lock size={12} color={Colors.inkTertiary} style={{ marginTop: 4 }} />}
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
              <div key={l.rank} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: isYou ? Colors.primaryPale : 'transparent' }}>
                <span style={{ width: 40, display: 'flex', justifyContent: 'center' }}>{l.Icon ? <l.Icon size={18} color={l.color} /> : <span style={{ fontWeight: Weight.bold, fontSize: 14 }}>#{l.rank}</span>}</span>
                <span style={{ flex: 1, fontSize: Font.body, color: isYou ? Colors.primary : Colors.ink, fontWeight: isYou ? Weight.bold : Weight.regular }}>{l.name}</span>
                <span style={{ fontWeight: Weight.bold, color: isYou ? Colors.primary : Colors.inkSecondary }}>{l.points} pts</span>
              </div>
            );
          })}
        </Card>

        {/* Activity Summary */}
        <SectionHeader title="Activity Summary" />
        <Card style={{ marginBottom: 28 }}>
          {[{ icon: Stethoscope, label: 'AI Diagnoses', value: '8', color: Colors.primary },
            { icon: Footprints, label: 'Walks', value: '42', color: Colors.success },
            { icon: Shield, label: 'Health Records', value: '15', color: Colors.accent },
            { icon: ShoppingBag, label: 'Shop Visits', value: '23', color: Colors.secondary },
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                <item.icon size={22} color={item.color} />
                <span style={{ flex: 1, fontSize: Font.body, color: Colors.ink }}>{item.label}</span>
                <span style={{ fontSize: Font.body, fontWeight: Weight.bold, color: Colors.ink }}>{item.value}</span>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, backgroundColor: Colors.hairlineLight }} />}
            </React.Fragment>
          ))}
        </Card>

        {/* Account */}
        <SectionHeader title="Account" />
        <Card style={{ padding: 0 }}>
          {[{ icon: User, label: 'Edit Profile' }, { icon: Bell, label: 'Notifications' }, { icon: Shield, label: 'Privacy & Data' }, { icon: HelpCircle, label: 'Help & Support' }].map((item, i) => (
            <button className="card-interactive" key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', borderTop: i > 0 ? `1px solid ${Colors.hairlineLight}` : 'none', cursor: 'pointer' }}>
              <item.icon size={22} color={Colors.inkSecondary} />
              <span style={{ flex: 1, fontSize: Font.body, color: Colors.ink, textAlign: 'left' }}>{item.label}</span>
              <ChevronRight size={18} color={Colors.inkTertiary} />
            </button>
          ))}
          <button className="btn-press" onClick={() => alert('Are you sure you want to sign out?')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', borderTop: `1px solid ${Colors.hairlineLight}`, cursor: 'pointer' }}>
            <LogOut size={22} color={Colors.error} />
            <span style={{ flex: 1, fontSize: Font.body, color: Colors.error, textAlign: 'left' }}>Sign Out</span>
          </button>
        </Card>
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
