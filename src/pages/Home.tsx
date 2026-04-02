import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PawPrint, Stethoscope, ShoppingBag, Trophy, ChevronRight,
  Plus, Star, Flame, Footprints, Bell, Sparkles,
  Dog, Cat, Rabbit, Bird, Bone, Bed, Gift,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Shadow, Font, Weight } from '../theme/spacing';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { usePets } from '../hooks/usePets';
import { useAuth } from '../hooks/useAuth';
import type { PetType } from '../models/types';

const PET_ICON_MAP: Record<PetType, LucideIcon> = { dog: Dog, cat: Cat, rabbit: Rabbit, bird: Bird, other: PawPrint };
const PET_COLOR_MAP: Record<PetType, string> = { dog: Colors.primary, cat: Colors.accent, rabbit: Colors.secondary, bird: Colors.success, other: Colors.lavender };

const reminders = [
  { pet: 'Luna', task: 'Rabies Booster', daysLeft: 25, color: Colors.accent },
  { pet: 'Milo', task: 'Deworming', daysLeft: 41, color: Colors.warning },
];

const products = [
  { id: '1', name: 'Organic Treats', price: '$12.99', Icon: Bone },
  { id: '2', name: 'Cozy Bed', price: '$34.99', Icon: Bed },
  { id: '3', name: 'Rope Toy', price: '$8.99', Icon: Gift },
  { id: '4', name: 'Grooming Kit', price: '$19.99', Icon: Sparkles },
];

/* ── progress circle (SVG) ──────────────────────────────────── */
const ProgressCircle: React.FC<{ pct: number; size?: number; stroke?: number }> = ({ pct, size = 80, stroke = 7 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={Colors.primaryPale} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={Colors.primary} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
      />
    </svg>
  );
};

