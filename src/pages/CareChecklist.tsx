import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brush, Droplet, Thermometer, Utensils, Eye, PawPrint, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { useI18n } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import {
  CHECKLIST_ITEM_KEYS, getChecklistState, setChecklistItemDone, getItemStreak, getPerfectDayStreak,
  isChallengeCelebrated, markChallengeCelebrated, type ChecklistItemKey,
} from '../services/checklistService';
import { addPoints } from '../services/userService';
import { POINTS } from '../constants/app';
import { CHALLENGES, type ChallengeDef } from '../constants/challenges';
import { useCelebrations } from '../components/CelebrationProvider';

const ITEM_ICONS: Record<ChecklistItemKey, React.ElementType> = {
  itemHabitat: Brush,
  itemWater: Droplet,
  itemTemperature: Thermometer,
  itemFood: Utensils,
  itemObservation: Eye,
  itemEnrichment: PawPrint,
};

export function CareChecklistPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { firebaseUser } = useAuth();
  const { celebrate } = useCelebrations();
  const [state, setState] = useState(() => getChecklistState());

  const doneCount = CHECKLIST_ITEM_KEYS.filter(k => state[k]).length;
  const total = CHECKLIST_ITEM_KEYS.length;
  const pct = Math.min(doneCount / total, 1);
  const earnedPoints = doneCount * POINTS.healthCheck;

  function awardChallenge(challenge: ChallengeDef) {
    markChallengeCelebrated(challenge.id);
    celebrate({
      id: challenge.id,
      emoji: challenge.emoji,
      title: t.challenges[challenge.titleKey],
      subtitle: t.challenges.celebrationSubtitle,
      xpReward: challenge.xpReward,
    });
    if (firebaseUser) {
      addPoints(firebaseUser.uid, challenge.xpReward).catch((e) => console.error('Error awarding challenge XP:', e));
    }
  }

  const toggle = (key: ChecklistItemKey) => {
    const next = !state[key];
    setChecklistItemDone(key, next);
    setState(prev => ({ ...prev, [key]: next }));

    if (!next) return; // only check for newly-completed challenges when marking done

    for (const challenge of CHALLENGES) {
      if (isChallengeCelebrated(challenge.id)) continue;
      if (challenge.itemKey === key) {
        if (getItemStreak(key) === challenge.targetDays) awardChallenge(challenge);
      } else if (challenge.itemKey === 'perfectDay') {
        if (getPerfectDayStreak() === challenge.targetDays) awardChallenge(challenge);
      }
    }
  };

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background, paddingBottom: Spacing.xxl }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
            <ArrowLeft size={22} color={Colors.ink} />
          </button>
          <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.checklist.title}</span>
        </div>
        <button onClick={() => navigate('/challenges')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs, display: 'flex' }}>
          <Trophy size={22} color={Colors.secondary} />
        </button>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
        <p style={{ fontSize: Font.body, color: Colors.inkSecondary, margin: 0, lineHeight: 1.5 }}>{t.checklist.subtitle}</p>

        <div style={{ backgroundColor: Colors.surface, borderRadius: Radius.lg, boxShadow: Shadow.soft, padding: Spacing.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
            <div style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: Colors.primaryPale, overflow: 'hidden' }}>
              <div style={{ width: `${Math.round(pct * 100)}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${Gradients.primary[0]}, ${Gradients.primary[1]})` }} />
            </div>
            <span style={{ fontSize: Font.sm, fontWeight: Weight.bold, color: Colors.ink, whiteSpace: 'nowrap' }}>
              {doneCount}/{total} {t.checklist.completed}
            </span>
          </div>
          <div style={{ marginTop: Spacing.sm, fontSize: Font.sm, fontWeight: Weight.bold, color: Colors.secondary }}>
            ⭐ {earnedPoints} {t.checklist.pointsEarned}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm + 2 }}>
          {CHECKLIST_ITEM_KEYS.map(key => {
            const Icon = ITEM_ICONS[key];
            const isDone = !!state[key];
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: Spacing.md, textAlign: 'left' as const,
                  backgroundColor: Colors.surface, borderRadius: Radius.md, boxShadow: Shadow.soft,
                  padding: Spacing.lg, border: 'none', cursor: 'pointer', width: '100%',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: Radius.sm, flexShrink: 0,
                  backgroundColor: isDone ? Colors.successPale : Colors.primaryPale,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={isDone ? Colors.success : Colors.primary} />
                </div>
                <span style={{
                  flex: 1, fontSize: Font.body, color: Colors.ink,
                  textDecoration: isDone ? 'line-through' : 'none',
                  opacity: isDone ? 0.6 : 1,
                }}>
                  {t.checklist[key]}
                </span>
                {isDone
                  ? <CheckCircle2 size={22} color={Colors.success} />
                  : <Circle size={22} color={Colors.hairline} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
