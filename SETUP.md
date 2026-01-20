# 🛠️ Guide de Configuration Détaillé - PetHealth

Ce guide vous accompagne pas à pas dans la configuration de l'application PetHealth.

## 📋 Table des Matières

1. [Configuration Firebase](#1-configuration-firebase)
2. [Configuration Gemini AI](#2-configuration-gemini-ai)
3. [Configuration Locale](#3-configuration-locale)
4. [Tests et Déploiement](#4-tests-et-déploiement)

## 1. Configuration Firebase

### 1.1 Créer un Projet Firebase

1. Rendez-vous sur [console.firebase.google.com](https://console.firebase.google.com)
2. Cliquez sur "Ajouter un projet"
3. Nom du projet : `PetHealth` (ou votre choix)
4. Activez Google Analytics (optionnel)
5. Créez le projet

### 1.2 Ajouter une Application

#### Pour iOS :
1. Dans la console Firebase, cliquez sur l'icône iOS
2. iOS Bundle ID : `com.pethealth.app`
3. Téléchargez `GoogleService-Info.plist`
4. Placez-le dans le dossier racine du projet

#### Pour Android :
1. Cliquez sur l'icône Android
2. Package Android : `com.pethealth.app`
3. Téléchargez `google-services.json`
4. Placez-le dans le dossier racine du projet

#### Pour Web :
1. Cliquez sur l'icône Web
2. Copiez la configuration Firebase
3. Ces valeurs iront dans votre `.env`

### 1.3 Activer l'Authentication

1. Dans le menu Firebase, allez dans **Authentication**
2. Cliquez sur "Commencer"
3. Onglet "Sign-in method"
4. Activez **Email/Password**
5. Cliquez sur "Enregistrer"

Optionnel - Activer Google Sign-In :
1. Activez **Google**
2. Configurez l'email du projet
3. Enregistrez

### 1.4 Configurer Cloud Firestore

1. Dans le menu, allez dans **Firestore Database**
2. Cliquez sur "Créer une base de données"
3. Mode : **Production** (pour la sécurité)
4. Emplacement : Choisir le plus proche (ex: `europe-west1`)
5. Créer

#### 1.4.1 Règles de Sécurité Firestore

Remplacez les règles par défaut par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    // Pets
    match /pets/{petId} {
      allow read, write: if isAuthenticated() &&
        (resource == null || resource.data.userId == request.auth.uid);
    }

    // Vaccinations
    match /vaccinations/{vaccinationId} {
      allow read, write: if isAuthenticated();
    }

    // Appointments
    match /appointments/{appointmentId} {
      allow read, write: if isAuthenticated();
    }

    // Weight Records
    match /weightRecords/{recordId} {
      allow read, write: if isAuthenticated();
    }

    // Medications
    match /medications/{medicationId} {
      allow read, write: if isAuthenticated();
    }

    // Health Records
    match /healthRecords/{recordId} {
      allow read, write: if isAuthenticated();
    }

    // Diagnostic Sessions
    match /diagnosticSessions/{sessionId} {
      allow read, write: if isAuthenticated() &&
        (resource == null || resource.data.userId == request.auth.uid);
    }
  }
}
```

Publiez les règles.

#### 1.4.2 Créer les Index

Dans l'onglet "Index", ajoutez ces index composites :

**Index 1 - Pets par utilisateur**
- Collection : `pets`
- Champs :
  - `userId` (Ascending)
  - `createdAt` (Descending)

**Index 2 - Vaccinations par animal**
- Collection : `vaccinations`
- Champs :
  - `petId` (Ascending)
  - `date` (Descending)

**Index 3 - Rendez-vous par animal**
- Collection : `appointments`
- Champs :
  - `petId` (Ascending)
  - `date` (Descending)

**Index 4 - Poids par animal**
- Collection : `weightRecords`
- Champs :
  - `petId` (Ascending)
  - `date` (Descending)

**Index 5 - Sessions diagnostic par utilisateur**
- Collection : `diagnosticSessions`
- Champs :
  - `userId` (Ascending)
  - `timestamp` (Descending)

### 1.5 Activer Storage (Optionnel)

Pour les photos d'animaux :

1. Dans le menu, allez dans **Storage**
2. Cliquez sur "Commencer"
3. Mode : **Production**
4. Emplacement : Identique à Firestore

Règles de sécurité Storage :

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

### 1.6 Récupérer les Clés de Configuration

1. Allez dans **Paramètres du projet** (icône engrenage)
2. Onglet "Général"
3. Section "Vos applications" → Web
4. Copiez les valeurs de `firebaseConfig`

Vous aurez besoin de :
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

## 2. Configuration Gemini AI

### 2.1 Obtenir une Clé API

1. Rendez-vous sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Sélectionnez un projet Google Cloud (ou créez-en un)
5. Copiez la clé générée

### 2.2 Limites et Quotas

Par défaut, l'API Gemini gratuite offre :
- 60 requêtes par minute
- Parfait pour le développement et les tests

Pour la production, envisagez :
- Mise en cache des réponses
- Limitation côté client (throttling)
- Passage à un plan payant si nécessaire

## 3. Configuration Locale

### 3.1 Créer le fichier .env

```bash
cp .env.example .env
```

### 3.2 Remplir les Variables

Éditez `.env` avec vos valeurs :

```env
# Firebase Configuration (depuis Firebase Console)
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=pethealth-xxxxx.firebaseapp.com
FIREBASE_PROJECT_ID=pethealth-xxxxx
FIREBASE_STORAGE_BUCKET=pethealth-xxxxx.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

# Google Gemini AI (depuis Google AI Studio)
GEMINI_API_KEY=AIzaSy...
```

### 3.3 Installer les Dépendances

```bash
npm install
```

### 3.4 Démarrer l'Application

```bash
npx expo start
```

Options :
- Pressez `i` pour iOS Simulator
- Pressez `a` pour Android Emulator
- Scannez le QR code avec Expo Go

## 4. Tests et Déploiement

### 4.1 Tester l'Authentification

1. Lancez l'app
2. Créez un compte test
3. Vérifiez dans Firebase Console → Authentication

### 4.2 Tester Firestore

1. Ajoutez un animal
2. Vérifiez dans Firebase Console → Firestore
3. La collection `pets` doit apparaître

### 4.3 Tester Gemini AI

1. Sélectionnez un animal
2. Allez dans l'onglet Diagnostic
3. Entrez des symptômes (ex: "éternuements, yeux qui coulent")
4. Vérifiez la réponse de l'IA

### 4.4 Build pour Production

#### iOS (nécessite macOS)

```bash
eas build --platform ios
```

#### Android

```bash
eas build --platform android
```

### 4.5 Configuration EAS (Expo Application Services)

1. Installez EAS CLI :
```bash
npm install -g eas-cli
```

2. Connectez-vous :
```bash
eas login
```

3. Configurez le projet :
```bash
eas build:configure
```

## 🎉 Configuration Terminée !

Votre application PetHealth est maintenant configurée et prête à l'emploi !

## 🐛 Problèmes Courants

### Erreur Firebase : "auth/configuration-not-found"
→ Vérifiez que les variables `.env` sont correctes

### Erreur Gemini : "API key not valid"
→ Vérifiez votre clé API Gemini dans `.env`

### Erreur Firestore : "Missing or insufficient permissions"
→ Vérifiez les règles de sécurité Firestore

### App ne démarre pas
→ Supprimez `node_modules` et relancez `npm install`

## 📞 Besoin d'Aide ?

- Documentation Expo : [docs.expo.dev](https://docs.expo.dev)
- Documentation Firebase : [firebase.google.com/docs](https://firebase.google.com/docs)
- Documentation Gemini : [ai.google.dev](https://ai.google.dev)

---

**Bon développement ! 🚀**
