import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { BADGES, BadgeId } from '../models/types';

const EARNED_BADGES: BadgeId[] = [
  'firstPet', 'firstDiagnosis', 'streak7Days', 'points100', 'points500', 'vetVisit5',
];

const LEADERBOARD = [
  { rank: 1, name: 'Sophie M.', points: 3450, icon: '👑' },
  { rank: 2, name: 'Lucas D.', points: 2890, icon: '🥈' },
  { rank: 3, name: 'Emma R.', points: 2340, icon: '🥉' },
  { rank: 4, name: 'You', points: 1250, icon: '🐾' },
  { rank: 5, name: 'Pierre L.', points: 980, icon: '' },
];

export function ProfileScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={Gradients.primary} style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.name}>Pet Lover</Text>
        <Text style={styles.level}>Level 12 - Health Champion</Text>
        <View style={styles.statsRow}>
          <HeaderStat value="1,250" label="Points" />
          <HeaderStat value="7" label="Day Streak" />
          <HeaderStat value="3" label="Pets" />
          <HeaderStat value="6" label="Badges" />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Level Progress */}
        <Card style={styles.levelCard}>
          <View style={styles.levelRow}>
            <Text style={styles.levelTitle}>Level 12</Text>
            <Text style={styles.levelXP}>1,250 / 2,000 XP</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: '62.5%' }]} />
          </View>
          <Text style={styles.levelHint}>750 XP to Level 13</Text>
        </Card>

        {/* Premium */}
        <LinearGradient colors={Gradients.sunset} style={styles.premiumCard}>
          <View style={styles.premiumIcon}>
            <Ionicons name="diamond" size={28} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.lg }}>
            <Text style={styles.premiumTitle}>Go Premium</Text>
            <Text style={styles.premiumSub}>Unlimited AI diagnoses, exclusive badges & more!</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </LinearGradient>

        {/* Badges */}
        <SectionHeader title="My Badges" />
        <View style={styles.badgesGrid}>
          {BADGES.map((badge) => {
            const earned = EARNED_BADGES.includes(badge.id);
            return (
              <TouchableOpacity
                key={badge.id}
                style={[styles.badgeCard, earned && styles.badgeCardEarned]}
                onPress={() => Alert.alert(badge.name, `${badge.icon} ${badge.description}`)}
              >
                <Text style={{ fontSize: 28, opacity: earned ? 1 : 0.3 }}>{badge.icon}</Text>
                <Text style={[styles.badgeName, !earned && { color: Colors.textLight }]}>
                  {badge.name}
                </Text>
                {!earned && <Ionicons name="lock-closed" size={12} color={Colors.textLight} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Leaderboard */}
        <SectionHeader title="Leaderboard" />
        <Card>
          {LEADERBOARD.map((l) => {
            const isYou = l.name === 'You';
            return (
              <View key={l.rank} style={[styles.leaderRow, isYou && { backgroundColor: Colors.primary + '08' }]}>
                <View style={styles.leaderRank}>
                  <Text style={{ fontSize: l.icon ? 18 : 14, fontWeight: '700' }}>
                    {l.icon || `#${l.rank}`}
                  </Text>
                </View>
                <Text style={[styles.leaderName, isYou && { color: Colors.primary, fontWeight: '700' }]}>
                  {l.name}
                </Text>
                <Text style={[styles.leaderPts, isYou && { color: Colors.primary }]}>
                  {l.points} pts
                </Text>
              </View>
            );
          })}
        </Card>

        {/* Activity Summary */}
        <SectionHeader title="Activity Summary" />
        <Card>
          <ActivityRow icon="medical" label="AI Diagnoses" value="8" color={Colors.primary} />
          <View style={styles.divider} />
          <ActivityRow icon="walk" label="Walks" value="42" color={Colors.success} />
          <View style={styles.divider} />
          <ActivityRow icon="shield-checkmark" label="Health Records" value="15" color={Colors.accent} />
          <View style={styles.divider} />
          <ActivityRow icon="bag-handle" label="Shop Visits" value="23" color={Colors.secondary} />
        </Card>

        {/* Account */}
        <SectionHeader title="Account" />
        <Card style={{ padding: 0 }}>
          {[
            { icon: 'person-outline', label: 'Edit Profile' },
            { icon: 'notifications-outline', label: 'Notifications' },
            { icon: 'shield-outline', label: 'Privacy & Data' },
            { icon: 'help-circle-outline', label: 'Help & Support' },
          ].map((item, i) => (
            <TouchableOpacity key={item.label} style={[styles.accountRow, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.borderLight }]}>
              <Ionicons name={item.icon as any} size={22} color={Colors.textSecondary} />
              <Text style={styles.accountLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.accountRow, { borderTopWidth: 1, borderTopColor: Colors.borderLight }]}
            onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?')}
          >
            <Ionicons name="log-out-outline" size={22} color={Colors.error} />
            <Text style={[styles.accountLabel, { color: Colors.error }]}>Sign Out</Text>
            <View />
          </TouchableOpacity>
        </Card>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

function HeaderStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: FontSize.xl, fontWeight: '700' }}>{value}</Text>
      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs }}>{label}</Text>
    </View>
  );
}

function ActivityRow({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={styles.activityRow}>
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={styles.activityLabel}>{label}</Text>
      <Text style={styles.activityValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { color: '#fff', fontSize: FontSize.xxl, fontWeight: '700', marginTop: Spacing.md },
  level: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.md, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: Spacing.xl,
  },
  content: { padding: Spacing.lg },
  levelCard: { marginBottom: Spacing.xxl },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  levelTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  levelXP: { color: Colors.textSecondary, fontSize: FontSize.md },
  progressBg: {
    height: 10,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  levelHint: { color: Colors.textLight, fontSize: FontSize.sm, marginTop: Spacing.sm },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xxl,
  },
  premiumIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumTitle: { color: '#fff', fontSize: FontSize.xl, fontWeight: '700' },
  premiumSub: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.sm, marginTop: 4 },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  badgeCard: {
    width: '30%',
    aspectRatio: 0.85,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeCardEarned: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary + '30',
  },
  badgeName: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  leaderRank: { width: 40, alignItems: 'center' },
  leaderName: { flex: 1, fontSize: FontSize.base, color: Colors.text },
  leaderPts: { fontWeight: '700', color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.borderLight },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  activityLabel: { flex: 1, fontSize: FontSize.base, color: Colors.text },
  activityValue: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  accountLabel: { flex: 1, fontSize: FontSize.base, color: Colors.text },
});
