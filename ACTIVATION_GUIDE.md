# 🔥 Guide d'Activation Firebase/Firestore et Stripe

Guide étape par étape pour configurer Firebase, Firestore et Stripe pour PetHealth.

---

## 📱 PARTIE 1 : FIREBASE ET FIRESTORE

### Étape 1 : Créer un Projet Firebase

1. **Allez sur la Console Firebase**
   ```
   https://console.firebase.google.com
   ```

2. **Cliquez sur "Ajouter un projet"**

3. **Configurez le projet :**
   - **Nom du projet :** `PetHealth` (ou votre choix)
   - **Activer Google Analytics :** Oui (recommandé)
   - **Compte Analytics :** Créez-en un ou utilisez existant
   - Cliquez sur **"Créer un projet"**

4. **Attendez la création** (30 secondes - 1 minute)

---

### Étape 2 : Ajouter une Application Web

1. **Dans la console Firebase, sur la page d'accueil du projet**

2. **Cliquez sur l'icône Web** `</>`

3. **Enregistrez votre application :**
   - **Nom de l'application :** `PetHealth Web`
   - **Cochez** "Configurer Firebase Hosting" (optionnel)
   - Cliquez sur **"Enregistrer l'application"**

4. **Copiez la configuration Firebase**

   Vous verrez un code comme celui-ci :
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyB...",
     authDomain: "pethealth-xxxxx.firebaseapp.com",
     projectId: "pethealth-xxxxx",
     storageBucket: "pethealth-xxxxx.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

5. **Gardez cette page ouverte** (nous allons copier ces valeurs)

---

### Étape 3 : Activer Authentication

1. **Dans le menu Firebase, cliquez sur "Authentication"**

2. **Cliquez sur "Commencer"**

3. **Onglet "Sign-in method"**

4. **Activer Email/Password :**
   - Cliquez sur **"Email/Password"**
   - Activez le **premier commutateur** (Email/Password)
   - Cliquez sur **"Enregistrer"**

5. **(Optionnel) Activer Google Sign-In :**
   - Cliquez sur **"Google"**
   - Activez le commutateur
   - Configurez l'email du projet
   - Cliquez sur **"Enregistrer"**

✅ **Authentication activé !**

---

### Étape 4 : Activer Firestore Database

1. **Dans le menu Firebase, cliquez sur "Firestore Database"**

2. **Cliquez sur "Créer une base de données"**

3. **Choisissez le mode :**
   - Sélectionnez **"Commencer en mode production"**
   - Cliquez sur **"Suivant"**

4. **Choisissez l'emplacement :**
   - Sélectionnez **"europe-west1"** (Belgique) ou **"europe-west9"** (Paris)
   - Cliquez sur **"Activer"**

5. **Attendez la création** (30 secondes)

✅ **Firestore activé !**

---

### Étape 5 : Configurer les Règles de Sécurité Firestore

1. **Dans Firestore Database, cliquez sur l'onglet "Règles"**

