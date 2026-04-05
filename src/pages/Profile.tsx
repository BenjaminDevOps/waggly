import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Diamond, ChevronRight, Bell, Shield, HelpCircle, LogOut, Lock, Stethoscope, Footprints, ShoppingBag, Crown, Medal, PawPrint, Flame, Star as StarIcon, Award, Building2, Trophy, Target, FileText, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { BADGES, type BadgeId } from '../models/types';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { useAuth } from '../hooks/useAuth';
import { usePets } from '../hooks/usePets';
import { useI18n, LOCALE_LABELS, LOCALE_FLAGS, type Locale } from '../i18n';

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

const LOCALES: Locale[] = ['en', 'fr', 'es'];

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { pets } = usePets();
  const { t, locale, setLocale } = useI18n();

  const totalPoints = user?.totalPoints ?? 0;
  const streak = user?.dailyStreak ?? 0;
  const earnedBadges = (user?.badges ?? []) as BadgeId[];
  const level = Math.floor(totalPoints / 200) + 1;
  const xpInLevel = totalPoints % 200;
  const xpNeeded = 200;
  const xpPct = (xpInLevel / xpNeeded) * 100;

  if (loading) {
    return (
      <div style={{ backgroundColor: Colors.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: Colors.inkSecondary, fontSize: Font.body }}>{t.common.loading}</span>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${Colors.primary}, ${Colors.primaryLight})`, padding: '60px 16px 28px', textAlign: 'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.2)', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <User size={40} color={Colors.inkInverse} />
        </div>
        <div style={{ color: Colors.inkInverse, fontSize: Font.title2, fontWeight: Weight.bold, marginTop: 12 }}>{user?.displayName ?? 'Pet Lover'}</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: Font.body, marginTop: 4 }}>{t.profile.level} {level}</div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: 20 }}>
          {[{ val: totalPoints.toLocaleString(), lbl: t.common.points }, { val: String(streak), lbl: t.profile.dayStreak }, { val: String(pets.length), lbl: t.tabs.pets }, { val: String(earnedBadges.length), lbl: t.profile.myBadges }].map(s => (
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
            <span style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink }}>{t.profile.level} {level}</span>
            <span style={{ color: Colors.inkSecondary, fontSize: Font.body }}>{xpInLevel} / {xpNeeded} XP</span>
          </div>
          <div style={{ height: 10, backgroundColor: Colors.surfaceSecondary, borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: `${xpPct}%`, height: '100%', backgroundColor: Colors.primary, borderRadius: 5 }} />
          </div>
          <div style={{ color: Colors.inkTertiary, fontSize: Font.sm, marginTop: 8 }}>
            {t.profile.xpTo.replace('{xp}', String(xpNeeded - xpInLevel)).replace('{level}', String(level + 1))}
          </div>
        </Card>

        {/* Premium */}
        <GradientCard colors={[Colors.secondary, Colors.accent]} onClick={() => navigate('/premium')} style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {user?.isPremium ? <Crown size={28} color={Colors.inkInverse} /> : <Diamond size={28} color={Colors.inkInverse} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: Colors.inkInverse, fontSize: Font.title3, fontWeight: Weight.bold }}>
              {user?.isPremium ? t.profile.premiumActive : t.profile.goPremium}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: Font.sm, marginTop: 4 }}>
              {user?.isPremium ? t.profile.premiumActiveDesc : t.profile.premiumDesc}
            </div>
          </div>
          <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
        </GradientCard>

        {/* Language Selector */}
        <SectionHeader title={t.profile.language} />
        <Card style={{ padding: 0, marginBottom: 28 }}>
          {LOCALES.map((loc, i) => {
            const active = locale === loc;
            return (
              <button
                key={loc}
                className="card-interactive"
                onClick={() => setLocale(loc)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%',
                  borderTop: i > 0 ? `1px solid ${Colors.hairlineLight}` : 'none', cursor: 'pointer',
                  backgroundColor: active ? Colors.primaryPale : 'transparent',
                }}
              >
                <span style={{
                  width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: active ? Colors.primary : Colors.surfaceSecondary,
                  color: active ? Colors.inkInverse : Colors.inkSecondary,
                  fontSize: Font.xs, fontWeight: Weight.bold,
                }}>
                  {LOCALE_FLAGS[loc]}
                </span>
                <span style={{ flex: 1, fontSize: Font.body, color: active ? Colors.primary : Colors.ink, textAlign: 'left', fontWeight: active ? Weight.bold : Weight.regular }}>
                  {LOCALE_LABELS[loc]}
                </span>
                {active && (
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary }} />
                )}
              </button>
            );
          })}
        </Card>

        {/* Badges */}
        <SectionHeader title={t.profile.myBadges} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {BADGES.map(badge => {
            const earned = earnedBadges.includes(badge.id);
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
        <SectionHeader title={t.profile.leaderboard} />
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
        <SectionHeader title={t.profile.activitySummary} />
        <Card style={{ marginBottom: 28 }}>
          {[{ icon: Stethoscope, label: t.profile.aiDiagnoses, value: String(user?.aiDiagnosisUsed ?? 0), color: Colors.primary },
            { icon: Footprints, label: t.profile.walks, value: '-', color: Colors.success },
            { icon: Shield, label: t.profile.healthRecords, value: '-', color: Colors.accent },
            { icon: ShoppingBag, label: t.profile.shopVisits, value: '-', color: Colors.secondary },
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
        <SectionHeader title={t.profile.account} />
        <Card style={{ padding: 0 }}>
          {[{ icon: User, label: t.profile.editProfile, route: '' }, { icon: Bell, label: t.profile.notifications, route: '' }, { icon: Shield, label: t.profile.privacyPolicy, route: '/privacy' }, { icon: FileText, label: t.profile.termsOfService, route: '/terms' }, { icon: HelpCircle, label: t.profile.helpSupport, route: '' }].map((item, i) => (
            <button className="card-interactive" key={item.label} onClick={() => item.route && navigate(item.route)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', borderTop: i > 0 ? `1px solid ${Colors.hairlineLight}` : 'none', cursor: 'pointer' }}>
              <item.icon size={22} color={Colors.inkSecondary} />
              <span style={{ flex: 1, fontSize: Font.body, color: Colors.ink, textAlign: 'left' }}>{item.label}</span>
              <ChevronRight size={18} color={Colors.inkTertiary} />
            </button>
          ))}
          <button className="btn-press" onClick={() => { if (window.confirm(t.profile.signOutConfirm)) { signOut(); } }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', borderTop: `1px solid ${Colors.hairlineLight}`, cursor: 'pointer' }}>
            <LogOut size={22} color={Colors.error} />
            <span style={{ flex: 1, fontSize: Font.body, color: Colors.error, textAlign: 'left' }}>{t.profile.signOut}</span>
          </button>
        </Card>
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
