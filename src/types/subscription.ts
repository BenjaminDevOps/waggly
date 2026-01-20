export type SubscriptionPlan = 'free' | 'premium' | 'pro';

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanFeatures {
  maxPets: number;
  aiDiagnosticsPerMonth: number;
  exportPdf: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  customReminders: boolean;
  veterinarianSharing: boolean;
  cloudStorage: string; // "1GB", "10GB", "unlimited"
}

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Prix barré pour la promotion
  currency: string;
  interval: 'month' | 'year';
  stripePriceId?: string;
  features: PlanFeatures;
  popular?: boolean;
}

export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Gratuit',
    description: 'Pour découvrir PetHealth',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    features: {
      maxPets: 2,
      aiDiagnosticsPerMonth: 2,
      exportPdf: false,
      prioritySupport: false,
      advancedAnalytics: false,
      customReminders: false,
      veterinarianSharing: false,
      cloudStorage: '100MB',
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'Pour les propriétaires engagés',
    price: 4.99,
    originalPrice: 9.99,
    currency: 'EUR',
    interval: 'month',
    stripePriceId: 'price_premium_monthly', // À remplacer par votre ID Stripe
    popular: true,
    features: {
      maxPets: 5,
      aiDiagnosticsPerMonth: 50,
      exportPdf: true,
      prioritySupport: false,
      advancedAnalytics: true,
      customReminders: true,
      veterinarianSharing: true,
      cloudStorage: '5GB',
    },
  },
  pro: {
    id: 'pro',
    name: 'Professionnel',
    description: 'Pour les professionnels et éleveurs',
    price: 9.99,
    originalPrice: 24.99,
    currency: 'EUR',
    interval: 'month',
    stripePriceId: 'price_pro_monthly', // À remplacer par votre ID Stripe
    features: {
      maxPets: -1, // unlimited
      aiDiagnosticsPerMonth: -1, // unlimited
      exportPdf: true,
      prioritySupport: true,
      advancedAnalytics: true,
      customReminders: true,
      veterinarianSharing: true,
      cloudStorage: 'unlimited',
    },
  },
};
