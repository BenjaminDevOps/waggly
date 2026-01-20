import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Subscription, SubscriptionPlan, PLAN_CONFIGS } from '@/types/subscription';

export class SubscriptionService {
  /**
   * Obtenir l'abonnement d'un utilisateur
   */
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const subscriptionSnap = await getDoc(subscriptionRef);

      if (subscriptionSnap.exists()) {
        const data = subscriptionSnap.data();
        return {
          id: subscriptionSnap.id,
          userId: data.userId,
          plan: data.plan,
          status: data.status,
          stripeCustomerId: data.stripeCustomerId,
          stripeSubscriptionId: data.stripeSubscriptionId,
          currentPeriodStart: data.currentPeriodStart?.toDate() || new Date(),
          currentPeriodEnd: data.currentPeriodEnd?.toDate() || new Date(),
          cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Subscription;
      }

      return null;
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }

  /**
   * Créer un abonnement gratuit par défaut
   */
  async createFreeSubscription(userId: string): Promise<void> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const now = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100); // "Lifetime" for free plan

      await setDoc(subscriptionRef, {
        userId,
        plan: 'free',
        status: 'active',
        currentPeriodStart: Timestamp.fromDate(now),
        currentPeriodEnd: Timestamp.fromDate(endDate),
        cancelAtPeriodEnd: false,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });
    } catch (error) {
      console.error('Error creating free subscription:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un abonnement
   */
  async updateSubscription(
    userId: string,
    updates: Partial<Subscription>
  ): Promise<void> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      await updateDoc(subscriptionRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Vérifier si l'utilisateur peut effectuer une action
   */
  async canPerformAction(
    userId: string,
    action: 'add_pet' | 'ai_diagnostic' | 'export_pdf' | 'advanced_analytics'
  ): Promise<{ allowed: boolean; reason?: string }> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription || subscription.status !== 'active') {
      return { allowed: false, reason: 'Abonnement inactif' };
    }

    const planConfig = PLAN_CONFIGS[subscription.plan];

    switch (action) {
      case 'add_pet':
        // Cette vérification nécessite de compter les animaux actuels
        // Pour l'instant, on retourne true, mais vous devriez vérifier le count
        return { allowed: true };

      case 'ai_diagnostic':
        // Vérifier le quota mensuel
        // Vous devriez implémenter un compteur dans Firestore
        if (planConfig.features.aiDiagnosticsPerMonth === -1) {
          return { allowed: true };
        }
        // TODO: Vérifier le compteur mensuel
        return { allowed: true };

      case 'export_pdf':
        if (!planConfig.features.exportPdf) {
          return {
            allowed: false,
            reason: 'Fonctionnalité disponible en Premium ou Pro'
          };
        }
        return { allowed: true };

      case 'advanced_analytics':
        if (!planConfig.features.advancedAnalytics) {
          return {
            allowed: false,
            reason: 'Fonctionnalité disponible en Premium ou Pro'
          };
        }
        return { allowed: true };

      default:
        return { allowed: true };
    }
  }

  /**
   * Obtenir les limites du plan actuel
   */
  getPlanLimits(plan: SubscriptionPlan) {
    return PLAN_CONFIGS[plan].features;
  }

  /**
   * Vérifier si un plan est supérieur à un autre
   */
  isPlanUpgrade(currentPlan: SubscriptionPlan, newPlan: SubscriptionPlan): boolean {
    const planOrder: Record<SubscriptionPlan, number> = {
      free: 0,
      premium: 1,
      pro: 2,
    };

    return planOrder[newPlan] > planOrder[currentPlan];
  }
}

export const subscriptionService = new SubscriptionService();