2. **Remplacez le contenu par :**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    // Pets collection
    match /pets/{petId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() &&
        resource.data.userId == request.auth.uid;
    }

    // Vaccinations collection
    match /vaccinations/{vaccinationId} {
      allow read, write: if isAuthenticated();
    }

    // Appointments collection
    match /appointments/{appointmentId} {
      allow read, write: if isAuthenticated();
    }

    // Weight records collection
    match /weightRecords/{recordId} {
      allow read, write: if isAuthenticated();
    }

    // Medications collection
    match /medications/{medicationId} {
      allow read, write: if isAuthenticated();
    }

    // Health records collection
    match /healthRecords/{recordId} {
      allow read, write: if isAuthenticated();
    }

    // Diagnostic sessions collection
    match /diagnosticSessions/{sessionId} {
      allow read: if isAuthenticated() &&
        resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
    }

    // Subscriptions collection (géré par Cloud Functions)
    match /subscriptions/{userId} {
      allow read: if isOwner(userId);
      allow write: if false; // Seules les Cloud Functions peuvent écrire
    }
  }
}
```

3. **Cliquez sur "Publier"**

✅ **Règles de sécurité configurées !**

---

### Étape 6 : Activer Storage (pour les photos)

1. **Dans le menu Firebase, cliquez sur "Storage"**

2. **Cliquez sur "Commencer"**

3. **Choisissez le mode :**
   - Sélectionnez **"Commencer en mode production"**
   - Cliquez sur **"Suivant"**

4. **Choisissez l'emplacement :**
   - Utilisez le **même emplacement que Firestore**
   - Cliquez sur **"Terminé"**

5. **Configurez les règles de sécurité Storage :**

   Allez dans l'onglet **"Règles"** et remplacez par :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /pets/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. **Cliquez sur "Publier"**

✅ **Storage activé !**

---

### Étape 7 : Récupérer les Clés Firebase

1. **Retournez à la page de configuration** (étape 2)

   Ou allez dans : **Paramètres du projet** (icône ⚙️) > **Général** > **Vos applications**

2. **Copiez les valeurs suivantes :**

```
apiKey: "AIzaSyB..."
authDomain: "pethealth-xxxxx.firebaseapp.com"
projectId: "pethealth-xxxxx"
storageBucket: "pethealth-xxxxx.appspot.com"
messagingSenderId: "123456789012"
appId: "1:123456789012:web:abcdef123456"
```

3. **Gardez ces valeurs** (nous les utiliserons à l'étape 11)

✅ **Firebase complètement configuré !**

---

## 💳 PARTIE 2 : STRIPE

### Étape 8 : Créer un Compte Stripe

1. **Allez sur Stripe**
   ```
   https://stripe.com
   ```

2. **Cliquez sur "S'inscrire"**

3. **Remplissez le formulaire :**
   - Email
   - Nom complet
   - Pays (France, Belgique, etc.)
   - Mot de passe

4. **Validez votre email**

5. **Complétez votre profil** (vous pourrez le faire plus tard)

---

### Étape 9 : Activer le Mode Test

1. **Dans le Dashboard Stripe, vérifiez que vous êtes en "Mode test"**

   En haut à droite, vous devez voir : **"Test mode"** activé

2. Si ce n'est pas le cas, cliquez sur le toggle pour activer le mode test

---

### Étape 10 : Récupérer les Clés API Stripe

1. **Dans le menu Stripe, cliquez sur "Développeurs"**

2. **Cliquez sur "Clés API"**

3. **Copiez les clés :**

   - **Clé publique de test** (commence par `pk_test_`)
   - **Clé secrète de test** (commence par `sk_test_`)
     - ⚠️ Cliquez sur "Révéler la clé secrète de test" pour la voir

4. **Gardez ces valeurs** (nous les utiliserons à l'étape 11)

⚠️ **IMPORTANT :** Ne partagez JAMAIS votre clé secrète publiquement !

---

### Étape 10.5 : Créer les Produits Stripe

1. **Dans le menu Stripe, cliquez sur "Produits"**

2. **Créer le Plan Premium :**
   - Cliquez sur **"+ Ajouter un produit"**
   - **Nom :** `PetHealth Premium`
   - **Description :** `Plan Premium pour propriétaires engagés`
   - **Prix :** `4.99 EUR`
   - **Modèle de facturation :** `Récurrent`
   - **Période de facturation :** `Mensuel`
   - Cliquez sur **"Enregistrer le produit"**
   - **⚠️ COPIEZ l'ID du prix** (commence par `price_`)

3. **Créer le Plan Pro :**
   - Cliquez sur **"+ Ajouter un produit"**
   - **Nom :** `PetHealth Pro`
   - **Description :** `Plan Professionnel pour éleveurs`
   - **Prix :** `14.99 EUR`
   - **Modèle de facturation :** `Récurrent`
   - **Période de facturation :** `Mensuel`
   - Cliquez sur **"Enregistrer le produit"**
   - **⚠️ COPIEZ l'ID du prix** (commence par `price_`)

4. **Gardez ces IDs** (price_xxxxx)

---

## ⚙️ PARTIE 3 : CONFIGURATION DE L'APPLICATION

### Étape 11 : Créer le Fichier .env

1. **Dans le dossier du projet :**

```bash
cd /home/user/Petsheath
```

2. **Copiez le template :**

```bash
cp .env.example .env
```

3. **Éditez le fichier .env :**

```bash
nano .env
# ou utilisez votre éditeur préféré
```

4. **Remplissez avec vos vraies valeurs :**

```env
# Firebase Configuration (depuis l'étape 7)
FIREBASE_API_KEY=AIzaSyB...
FIREBASE_AUTH_DOMAIN=pethealth-xxxxx.firebaseapp.com
FIREBASE_PROJECT_ID=pethealth-xxxxx
FIREBASE_STORAGE_BUCKET=pethealth-xxxxx.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Google Gemini AI (vous l'obtiendrez à l'étape 12)
GEMINI_API_KEY=AIzaSy...

