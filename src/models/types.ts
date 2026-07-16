// ==================== PET ====================
// NAC = "Nouveaux Animaux de Compagnie" (exotic / non-traditional pets)
export type PetType = 'reptile' | 'rodent' | 'ferret' | 'bird' | 'fish' | 'amphibian' | 'invertebrate' | 'other';
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
  reptile: '\u{1F98E}',
  rodent: '\u{1F439}',
  ferret: '\u{1F9A1}',
  bird: '\u{1F426}',
  fish: '\u{1F420}',
  amphibian: '\u{1F438}',
  invertebrate: '\u{1F577}\u{FE0F}',
  other: '\u{1F43E}',
};

export const PET_COLORS: Record<PetType, string> = {
  reptile: '#3B2360',
  rodent: '#D4726A',
  ferret: '#A594C9',
  bird: '#6EAF7B',
  fish: '#7DB8D4',
  amphibian: '#7EC8B0',
  invertebrate: '#91819E',
  other: '#E0AE4A',
};

// ==================== HEALTH RECORD ====================
export type RecordType =
  | 'vaccination'
  | 'deworming'
  | 'tickTreatment'
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
  vaccination: '\u{1F489}',
  deworming: '\u{1F48A}',
  tickTreatment: '\u{1F41B}',
  vetVisit: '\u{1F3E5}',
  weight: '\u2696\uFE0F',
  medication: '\u{1F48A}',
  surgery: '\u{1F52C}',
  allergy: '\u26A0\uFE0F',
  note: '\u{1F4DD}',
};

export const RECORD_LABELS: Record<RecordType, string> = {
  vaccination: 'Vaccination',
  deworming: 'Deworming',
  tickTreatment: 'Tick Treatment',
  vetVisit: 'Vet Visit',
  weight: 'Weight',
  medication: 'Medication',
  surgery: 'Surgery',
  allergy: 'Allergy',
  note: 'Note',
};

// ==================== NAC JOURNAL (shedding/behavior + habitat) ====================
// Weight entries reuse HealthRecord with type: 'weight' — these two cover the
// NAC-specific logs that don't fit the existing medical-record model.
export type NacJournalEntryType = 'shedding' | 'habitat';

export interface NacJournalEntry {
  id: string;
  petId: string;
  userId: string;
  type: NacJournalEntryType;
  date: string;
  note?: string;
  temperatureC?: number;
  humidityPct?: number;
  createdAt: string;
}

// ==================== APPOINTMENTS ====================
export interface Appointment {
  id: string;
  petId: string;
  userId: string;
  date: string; // ISO date (yyyy-mm-dd)
  time?: string; // HH:mm
  vetName: string;
  location?: string;
  note?: string;
  createdAt: string;
}

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

// ==================== SHOP ====================
export type ShopCategory =
  | 'terrariums'
  | 'substrate'
  | 'heatingLighting'
  | 'food'
  | 'accessories';

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
  terrariums: '\u{1F3E0}',
  substrate: '\u{1F33F}',
  heatingLighting: '\u2600\uFE0F',
  food: '\u{1F997}',
  accessories: '\u{1F380}',
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
  | 'healthChampion';

export interface Badge {
  id: BadgeId;
  emoji: string;
  icon: string;
}

// Names/descriptions live in i18n (see `badges` namespace) so they stay localized.
export const BADGES: Badge[] = [
  { id: 'firstPet', emoji: '\u{1F43E}', icon: 'PawPrint' },
  { id: 'firstDiagnosis', emoji: '\u{1FA7A}', icon: 'Stethoscope' },
  { id: 'streak7Days', emoji: '\u{1F525}', icon: 'Flame' },
  { id: 'streak30Days', emoji: '⭐', icon: 'Star' },
  { id: 'points100', emoji: '\u{1F3C5}', icon: 'Award' },
  { id: 'points500', emoji: '\u{1F48E}', icon: 'Diamond' },
  { id: 'points1000', emoji: '\u{1F451}', icon: 'Crown' },
  { id: 'vetVisit5', emoji: '\u{1F3E5}', icon: 'Building2' },
  { id: 'healthChampion', emoji: '\u{1F3C6}', icon: 'Trophy' },
];
