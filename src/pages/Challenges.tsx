import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useI18n } from '../i18n';
import { CHALLENGES } from '../constants/challenges';
import { getItemStreak, getPerfectDayStreak, isChallengeCelebrated } from '../services/checklistService';

export function ChallengesPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

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

        {CHALLENGES.map((challenge) => {
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
      </div>
    </div>
  );
}
