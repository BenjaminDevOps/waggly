import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PawPrint, Stethoscope, ShoppingBag, Trophy, ChevronRight,
  Plus, Star, Flame, Footprints, Bell, Sparkles,
} from 'lucide-react';

/* ── colours & tokens ───────────────────────────────────────── */
const C = {
  primary: '#5B5EA6', primaryPale: '#EDEDF7',
  secondary: '#E8985E', secondaryPale: '#FDF2E9',
  accent: '#D4726A', success: '#6EAF7B', warning: '#E5A84B',
  background: '#FAF8F5', surface: '#FFFFFF', surfaceSecondary: '#F3F0EB',
  ink: '#2D2D3A', inkSecondary: '#6B6B80', inkTertiary: '#9D9DAF',
  hairline: '#E8E4DF',
};

const shadow = '0 4px 12px rgba(45,45,58,0.06)';
const shadowMd = '0 8px 24px rgba(45,45,58,0.10)';

/* ── demo data ──────────────────────────────────────────────── */
const pets = [
  { id: '1', name: 'Luna', type: 'dog', breed: 'Golden Retriever', emoji: '🐕', color: '#5B5EA6' },
  { id: '2', name: 'Milo', type: 'cat', breed: 'British Shorthair', emoji: '🐈', color: '#D4726A' },
  { id: '3', name: 'Coco', type: 'rabbit', breed: 'Holland Lop', emoji: '🐰', color: '#E8985E' },
];

const reminders = [
  { pet: 'Luna', task: 'Rabies Booster', daysLeft: 25, color: C.accent },
  { pet: 'Milo', task: 'Deworming', daysLeft: 41, color: C.warning },
];

const products = [
  { id: '1', name: 'Organic Treats', price: '$12.99', emoji: '🦴' },
  { id: '2', name: 'Cozy Bed', price: '$34.99', emoji: '🛏️' },
  { id: '3', name: 'Rope Toy', price: '$8.99', emoji: '🧸' },
  { id: '4', name: 'Grooming Kit', price: '$19.99', emoji: '✨' },
];

/* ── small shared components ────────────────────────────────── */
const SectionHeader: React.FC<{ title: string; action?: string; onAction?: () => void }> = ({ title, action, onAction }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 }}>
    <span style={{ fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: -0.3 }}>{title}</span>
    {action && onAction && (
      <button onClick={onAction} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.primary, fontSize: 15, fontWeight: 600 }}>
        {action}
      </button>
    )}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; padded?: boolean }> = ({ children, style, onClick, padded = true }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: C.surface, borderRadius: 20, boxShadow: shadow,
      ...(padded ? { padding: 20 } : {}),
      ...(onClick ? { cursor: 'pointer' } : {}),
      ...style,
    }}
  >
    {children}
  </div>
);

