export type PetType = 'dog' | 'cat' | 'nac';

export type PetGender = 'male' | 'female';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  points: number;
  badges: Badge[];
  diagnosticsUsedThisMonth: number;
  diagnosticsResetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  type: PetType;
  breed?: string;
  gender: PetGender;
  birthDate: Date;
  weight?: number;
  photoURL?: string;
  microchipNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vaccination {
  id: string;
  petId: string;
  name: string;
  date: Date;
  nextDueDate?: Date;
  veterinarian?: string;
  clinic?: string;
  batchNumber?: string;
  notes?: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  petId: string;
  title: string;
  date: Date;
  type: 'checkup' | 'vaccination' | 'surgery' | 'other';
  veterinarian?: string;
  clinic?: string;
  notes?: string;
  reminderSet: boolean;
  completed: boolean;
  createdAt: Date;
}

export interface WeightRecord {
  id: string;
  petId: string;
  weight: number;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy?: string;
  notes?: string;
  active: boolean;
  createdAt: Date;
}

export interface HealthRecord {
  id: string;
  petId: string;
  title: string;
  description: string;
  date: Date;
  type: 'illness' | 'injury' | 'allergy' | 'other';
  veterinarian?: string;
  treatment?: string;
  documents?: string[];
  createdAt: Date;
}

export interface DiagnosticSession {
  id: string;
  petId: string;
  userId: string;
  symptoms: string;
  aiResponse: string;
  severity?: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'health' | 'care' | 'engagement';
  condition: string;
}
