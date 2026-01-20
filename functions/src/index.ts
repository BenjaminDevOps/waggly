import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const db = admin.firestore();

/**
 * Créer une session de checkout Stripe
 */
export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Vérifier l'authentification
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { userId, plan, successUrl, cancelUrl } = data;

  if (!userId || !plan) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required parameters'
    );
  }

  try {
    // Obtenir ou créer le client Stripe
    const userDoc = await db.collection('users').doc(userId).get();
    let stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userDoc.data()?.email,
        metadata: {
          firebaseUID: userId,
        },
      });
      stripeCustomerId = customer.id;

      // Sauvegarder l'ID client dans Firestore
      await db.collection('users').doc(userId).update({
        stripeCustomerId,
      });
    }

    // Déterminer le price ID selon le plan
    let priceId: string;
    switch (plan) {
      case 'premium':
        priceId = 'price_premium_monthly'; // À remplacer par votre ID Stripe
        break;
      case 'pro':
        priceId = 'price_pro_monthly'; // À remplacer par votre ID Stripe
        break;
      default:
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Invalid plan'
        );
    }

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        plan,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Créer un portail de gestion client Stripe
 */
export const createPortalSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { userId, returnUrl } = data;

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      throw new functions.https.HttpsError(
        'not-found',
        'No Stripe customer found'
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    return {
      url: session.url,
    };
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Annuler un abonnement
 */
export const cancelSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { subscriptionId } = data;

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Webhook Stripe pour gérer les événements
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Traiter l'événement
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Webhook processing failed');
  }
});

/**
 * Gérer la complétion du checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;

  if (!userId || !plan) {
    console.error('Missing userId or plan in session metadata');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // Mettre à jour l'abonnement dans Firestore
  await db.collection('subscriptions').doc(userId).set({
    userId,
    plan,
    status: subscription.status,
    stripeCustomerId: session.customer,
    stripeSubscriptionId: subscription.id,
    currentPeriodStart: admin.firestore.Timestamp.fromDate(
      new Date(subscription.current_period_start * 1000)
    ),
    currentPeriodEnd: admin.firestore.Timestamp.fromDate(
      new Date(subscription.current_period_end * 1000)
    ),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

/**
 * Gérer la mise à jour d'un abonnement
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    // Trouver l'utilisateur via le customerId
    const usersSnapshot = await db
      .collection('users')
      .where('stripeCustomerId', '==', subscription.customer)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', subscription.customer);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    await updateSubscriptionInFirestore(userDoc.id, subscription);
  } else {
    await updateSubscriptionInFirestore(userId, subscription);
  }
}

/**
 * Gérer la suppression d'un abonnement
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    const usersSnapshot = await db
      .collection('users')
      .where('stripeCustomerId', '==', subscription.customer)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', subscription.customer);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    await db.collection('subscriptions').doc(userDoc.id).update({
      plan: 'free',
      status: 'canceled',
      stripeSubscriptionId: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else {
    await db.collection('subscriptions').doc(userId).update({
      plan: 'free',
      status: 'canceled',
      stripeSubscriptionId: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

/**
 * Gérer l'échec d'un paiement
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const usersSnapshot = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    console.error('No user found for customer:', customerId);
    return;
  }

  const userDoc = usersSnapshot.docs[0];

  await db.collection('subscriptions').doc(userDoc.id).update({
    status: 'past_due',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // TODO: Envoyer une notification à l'utilisateur
}

/**
 * Utilitaire pour mettre à jour l'abonnement dans Firestore
 */
async function updateSubscriptionInFirestore(
  userId: string,
  subscription: Stripe.Subscription
) {
  // Déterminer le plan depuis les items
  let plan = 'free';
  if (subscription.items.data.length > 0) {
    const priceId = subscription.items.data[0].price.id;
    if (priceId === 'price_premium_monthly') {
      plan = 'premium';
    } else if (priceId === 'price_pro_monthly') {
      plan = 'pro';
    }
  }

  await db.collection('subscriptions').doc(userId).update({
    plan,
    status: subscription.status,
    currentPeriodStart: admin.firestore.Timestamp.fromDate(
      new Date(subscription.current_period_start * 1000)
    ),
    currentPeriodEnd: admin.firestore.Timestamp.fromDate(
      new Date(subscription.current_period_end * 1000)
    ),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