const GradientCard: React.FC<{ colors: [string, string]; children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }> = ({ colors, children, style, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
      borderRadius: 20, padding: 28,
      ...(onClick ? { cursor: 'pointer' } : {}),
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── progress circle (SVG) ──────────────────────────────────── */
const ProgressCircle: React.FC<{ pct: number; size?: number; stroke?: number }> = ({ pct, size = 80, stroke = 7 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.primaryPale} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={C.primary} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
      />
    </svg>
  );
};

/* ── main page ──────────────────────────────────────────────── */
export function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: C.background, minHeight: '100vh' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${C.primary}, #7B7FCC)`,
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>W</span>
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: -0.3 }}>Waggly</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: C.secondaryPale, borderRadius: 999, padding: '4px 12px' }}>
            <Flame size={14} color={C.secondary} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.secondary }}>7</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: C.primaryPale, borderRadius: 999, padding: '4px 12px' }}>
            <Star size={14} color={C.primary} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>1,250</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* welcome gradient card */}
        <GradientCard colors={['#5B5EA6', '#7B7FCC']}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>Good morning 👋</span>
              <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '4px 0 12px', letterSpacing: -0.3 }}>
                Welcome back!
              </h2>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={16} color="#fff" />
                <span style={{ color: '#fff', fontSize: 13, lineHeight: 1.4 }}>
                  Daily tip: Regular walks reduce anxiety in dogs by up to 40%
                </span>
              </div>
            </div>
            <span style={{ fontSize: 48, marginLeft: 12 }}>🐾</span>
          </div>
        </GradientCard>

        {/* My Pets horizontal scroll */}
        <div>
          <SectionHeader title="My Pets" action="See all" onAction={() => navigate('/pets')} />
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4, marginRight: -20 }}>
            {pets.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/pet/${p.id}`)}
                style={{
                  minWidth: 120, backgroundColor: C.surface, borderRadius: 20, padding: 16,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  boxShadow: shadow, cursor: 'pointer', flexShrink: 0,
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 18, backgroundColor: p.color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                }}>
                  {p.emoji}
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{p.name}</span>
                <span style={{ fontSize: 11, color: C.inkTertiary }}>{p.breed}</span>
              </div>
            ))}
            {/* add pet card */}
            <div
              onClick={() => navigate('/add-pet')}
              style={{
                minWidth: 120, borderRadius: 20, padding: 16,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                border: `2px dashed ${C.hairline}`, cursor: 'pointer', flexShrink: 0,
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 18, backgroundColor: C.surfaceSecondary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus size={24} color={C.inkTertiary} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.inkTertiary }}>Add Pet</span>
            </div>
          </div>
        </div>

        {/* Today's Walk */}
        <div>
          <SectionHeader title="Today's Walk" />
          <Card onClick={() => navigate('/walk')} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <ProgressCircle pct={0.47} />
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: C.primary }}>47%</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>2,340 steps</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Footprints size={14} color={C.inkTertiary} />
                <span style={{ fontSize: 13, color: C.inkTertiary }}>of 5,000 daily goal</span>
              </div>
              <div style={{
                marginTop: 10, height: 6, borderRadius: 3, backgroundColor: C.primaryPale, overflow: 'hidden',
              }}>
                <div style={{ width: '47%', height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.primary}, #7B7FCC)` }} />
              </div>
            </div>
            <ChevronRight size={20} color={C.inkTertiary} />
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
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{r.pet} — {r.task}</span>
                  <span style={{ display: 'block', fontSize: 13, color: C.inkTertiary, marginTop: 2 }}>
                    Due in {r.daysLeft} days
                  </span>
                </div>
                <ChevronRight size={18} color={C.inkTertiary} />
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions 2x2 */}
        <div>
          <SectionHeader title="Quick Actions" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {([
              { icon: Stethoscope, label: 'AI Diagnosis', color: C.accent, bg: '#FBEAE9', path: '/diagnosis' },
              { icon: PawPrint, label: 'Add Pet', color: C.primary, bg: C.primaryPale, path: '/add-pet' },
              { icon: ShoppingBag, label: 'Shop', color: C.secondary, bg: C.secondaryPale, path: '/shop' },
              { icon: Trophy, label: 'Badges', color: C.success, bg: '#E7F4EA', path: '/profile' },
            ] as const).map(a => (
              <Card
                key={a.label}
                onClick={() => navigate(a.path)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 20 }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 16, backgroundColor: a.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <a.icon size={24} color={a.color} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{a.label}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <SectionHeader title="Featured Products" action="See all" onAction={() => navigate('/shop')} />
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4, marginRight: -20 }}>
            {products.map(p => (
              <Card key={p.id} onClick={() => navigate('/shop')} padded={false} style={{ minWidth: 140, flexShrink: 0 }}>
                <div style={{
                  height: 100, borderRadius: '20px 20px 0 0', backgroundColor: C.surfaceSecondary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
                }}>
                  {p.emoji}
                </div>
                <div style={{ padding: '12px 14px 14px' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.ink, display: 'block' }}>{p.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginTop: 4, display: 'block' }}>{p.price}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
