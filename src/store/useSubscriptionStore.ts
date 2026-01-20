import { create } from 'zustand';
import { Subscription, SubscriptionPlan, PLAN_CONFIGS } from '@/types/subscription';
import { subscriptionService } from '@/services/subscriptionService';

interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  loadSubscription: (userId: string) => Promise<void>;
  updatePlan: (userId: string, plan: SubscriptionPlan) => Promise<void>;
  canPerformAction: (
    userId: string,
    action: 'add_pet' | 'ai_diagnostic' | 'export_pdf' | 'advanced_analytics'
  ) => Promise<{ allowed: boolean; reason?: string }>;
  isPremium: () => boolean;
  isPro: () => boolean;
  getCurrentPlanConfig: () => typeof PLAN_CONFIGS[SubscriptionPlan] | null;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  loading: false,
  error: null,

  loadSubscription: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      let subscription = await subscriptionService.getUserSubscription(userId);

      // Si l'utilisateur n'a pas d'abonnement, créer un abonnement gratuit
      if (!subscription) {
        await subscriptionService.createFreeSubscription(userId);
        subscription = await subscriptionService.getUserSubscription(userId);
      }

      set({ subscription, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updatePlan: async (userId: string, plan: SubscriptionPlan) => {
    try {
      set({ loading: true, error: null });
      await subscriptionService.updateSubscription(userId, { plan });
      const subscription = await subscriptionService.getUserSubscription(userId);
      set({ subscription, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  canPerformAction: async (userId: string, action) => {
    return await subscriptionService.canPerformAction(userId, action);
  },

  isPremium: () => {
    const { subscription } = get();
    return subscription?.plan === 'premium' || subscription?.plan === 'pro';
  },

  isPro: () => {
    const { subscription } = get();
    return subscription?.plan === 'pro';
  },

  getCurrentPlanConfig: () => {
    const { subscription } = get();
    if (!subscription) return null;
    return PLAN_CONFIGS[subscription.plan];
  },
}));
