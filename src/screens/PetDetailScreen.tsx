import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/Badge';
import { SectionHeader } from '../components/SectionHeader';
import { Pet, PET_EMOJI } from '../models/types';

function getAge(birthDate?: string): string {
  if (!birthDate) return 'N/A';
  const birth = new Date(birthDate);
  return `${new Date().getFullYear() - birth.getFullYear()} yrs`;
}

export function PetDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const pet: Pet = route.params.pet;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <LinearGradient colors={Gradients.primary} style={styles.hero}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.heroAvatar}>
          <Text style={{ fontSize: 44 }}>{PET_EMOJI[pet.type]}</Text>
        </View>
        <Text style={styles.heroName}>{pet.name}</Text>
        <Text style={styles.heroBreed}>{pet.breed ?? pet.type}</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard icon="calendar-outline" label="Age" value={getAge(pet.birthDate)} color={Colors.primary} />
          <StatCard icon="fitness-outline" label="Weight" value={pet.weight ? `${pet.weight} kg` : 'N/A'} color={Colors.secondary} />
          <StatCard
            icon={pet.gender === 'male' ? 'male' : 'female'}
            label="Gender"
            value={pet.gender}
            color={Colors.accent}
          />
        </View>

        {/* Health Score */}
        <LinearGradient colors={Gradients.forest} style={styles.healthScore}>
          <View style={styles.healthCircle}>
            <Text style={styles.healthValue}>92</Text>
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.lg }}>
            <Text style={styles.healthTitle}>Health Score</Text>
            <Text style={styles.healthSub}>Excellent! All vaccinations up to date.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </LinearGradient>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.actionsRow}>
          {[
            { icon: 'medical', label: 'Health\nRecord', color: Colors.primary },
            { icon: 'add-circle-outline', label: 'Add\nRecord', color: Colors.success },
            { icon: 'shield-checkmark', label: 'Vaccine', color: Colors.accent },
          ].map((a) => (
            <TouchableOpacity
              key={a.label}
              style={[styles.actionBtn, { backgroundColor: a.color + '12' }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Ionicons name={a.icon as any} size={28} color={a.color} />
              <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Records */}
        <SectionHeader title="Health Records" actionLabel="See All" onAction={() => {}} />
        {[
          { emoji: '💉', title: 'Rabies Vaccine', date: '15 Mar 2026' },
          { emoji: '💊', title: 'Deworming', date: '01 Feb 2026' },
          { emoji: '🏥', title: 'Annual Checkup', date: '20 Jan 2026' },
        ].map((r) => (
          <Card key={r.title} style={styles.recordCard}>
            <View style={styles.recordRow}>
              <Text style={{ fontSize: 24 }}>{r.emoji}</Text>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.recordTitle}>{r.title}</Text>
                <Text style={styles.recordDate}>{r.date}</Text>
              </View>
              <StatusBadge label="Done" color={Colors.success} small />
            </View>
          </Card>
        ))}

        {/* Microchip */}
        {pet.microchipId && (
          <Card style={{ marginTop: Spacing.md }}>
            <View style={styles.recordRow}>
              <Ionicons name="qr-code" size={24} color={Colors.primary} />
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.recordTitle}>Microchip ID</Text>
                <Text style={styles.recordDate}>{pet.microchipId}</Text>
              </View>
            </View>
          </Card>
        )}

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: {
    paddingTop: 60,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroName: { color: '#fff', fontSize: Font.title1, fontWeight: Weight.bold, marginTop: Spacing.md },
  heroBreed: { color: 'rgba(255,255,255,0.7)', fontSize: Font.body },
  content: { padding: Spacing.lg },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadow.soft,
  },
  statValue: { fontSize: Font.bodyLarge, fontWeight: Weight.bold, marginTop: Spacing.sm, color: Colors.ink },
  statLabel: { fontSize: Font.xs, color: Colors.inkSecondary, marginTop: 2 },
  healthScore: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    marginBottom: Spacing.xxl,
  },
  healthCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthValue: { color: '#fff', fontSize: Font.title2, fontWeight: Weight.bold },
  healthTitle: { color: '#fff', fontSize: Font.bodyLarge, fontWeight: Weight.bold },
  healthSub: { color: 'rgba(255,255,255,0.7)', fontSize: Font.body, marginTop: 4 },
  actionsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xxl },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
  },
  actionLabel: { fontSize: Font.xs, fontWeight: Weight.semibold, textAlign: 'center', marginTop: Spacing.sm },
  recordCard: { marginBottom: Spacing.sm },
  recordRow: { flexDirection: 'row', alignItems: 'center' },
  recordTitle: { fontWeight: Weight.semibold, fontSize: Font.body, color: Colors.ink },
  recordDate: { color: Colors.inkSecondary, fontSize: Font.sm, marginTop: 2 },
});
