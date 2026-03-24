import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { IOSButton } from '../components/IOSButton';
import { calculatePoints, estimateCalories, estimateDistanceKm } from '../services/walkService';
import { PET_EMOJI } from '../models/types';

const WEEKLY_STEPS = [3200, 4100, 2800, 5200, 3900, 4500, 2340];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WalkScreen() {
  const [isWalking, setIsWalking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [dailyGoal] = useState(5000);
  const [todaySteps, setTodaySteps] = useState(2340);
  const [showSummary, setShowSummary] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const stepsRef = useRef<ReturnType<typeof setInterval>>();

  const totalSteps = todaySteps + steps;
  const progress = Math.min(totalSteps / dailyGoal, 1);
  const maxWeekly = Math.max(...WEEKLY_STEPS);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stepsRef.current) clearInterval(stepsRef.current);
    };
  }, []);

  const toggleWalk = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (isWalking) {
      clearInterval(timerRef.current);
      clearInterval(stepsRef.current);
      setIsWalking(false);
      setShowSummary(true);
    } else {
      setSteps(0);
      setSeconds(0);
      setIsWalking(true);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      stepsRef.current = setInterval(() => {
        setSteps((s) => s + Math.floor(Math.random() * 3) + 1);
      }, 600);
    }
  }, [isWalking]);

  const finishWalk = () => {
    setTodaySteps((t) => t + steps);
    setSteps(0);
    setSeconds(0);
    setShowSummary(false);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Walk</Text>

      {/* Step Counter */}
      <View style={styles.counterWrap}>
        <View style={styles.counterOuter}>
          <View style={[styles.counterProgress, { transform: [{ rotate: `${progress * 360}deg` }] }]} />
          <View style={styles.counterInner}>
            <Ionicons
              name={isWalking ? 'walk' : 'paw'}
              size={28}
              color={Colors.primary}
            />
            <Text style={styles.counterSteps}>{totalSteps}</Text>
            <Text style={styles.counterGoal}>of {dailyGoal} steps</Text>
            {progress >= 1 && (
              <Text style={styles.goalReached}>Goal reached! 🎉</Text>
            )}
          </View>
        </View>
      </View>

      {/* Pet selector */}
      <Text style={styles.sectionLabel}>Walking with</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.xxl }}>
        {[
          { name: 'Luna', type: 'dog' as const },
          { name: 'Milo', type: 'cat' as const },
          { name: 'Coco', type: 'rabbit' as const },
        ].map((pet) => (
          <TouchableOpacity
            key={pet.name}
            style={[styles.petChip, selectedPet === pet.name && styles.petChipActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedPet(selectedPet === pet.name ? null : pet.name);
            }}
          >
            <Text style={{ fontSize: 20 }}>{PET_EMOJI[pet.type]}</Text>
            <Text style={[styles.petChipText, selectedPet === pet.name && { color: Colors.primary }]}>
              {pet.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Start/Stop */}
      <TouchableOpacity
        style={[styles.walkBtn, { backgroundColor: isWalking ? Colors.error : Colors.success }]}
        onPress={toggleWalk}
        activeOpacity={0.85}
      >
        <Ionicons name={isWalking ? 'stop' : 'play'} size={28} color="#fff" />
        <Text style={styles.walkBtnText}>{isWalking ? 'Stop Walk' : 'Start Walk'}</Text>
      </TouchableOpacity>

      {/* Current Walk Stats */}
      {isWalking && (
        <GradientCard colors={Gradients.primary} style={{ marginTop: Spacing.xxl }}>
          <Text style={styles.curWalkLabel}>Current Walk</Text>
          <Text style={styles.curWalkTimer}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </Text>
          <View style={styles.curStatsRow}>
            <CurStat icon="walk" value={String(steps)} label="Steps" />
            <CurStat icon="navigate" value={estimateDistanceKm(steps).toFixed(2)} label="km" />
            <CurStat icon="flame" value={String(estimateCalories(steps))} label="cal" />
          </View>
        </GradientCard>
      )}

      {/* Today's summary */}
      <SectionHeader title="Today's Summary" />
      <View style={styles.miniStatsRow}>
        <MiniStat icon="walk" value={String(totalSteps)} label="Total Steps" color={Colors.primary} />
        <MiniStat icon="navigate" value={estimateDistanceKm(totalSteps).toFixed(1)} label="km walked" color={Colors.success} />
        <MiniStat icon="flame" value={String(estimateCalories(totalSteps))} label="Calories" color={Colors.accent} />
      </View>

      {/* Weekly chart */}
      <SectionHeader title="This Week" />
      <Card style={styles.chartCard}>
        <View style={styles.barsRow}>
          {WEEKLY_STEPS.map((s, i) => (
            <View key={i} style={styles.barCol}>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${(s / maxWeekly) * 100}%`,
                      backgroundColor: i === 6 ? Colors.primary : Colors.primary + '60',
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{DAYS[i]}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Achievements */}
      <SectionHeader title="Walk Achievements" />
      {[
        { icon: '🏃', title: 'First Walk', desc: 'Complete your first walk', done: true },
        { icon: '🎯', title: '5K Steps', desc: 'Walk 5,000 steps in a day', done: true },
        { icon: '🔥', title: '7 Day Streak', desc: 'Walk every day for a week', done: false },
        { icon: '🏆', title: 'Marathon Walker', desc: 'Walk 42 km total', done: false },
      ].map((a) => (
        <Card key={a.title} style={styles.achieveCard}>
          <View style={styles.achieveRow}>
            <Text style={{ fontSize: 28, opacity: a.done ? 1 : 0.4 }}>{a.icon}</Text>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Text style={[styles.achieveTitle, !a.done && { color: Colors.inkTertiary }]}>{a.title}</Text>
              <Text style={styles.achieveDesc}>{a.desc}</Text>
            </View>
            <Ionicons
              name={a.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={a.done ? Colors.success : Colors.hairline}
            />
          </View>
        </Card>
      ))}

      <View style={{ height: 40 }} />

      {/* Walk Summary Modal */}
      <Modal visible={showSummary} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 48 }}>🎉</Text>
            <Text style={styles.modalTitle}>Great Walk!</Text>
            <View style={styles.modalStatsRow}>
              <SummaryStat value={String(steps)} label="Steps" />
              <SummaryStat value={`${estimateDistanceKm(steps).toFixed(2)} km`} label="Distance" />
              <SummaryStat value={`${mins} min`} label="Time" />
            </View>
            <GradientCard colors={Gradients.gold} style={{ width: '100%', marginVertical: Spacing.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="star" size={20} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: Weight.bold, fontSize: 16, marginLeft: 8 }}>
                  +{calculatePoints(steps, mins)} points earned!
                </Text>
              </View>
            </GradientCard>
            <IOSButton label="Done" onPress={finishWalk} size="large" style={{ width: '100%' }} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function CurStat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Ionicons name={icon as any} size={18} color="rgba(255,255,255,0.7)" />
      <Text style={{ color: '#fff', fontSize: Font.title3, fontWeight: Weight.bold }}>{value}</Text>
      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: Font.xs }}>{label}</Text>
    </View>
  );
}

function MiniStat({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <Card style={styles.miniStatCard}>
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </Card>
  );
}

function SummaryStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{value}</Text>
      <Text style={{ color: Colors.inkSecondary }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  headerTitle: { fontSize: Font.largeTitle, fontWeight: Weight.bold, color: Colors.ink, marginBottom: Spacing.lg },
  counterWrap: { alignItems: 'center', marginBottom: Spacing.xxl },
  counterOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: Colors.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  counterProgress: { position: 'absolute', width: '100%', height: '100%' },
  counterInner: { alignItems: 'center' },
  counterSteps: { fontSize: Font.hero, fontWeight: Weight.bold, color: Colors.ink },
  counterGoal: { fontSize: Font.body, color: Colors.inkSecondary },
  goalReached: { color: Colors.success, fontWeight: Weight.bold, fontSize: Font.xs, marginTop: 4 },
  sectionLabel: { fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink, marginBottom: Spacing.sm },
  petChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.pill,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: Spacing.sm,
  },
  petChipActive: { backgroundColor: Colors.primaryPale, borderColor: Colors.primary },
  petChipText: { fontWeight: Weight.bold, color: Colors.inkSecondary },
  walkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    borderRadius: Radius.xl,
    gap: Spacing.md,
    ...Shadow.medium,
  },
  walkBtnText: { color: '#fff', fontSize: Font.title2, fontWeight: Weight.bold },
  curWalkLabel: { color: 'rgba(255,255,255,0.7)', fontSize: Font.body, textAlign: 'center' },
  curWalkTimer: {
    color: '#fff',
    fontSize: 32,
    fontWeight: Weight.bold,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    marginVertical: Spacing.sm,
  },
  curStatsRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: Spacing.md },
  miniStatsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xxl },
  miniStatCard: { flex: 1, alignItems: 'center', padding: Spacing.md },
  miniStatValue: { fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, marginTop: 4 },
  miniStatLabel: { fontSize: Font.xs, color: Colors.inkSecondary, textAlign: 'center' },
  chartCard: { marginBottom: Spacing.xxl },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', height: 120, alignItems: 'flex-end' },
  barCol: { alignItems: 'center', flex: 1 },
  barBg: { width: 20, height: 100, backgroundColor: Colors.surfaceSecondary, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: Font.xs, color: Colors.inkSecondary, marginTop: 4 },
  achieveCard: { marginBottom: Spacing.sm },
  achieveRow: { flexDirection: 'row', alignItems: 'center' },
  achieveTitle: { fontWeight: Weight.bold, color: Colors.ink },
  achieveDesc: { color: Colors.inkSecondary, fontSize: Font.sm },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  modalTitle: { fontSize: Font.title2, fontWeight: Weight.bold, color: Colors.ink, marginVertical: Spacing.md },
  modalStatsRow: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginVertical: Spacing.lg },
});
