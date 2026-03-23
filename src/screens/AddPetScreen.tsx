import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize } from '../theme/spacing';
import { PetType, PetGender, PET_EMOJI } from '../models/types';

const PET_TYPES: { type: PetType; label: string }[] = [
  { type: 'dog', label: 'Dog' },
  { type: 'cat', label: 'Cat' },
  { type: 'bird', label: 'Bird' },
  { type: 'rabbit', label: 'Rabbit' },
  { type: 'other', label: 'NAC' },
];

const GENDERS: { value: PetGender; label: string; icon: string; color: string }[] = [
  { value: 'male', label: 'Male', icon: 'male', color: '#3B82F6' },
  { value: 'female', label: 'Female', icon: 'female', color: '#EC4899' },
  { value: 'unknown', label: 'Unknown', icon: 'help', color: '#9CA3AF' },
];

export function AddPetScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [selectedType, setSelectedType] = useState<PetType>('dog');
  const [selectedGender, setSelectedGender] = useState<PetGender>('unknown');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your pet\'s name');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', `${name} added successfully!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 800);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>What type of pet?</Text>
      <View style={styles.typeRow}>
        {PET_TYPES.map((pt) => (
          <TouchableOpacity
            key={pt.type}
            style={[
              styles.typeCard,
              selectedType === pt.type && styles.typeCardActive,
            ]}
            onPress={() => setSelectedType(pt.type)}
          >
            <Text style={{ fontSize: 28 }}>{PET_EMOJI[pt.type]}</Text>
            <Text
              style={[
                styles.typeLabel,
                selectedType === pt.type && { color: Colors.primary, fontWeight: '700' },
              ]}
            >
              {pt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Photo placeholder */}
      <TouchableOpacity style={styles.photoCircle}>
        <Ionicons name="camera-outline" size={32} color={Colors.primary + '80'} />
        <Text style={styles.photoText}>Add Photo</Text>
      </TouchableOpacity>

      {/* Form fields */}
      <Text style={styles.label}>Pet Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your pet's name"
        placeholderTextColor={Colors.textLight}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Breed (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Golden Retriever"
        placeholderTextColor={Colors.textLight}
        value={breed}
        onChangeText={setBreed}
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        {GENDERS.map((g) => (
          <TouchableOpacity
            key={g.value}
            style={[
              styles.genderCard,
              selectedGender === g.value && {
                backgroundColor: g.color + '18',
                borderColor: g.color,
              },
            ]}
            onPress={() => setSelectedGender(g.value)}
          >
            <Ionicons
              name={g.icon as any}
              size={24}
              color={selectedGender === g.value ? g.color : Colors.textLight}
            />
            <Text
              style={[
                styles.genderText,
                selectedGender === g.value && { color: g.color, fontWeight: '700' },
              ]}
            >
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 25.5"
        placeholderTextColor={Colors.textLight}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Microchip ID (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 250269606..."
        placeholderTextColor={Colors.textLight}
        value={microchip}
        onChangeText={setMicrochip}
      />

      {/* Save button */}
      <TouchableOpacity
        style={[styles.saveBtn, loading && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
        <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Add Pet'}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xxl },
  typeCard: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardActive: { backgroundColor: Colors.primary + '15', borderColor: Colors.primary },
  typeLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '10',
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.xxl,
  },
  photoText: { fontSize: FontSize.xs, color: Colors.primary + '80', marginTop: 4 },
  label: { fontSize: FontSize.base, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: FontSize.base,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  genderRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  genderCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderText: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  saveBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
});
