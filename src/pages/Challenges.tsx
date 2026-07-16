import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Lock, PawPrint, Stethoscope, Flame, Star as StarIcon, Award, Diamond, Crown, Building2, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useI18n } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { CHALLENGES } from '../constants/challenges';
import { getItemStreak, getPerfectDayStreak, isChallengeCelebrated } from '../services/checklistService';
import { BADGES, type BadgeId } from '../models/types';
import { getBadgeName, getBadgeDescription } from '../services/badgeService';

const BADGE_ICON_MAP: Record<string, LucideIcon> = {
  PawPrint, Stethoscope, Flame, 'Star': StarIcon, Award, Diamond, Crown, Building2, Trophy,
};

type Tab = 'challenges' | 'badges';

export function ChallengesPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('challenges');
  const [selectedBadge, setSelectedBadge] = useState<{ name: string; description: string } | null>(null);
  const earnedBadges = (user?.badges ?? []) as BadgeId[];

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background, paddingBottom: Spacing.xxl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.challenges.title}</span>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
        <p style={{ fontSize: Font.body, color: Colors.inkSecondary, margin: `0 0 ${Spacing.sm}px`, lineHeight: 1.5 }}>
          {t.challenges.subtitle}
        </p>

        <div style={{ display: 'flex', backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.pill, padding: 4, marginBottom: Spacing.sm }}>
          {([['challenges', t.challenges.tabChallenges], ['badges', t.challenges.tabBadges]] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: Radius.pill, cursor: 'pointer',
                fontSize: Font.sm, fontWeight: Weight.bold,
                backgroundColor: tab === key ? Colors.surface : 'transparent',
                color: tab === key ? Colors.primary : Colors.inkSecondary,
                boxShadow: tab === key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'challenges' && CHALLENGES.map((challenge) => {
          const current = challenge.itemKey === 'perfectDay' ? getPerfectDayStreak() : getItemStreak(challenge.itemKey);
          const progress = Math.min(current / challenge.targetDays, 1);
          const completed = isChallengeCelebrated(challenge.id);

          return (
            <Card key={challenge.id} style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
              <div style={{
                width: 48, height: 48, borderRadius: Radius.md, flexShrink: 0, fontSize: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: completed ? `linear-gradient(135deg, ${Gradients.gold[0]}, ${Gradients.gold[1]})` : Colors.primaryPale,
              }}>
                {challenge.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: Font.body, fontWeight: Weight.bold, color: Colors.ink }}>{t.challenges[challenge.titleKey]}</span>
                  {completed && <CheckCircle2 size={16} color={Colors.success} />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, marginTop: 6 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: Colors.surfaceSecondary, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.round(progress * 100)}%`, height: '100%', borderRadius: 3,
                      background: completed ? Colors.success : `linear-gradient(90deg, ${Gradients.primary[0]}, ${Gradients.primary[1]})`,
                    }} />
                  </div>
                  <span style={{ fontSize: Font.xs, color: Colors.inkTertiary, whiteSpace: 'nowrap' }}>
                    {completed ? t.challenges.completed : t.challenges.progressLabel.replace('{current}', String(Math.min(current, challenge.targetDays))).replace('{target}', String(challenge.targetDays))}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: Font.xs, fontWeight: Weight.bold, color: Colors.secondary, flexShrink: 0 }}>
                +{challenge.xpReward}
              </span>
            </Card>
          );
        })}

        {tab === 'badges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {BADGES.map(badge => {
              const earned = earnedBadges.includes(badge.id);
              const BadgeIcon = BADGE_ICON_MAP[badge.icon] || PawPrint;
              const name = getBadgeName(t, badge.id);
              const description = getBadgeDescription(t, badge.id);
              return (
                <button className="btn-press" key={badge.id} onClick={() => setSelectedBadge({ name, description })} style={{
                  aspectRatio: '0.85', borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: earned ? Colors.primaryPale : Colors.surfaceSecondary,
                  border: `1px solid ${earned ? Colors.primary + '30' : Colors.hairline}`, cursor: 'pointer',
                }}>
                  <BadgeIcon size={28} color={earned ? Colors.primary : Colors.inkTertiary} style={{ opacity: earned ? 1 : 0.3 }} />
                  <span style={{ fontSize: Font.xs, fontWeight: Weight.semibold, color: earned ? Colors.ink : Colors.inkTertiary, textAlign: 'center', marginTop: 8 }}>{name}</span>
                  {!earned && <Lock size={12} color={Colors.inkTertiary} style={{ marginTop: 4 }} />}
                </button>
              );
            })}
          </div>
        )}
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
    </div>
  );
}
