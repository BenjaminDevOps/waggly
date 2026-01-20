import { Achievement, Badge } from '@/types/models';
import { firestoreService } from './firestoreService';

export interface RewardEvent {
  type: 'pet_added' | 'vaccination_added' | 'appointment_completed' |
        'weight_recorded' | 'diagnostic_completed' | 'health_record_added' |
        'medication_added' | 'daily_login' | 'profile_completed';
  petId?: string;
  userId: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_pet',
    name: 'Premier Compagnon',
    description: 'Ajouter votre premier animal',
    icon: '🐾',
    points: 10,
    category: 'engagement',
    condition: 'pet_added',
  },
  {
    id: 'health_guardian',
    name: 'Gardien de la Santé',
    description: 'Enregistrer 5 vaccinations',
    icon: '💉',
    points: 25,
    category: 'health',
    condition: 'vaccination_count_5',
  },
  {
    id: 'regular_checkup',
    name: 'Suivi Régulier',
    description: 'Compléter 3 rendez-vous vétérinaires',
    icon: '🏥',
    points: 30,
    category: 'health',
    condition: 'appointment_count_3',
  },
  {
    id: 'weight_tracker',
    name: 'Suivi du Poids',
    description: 'Enregistrer le poids pendant 4 semaines consécutives',
    icon: '📊',
    points: 20,
    category: 'care',
    condition: 'weight_tracked_4_weeks',
  },
  {
    id: 'ai_explorer',
    name: 'Explorateur IA',
    description: 'Utiliser le diagnostic IA 5 fois',
    icon: '🤖',
    points: 15,
    category: 'engagement',
    condition: 'diagnostic_count_5',
  },
  {
    id: 'dedicated_owner',
    name: 'Propriétaire Dévoué',
    description: 'Se connecter 7 jours consécutifs',
    icon: '⭐',
    points: 35,
    category: 'engagement',
    condition: 'login_streak_7',
  },
  {
    id: 'health_historian',
    name: 'Historien de la Santé',
    description: 'Créer 10 entrées dans le carnet de santé',
    icon: '📖',
    points: 40,
    category: 'care',
    condition: 'health_record_count_10',
  },
  {
    id: 'medication_master',
    name: 'Maître des Médicaments',
    description: 'Gérer 5 traitements médicamenteux',
    icon: '💊',
    points: 25,
    category: 'care',
    condition: 'medication_count_5',
  },
];

export class RewardService {
  async processRewardEvent(event: RewardEvent): Promise<{ points: number; newBadges: Badge[] }> {
    let pointsEarned = 0;
    const newBadges: Badge[] = [];

    switch (event.type) {
      case 'pet_added':
        pointsEarned = 10;
        break;
      case 'vaccination_added':
        pointsEarned = 5;
        break;
      case 'appointment_completed':
        pointsEarned = 8;
        break;
      case 'weight_recorded':
        pointsEarned = 3;
        break;
      case 'diagnostic_completed':
        pointsEarned = 5;
        break;
      case 'health_record_added':
        pointsEarned = 4;
        break;
      case 'medication_added':
        pointsEarned = 5;
        break;
      case 'daily_login':
        pointsEarned = 2;
        break;
      case 'profile_completed':
        pointsEarned = 15;
        break;
    }

    if (pointsEarned > 0) {
      await firestoreService.updateUserPoints(event.userId, pointsEarned);
    }

    return { points: pointsEarned, newBadges };
  }

  async checkAchievements(userId: string): Promise<Achievement[]> {
    return ACHIEVEMENTS;
  }

  getPointsForLevel(level: number): number {
    return level * 100;
  }

  calculateLevel(points: number): number {
    return Math.floor(points / 100) + 1;
  }

  getProgressToNextLevel(points: number): number {
    const currentLevel = this.calculateLevel(points);
    const pointsForCurrentLevel = (currentLevel - 1) * 100;
    const pointsForNextLevel = currentLevel * 100;
    const progress = points - pointsForCurrentLevel;
    const total = pointsForNextLevel - pointsForCurrentLevel;
    return (progress / total) * 100;
  }
}

export const rewardService = new RewardService();
