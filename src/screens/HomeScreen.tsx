import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';
import { GradientCard } from '../components/GradientCard';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/Badge';
import { PET_EMOJI } from '../models/types';

const DEMO_PETS = [
  { name: 'Luna', type: 'dog' as const, status: 'Healthy', color: Colors.dog },
  { name: 'Milo', type: 'cat' as const, status: 'Healthy', color: Colors.cat },
  { name: 'Coco', type: 'rabbit' as const, status: 'Checkup due', color: Colors.rabbit },
];

export function HomeScreen({ navigation: tabNav }: any) {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>W</Text>
          </View>
          <Text style={styles.appTitle}>Waggly</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <Text style={{ fontSize: 14 }}>🔥</Text>
            <Text style={styles.streakText}>7</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Ionicons name="star" size={14} color="#fff" />
            <Text style={styles.pointsText}>1,250</Text>
          </View>
        </View>
      </View>

      {/* Welcome Card */}
      <GradientCard colors={Gradients.primary} style={styles.welcomeCard}>
        <View style={styles.welcomeRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeTitle}>Good morning! 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Your pets are counting on you today!
            </Text>
          </View>
          <Text style={{ fontSize: 44 }}>🐾</Text>
        </View>
        <View style={styles.tipBox}>
          <Text style={{ fontSize: 16 }}>💡</Text>
          <Text style={styles.tipText}>
            Tip: Regular brushing reduces shedding by up to 90%!
          </Text>
        </View>
      </GradientCard>

      {/* My Pets */}
      <SectionHeader
        title="My Pets"
        actionLabel="See All"
        onAction={() => tabNav.navigate('Pets')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.petCarousel}
      >
        {DEMO_PETS.map((pet) => (
          <View
            key={pet.name}
            style={[styles.petMiniCard, { backgroundColor: pet.color + '18' }]}
          >
            <Text style={{ fontSize: 32 }}>{PET_EMOJI[pet.type]}</Text>
            <Text style={styles.petMiniName}>{pet.name}</Text>
            <Text
              style={[
                styles.petMiniStatus,
                { color: pet.status === 'Healthy' ? Colors.success : Colors.warning },
              ]}
            >
              {pet.status}
            </Text>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addPetCard}
          onPress={() => navigation.navigate('AddPet')}
        >
          <Ionicons name="add-circle-outline" size={32} color={Colors.textLight} />
          <Text style={styles.addPetText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Today's Walk */}
      <SectionHeader title="Today's Walk" />
      <Card onPress={() => tabNav.navigate('Walk')} style={styles.walkCard}>
        <View style={styles.walkRow}>
          <View style={styles.walkCircle}>
            <Text style={styles.walkPercent}>47%</Text>
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.lg }}>
            <Text style={styles.walkSteps}>2,340 / 5,000 steps</Text>
            <Text style={styles.walkDist}>1.64 km walked today</Text>
          </View>
          <View style={styles.walkNowBtn}>
            <Text style={styles.walkNowText}>Walk Now</Text>
          </View>
        </View>
      </Card>

      {/* Reminders */}
      <SectionHeader title="Reminders" />
      <Card style={{ marginBottom: Spacing.sm }}>
        <View style={styles.reminderRow}>
          <Text style={{ fontSize: 24 }}>💉</Text>
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.reminderTitle}>Luna - Rabies Booster</Text>
            <Text style={styles.reminderSub}>Due in 25 days</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </View>
      </Card>
      <Card style={{ marginBottom: Spacing.lg }}>
        <View style={styles.reminderRow}>
          <Text style={{ fontSize: 24 }}>💊</Text>
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.reminderTitle}>Milo - Deworming</Text>
            <Text style={styles.reminderSub}>Due in 41 days</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </View>
      </Card>

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" />
      <View style={styles.actionsGrid}>
        {[
          { icon: 'medical', label: 'AI Diagnosis', color: Colors.primary, tab: 'Diagnosis' },
          { icon: 'paw', label: 'Add Pet', color: Colors.secondary, screen: 'AddPet' },
          { icon: 'bag-handle', label: 'Shop', color: Colors.accent, tab: 'Shop' },
          { icon: 'trophy', label: 'Badges', color: Colors.success, tab: 'Profile' },
        ].map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionCard}
            onPress={() => {
              if (action.tab) tabNav.navigate(action.tab);
              else if (action.screen) navigation.navigate(action.screen);
            }}
          >
            <Ionicons name={action.icon as any} size={32} color={action.color} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Products */}
      <SectionHeader
        title="Featured Products"
        actionLabel="See All"
        onAction={() => tabNav.navigate('Shop')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: Spacing.xxxl }}
      >
        {[
          { name: 'Royal Canin Adult', price: '$45.99', old: '$54.99', cat: 'Food' },
          { name: 'Interactive Puzzle', price: '$19.99', old: null, cat: 'Toys' },
          { name: 'FURminator Brush', price: '$29.99', old: '$39.99', cat: 'Grooming' },
        ].map((p) => (
          <View key={p.name} style={styles.featuredCard}>
            <View style={styles.featuredImg}>
              <Ionicons name="bag-outline" size={32} color={Colors.primary + '60'} />
            </View>
            <View style={{ padding: Spacing.sm }}>
              <Text style={styles.featuredName} numberOfLines={1}>{p.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.featuredPrice}>{p.price}</Text>
                {p.old && <Text style={styles.featuredOldPrice}>{p.old}</Text>}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  appTitle: { fontSize: FontSize.xxl, fontWeight: '700', marginLeft: Spacing.sm, color: Colors.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  streakText: { fontWeight: '700', color: Colors.error, fontSize: FontSize.sm },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  pointsText: { fontWeight: '700', color: '#fff', fontSize: FontSize.sm },
  welcomeCard: { marginBottom: Spacing.xxl },
  welcomeRow: { flexDirection: 'row', alignItems: 'center' },
  welcomeTitle: { color: '#fff', fontSize: FontSize.xxl, fontWeight: '700' },
  welcomeSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.md, marginTop: 4 },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  tipText: { color: '#fff', fontSize: FontSize.sm, flex: 1 },
  petCarousel: { marginBottom: Spacing.xxl },
  petMiniCard: {
    width: 90,
    height: 110,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  petMiniName: { fontWeight: '700', fontSize: FontSize.sm, marginTop: 6, color: Colors.text },
  petMiniStatus: { fontSize: FontSize.xs, fontWeight: '600', marginTop: 2 },
  addPetCard: {
    width: 90,
    height: 110,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPetText: { color: Colors.textLight, fontSize: FontSize.xs, marginTop: 4 },
  walkCard: { marginBottom: Spacing.xxl },
  walkRow: { flexDirection: 'row', alignItems: 'center' },
  walkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walkPercent: { fontWeight: '700', fontSize: FontSize.sm },
  walkSteps: { fontWeight: '700', fontSize: FontSize.base },
  walkDist: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
  walkNowBtn: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  walkNowText: { color: '#fff', fontWeight: '700', fontSize: FontSize.sm },
  reminderRow: { flexDirection: 'row', alignItems: 'center' },
  reminderTitle: { fontWeight: '600', fontSize: FontSize.md, color: Colors.text },
  reminderSub: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  actionCard: {
    width: (Dimensions.get('window').width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionLabel: { fontWeight: '600', marginTop: Spacing.sm, color: Colors.text },
  featuredCard: {
    width: 150,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImg: {
    height: 80,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredName: { fontWeight: '700', fontSize: FontSize.sm, color: Colors.text },
  featuredPrice: { color: Colors.primary, fontWeight: '700', marginTop: 4 },
  featuredOldPrice: {
    color: Colors.textLight,
    fontSize: FontSize.xs,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
});
