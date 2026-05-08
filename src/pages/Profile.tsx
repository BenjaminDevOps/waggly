import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Diamond, ChevronRight, Shield, HelpCircle, LogOut, Lock, Stethoscope, Footprints, Crown, Medal, PawPrint, Flame, Star as StarIcon, Award, Building2, Trophy, Target, FileText } from 'lucide-react';
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

const AVATAR_EMOJI: Record<string, string> = {
  dog1: '\u{1F436}', cat1: '\u{1F431}', rabbit1: '\u{1F430}', bird1: '\u{1F426}',
  fox1: '\u{1F98A}', bear1: '\u{1F43B}', panda1: '\u{1F43C}', koala1: '\u{1F428}',
  lion1: '\u{1F981}', unicorn1: '\u{1F984}', owl1: '\u{1F989}', paw1: '\u{1F43E}',
};

const BADGE_ICON_MAP: Record<string, LucideIcon> = {
  PawPrint, Stethoscope, Flame, 'Star': StarIcon, Award, Diamond, Crown, Building2, Trophy, Footprints, Target, Medal,
};
const LOCALES: Locale[] = ['en', 'fr', 'es'];

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { pets } = usePets();
  const { t, locale, setLocale } = useI18n();
  const [selectedBadge, setSelectedBadge] = useState<{ name: string; description: string } | null>(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

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
        <div style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.2)', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 44 }}>
          {user?.photoUrl ? AVATAR_EMOJI[user.photoUrl] ?? '\u{1F43E}' : <User size={40} color={Colors.inkInverse} />}
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
              <button className="btn-press" key={badge.id} onClick={() => setSelectedBadge({ name: badge.name, description: badge.description })} style={{
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

        {/* Activity Summary */}
        <SectionHeader title={t.profile.activitySummary} />
        <Card style={{ marginBottom: 28 }}>
          {[{ icon: Stethoscope, label: t.profile.aiDiagnoses, value: String(user?.aiDiagnosisUsed ?? 0), color: Colors.primary },
            { icon: Footprints, label: t.profile.walks, value: String(user?.totalPoints ? Math.floor((user.totalPoints) / 10) : 0), color: Colors.success },
            { icon: Shield, label: t.profile.healthRecords, value: '-', color: Colors.accent },
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
          {[{ icon: User, label: t.profile.editProfile, route: '/edit-profile' }, { icon: Shield, label: t.profile.privacyPolicy, route: '/privacy' }, { icon: FileText, label: t.profile.termsOfService, route: '/terms' }, { icon: HelpCircle, label: t.profile.helpSupport, route: '/contact' }].map((item, i) => (
            <button className="card-interactive" key={item.label} onClick={() => item.route && navigate(item.route)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', borderTop: i > 0 ? `1px solid ${Colors.hairlineLight}` : 'none', cursor: 'pointer' }}>
              <item.icon size={22} color={Colors.inkSecondary} />
              <span style={{ flex: 1, fontSize: Font.body, color: Colors.ink, textAlign: 'left' }}>{item.label}</span>
              <ChevronRight size={18} color={Colors.inkTertiary} />
            </button>
          ))}
          <button className="btn-press" onClick={() => setShowSignOutConfirm(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', borderTop: `1px solid ${Colors.hairlineLight}`, cursor: 'pointer' }}>
            <LogOut size={22} color={Colors.error} />
            <span style={{ flex: 1, fontSize: Font.body, color: Colors.error, textAlign: 'left' }}>{t.profile.signOut}</span>
          </button>
        </Card>
        <div style={{ height: 40 }} />
      </div>

      {selectedBadge && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 32 }} onClick={() => setSelectedBadge(null)}>
          <div style={{ backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: 32, maxWidth: 320, width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginBottom: 8 }}>{selectedBadge.name}</div>
            <div style={{ fontSize: Font.body, color: Colors.inkSecondary, lineHeight: 1.5 }}>{selectedBadge.description}</div>
            <button onClick={() => setSelectedBadge(null)} style={{ marginTop: 20, padding: '10px 32px', borderRadius: Radius.pill, backgroundColor: Colors.primary, color: Colors.inkInverse, fontSize: Font.body, fontWeight: Weight.bold, border: 'none', cursor: 'pointer' }}>{t.common.close}</button>
          </div>
        </div>
      )}

      {showSignOutConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 32 }} onClick={() => setShowSignOutConfirm(false)}>
          <div style={{ backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: 32, maxWidth: 320, width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: Font.body, color: Colors.ink, marginBottom: 20, lineHeight: 1.5 }}>{t.profile.signOutConfirm}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowSignOutConfirm(false)} style={{ flex: 1, padding: '12px 0', borderRadius: Radius.md, backgroundColor: Colors.surfaceSecondary, color: Colors.ink, fontSize: Font.body, fontWeight: Weight.semibold, border: 'none', cursor: 'pointer' }}>{t.common.cancel}</button>
              <button onClick={() => { setShowSignOutConfirm(false); signOut(); }} style={{ flex: 1, padding: '12px 0', borderRadius: Radius.md, backgroundColor: Colors.error, color: Colors.inkInverse, fontSize: Font.body, fontWeight: Weight.bold, border: 'none', cursor: 'pointer' }}>{t.profile.signOut}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
