import React from 'react';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { Button } from './Button';
import { Confetti } from './Confetti';
import { useI18n } from '../i18n';

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  xpReward: number;
}

interface Props {
  achievement: Achievement;
  onClose: () => void;
}

/** "Bravo !" celebration screen shown whenever a challenge or badge is unlocked. */
export function Celebration({ achievement, onClose }: Props) {
  const { t } = useI18n();

  return (
    <>
      <Confetti />
      <div style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 260, padding: Spacing.xl }}>
        <div style={{
          backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.xxl,
          width: '100%', maxWidth: 360, textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          animation: 'celebrationPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}>
          <div style={{
            width: 96, height: 96, borderRadius: 48, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${Gradients.gold[0]}, ${Gradients.gold[1]})`, fontSize: 44,
          }}>
            {achievement.emoji}
          </div>
          <h2 style={{ fontSize: Font.title1, fontWeight: Weight.heavy, color: Colors.ink, margin: '20px 0 4px' }}>
            {t.challenges.celebrationTitle}
          </h2>
          <p style={{ fontSize: Font.body, color: Colors.inkSecondary, margin: '0 0 4px' }}>
            {achievement.subtitle}
          </p>
          <p style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, margin: '8px 0 20px' }}>
            {achievement.title}
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: Colors.secondaryPale,
            color: Colors.secondary, padding: '8px 18px', borderRadius: Radius.pill, fontWeight: Weight.bold, marginBottom: 24,
          }}>
            ⭐ {t.challenges.xpEarned.replace('{xp}', String(achievement.xpReward))}
          </div>
          <Button label={t.common.close} onPress={onClose} variant="primary" />
        </div>
      </div>
    </>
  );
}
