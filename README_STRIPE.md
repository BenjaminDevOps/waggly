# 💳 Système de Facturation Freemium avec Stripe

PetHealth intègre un système de facturation freemium complet basé sur Stripe, permettant de monétiser l'application tout en offrant une version gratuite.

## 🎯 Vue d'Ensemble

### Plans Disponibles

| Plan | Prix | Animaux | Diagnostics IA/mois | Fonctionnalités Premium |
|------|------|---------|---------------------|------------------------|
| **Gratuit** | 0€ | 2 | 5 | ❌ |
| **Premium** | 4.99€/mois | 5 | 50 | ✅ Export PDF, Partage vétérinaires, Analytics |
| **Pro** | 14.99€/mois | Illimité | Illimité | ✅ Tout Premium + Support prioritaire |

### Fonctionnalités du Système

- ✅ **Abonnements récurrents** avec Stripe
- ✅ **Gestion automatique** des paiements
- ✅ **Webhooks** pour synchronisation temps réel
- ✅ **Portail client** Stripe intégré
- ✅ **Restrictions par plan** appliquées automatiquement
- ✅ **Cartes de test** pour développement
- ✅ **Cloud Functions** sécurisées
- ✅ **Interface utilisateur** moderne et intuitive

## 📁 Architecture

### Structure des Fichiers

```
Petsheath/
├── app/(tabs)/
│   ├── pricing.tsx          # Écran de sélection de plan
│   └── subscription.tsx     # Gestion de l'abonnement
├── src/
│   ├── types/
│   │   └── subscription.ts  # Types et configuration des plans
│   ├── services/
│   │   ├── stripeService.ts      # Service Stripe côté client
│   │   └── subscriptionService.ts # Logique d'abonnement
│   └── store/
│       └── useSubscriptionStore.ts # État global abonnement
└── functions/
    └── src/
        └── index.ts         # Cloud Functions Stripe
```

### Flux de Paiement

```
1. Utilisateur clique sur "Passer à Premium"
   ↓
2. App appelle Cloud Function createCheckoutSession
   ↓
3. Cloud Function crée session Stripe
   ↓
4. Utilisateur redirigé vers Stripe Checkout
   ↓
5. Paiement effectué
   ↓
6. Webhook Stripe déclenché
   ↓
7. Cloud Function met à jour Firestore
   ↓
8. App synchronisée automatiquement
```

## 🚀 Intégration dans l'App

### 1. Écran de Pricing

L'écran `pricing.tsx` permet aux utilisateurs de :
- Voir les 3 plans côte à côte
- Comparer les fonctionnalités
- Sélectionner et souscrire à un plan
- Voir le plan actuel mis en évidence

**Navigation :**
```typescript
router.push('/(tabs)/pricing');
```

### 2. Gestion de l'Abonnement

L'écran `subscription.tsx` permet de :
- Voir le plan actuel et son statut
- Voir les dates de facturation
- Passer à un plan supérieur
- Gérer les moyens de paiement (via portail Stripe)
- Annuler l'abonnement

**Accessible depuis :** Profil > Mon Abonnement

### 3. Restrictions par Plan

Le système vérifie automatiquement les droits :

```typescript
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

const { canPerformAction } = useSubscriptionStore();

// Vérifier avant d'ajouter un animal
const result = await canPerformAction(userId, 'add_pet');
if (!result.allowed) {
  Alert.alert('Limite atteinte', result.reason);
  router.push('/(tabs)/pricing');
  return;
}

// Vérifier avant un diagnostic IA
const result = await canPerformAction(userId, 'ai_diagnostic');

// Vérifier avant export PDF
const result = await canPerformAction(userId, 'export_pdf');
```

### 4. Affichage du Plan Actuel

```typescript
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

const { subscription, isPremium, isPro } = useSubscriptionStore();

// Afficher un badge Premium
{isPremium() && <Badge text="Premium" />}

// Limiter une fonctionnalité
{isPro() && <AdvancedAnalytics />}

// Afficher le plan
<Text>{subscription?.plan}</Text>
```

## 🔧 Configuration

### Prérequis

1. Compte Stripe créé
2. Produits et prix configurés dans Stripe
3. Webhooks configurés
4. Cloud Functions déployées

### Étapes Rapides

1. **Obtenir les clés Stripe :**
   ```bash
   # Dans Stripe Dashboard > Développeurs > Clés API
   pk_test_... (clé publique)
   sk_test_... (clé secrète)
   ```

2. **Configurer `.env` :**
   ```env
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Créer les produits dans Stripe :**
   - Premium : 4.99€/mois
   - Pro : 14.99€/mois

4. **Mettre à jour les Price IDs :**
   Dans `src/types/subscription.ts` :
   ```typescript
   stripePriceId: 'price_your_actual_price_id'
   ```

5. **Déployer les Cloud Functions :**
   ```bash
   cd functions
   npm install
   npm run deploy
   ```

6. **Configurer le webhook Stripe :**
   URL : `https://your-region-project.cloudfunctions.net/stripeWebhook`

📖 **Pour plus de détails, consultez [`STRIPE_SETUP.md`](./STRIPE_SETUP.md)**

