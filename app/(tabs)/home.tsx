import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { usePetStore } from '@/store/usePetStore';
import { useRewardStore } from '@/store/useRewardStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pet } from '@/types/models';

export default function HomeScreen() {
  const { userData, user } = useAuthStore();
  const { pets, loadPets } = usePetStore();
  const { level, totalPoints, progressToNextLevel } = useRewardStore();

  useEffect(() => {
    if (user) {
      loadPets(user.uid);
    }
  }, [user]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.header}>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.userName}>{userData?.displayName || 'Utilisateur'} 👋</Text>

          <View style={styles.levelCard}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Niveau {level}</Text>
              <Text style={styles.points}>{totalPoints} points</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progressToNextLevel}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progressToNextLevel)}% vers le niveau {level + 1}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Mes Compagnons</Text>
          {pets.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🐾</Text>
              <Text style={styles.emptyText}>
                Aucun animal enregistré
              </Text>
              <Text style={styles.emptySubtext}>
                Ajoutez votre premier compagnon pour commencer !
              </Text>
            </View>
          ) : (
            <View style={styles.petsList}>
              {pets.slice(0, 3).map((pet: Pet) => (
                <View key={pet.id} style={styles.petCard}>
                  <View style={styles.petIcon}>
                    <Text style={styles.petEmoji}>
                      {pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐈' : '🐹'}
                    </Text>
                  </View>
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petBreed}>{pet.breed || 'Race inconnue'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>Actions Rapides</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="add-circle" size={32} color="#3b82f6" />
              <Text style={[styles.actionText, { color: '#3b82f6' }]}>
                Ajouter un animal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#fce7f3' }]}>
              <Ionicons name="medical" size={32} color="#ec4899" />
              <Text style={[styles.actionText, { color: '#ec4899' }]}>
                Diagnostic IA
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="calendar" size={32} color="#22c55e" />
              <Text style={[styles.actionText, { color: '#22c55e' }]}>
                Rendez-vous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="fitness" size={32} color="#f59e0b" />
              <Text style={[styles.actionText, { color: '#f59e0b' }]}>
                Suivi poids
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Rappels</Text>
          <View style={styles.remindersCard}>
            <Ionicons name="notifications" size={24} color="#6366f1" />
            <Text style={styles.remindersText}>
              Aucun rappel pour aujourd'hui
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 18,
    color: '#e0e7ff',
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  levelCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  points: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 10,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  petsList: {
    gap: 12,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  petEmoji: {
    fontSize: 28,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  petBreed: {
    fontSize: 14,
    color: '#6b7280',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  remindersCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  remindersText: {
    flex: 1,
    fontSize: 16,
    color: '#6b7280',
  },
});
