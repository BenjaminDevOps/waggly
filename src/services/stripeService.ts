import { STRIPE_PUBLISHABLE_KEY } from '@env';
import { SubscriptionPlan } from '@/types/subscription';

// Note: Pour la production, vous devez créer une Cloud Function Firebase
// qui gère les appels côté serveur à Stripe avec la clé secrète

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

export class StripeService {
  private baseUrl: string;

  constructor() {
    // URL de votre Cloud Function Firebase ou backend
    this.baseUrl = 'https://your-region-your-project.cloudfunctions.net/stripe';
  }

  /**
   * Créer une session de checkout Stripe
   */
  async createCheckoutSession(
    userId: string,
    plan: SubscriptionPlan,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    try {
      const response = await fetch(`${this.baseUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          plan,
          successUrl,
          cancelUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Créer un portail de gestion de l'abonnement
   */
  async createCustomerPortalSession(
    userId: string,
    returnUrl: string
  ): Promise<{ url: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          returnUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }

  /**
   * Annuler un abonnement
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Obtenir les méthodes de paiement d'un client
   */
  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/payment-methods?customerId=${customerId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      return data.paymentMethods;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