/* ── main page ──────────────────────────────────────────────── */
export function HomePage() {
  const navigate = useNavigate();
  const { pets, loading: petsLoading } = usePets();
  const { user, loading: authLoading } = useAuth();

  const userPoints = user?.totalPoints ?? 0;
  const userStreak = user?.dailyStreak ?? 0;

  return (
    <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${Spacing.lg}px ${Spacing.xl}px ${Spacing.sm}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: Spacing.md, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${Gradients.primary[0]}, ${Gradients.primary[1]})`,
          }}>
            <span style={{ color: Colors.inkInverse, fontWeight: Weight.heavy, fontSize: 18 }}>W</span>
          </div>
          <span style={{ fontSize: Font.title2, fontWeight: Weight.bold, color: Colors.ink, letterSpacing: -0.3 }}>Waggly</span>
        </div>
        <div style={{ display: 'flex', gap: Spacing.sm }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.secondaryPale, borderRadius: 999, padding: `${Spacing.xs}px ${Spacing.md}px` }}>
            <Flame size={14} color={Colors.secondary} />
            <span style={{ fontSize: Font.sm, fontWeight: Weight.bold, color: Colors.secondary }}>{userStreak}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.primaryPale, borderRadius: 999, padding: `${Spacing.xs}px ${Spacing.md}px` }}>
            <Star size={14} color={Colors.primary} />
            <span style={{ fontSize: Font.sm, fontWeight: Weight.bold, color: Colors.primary }}>{userPoints.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px ${Spacing.xxl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xxl }}>
        {/* welcome gradient card */}
        <GradientCard colors={Gradients.primary}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: Font.body }}>Good morning 👋</span>
              <h2 style={{ color: Colors.inkInverse, fontSize: Font.title1, fontWeight: Weight.bold, margin: '4px 0 12px', letterSpacing: -0.3 }}>
                Welcome back!
              </h2>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: Spacing.md, padding: `10px 14px`, display: 'flex', alignItems: 'center', gap: Spacing.sm }}>
                <Sparkles size={16} color="#fff" />
                <span style={{ color: Colors.inkInverse, fontSize: Font.sm, lineHeight: 1.4 }}>
                  Daily tip: Regular walks reduce anxiety in dogs by up to 40%
                </span>
              </div>
            </div>
            <PawPrint size={48} color="rgba(255,255,255,0.5)" style={{ marginLeft: Spacing.md, flexShrink: 0 }} />
          </div>
        </GradientCard>

        {/* My Pets horizontal scroll */}
        <div>
          <SectionHeader title="My Pets" actionLabel="See all" onAction={() => navigate('/pets')} />
          <div style={{ display: 'flex', gap: Spacing.md, overflowX: 'auto', paddingBottom: Spacing.xs, marginRight: -Spacing.xl }}>
            {petsLoading ? (
              <div style={{ minWidth: 120, padding: Spacing.lg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>Loading...</span>
              </div>
            ) : pets.length === 0 ? (
              <div style={{ minWidth: 120, padding: Spacing.lg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>No pets yet</span>
              </div>
            ) : pets.map(p => {
              const PetIcon = PET_ICON_MAP[p.type] || PawPrint;
              const petColor = PET_COLOR_MAP[p.type] || Colors.lavender;
              return (
              <div
                key={p.id}
                className="card-interactive"
                onClick={() => navigate(`/pet/${p.id}`)}
                style={{
                  minWidth: 120, backgroundColor: Colors.surface, borderRadius: 20, padding: Spacing.lg,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm,
                  boxShadow: Shadow.soft, cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 18, backgroundColor: petColor + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <PetIcon size={28} color={petColor} />
                </div>
                <span style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink }}>{p.name}</span>
                <span style={{ fontSize: Font.xs, color: Colors.inkTertiary }}>{p.breed || p.type}</span>
              </div>
              );
            })}
            {/* add pet card */}
            <div
              className="card-interactive"
              onClick={() => navigate('/add-pet')}
              style={{
                minWidth: 120, borderRadius: 20, padding: Spacing.lg,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
                border: `2px dashed ${Colors.hairline}`, cursor: 'pointer', flexShrink: 0,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.surfaceSecondary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus size={24} color={Colors.inkTertiary} />
              </div>
              <span style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkTertiary }}>Add Pet</span>
            </div>
          </div>
        </div>

        {/* Today's Walk */}
        <div>
          <SectionHeader title="Today's Walk" />
          <Card className="card-interactive" onClick={() => navigate('/walk')} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: Spacing.xl }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <ProgressCircle pct={0.47} />
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.primary }}>47%</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: Font.bodyLarge, fontWeight: Weight.semibold, color: Colors.ink }}>2,340 steps</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs }}>
                <Footprints size={14} color={Colors.inkTertiary} />
                <span style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>of 5,000 daily goal</span>
              </div>
              <div style={{
                marginTop: 10, height: 6, borderRadius: 3, backgroundColor: Colors.primaryPale, overflow: 'hidden',
              }}>
                <div style={{ width: '47%', height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${Gradients.primary[0]}, ${Gradients.primary[1]})` }} />
              </div>
            </div>
            <ChevronRight size={20} color={Colors.inkTertiary} />
          </Card>
        </div>

        {/* Reminders */}
        <div>
          <SectionHeader title="Reminders" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reminders.map((r, i) => (
              <Card key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14, backgroundColor: r.color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bell size={20} color={r.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink }}>{r.pet} — {r.task}</span>
                  <span style={{ display: 'block', fontSize: Font.sm, color: Colors.inkTertiary, marginTop: 2 }}>
                    Due in {r.daysLeft} days
                  </span>
                </div>
                <ChevronRight size={18} color={Colors.inkTertiary} />
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions 2x2 */}
        <div>
          <SectionHeader title="Quick Actions" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
            {([
              { icon: Stethoscope, label: 'AI Diagnosis', color: Colors.accent, bg: Colors.accentPale, path: '/diagnosis' },
              { icon: PawPrint, label: 'Add Pet', color: Colors.primary, bg: Colors.primaryPale, path: '/add-pet' },
              { icon: ShoppingBag, label: 'Shop', color: Colors.secondary, bg: Colors.secondaryPale, path: '/shop' },
              { icon: Trophy, label: 'Badges', color: Colors.success, bg: Colors.successPale, path: '/profile' },
            ] as const).map(a => (
              <Card
                key={a.label}
                className="card-interactive"
                onClick={() => navigate(a.path)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: Spacing.xl }}
              >
                <div style={{
                  width: Spacing.huge, height: Spacing.huge, borderRadius: Spacing.lg, backgroundColor: a.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <a.icon size={24} color={a.color} />
                </div>
                <span style={{ fontSize: 14, fontWeight: Weight.semibold, color: Colors.ink }}>{a.label}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <SectionHeader title="Featured Products" actionLabel="See all" onAction={() => navigate('/shop')} />
          <div style={{ display: 'flex', gap: Spacing.md, overflowX: 'auto', paddingBottom: Spacing.xs, marginRight: -Spacing.xl }}>
            {products.map(p => (
              <Card key={p.id} className="card-interactive" onClick={() => navigate('/shop')} padded={false} style={{ minWidth: 140, flexShrink: 0 }}>
                <div style={{
                  height: 100, borderRadius: '20px 20px 0 0', backgroundColor: Colors.surfaceSecondary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <p.Icon size={36} color={Colors.inkTertiary} />
                </div>
                <div style={{ padding: '12px 14px 14px' }}>
                  <span style={{ fontSize: 14, fontWeight: Weight.semibold, color: Colors.ink, display: 'block' }}>{p.name}</span>
                  <span style={{ fontSize: Font.sm, fontWeight: Weight.bold, color: Colors.primary, marginTop: Spacing.xs, display: 'block' }}>{p.price}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
