import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { Pet, PET_EMOJI, PET_COLORS } from '../models/types';

const DEMO_PETS: Pet[] = [
  {
    id: '1', userId: 'demo', name: 'Luna', type: 'dog', breed: 'Golden Retriever',
    gender: 'female', birthDate: '2021-03-15', weight: 28.5, createdAt: '', updatedAt: '',
  },
  {
    id: '2', userId: 'demo', name: 'Milo', type: 'cat', breed: 'British Shorthair',
    gender: 'male', birthDate: '2022-07-20', weight: 5.2, createdAt: '', updatedAt: '',
  },
  {
    id: '3', userId: 'demo', name: 'Coco', type: 'rabbit', breed: 'Holland Lop',
    gender: 'female', birthDate: '2023-01-10', weight: 1.8, createdAt: '', updatedAt: '',
  },
];

function getAge(birthDate?: string): string {
  if (!birthDate) return 'N/A';
  const birth = new Date(birthDate);
  const years = new Date().getFullYear() - birth.getFullYear();
  return `${years} yrs`;
}

function PetCard({ pet }: { pet: Pet }) {
  const navigation = useNavigation<any>();
  const color = PET_COLORS[pet.type];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('PetDetail', { pet });
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.avatar, { backgroundColor: color + '20' }]}>
        <Text style={{ fontSize: 36 }}>{PET_EMOJI[pet.type]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed ?? pet.type}</Text>
        <View style={styles.chips}>
          <InfoChip icon="calendar-outline" label={getAge(pet.birthDate)} />
          <InfoChip icon="fitness-outline" label={pet.weight ? `${pet.weight} kg` : 'N/A'} />
          <InfoChip
            icon={pet.gender === 'male' ? 'male' : pet.gender === 'female' ? 'female' : 'help'}
            label={pet.gender}
          />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.inkTertiary} />
    </TouchableOpacity>
  );
}

function InfoChip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon as any} size={12} color={Colors.inkSecondary} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export function PetsScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Pets</Text>
      </View>
      <FlatList
        data={DEMO_PETS}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: Spacing.lg }}
        renderItem={({ item }) => <PetCard pet={item} />}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('AddPet');
        }}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.fabText}>Add Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  headerTitle: { fontSize: Font.largeTitle, fontWeight: Weight.bold, color: Colors.ink },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    ...Shadow.soft,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1, marginLeft: Spacing.lg },
  name: { fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink },
  breed: { fontSize: Font.body, color: Colors.inkSecondary, marginTop: 2 },
  chips: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    gap: 3,
  },
  chipText: { fontSize: Font.xs, color: Colors.inkSecondary },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
    gap: Spacing.sm,
    ...Shadow.glow(Colors.primary),
  },
  fabText: { color: '#fff', fontWeight: Weight.bold, fontSize: Font.body },
});
