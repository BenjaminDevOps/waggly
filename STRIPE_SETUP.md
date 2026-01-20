# 💳 Configuration Stripe pour PetHealth

Ce guide vous explique comment configurer Stripe pour activer les paiements et abonnements dans PetHealth.

## 📋 Prérequis

- Compte Stripe ([stripe.com](https://stripe.com))
- Firebase CLI installé
- Node.js 18+

## 1. Configuration du Compte Stripe

### 1.1 Créer un Compte Stripe

1. Rendez-vous sur [stripe.com](https://stripe.com)
2. Créez un compte (ou connectez-vous)
3. Complétez les informations de votre entreprise

### 1.2 Obtenir les Clés API

1. Dans le Dashboard Stripe, allez dans **Développeurs** > **Clés API**
2. Copiez :
   - **Clé publique de test** (pk_test_...)
   - **Clé secrète de test** (sk_test_...)

⚠️ **IMPORTANT** : Ne partagez JAMAIS votre clé secrète publiquement !

### 1.3 Créer les Produits et Prix

#### Plan Premium

1. Dans Stripe Dashboard, allez dans **Produits** > **+ Ajouter un produit**
2. Configurez :
   - **Nom** : PetHealth Premium
   - **Description** : Plan Premium pour propriétaires engagés
   - **Tarification** :
     - Prix : 4.99 EUR
     - Modèle de facturation : Récurrent
     - Période de facturation : Mensuel
3. Cliquez sur **Enregistrer le produit**
4. **Copiez l'ID du prix** (price_xxxxx) - vous en aurez besoin

#### Plan Pro

1. Créez un nouveau produit :
   - **Nom** : PetHealth Pro
   - **Description** : Plan Professionnel pour éleveurs
   - **Tarification** :
     - Prix : 14.99 EUR
     - Modèle de facturation : Récurrent
     - Période de facturation : Mensuel
2. **Copiez l'ID du prix** (price_xxxxx)

### 1.4 Configurer le Webhook

1. Dans Stripe Dashboard, allez dans **Développeurs** > **Webhooks**
2. Cliquez sur **+ Ajouter un point de terminaison**
3. URL du point de terminaison :
   ```
   https://your-region-your-project.cloudfunctions.net/stripeWebhook
   ```
   (Remplacez par l'URL de votre Cloud Function après déploiement)

4. Sélectionnez les événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

5. Cliquez sur **Ajouter un point de terminaison**
6. **Copiez le secret de signature** (whsec_...)

## 2. Configuration de l'Application

### 2.1 Variables d'Environnement

Ajoutez les clés Stripe dans votre fichier `.env` :

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2.2 Mettre à Jour les Price IDs

Dans `src/types/subscription.ts`, remplacez les IDs de prix :

```typescript
export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanConfig> = {
  // ...
  premium: {
    // ...
    stripePriceId: 'price_your_premium_price_id', // ← Remplacez ici
  },
  pro: {
    // ...
    stripePriceId: 'price_your_pro_price_id', // ← Remplacez ici
  },
};
```

## 3. Déploiement des Cloud Functions

### 3.1 Installer Firebase CLI

```bash
npm install -g firebase-tools
```

### 3.2 Se Connecter à Firebase

```bash
firebase login
```

### 3.3 Initialiser Firebase Functions

```bash
cd functions
npm install
```

### 3.4 Configurer les Secrets

Configurez les variables d'environnement pour les Functions :

```bash
firebase functions:config:set stripe.secret_key="sk_test_your_secret_key"
firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_secret"
```

### 3.5 Déployer les Functions

```bash
cd functions
npm run deploy
```

Notez l'URL de la function `stripeWebhook` retournée.

### 3.6 Mettre à Jour le Webhook Stripe

Retournez dans Stripe Dashboard > Webhooks et mettez à jour l'URL avec celle de votre Cloud Function.

## 4. Configuration Firestore

### 4.1 Ajouter les Règles de Sécurité

Dans Firestore, ajoutez ces règles pour la collection `subscriptions` :

```javascript
match /subscriptions/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if false; // Seules les Cloud Functions peuvent écrire
}
```

### 4.2 Créer les Index

Firestore créera automatiquement les index nécessaires lors de la première utilisation.

## 5. Tests

### 5.1 Cartes de Test Stripe

Utilisez ces cartes pour tester :

| Carte | Numéro | Résultat |
|-------|--------|----------|
| Succès | 4242 4242 4242 4242 | Paiement réussi |
| Échec | 4000 0000 0000 0002 | Paiement refusé |
| 3D Secure | 4000 0027 6000 3184 | Requiert authentification |

- **Date d'expiration** : N'importe quelle date future
- **CVC** : N'importe quels 3 chiffres
- **Code postal** : N'importe quel code

### 5.2 Tester un Abonnement

1. Lancez l'application
2. Connectez-vous
3. Allez dans **Profil** > **Mon Abonnement**
4. Cliquez sur **Passer à Premium**
5. Utilisez la carte de test `4242 4242 4242 4242`
6. Complétez le paiement
7. Vérifiez que l'abonnement est actif dans l'app
8. Vérifiez dans Firestore que la collection `subscriptions` a été mise à jour

### 5.3 Tester l'Annulation

1. Dans l'app, allez dans **Mon Abonnement**
2. Cliquez sur **Annuler l'abonnement**
3. Confirmez
4. Vérifiez que `cancelAtPeriodEnd` est `true` dans Firestore

## 6. Passage en Production

### 6.1 Activer votre Compte Stripe

1. Dans Stripe Dashboard, complétez l'activation de votre compte
2. Fournissez les informations bancaires
3. Vérifiez votre identité

### 6.2 Obtenir les Clés de Production

1. Dans Stripe Dashboard, désactivez le **Mode test**
2. Copiez les nouvelles clés API de production
3. Mettez à jour vos variables d'environnement

### 6.3 Créer les Produits en Production

Recréez les produits Premium et Pro en mode production avec les mêmes prix.

### 6.4 Mettre à Jour les Functions

```bash
firebase functions:config:set stripe.secret_key="sk_live_your_live_secret_key"
firebase functions:config:set stripe.webhook_secret="whsec_your_live_webhook_secret"
cd functions
npm run deploy
```

### 6.5 Mettre à Jour le Webhook

Créez un nouveau webhook en production avec l'URL de votre Cloud Function.

## 7. Architecture des Paiements

```
┌─────────────┐
│   Mobile    │
│     App     │
└──────┬──────┘
       │
       │ 1. Demande checkout
       ▼
┌─────────────────┐
│ Cloud Function  │
│ createCheckout  │
└──────┬──────────┘
       │
       │ 2. Crée session
       ▼
┌─────────────┐
│   Stripe    │
│   Checkout  │
└──────┬──────┘
       │
       │ 3. Paiement validé
       ▼
┌─────────────┐
│   Webhook   │
│   Stripe    │
└──────┬──────┘
       │
       │ 4. Mise à jour
       ▼
┌─────────────┐
│  Firestore  │
│subscription │
└─────────────┘
```

## 8. Fonctionnalités Disponibles

### 8.1 Plans Disponibles

| Plan | Prix | Fonctionnalités |
|------|------|----------------|
| **Gratuit** | 0€ | 2 animaux, 5 diagnostics IA/mois |
| **Premium** | 4.99€/mois | 5 animaux, 50 diagnostics IA/mois, Export PDF, Partage vétérinaires |
| **Pro** | 14.99€/mois | Illimité, Support prioritaire, Stockage illimité |

### 8.2 Restrictions Implémentées

Le système vérifie automatiquement :
- Nombre maximum d'animaux
- Quota mensuel de diagnostics IA
- Accès aux fonctionnalités premium (PDF, analytics, etc.)

## 9. Sécurité

### 9.1 Bonnes Pratiques

- ✅ Clé secrète uniquement côté serveur (Cloud Functions)
- ✅ Vérification de la signature des webhooks
- ✅ Authentification Firebase requise
- ✅ Règles Firestore strictes
- ✅ Pas de prix codés en dur côté client

### 9.2 Protection contre la Fraude

Stripe inclut automatiquement :
- Radar (détection de fraude)
- 3D Secure pour cartes européennes
- Blocage de paiements suspects

## 10. Support et Dépannage

### Problèmes Courants

#### "Invalid API Key"
→ Vérifiez que vos clés Stripe sont correctes dans `.env`

#### "No such price"
→ Vérifiez que les Price IDs dans `subscription.ts` correspondent à ceux de Stripe

#### "Webhook signature verification failed"
→ Vérifiez que le `STRIPE_WEBHOOK_SECRET` est correct

#### "Permission denied on subscriptions"
→ Vérifiez les règles Firestore pour la collection `subscriptions`

### Logs

Consultez les logs des Cloud Functions :

```bash
firebase functions:log
```

Consultez les événements dans Stripe Dashboard > Développeurs > Événements

## 11. Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe avec Firebase](https://firebase.google.com/docs/use-cases/payments)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (pour tester localement)
- [Support Stripe](https://support.stripe.com/)

---

**Votre système de paiement est maintenant configuré ! 🎉**

Pour toute question : support@pethealth.app