# Stripe Configuration (depuis l'étape 10)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

5. **Sauvegardez le fichier** (Ctrl+O, Enter, Ctrl+X pour nano)

---

### Étape 12 : Obtenir la Clé Gemini AI

1. **Allez sur Google AI Studio**
   ```
   https://makersuite.google.com/app/apikey
   ```

2. **Connectez-vous avec votre compte Google**

3. **Cliquez sur "Create API Key"**

4. **Sélectionnez un projet Google Cloud** (ou créez-en un)

5. **Copiez la clé générée** (commence par `AIzaSy`)

6. **Ajoutez-la dans votre .env :**

```env
GEMINI_API_KEY=AIzaSy...
```

---

### Étape 13 : Mettre à Jour les Price IDs Stripe

1. **Ouvrez le fichier :**

```bash
nano src/types/subscription.ts
```

2. **Trouvez la section `PLAN_CONFIGS`**

3. **Remplacez les Price IDs :**

```typescript
export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanConfig> = {
  // ...
  premium: {
    // ...
    stripePriceId: 'price_votre_premium_id', // ← Remplacez
  },
  pro: {
    // ...
    stripePriceId: 'price_votre_pro_id', // ← Remplacez
  },
};
```

4. **Sauvegardez** (Ctrl+O, Enter, Ctrl+X)

---

## ✅ PARTIE 4 : VÉRIFICATION

### Étape 14 : Tester la Configuration

1. **Installer les dépendances :**

```bash
npm install
```

2. **Lancer l'application :**

```bash
npm start
```

3. **Tester l'authentification :**
   - Créez un compte test
   - Vérifiez dans Firebase Console > Authentication

4. **Tester Firestore :**
   - Ajoutez un animal dans l'app
   - Vérifiez dans Firebase Console > Firestore > pets

5. **Tester Stripe :**
   - Allez dans Profil > Mon Abonnement
   - Tentez de passer à Premium
   - Utilisez la carte test : `4242 4242 4242 4242`

---

## 🎉 RÉCAPITULATIF

Vous avez maintenant :

✅ **Firebase** configuré
  - Authentication activé
  - Firestore activé avec règles de sécurité
  - Storage activé

✅ **Stripe** configuré
  - Compte créé
  - Produits Premium et Pro créés
  - Clés API récupérées

✅ **Application** configurée
  - Fichier .env créé avec toutes les clés
  - Price IDs Stripe mis à jour
  - Prêt à tester !

---

## 📝 Checklist Finale

- [ ] Compte Firebase créé
- [ ] Authentication activé (Email/Password)
- [ ] Firestore activé
- [ ] Règles de sécurité Firestore configurées
- [ ] Storage activé
- [ ] Règles de sécurité Storage configurées
- [ ] Clés Firebase copiées
- [ ] Compte Stripe créé
- [ ] Mode test Stripe activé
- [ ] Produits Premium et Pro créés dans Stripe
- [ ] Clés API Stripe copiées
- [ ] Clé Gemini AI obtenue
- [ ] Fichier .env créé et rempli
- [ ] Price IDs mis à jour dans subscription.ts
- [ ] npm install exécuté
- [ ] Application lancée et testée

---

## 🆘 Problèmes Courants

### Firebase : "Permission denied"
→ Vérifiez les règles de sécurité Firestore

### Stripe : "Invalid API Key"
→ Vérifiez que vous avez copié la bonne clé (mode test)

### Gemini : "API key not valid"
→ Vérifiez que la clé est bien dans .env

### App ne démarre pas
→ Vérifiez que toutes les variables .env sont remplies
→ Exécutez `npm install` à nouveau

---

## 📞 Support

Pour toute question :
- Firebase : [firebase.google.com/support](https://firebase.google.com/support)
- Stripe : [support.stripe.com](https://support.stripe.com)
- Gemini : [ai.google.dev](https://ai.google.dev)

---

**Votre application est maintenant prête à fonctionner ! 🚀**