## 💡 Utilisation

### Pour les Développeurs

#### Ajouter une Nouvelle Restriction

1. Modifiez `PlanFeatures` dans `subscription.ts` :
   ```typescript
   export interface PlanFeatures {
     // ... features existantes
     newFeature: boolean;
   }
   ```

2. Mettez à jour `PLAN_CONFIGS` :
   ```typescript
   premium: {
     features: {
       // ... features existantes
       newFeature: true,
     }
   }
   ```

3. Ajoutez la vérification dans `subscriptionService.ts` :
   ```typescript
   case 'new_feature':
     if (!planConfig.features.newFeature) {
       return { allowed: false, reason: 'Premium requis' };
     }
     return { allowed: true };
   ```

#### Créer un Nouveau Plan

1. Ajoutez le plan dans `subscription.ts` :
   ```typescript
   export type SubscriptionPlan = 'free' | 'premium' | 'pro' | 'enterprise';
   ```

2. Configurez le plan :
   ```typescript
   enterprise: {
     id: 'enterprise',
     name: 'Entreprise',
     price: 49.99,
     // ... configuration
   }
   ```

3. Créez le produit dans Stripe

4. Mettez à jour les Cloud Functions

### Pour les Testeurs

#### Cartes de Test

| Scénario | Numéro de carte |
|----------|----------------|
| ✅ Succès | 4242 4242 4242 4242 |
| ❌ Échec | 4000 0000 0000 0002 |
| 🔐 3D Secure | 4000 0027 6000 3184 |

**Autres infos :**
- Date d'expiration : N'importe quelle date future
- CVC : N'importe quels 3 chiffres
- Code postal : N'importe lequel

#### Scénarios de Test

**Test 1 : Souscription Premium**
1. Connectez-vous à l'app
2. Profil > Mon Abonnement
3. Passer à Premium
4. Utilisez 4242 4242 4242 4242
5. Vérifiez que le plan est Premium

**Test 2 : Annulation**
1. Mon Abonnement
2. Annuler l'abonnement
3. Confirmez
4. Vérifiez "Se termine le..."

**Test 3 : Restrictions**
1. Avec plan gratuit, ajoutez 3 animaux
2. Le 3ème devrait être bloqué
3. Passez à Premium
4. Réessayez, devrait fonctionner

## 📊 Données Firestore

### Collection `subscriptions`

```typescript
{
  userId: string,
  plan: 'free' | 'premium' | 'pro',
  status: 'active' | 'canceled' | 'past_due',
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  currentPeriodStart: Timestamp,
  currentPeriodEnd: Timestamp,
  cancelAtPeriodEnd: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Règles de Sécurité

```javascript
match /subscriptions/{userId} {
  allow read: if request.auth.uid == userId;
  allow write: if false; // Seules les Cloud Functions
}
```

## 🎨 Interface Utilisateur

### Écran Pricing

- **Design :** Cards avec comparaison côte à côte
- **Couleurs :** Plan populaire en violet (#6366f1)
- **Badges :** "POPULAIRE", "Plan actuel"
- **CTA :** Boutons colorés selon le plan

### Écran Subscription

- **Header :** Gradient selon le plan
- **Statut :** Badge actif/inactif
- **Fonctionnalités :** Liste avec icônes
- **Actions :** Upgrade, Gérer, Annuler

## 🔒 Sécurité

### Bonnes Pratiques Implémentées

- ✅ Clé secrète uniquement en Cloud Functions
- ✅ Vérification signature webhooks
- ✅ Authentification Firebase requise
- ✅ Règles Firestore strictes
- ✅ Pas de prix côté client
- ✅ Validation serveur des plans

### Protection Fraude

Stripe inclut :
- Radar (ML anti-fraude)
- 3D Secure automatique
- Blocage paiements suspects

## 📈 Métriques et Analytics

### Tableaux de Bord Disponibles

**Stripe Dashboard :**
- Revenus mensuels récurrents (MRR)
- Taux de rétention
- Taux de churning
- Paiements échoués

**Firebase Console :**
- Nombre d'abonnements actifs
- Distribution par plan
- Conversions gratuit → payant

## 🐛 Dépannage

### Problèmes Courants

**"Invalid API Key"**
- Vérifiez `.env`
- Vérifiez mode test/production

**"No such price"**
- Vérifiez Price IDs dans `subscription.ts`
- Vérifiez que les produits existent dans Stripe

**"Webhook failed"**
- Vérifiez le secret webhook
- Consultez logs : `firebase functions:log`

**"Permission denied"**
- Vérifiez règles Firestore
- Vérifiez authentification utilisateur

## 📚 Ressources

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [STRIPE_SETUP.md](./STRIPE_SETUP.md) - Guide complet

## 🎯 Roadmap

- [ ] Plans annuels (-20%)
- [ ] Essai gratuit 7 jours
- [ ] Codes promo
- [ ] Programme de parrainage
- [ ] Plans entreprise personnalisés
- [ ] Support Apple Pay / Google Pay
- [ ] Facturation par crédit (usage)

---

**Le système de paiement est prêt à générer des revenus ! 💰**

Pour questions : billing@pethealth.app
