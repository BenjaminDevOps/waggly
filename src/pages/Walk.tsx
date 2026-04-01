import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PawPrint, Play, Square, Navigation, Flame, Star, CheckCircle, Circle, Footprints, MapPin, Dog, Cat, Rabbit, Target, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';
import { calculatePoints, estimateCalories, estimateDistanceKm } from '../services/walkService';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';

const WEEKLY_STEPS = [3200, 4100, 2800, 5200, 3900, 4500, 2340];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PET_ICONS: Record<string, LucideIcon> = { Luna: Dog, Milo: Cat, Coco: Rabbit };

export function WalkPage() {
  const [isWalking, setIsWalking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [todaySteps, setTodaySteps] = useState(2340);
  const [showSummary, setShowSummary] = useState(false);
  const dailyGoal = 5000;
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const stepsRef = useRef<ReturnType<typeof setInterval>>();
  const totalSteps = todaySteps + steps;
  const progress = Math.min(totalSteps / dailyGoal, 1);
  const maxWeekly = Math.max(...WEEKLY_STEPS);

  useEffect(() => () => { clearInterval(timerRef.current); clearInterval(stepsRef.current); }, []);

  const toggleWalk = useCallback(() => {
    if (isWalking) {
      clearInterval(timerRef.current); clearInterval(stepsRef.current);
      setIsWalking(false); setShowSummary(true);
    } else {
      setSteps(0); setSeconds(0); setIsWalking(true);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
      stepsRef.current = setInterval(() => setSteps(s => s + Math.floor(Math.random() * 3) + 1), 600);
    }
  }, [isWalking]);

  const finishWalk = () => { setTodaySteps(t => t + steps); setSteps(0); setSeconds(0); setShowSummary(false); };
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="fade-in" style={{ padding: Spacing.lg, backgroundColor: Colors.background, minHeight: '100vh' }}>
      <h1 style={{ fontSize: Font.largeTitle, fontWeight: Weight.bold, color: Colors.ink, marginBottom: Spacing.lg }}>Walk</h1>

      {/* Step Counter */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: Spacing.xxl }}>
        <div style={{
          width: 200, height: 200, borderRadius: 100,
          border: `10px solid ${Colors.hairline}`,
          background: `conic-gradient(${Colors.primary} ${progress * 360}deg, transparent 0deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{ width: 170, height: 170, borderRadius: 85, backgroundColor: Colors.background, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <PawPrint size={28} color={Colors.primary} />
            <span style={{ fontSize: Font.hero, fontWeight: Weight.bold, color: Colors.ink }}>{totalSteps}</span>
            <span style={{ fontSize: Font.body, color: Colors.inkSecondary }}>of {dailyGoal} steps</span>
            {progress >= 1 && <span style={{ color: Colors.success, fontWeight: Weight.bold, fontSize: Font.xs, marginTop: Spacing.xs }}>Goal reached!</span>}
          </div>
        </div>
      </div>

      {/* Pet selector */}
      <div style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink, marginBottom: Spacing.sm }}>Walking with</div>
      <div style={{ display: 'flex', gap: Spacing.sm, marginBottom: Spacing.xxl, overflowX: 'auto' }}>
        {Object.entries(PET_ICONS).map(([name, Icon]) => (
          <button className="btn-press" key={name} onClick={() => setSelectedPet(selectedPet === name ? null : name)} style={{
            display: 'flex', alignItems: 'center', gap: Spacing.sm, padding: `${Spacing.sm}px ${Spacing.lg}px`, borderRadius: Radius.pill,
            backgroundColor: selectedPet === name ? Colors.primaryPale : Colors.surfaceSecondary,
            border: `2px solid ${selectedPet === name ? Colors.primary : 'transparent'}`, cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Icon size={20} color={selectedPet === name ? Colors.primary : Colors.inkSecondary} />
            <span style={{ fontWeight: Weight.bold, color: selectedPet === name ? Colors.primary : Colors.inkSecondary }}>{name}</span>
          </button>
        ))}
      </div>

      {/* Start/Stop */}
      <button className="btn-press" onClick={toggleWalk} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Spacing.md,
        padding: Spacing.xl, borderRadius: Radius.xl, fontSize: Font.title2, fontWeight: Weight.bold, color: Colors.inkInverse, cursor: 'pointer',
        backgroundColor: isWalking ? Colors.error : Colors.success,
        boxShadow: `0 8px 24px ${isWalking ? 'rgba(212,96,90,0.3)' : 'rgba(110,175,123,0.3)'}`,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {isWalking ? <Square size={28} color={Colors.inkInverse} /> : <Play size={28} color={Colors.inkInverse} />}
        {isWalking ? 'Stop Walk' : 'Start Walk'}
      </button>

      {/* Current Walk Stats */}
      {isWalking && (
        <GradientCard colors={[Colors.primary, Colors.primaryLight]} style={{ marginTop: Spacing.xxl, textAlign: 'center' as const }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: Font.body }}>Current Walk</div>
          <div style={{ color: Colors.inkInverse, fontSize: 32, fontWeight: Weight.bold, fontVariantNumeric: 'tabular-nums', margin: `${Spacing.sm}px 0` }}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: Spacing.md }}>
            {[{ Icon: Footprints, val: steps, lbl: 'Steps' }, { Icon: MapPin, val: estimateDistanceKm(steps).toFixed(2), lbl: 'km' }, { Icon: Flame, val: estimateCalories(steps), lbl: 'cal' }].map(s => (
              <div key={s.lbl} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}><s.Icon size={16} color="rgba(255,255,255,0.7)" /></div>
                <div style={{ color: Colors.inkInverse, fontSize: Font.title3, fontWeight: Weight.bold }}>{s.val}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: Font.xs }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </GradientCard>
      )}

      {/* Today's Summary */}
      <SectionHeader title="Today's Summary" />
      <div style={{ display: 'flex', gap: Spacing.sm, marginBottom: Spacing.xxl }}>
        {[{ Icon: Footprints, val: totalSteps, lbl: 'Total Steps', color: Colors.primary },
          { Icon: MapPin, val: estimateDistanceKm(totalSteps).toFixed(1), lbl: 'km walked', color: Colors.success },
          { Icon: Flame, val: estimateCalories(totalSteps), lbl: 'Calories', color: Colors.accent },
        ].map(s => (
          <Card key={s.lbl} style={{ flex: 1, textAlign: 'center' as const, padding: Spacing.md }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><s.Icon size={18} color={s.color} /></div>
            <div style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, marginTop: Spacing.xs }}>{s.val}</div>
            <div style={{ fontSize: Font.xs, color: Colors.inkSecondary, textAlign: 'center' }}>{s.lbl}</div>
          </Card>
        ))}
      </div>

      {/* Weekly Chart */}
      <SectionHeader title="This Week" />
      <Card style={{ marginBottom: Spacing.xxl }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: 120, alignItems: 'flex-end' }}>
          {WEEKLY_STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 20, height: 100, backgroundColor: Colors.surfaceSecondary, borderRadius: 6, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: `${(s / maxWeekly) * 100}%`, backgroundColor: i === 6 ? Colors.primary : `${Colors.primary}60`, borderRadius: 6 }} />
              </div>
              <span style={{ fontSize: Font.xs, color: Colors.inkSecondary, marginTop: Spacing.xs }}>{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <SectionHeader title="Walk Achievements" />
      {[{ Icon: Footprints, title: 'First Walk', desc: 'Complete your first walk', done: true, color: Colors.primary },
        { Icon: Target, title: '5K Steps', desc: 'Walk 5,000 steps in a day', done: true, color: Colors.success },
        { Icon: Flame, title: '7 Day Streak', desc: 'Walk every day for a week', done: false, color: Colors.secondary },
        { Icon: Trophy, title: 'Marathon Walker', desc: 'Walk 42 km total', done: false, color: Colors.warning },
      ].map(a => (
        <Card key={a.title} style={{ marginBottom: Spacing.sm }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
            <a.Icon size={28} color={a.done ? a.color : Colors.hairline} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: Weight.bold, color: a.done ? Colors.ink : Colors.inkTertiary }}>{a.title}</div>
              <div style={{ color: Colors.inkSecondary, fontSize: Font.sm }}>{a.desc}</div>
            </div>
            {a.done ? <CheckCircle size={28} color={Colors.success} /> : <Circle size={28} color={Colors.hairline} />}
          </div>
        </Card>
      ))}

      {/* Walk Summary Modal */}
      {showSummary && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal-sheet" style={{ backgroundColor: Colors.surface, borderRadius: `${Radius.xxl}px ${Radius.xxl}px 0 0`, padding: Spacing.xxl, width: '100%', maxWidth: 430, textAlign: 'center' }}>
            <Trophy size={48} color={Colors.warning} />
            <h2 style={{ fontSize: Font.title2, fontWeight: Weight.bold, color: Colors.ink, margin: `${Spacing.md}px 0` }}>Great Walk!</h2>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: `${Spacing.lg}px 0` }}>
              {[{ val: steps, lbl: 'Steps' }, { val: `${estimateDistanceKm(steps).toFixed(2)} km`, lbl: 'Distance' }, { val: `${mins} min`, lbl: 'Time' }].map(s => (
                <div key={s.lbl}><div style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{s.val}</div><div style={{ color: Colors.inkSecondary }}>{s.lbl}</div></div>
              ))}
            </div>
            <GradientCard colors={[Colors.warning, Colors.secondary]} style={{ margin: `${Spacing.lg}px 0`, textAlign: 'center' as const }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: Spacing.sm }}>
                <Star size={20} color={Colors.inkInverse} />
                <span style={{ color: Colors.inkInverse, fontWeight: Weight.bold, fontSize: Font.body }}>+{calculatePoints(steps, mins)} points earned!</span>
              </div>
            </GradientCard>
            <Button label="Done" onPress={finishWalk} size="large" />
          </div>
        </div>
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}
