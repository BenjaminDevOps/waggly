import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  Pet,
  Vaccination,
  Appointment,
  WeightRecord,
  Medication,
  HealthRecord,
  DiagnosticSession,
  User,
} from '@/types/models';

const convertTimestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};

export class FirestoreService {
  // User operations
  async createUser(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    await updateDoc(userRef, {
      ...userData,
      createdAt: now,
      updatedAt: now,
      points: 0,
      badges: [],
      diagnosticsUsedThisMonth: 0,
      diagnosticsResetDate: nextMonth,
    });
  }

  async getUser(userId: string): Promise<User | null> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: userSnap.id,
        ...data,
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
        diagnosticsResetDate: data.diagnosticsResetDate ? convertTimestampToDate(data.diagnosticsResetDate) : new Date(),
      } as User;
    }
    return null;
  }

  async updateUserPoints(userId: string, points: number): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const user = await this.getUser(userId);
    if (user) {
      await updateDoc(userRef, {
        points: user.points + points,
        updatedAt: new Date(),
      });
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  // Pet operations
  async createPet(petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const petsRef = collection(db, 'pets');
    const docRef = await addDoc(petsRef, {
      ...petData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  }

  async getPet(petId: string): Promise<Pet | null> {
    const petRef = doc(db, 'pets', petId);
    const petSnap = await getDoc(petRef);
    if (petSnap.exists()) {
      const data = petSnap.data();
      return {
        id: petSnap.id,
        ...data,
        birthDate: convertTimestampToDate(data.birthDate),
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
      } as Pet;
    }
    return null;
  }

  async getUserPets(userId: string): Promise<Pet[]> {
    const petsRef = collection(db, 'pets');
    const q = query(petsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        birthDate: convertTimestampToDate(data.birthDate),
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
      } as Pet;
    });
  }

  async updatePet(petId: string, petData: Partial<Pet>): Promise<void> {
    const petRef = doc(db, 'pets', petId);
    await updateDoc(petRef, {
      ...petData,
      updatedAt: new Date(),
    });
  }

  async deletePet(petId: string): Promise<void> {
    const petRef = doc(db, 'pets', petId);
    await deleteDoc(petRef);
  }

  // Vaccination operations
  async addVaccination(vaccinationData: Omit<Vaccination, 'id' | 'createdAt'>): Promise<string> {
    const vaccinationsRef = collection(db, 'vaccinations');
    const docRef = await addDoc(vaccinationsRef, {
      ...vaccinationData,
      createdAt: new Date(),
    });
    return docRef.id;
  }

  async getPetVaccinations(petId: string): Promise<Vaccination[]> {
    const vaccinationsRef = collection(db, 'vaccinations');
    const q = query(vaccinationsRef, where('petId', '==', petId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: convertTimestampToDate(data.date),
        nextDueDate: data.nextDueDate ? convertTimestampToDate(data.nextDueDate) : undefined,
        createdAt: convertTimestampToDate(data.createdAt),
      } as Vaccination;
    });
  }

  async deleteVaccination(vaccinationId: string): Promise<void> {
    const vaccinationRef = doc(db, 'vaccinations', vaccinationId);
    await deleteDoc(vaccinationRef);
  }

  // Appointment operations
  async addAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Promise<string> {
    const appointmentsRef = collection(db, 'appointments');
    const docRef = await addDoc(appointmentsRef, {
      ...appointmentData,
      createdAt: new Date(),
    });
    return docRef.id;
  }

  async getPetAppointments(petId: string): Promise<Appointment[]> {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('petId', '==', petId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: convertTimestampToDate(data.date),
        createdAt: convertTimestampToDate(data.createdAt),
      } as Appointment;
    });
  }

  async updateAppointment(appointmentId: string, appointmentData: Partial<Appointment>): Promise<void> {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, appointmentData);
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await deleteDoc(appointmentRef);
  }

  // Weight records operations
  async addWeightRecord(weightData: Omit<WeightRecord, 'id' | 'createdAt'>): Promise<string> {
    const weightRef = collection(db, 'weightRecords');
    const docRef = await addDoc(weightRef, {
      ...weightData,
      createdAt: new Date(),
    });
    return docRef.id;
  }

  async getPetWeightRecords(petId: string): Promise<WeightRecord[]> {
    const weightRef = collection(db, 'weightRecords');
    const q = query(weightRef, where('petId', '==', petId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: convertTimestampToDate(data.date),
        createdAt: convertTimestampToDate(data.createdAt),
      } as WeightRecord;
    });
  }

  // Medication operations
  async addMedication(medicationData: Omit<Medication, 'id' | 'createdAt'>): Promise<string> {
    const medicationsRef = collection(db, 'medications');
    const docRef = await addDoc(medicationsRef, {
      ...medicationData,
      createdAt: new Date(),
    });
    return docRef.id;
  }

  async getPetMedications(petId: string): Promise<Medication[]> {
    const medicationsRef = collection(db, 'medications');
    const q = query(medicationsRef, where('petId', '==', petId), orderBy('startDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: convertTimestampToDate(data.startDate),
        endDate: data.endDate ? convertTimestampToDate(data.endDate) : undefined,
        createdAt: convertTimestampToDate(data.createdAt),
      } as Medication;
    });
  }

  async updateMedication(medicationId: string, medicationData: Partial<Medication>): Promise<void> {
    const medicationRef = doc(db, 'medications', medicationId);
    await updateDoc(medicationRef, medicationData);
  }

  // Health records operations
  async addHealthRecord(healthData: Omit<HealthRecord, 'id' | 'createdAt'>): Promise<string> {
    const healthRef = collection(db, 'healthRecords');
    const docRef = await addDoc(healthRef, {
      ...healthData,
      createdAt: new Date(),
    });
    return docRef.id;
  }

  async getPetHealthRecords(petId: string): Promise<HealthRecord[]> {
    const healthRef = collection(db, 'healthRecords');
    const q = query(healthRef, where('petId', '==', petId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: convertTimestampToDate(data.date),
        createdAt: convertTimestampToDate(data.createdAt),
      } as HealthRecord;
    });
  }

  // Diagnostic sessions operations
  async saveDiagnosticSession(sessionData: Omit<DiagnosticSession, 'id'>): Promise<string> {
    const diagnosticsRef = collection(db, 'diagnosticSessions');
    const docRef = await addDoc(diagnosticsRef, sessionData);
    return docRef.id;
  }

  async getUserDiagnosticSessions(userId: string): Promise<DiagnosticSession[]> {
    const diagnosticsRef = collection(db, 'diagnosticSessions');
    const q = query(diagnosticsRef, where('userId', '==', userId), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: convertTimestampToDate(data.timestamp),
      } as DiagnosticSession;
    });
  }
}

export const firestoreService = new FirestoreService();
