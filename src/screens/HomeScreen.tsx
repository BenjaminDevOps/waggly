import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { GradientCard } from '../components/GradientCard';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/Badge';
import { IOSButton } from '../components/IOSButton';
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
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight');
            navigation.navigate('AddPet');
          }}
        >
          <Ionicons name="add-circle-outline" size={32} color={Colors.inkTertiary} />
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
          <Ionicons name="chevron-forward" size={20} color={Colors.inkTertiary} />
        </View>
      </Card>
      <Card style={{ marginBottom: Spacing.lg }}>
        <View style={styles.reminderRow}>
          <Text style={{ fontSize: 24 }}>💊</Text>
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.reminderTitle}>Milo - Deworming</Text>
            <Text style={styles.reminderSub}>Due in 41 days</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.inkTertiary} />
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
              ReactNativeHapticFeedback.trigger('impactLight');
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
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { color: '#fff', fontWeight: Weight.heavy, fontSize: 18 },
  appTitle: { fontSize: Font.title2, fontWeight: Weight.bold, marginLeft: Spacing.sm, color: Colors.ink },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorPale,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    gap: 4,
  },
  streakText: { fontWeight: Weight.bold, color: Colors.error, fontSize: Font.sm },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    gap: 4,
  },
  pointsText: { fontWeight: Weight.bold, color: '#fff', fontSize: Font.sm },
  welcomeCard: { marginBottom: Spacing.xxl },
  welcomeRow: { flexDirection: 'row', alignItems: 'center' },
  welcomeTitle: { color: '#fff', fontSize: Font.title2, fontWeight: Weight.bold },
  welcomeSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: Font.body, marginTop: 4 },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  tipText: { color: '#fff', fontSize: Font.sm, flex: 1 },
  petCarousel: { marginBottom: Spacing.xxl },
  petMiniCard: {
    width: 100,
    height: 120,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  petMiniName: { fontWeight: Weight.bold, fontSize: Font.sm, marginTop: 6, color: Colors.ink },
  petMiniStatus: { fontSize: Font.xs, fontWeight: Weight.semibold, marginTop: 2 },
  addPetCard: {
    width: 100,
    height: 120,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.hairline,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPetText: { color: Colors.inkTertiary, fontSize: Font.xs, marginTop: 4 },
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
  walkPercent: { fontWeight: Weight.bold, fontSize: Font.sm },
  walkSteps: { fontWeight: Weight.bold, fontSize: Font.body },
  walkDist: { color: Colors.inkSecondary, fontSize: Font.sm, marginTop: 2 },
  walkNowBtn: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  walkNowText: { color: '#fff', fontWeight: Weight.bold, fontSize: Font.sm },
  reminderRow: { flexDirection: 'row', alignItems: 'center' },
  reminderTitle: { fontWeight: Weight.semibold, fontSize: Font.body, color: Colors.ink },
  reminderSub: { color: Colors.inkSecondary, fontSize: Font.sm, marginTop: 2 },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  actionCard: {
    width: (Dimensions.get('window').width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.soft,
  },
  actionLabel: { fontWeight: Weight.semibold, marginTop: Spacing.sm, color: Colors.ink },
  featuredCard: {
    width: 155,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginRight: Spacing.md,
    overflow: 'hidden',
    ...Shadow.soft,
  },
  featuredImg: {
    height: 80,
    backgroundColor: Colors.primaryPale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredName: { fontWeight: Weight.bold, fontSize: Font.sm, color: Colors.ink },
  featuredPrice: { color: Colors.primary, fontWeight: Weight.bold, marginTop: 4 },
  featuredOldPrice: {
    color: Colors.inkTertiary,
    fontSize: Font.xs,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
});
