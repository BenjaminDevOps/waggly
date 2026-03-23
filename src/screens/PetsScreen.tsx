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
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';
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
      onPress={() => navigation.navigate('PetDetail', { pet })}
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
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );
}

function InfoChip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon as any} size={12} color={Colors.textSecondary} />
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
        onPress={() => navigation.navigate('AddPet')}
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
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1, marginLeft: Spacing.lg },
  name: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  breed: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 2 },
  chips: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    gap: 3,
  },
  chipText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: FontSize.base },
});
