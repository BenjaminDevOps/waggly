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
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { StatusBadge } from '../components/Badge';
import { IOSButton } from '../components/IOSButton';
import { PET_EMOJI, PetType } from '../models/types';

const SYMPTOM_CHIPS = [
  'Vomiting', 'Diarrhea', 'Scratching', 'Limping', 'Not Eating',
  'Coughing', 'Sneezing', 'Lethargy', 'Hair Loss', 'Eye Discharge',
  'Swelling', 'Bad Breath',
];

const DEMO_PETS = [
  { name: 'Luna', type: 'dog' as PetType },
  { name: 'Milo', type: 'cat' as PetType },
  { name: 'Coco', type: 'rabbit' as PetType },
];

export function DiagnosisScreen() {
  const [symptoms, setSymptoms] = useState('');
  const [selectedPet, setSelectedPet] = useState('Luna');
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [freeUses, setFreeUses] = useState(3);

  const startAnalysis = () => {
    if (!symptoms.trim()) {
      Alert.alert('Missing Info', 'Please describe the symptoms first');
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
      setFreeUses((v) => Math.max(0, v - 1));
    }, 2000);
  };

  if (showResults) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>AI Diagnosis</Text>
        </View>

        {/* Severity Banner */}
        <GradientCard colors={Gradients.warmSunset} style={{ marginBottom: Spacing.xxl }}>
          <View style={styles.severityRow}>
            <View style={styles.severityIcon}>
              <Ionicons name="warning" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.lg }}>
              <Text style={styles.severityTitle}>Moderate Severity</Text>
              <Text style={styles.severitySub}>Monitor closely, vet visit recommended</Text>
            </View>
          </View>
        </GradientCard>

        {/* Assessment */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="search" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Assessment</Text>
          </View>
          <Text style={styles.sectionText}>
            Based on the symptoms described (scratching, red patches on belly, lethargy),
            your dog may be experiencing a dermatological issue. The combination suggests
            a possible allergic reaction or skin infection.
          </Text>
        </Card>

        {/* Possible Conditions */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Possible Conditions</Text>
          </View>
          {[
            { name: 'Atopic Dermatitis', prob: 65, desc: 'Allergic skin condition common in dogs' },
            { name: 'Contact Allergy', prob: 45, desc: 'Reaction to environmental allergen' },
            { name: 'Bacterial Skin Infection', prob: 30, desc: 'Secondary infection from scratching' },
          ].map((c) => (
            <View key={c.name} style={styles.conditionRow}>
              <View style={[styles.conditionCircle, { borderColor: c.prob > 50 ? Colors.warning : Colors.inkTertiary }]}>
                <Text style={[styles.conditionProb, { color: c.prob > 50 ? Colors.warning : Colors.inkSecondary }]}>
                  {c.prob}%
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.conditionName}>{c.name}</Text>
                <Text style={styles.conditionDesc}>{c.desc}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Recommendations */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb-outline" size={20} color={Colors.success} />
            <Text style={styles.sectionTitle}>Recommendations</Text>
          </View>
          {[
            { text: 'Keep affected area clean and dry', urgency: 'Now', color: Colors.error },
            { text: 'Prevent scratching with an e-collar if needed', urgency: 'Now', color: Colors.error },
            { text: 'Schedule a vet appointment within 48 hours', urgency: 'Soon', color: Colors.warning },
            { text: 'Note any new foods or environmental changes', urgency: 'Track', color: Colors.success },
          ].map((r) => (
            <View key={r.text} style={styles.recRow}>
              <StatusBadge label={r.urgency} color={r.color} small />
              <Text style={styles.recText}>{r.text}</Text>
            </View>
          ))}
        </Card>

        {/* Emergency */}
        <View style={styles.emergencyBox}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={20} color={Colors.error} />
            <Text style={[styles.sectionTitle, { color: Colors.error }]}>Seek Immediate Help If:</Text>
          </View>
          {['Rapid swelling of face or throat', 'Difficulty breathing',
            'Excessive bleeding from skin lesions', 'High fever or refusal to eat/drink',
          ].map((s) => (
            <View key={s} style={styles.emergencyItem}>
              <View style={styles.emergencyDot} />
              <Text style={styles.emergencyText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <IOSButton
            label="New Diagnosis"
            variant="ghost"
            onPress={() => { setShowResults(false); setSymptoms(''); }}
            style={{ flex: 1 }}
          />
          <IOSButton
            label="Save Result"
            onPress={() => {}}
            style={{ flex: 1 }}
          />
        </View>

        {/* Points */}
        <GradientCard colors={Gradients.gold} style={{ marginBottom: Spacing.xxxl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="star" size={20} color="#fff" />
            <Text style={styles.pointsText}>+10 points earned!</Text>
          </View>
        </GradientCard>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>AI Diagnosis</Text>
        <StatusBadge
          label={`${freeUses}/3 free`}
          color={freeUses > 0 ? Colors.success : Colors.error}
        />
      </View>

      {/* Info banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
        <Text style={styles.infoText}>
          AI diagnosis is not a substitute for professional veterinary care.
          Always consult a vet for serious symptoms.
        </Text>
      </View>

      {/* Select Pet */}
      <Text style={styles.label}>Select Pet</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.xxl }}>
        {DEMO_PETS.map((pet) => (
          <TouchableOpacity
            key={pet.name}
            style={[styles.petChip, selectedPet === pet.name && styles.petChipActive]}
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight');
              setSelectedPet(pet.name);
            }}
          >
            <Text style={{ fontSize: 24 }}>{PET_EMOJI[pet.type]}</Text>
            <Text style={[styles.petChipText, selectedPet === pet.name && { color: Colors.primary }]}>
              {pet.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick symptom chips */}
      <Text style={styles.label}>Common Symptoms</Text>
      <View style={styles.chipWrap}>
        {SYMPTOM_CHIPS.map((s) => (
          <TouchableOpacity
            key={s}
            style={styles.symptomChip}
            onPress={() => {
              ReactNativeHapticFeedback.trigger('selection');
              setSymptoms((prev) => (prev ? `${prev}, ${s}` : s));
            }}
          >
            <Text style={styles.symptomChipText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}
      <Text style={styles.label}>Describe the Symptoms</Text>
      <TextInput
        style={styles.textArea}
        placeholder={'Describe what you\'ve observed...\n\ne.g., "My dog has been scratching a lot, has red patches on belly"'}
        placeholderTextColor={Colors.inkTertiary}
        multiline
        numberOfLines={5}
        value={symptoms}
        onChangeText={setSymptoms}
        textAlignVertical="top"
      />

      {/* Photo upload placeholder */}
      <TouchableOpacity style={styles.photoBox}>
        <Ionicons name="camera-outline" size={36} color={Colors.inkTertiary} />
        <Text style={styles.photoLabel}>Add a photo (optional)</Text>
        <Text style={styles.photoHint}>Photos help improve diagnosis accuracy</Text>
      </TouchableOpacity>

      {/* Analyze button */}
      <IOSButton
        label={analyzing ? 'Analyzing with Gemini AI...' : 'Analyze Symptoms'}
        onPress={startAnalysis}
        loading={analyzing}
        disabled={analyzing}
        icon={<Ionicons name="sparkles" size={22} color="#fff" />}
        size="large"
      />

      {/* History */}
      <Text style={[styles.label, { marginTop: Spacing.xxl }]}>Recent Diagnoses</Text>
      {[
        { pet: '🐕 Luna', symptoms: 'Scratching, red skin patches', severity: 'Medium', date: '18 Mar 2026', color: Colors.warning },
        { pet: '🐈 Milo', symptoms: 'Sneezing, watery eyes', severity: 'Low', date: '10 Mar 2026', color: Colors.success },
      ].map((h) => (
        <Card key={h.date} style={{ marginBottom: Spacing.sm }}>
          <View style={styles.historyRow}>
            <Text style={{ fontSize: 24 }}>{h.pet.split(' ')[0]}</Text>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Text style={{ fontWeight: Weight.semibold, color: Colors.ink }}>{h.symptoms}</Text>
              <Text style={{ color: Colors.inkSecondary, fontSize: Font.sm }}>{h.date}</Text>
            </View>
            <StatusBadge label={h.severity} color={h.color} small />
          </View>
        </Card>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  headerTitle: { fontSize: Font.largeTitle, fontWeight: Weight.bold, color: Colors.ink },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryPale,
    borderWidth: 1,
    borderColor: Colors.primaryLight + '40',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  infoText: { flex: 1, fontSize: Font.sm, color: Colors.primaryDark },
  label: { fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink, marginBottom: Spacing.md },
  petChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg,
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: Spacing.sm,
  },
  petChipActive: { backgroundColor: Colors.primaryPale, borderColor: Colors.primary },
  petChipText: { fontWeight: Weight.bold, color: Colors.inkSecondary },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xxl },
  symptomChip: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  symptomChipText: { fontSize: Font.sm, color: Colors.ink },
  textArea: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    fontSize: Font.body,
    color: Colors.ink,
    minHeight: 120,
    marginBottom: Spacing.lg,
  },
  photoBox: {
    borderWidth: 1,
    borderColor: Colors.hairline,
    borderStyle: 'dashed',
    borderRadius: Radius.md,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  photoLabel: { color: Colors.inkSecondary, fontWeight: Weight.semibold, marginTop: Spacing.sm },
  photoHint: { color: Colors.inkTertiary, fontSize: Font.xs, marginTop: 4 },
  historyRow: { flexDirection: 'row', alignItems: 'center' },
  // Results styles
  severityRow: { flexDirection: 'row', alignItems: 'center' },
  severityIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  severityTitle: { color: '#fff', fontSize: Font.title3, fontWeight: Weight.bold },
  severitySub: { color: 'rgba(255,255,255,0.7)', fontSize: Font.body, marginTop: 2 },
  section: { marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  sectionTitle: { fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink },
  sectionText: { fontSize: Font.body, color: Colors.inkSecondary, lineHeight: 22 },
  conditionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  conditionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conditionProb: { fontSize: Font.xs, fontWeight: Weight.bold },
  conditionName: { fontWeight: Weight.semibold, color: Colors.ink },
  conditionDesc: { fontSize: Font.xs, color: Colors.inkSecondary },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  recText: { flex: 1, fontSize: Font.body, color: Colors.ink },
  emergencyBox: {
    backgroundColor: Colors.errorPale,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  emergencyItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 6 },
  emergencyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error },
  emergencyText: { fontSize: Font.body, color: Colors.ink },
  actionRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  pointsText: { color: '#fff', fontWeight: Weight.bold, fontSize: Font.body, marginLeft: Spacing.sm },
});
