// ==================== PET ====================
export type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
export type PetGender = 'male' | 'female' | 'unknown';

export interface Pet {
  id: string;
  userId: string;
  name: string;
  type: PetType;
  breed?: string;
  gender: PetGender;
  birthDate?: string;
  weight?: number;
  photoUrl?: string;
  microchipId?: string;
  createdAt: string;
  updatedAt: string;
}

export const PET_EMOJI: Record<PetType, string> = {
  dog: '🐕',
  cat: '🐈',
  bird: '🐦',
  rabbit: '🐰',
  other: '🐾',
};

export const PET_COLORS: Record<PetType, string> = {
  dog: '#6366F1',
  cat: '#EC4899',
  bird: '#10B981',
  rabbit: '#F59E0B',
  other: '#8B5CF6',
};

// ==================== HEALTH RECORD ====================
export type RecordType =
  | 'vaccination'
  | 'deworming'
  | 'vetVisit'
  | 'weight'
  | 'medication'
  | 'surgery'
  | 'allergy'
  | 'note';

export interface HealthRecord {
  id: string;
  petId: string;
  userId: string;
  type: RecordType;
  title: string;
  description?: string;
  date: string;
  nextDueDate?: string;
  vetName?: string;
  weight?: number;
  createdAt: string;
}

export const RECORD_EMOJI: Record<RecordType, string> = {
  vaccination: '💉',
  deworming: '💊',
  vetVisit: '🏥',
  weight: '⚖️',
  medication: '💊',
  surgery: '🔬',
  allergy: '⚠️',
  note: '📝',
};

export const RECORD_LABELS: Record<RecordType, string> = {
  vaccination: 'Vaccination',
  deworming: 'Deworming',
  vetVisit: 'Vet Visit',
  weight: 'Weight',
  medication: 'Medication',
  surgery: 'Surgery',
  allergy: 'Allergy',
  note: 'Note',
};

// ==================== DIAGNOSIS ====================
export type DiagnosisSeverity = 'low' | 'medium' | 'high' | 'emergency';

export interface Diagnosis {
  id: string;
  userId: string;
  petId: string;
  symptoms: string;
  aiResponse: string;
  severity: DiagnosisSeverity;
  possibleConditions: string[];
  recommendations: string[];
  requiresVetVisit: boolean;
  createdAt: string;
}

// ==================== WALK ====================
export interface Walk {
  id: string;
  userId: string;
  petId?: string;
  petName?: string;
  startTime: string;
  endTime?: string;
  steps: number;
  distanceKm: number;
  durationMinutes: number;
  caloriesBurned: number;
  pointsEarned: number;
}

// ==================== SHOP ====================
export type ShopCategory =
  | 'food'
  | 'toys'
  | 'health'
  | 'accessories'
  | 'grooming'
  | 'training';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: ShopCategory;
  petTypes: PetType[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
}

export const SHOP_EMOJI: Record<ShopCategory, string> = {
  food: '🍖',
  toys: '🧸',
  health: '💊',
  accessories: '🎀',
  grooming: '✂️',
  training: '🎯',
};

// ==================== USER & GAMIFICATION ====================
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  isPremium: boolean;
  totalPoints: number;
  dailyStreak: number;
  aiDiagnosisUsed: number;
  badges: string[];
  createdAt: string;
}

export type BadgeId =
  | 'firstPet'
  | 'firstDiagnosis'
  | 'streak7Days'
  | 'streak30Days'
  | 'points100'
  | 'points500'
  | 'points1000'
  | 'vetVisit5'
  | 'healthChampion'
  | 'firstWalk'
  | 'walker5k'
  | 'marathonWalker';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
}

export const BADGES: Badge[] = [
  { id: 'firstPet', name: 'First Pet', description: 'Added your first pet', icon: '🐾' },
  { id: 'firstDiagnosis', name: 'First Diagnosis', description: 'Used AI diagnosis for the first time', icon: '🔬' },
  { id: 'streak7Days', name: '7 Day Streak', description: 'Logged in for 7 consecutive days', icon: '🔥' },
  { id: 'streak30Days', name: '30 Day Streak', description: 'Logged in for 30 consecutive days', icon: '⭐' },
  { id: 'points100', name: '100 Points', description: 'Earned 100 points', icon: '💯' },
  { id: 'points500', name: '500 Points', description: 'Earned 500 points', icon: '💎' },
  { id: 'points1000', name: '1000 Points', description: 'Earned 1000 points', icon: '👑' },
  { id: 'vetVisit5', name: '5 Vet Visits', description: 'Recorded 5 vet visits', icon: '🏥' },
  { id: 'healthChampion', name: 'Health Champion', description: 'Maintained excellent pet health', icon: '🏆' },
  { id: 'firstWalk', name: 'First Walk', description: 'Completed your first walk with your pet', icon: '🏃' },
  { id: 'walker5k', name: '5K Walker', description: 'Walked 5,000 steps in a single day', icon: '🎯' },
  { id: 'marathonWalker', name: 'Marathon Walker', description: 'Walked a total of 42 km', icon: '🏅' },
];
