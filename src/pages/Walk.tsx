import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PawPrint, Play, Square, Flame, Star, CheckCircle, Circle, Footprints, MapPin, Target, Trophy } from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';
import { calculatePoints, estimateCalories, estimateDistanceKm } from '../services/walkService';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { usePets } from '../hooks/usePets';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import { saveWalk, subscribeToTodayWalks, subscribeToWalks } from '../services/walkFirestoreService';
import { addPoints } from '../services/userService';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import { startPedometer, stopPedometer, isPedometerAvailable } from '../services/pedometerService';
import { startWalkTracking, stopWalkTracking } from '../services/locationService';

export function WalkPage() {
  const { pets } = usePets();
  const { firebaseUser } = useAuth();
  const { t } = useI18n();
  const [isWalking, setIsWalking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [gpsDistanceKm, setGpsDistanceKm] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [todaySteps, setTodaySteps] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [showSummary, setShowSummary] = useState(false);
  const [useNativePedometer, setUseNativePedometer] = useState(false);
  const dailyGoal = 5000;
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const stepsRef = useRef<ReturnType<typeof setInterval>>();
  const totalSteps = todaySteps + steps;
  const progress = Math.min(totalSteps / dailyGoal, 1);
  const maxWeekly = Math.max(...weeklySteps, 1);

  const DAYS = [t.walk.mon, t.walk.tue, t.walk.wed, t.walk.thu, t.walk.fri, t.walk.sat, t.walk.sun];

  // Subscribe to today's walks from Firestore for real step count
  useEffect(() => {
    if (!firebaseUser) return;
    const unsubscribe = subscribeToTodayWalks(firebaseUser.uid, (walks) => {
      const total = walks.reduce((sum, w) => sum + (w.steps || 0), 0);
      setTodaySteps(total);
    });
    return unsubscribe;
  }, [firebaseUser]);

  // Subscribe to this week's walks for the weekly chart
  useEffect(() => {
    if (!firebaseUser) return;
    const unsubscribe = subscribeToWalks(firebaseUser.uid, (walks) => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
      // Build array for Mon-Sun
      const stepsPerDay = [0, 0, 0, 0, 0, 0, 0];
      walks.forEach(w => {
        const walkDate = new Date(w.startTime);
        const diffDays = Math.floor((now.getTime() - walkDate.getTime()) / (1000 * 60 * 60 * 24));
        // Convert to Mon=0 index
        const walkDayIndex = (walkDate.getDay() + 6) % 7; // Mon=0, Tue=1, ... Sun=6
        const todayIndex = (dayOfWeek + 6) % 7;
        // Only include walks from this week (within 7 days and same week)
        if (diffDays < 7 && walkDate >= getStartOfWeek(now)) {
          stepsPerDay[walkDayIndex] += w.steps || 0;
        }
      });
      setWeeklySteps(stepsPerDay);
    }, 50);
    return unsubscribe;
  }, [firebaseUser]);

  useEffect(() => {
    isPedometerAvailable().then(setUseNativePedometer);
  }, []);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearInterval(stepsRef.current);
    stopPedometer();
    stopWalkTracking();
  }, []);

  const toggleWalk = useCallback(async () => {
    if (isWalking) {
      clearInterval(timerRef.current);
      clearInterval(stepsRef.current);
      await stopPedometer();
      const gpsState = await stopWalkTracking();
      setGpsDistanceKm(gpsState.distanceKm);
      setIsWalking(false);
      setShowSummary(true);
    } else {
      setSteps(0);
      setSeconds(0);
      setGpsDistanceKm(0);
      setIsWalking(true);

      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);

      const pedometerStarted = await startPedometer((state) => {
        setSteps(state.steps);
        if (state.distanceMeters > 0) {
          setGpsDistanceKm(state.distanceMeters / 1000);
        }
      });

      startWalkTracking((gpsState) => {
        setGpsDistanceKm(gpsState.distanceKm);
        if (!pedometerStarted) {
          setSteps(gpsState.steps);
        }
      });

      if (!pedometerStarted) {
        stepsRef.current = setInterval(() => setSteps(s => s + Math.floor(Math.random() * 3) + 1), 600);
      }
    }
  }, [isWalking]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const walkDistanceKm = gpsDistanceKm > 0 ? gpsDistanceKm : estimateDistanceKm(steps);

  const finishWalk = async () => {
    if (firebaseUser) {
      const pts = calculatePoints(steps, mins);
      try {
        await saveWalk(firebaseUser.uid, {
          petId: selectedPet || undefined,
          petName: pets.find(p => p.id === selectedPet)?.name,
          startTime: new Date(Date.now() - seconds * 1000).toISOString(),
          endTime: new Date().toISOString(),
          steps,
          distanceKm: walkDistanceKm,
          durationMinutes: mins,
          caloriesBurned: estimateCalories(steps),
          pointsEarned: pts,
        });
        await addPoints(firebaseUser.uid, pts);
      } catch (e) {
        console.error('Error saving walk:', e);
      }
    }
    setSteps(0); setSeconds(0); setGpsDistanceKm(0); setShowSummary(false);
  };

  return (
    <div className="fade-in" style={{ padding: Spacing.lg, backgroundColor: Colors.background, minHeight: '100vh' }}>
      <h1 style={{ fontSize: Font.largeTitle, fontWeight: Weight.bold, color: Colors.ink, marginBottom: Spacing.lg }}>{t.walk.title}</h1>

      {/* Step Counter */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: Spacing.xxl }}>
        <div style={{
          width: 200, height: 200, borderRadius: 100, border: `10px solid ${Colors.hairline}`,
          background: `conic-gradient(${Colors.primary} ${progress * 360}deg, transparent 0deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ width: 170, height: 170, borderRadius: 85, backgroundColor: Colors.background, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <PawPrint size={28} color={Colors.primary} />
            <span style={{ fontSize: Font.hero, fontWeight: Weight.bold, color: Colors.ink }}>{totalSteps}</span>
            <span style={{ fontSize: Font.body, color: Colors.inkSecondary }}>{t.common.of} {dailyGoal} {t.common.steps.toLowerCase()}</span>
            {progress >= 1 && <span style={{ color: Colors.success, fontWeight: Weight.bold, fontSize: Font.xs, marginTop: Spacing.xs }}>{t.walk.goalReached}</span>}
          </div>
        </div>
      </div>

      {/* Pet selector */}
      <div style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink, marginBottom: Spacing.sm }}>{t.walk.walkingWith}</div>
      <div style={{ display: 'flex', gap: Spacing.sm, marginBottom: Spacing.xxl, overflowX: 'auto' }}>
        {pets.map(pet => {
          const Icon = PET_ICON_MAP[pet.type] || PawPrint;
          const active = selectedPet === pet.id;
          const color = PET_COLOR_MAP[pet.type] || Colors.primary;
          return (
            <button className="btn-press" key={pet.id} onClick={() => setSelectedPet(active ? null : pet.id)} style={{
              display: 'flex', alignItems: 'center', gap: Spacing.sm, padding: `${Spacing.sm}px ${Spacing.lg}px`, borderRadius: Radius.pill,
              backgroundColor: active ? Colors.primaryPale : Colors.surfaceSecondary,
              border: `2px solid ${active ? color : 'transparent'}`, cursor: 'pointer',
            }}>
              <Icon size={20} color={active ? color : Colors.inkSecondary} />
              <span style={{ fontWeight: Weight.bold, color: active ? color : Colors.inkSecondary }}>{pet.name}</span>
            </button>
          );
        })}
      </div>

      {/* Start/Stop */}
      <button className="btn-press" onClick={toggleWalk} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Spacing.md,
        padding: Spacing.xl, borderRadius: Radius.xl, fontSize: Font.title2, fontWeight: Weight.bold, color: Colors.inkInverse, cursor: 'pointer',
        backgroundColor: isWalking ? Colors.error : Colors.success,
        boxShadow: `0 8px 24px ${isWalking ? 'rgba(212,96,90,0.3)' : 'rgba(110,175,123,0.3)'}`,
      }}>
        {isWalking ? <Square size={28} color={Colors.inkInverse} /> : <Play size={28} color={Colors.inkInverse} />}
        {isWalking ? t.walk.stopWalk : t.walk.startWalk}
      </button>

      {/* Current Walk Stats */}
      {isWalking && (
        <GradientCard colors={[Colors.primary, Colors.primaryLight]} style={{ marginTop: Spacing.xxl, textAlign: 'center' as const }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: Font.body }}>{t.walk.currentWalk}</div>
          <div style={{ color: Colors.inkInverse, fontSize: 32, fontWeight: Weight.bold, fontVariantNumeric: 'tabular-nums', margin: `${Spacing.sm}px 0` }}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: Spacing.md }}>
            {[{ Icon: Footprints, val: steps, lbl: t.common.steps }, { Icon: MapPin, val: walkDistanceKm.toFixed(2), lbl: t.common.km }, { Icon: Flame, val: estimateCalories(steps), lbl: t.common.cal }].map(s => (
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
      <SectionHeader title={t.walk.todaysSummary} />
      <div style={{ display: 'flex', gap: Spacing.sm, marginBottom: Spacing.xxl }}>
        {[{ Icon: Footprints, val: totalSteps, lbl: t.walk.totalSteps, color: Colors.primary },
          { Icon: MapPin, val: estimateDistanceKm(totalSteps).toFixed(1), lbl: t.walk.kmWalked, color: Colors.success },
          { Icon: Flame, val: estimateCalories(totalSteps), lbl: t.walk.calories, color: Colors.accent },
        ].map(s => (
          <Card key={s.lbl} style={{ flex: 1, textAlign: 'center' as const, padding: Spacing.md }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><s.Icon size={18} color={s.color} /></div>
            <div style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, marginTop: Spacing.xs }}>{s.val}</div>
            <div style={{ fontSize: Font.xs, color: Colors.inkSecondary, textAlign: 'center' }}>{s.lbl}</div>
          </Card>
        ))}
      </div>

      {/* Weekly Chart */}
      <SectionHeader title={t.walk.thisWeek} />
      <Card style={{ marginBottom: Spacing.xxl }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: 120, alignItems: 'flex-end' }}>
          {weeklySteps.map((s, i) => {
            const todayIndex = (new Date().getDay() + 6) % 7;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 20, height: 100, backgroundColor: Colors.surfaceSecondary, borderRadius: 6, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: `${(s / maxWeekly) * 100}%`, backgroundColor: i === todayIndex ? Colors.primary : `${Colors.primary}60`, borderRadius: 6 }} />
                </div>
                <span style={{ fontSize: Font.xs, color: i === todayIndex ? Colors.primary : Colors.inkSecondary, fontWeight: i === todayIndex ? Weight.bold : Weight.regular, marginTop: Spacing.xs }}>{DAYS[i]}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Achievements */}
      <SectionHeader title={t.walk.achievements} />
      {[{ Icon: Footprints, title: t.walk.firstWalk, desc: t.walk.firstWalkDesc, done: true, color: Colors.primary },
        { Icon: Target, title: t.walk.fiveKSteps, desc: t.walk.fiveKStepsDesc, done: true, color: Colors.success },
        { Icon: Flame, title: t.walk.sevenDayStreak, desc: t.walk.sevenDayStreakDesc, done: false, color: Colors.secondary },
        { Icon: Trophy, title: t.walk.marathonWalker, desc: t.walk.marathonWalkerDesc, done: false, color: Colors.warning },
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
            <h2 style={{ fontSize: Font.title2, fontWeight: Weight.bold, color: Colors.ink, margin: `${Spacing.md}px 0` }}>{t.walk.greatWalk}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: `${Spacing.lg}px 0` }}>
              {[{ val: steps, lbl: t.common.steps }, { val: `${walkDistanceKm.toFixed(2)} ${t.common.km}`, lbl: t.walk.distance }, { val: `${mins} min`, lbl: t.walk.time }].map(s => (
                <div key={s.lbl}><div style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{s.val}</div><div style={{ color: Colors.inkSecondary }}>{s.lbl}</div></div>
              ))}
            </div>
            <GradientCard colors={[Colors.warning, Colors.secondary]} style={{ margin: `${Spacing.lg}px 0`, textAlign: 'center' as const }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: Spacing.sm }}>
                <Star size={20} color={Colors.inkInverse} />
                <span style={{ color: Colors.inkInverse, fontWeight: Weight.bold, fontSize: Font.body }}>{t.walk.pointsEarned.replace('{pts}', String(calculatePoints(steps, mins)))}</span>
              </div>
            </GradientCard>
            <Button label={t.common.done} onPress={finishWalk} size="large" />
          </div>
        </div>
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
