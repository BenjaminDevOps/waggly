# 🐾 PetHealth - Application de Santé pour Animaux de Compagnie

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.73-61dafb.svg)
![Expo](https://img.shields.io/badge/Expo-~50.0-000020.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6.svg)

Application mobile cross-platform (iOS & Android) permettant aux propriétaires d'animaux de compagnie de gérer la santé de leurs compagnons avec l'aide de l'IA.

## ✨ Fonctionnalités

### 🏥 Diagnostic Vétérinaire IA
- Diagnostic préliminaire basé sur **Google Gemini AI**
- Analyse des symptômes en temps réel
- Recommandations personnalisées
- Évaluation de la gravité
- Historique des consultations

### 📖 Carnet de Santé Digital
- **Vaccinations** : Suivi complet avec rappels
- **Poids** : Graphiques d'évolution
- **Rendez-vous** : Gestion des visites vétérinaires
- **Médicaments** : Traitements en cours
- **Historique médical** : Toutes les interventions

### 🎮 Système de Gamification
- **Niveaux et Points** : Progression basée sur l'engagement
- **Badges et Réalisations** : 8+ badges à débloquer
- **Récompenses** : Points pour chaque action
- **Progression visuelle** : Barre de progression animée

### 🐕 Gestion Multi-Animaux
- Support **Chiens, Chats et NAC** (Nouveaux Animaux de Compagnie)
- Profils détaillés par animal
- Photos et informations complètes
- Sélection rapide de l'animal actif

### 🎨 Interface Ludique et Moderne
- Design coloré et accueillant
- Animations fluides
- Navigation intuitive
- Thème cohérent

## 🏗️ Architecture Technique

### Stack Technologique
```
Frontend:
├── React Native (0.73)
├── Expo (~50.0)
├── TypeScript (5.3)
├── Expo Router (Navigation)
└── React Native Reanimated (Animations)

Backend:
├── Firebase Authentication
├── Cloud Firestore (Base de données)
└── Firebase Storage

IA:
└── Google Gemini AI (gemini-pro)

État Global:
└── Zustand

Utilitaires:
├── date-fns (Gestion des dates)
└── Expo Vector Icons
```

### Structure du Projet
```
Petsheath/
├── app/                          # Expo Router - Navigation
│   ├── (auth)/                  # Écrans d'authentification
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/                  # Navigation par onglets
│   │   ├── home.tsx             # Tableau de bord
│   │   ├── pets.tsx             # Gestion des animaux
│   │   ├── diagnostic.tsx       # Diagnostic IA
│   │   ├── health.tsx           # Carnet de santé
│   │   └── profile.tsx          # Profil utilisateur
│   ├── _layout.tsx
│   └── index.tsx
├── src/
│   ├── config/
│   │   └── firebase.ts          # Configuration Firebase
│   ├── services/
│   │   ├── firestoreService.ts  # Service Firestore
│   │   ├── geminiService.ts     # Service Gemini AI
│   │   └── rewardService.ts     # Système de rewards
│   ├── store/
│   │   ├── useAuthStore.ts      # État authentification
│   │   ├── usePetStore.ts       # État animaux
│   │   └── useRewardStore.ts    # État gamification
│   └── types/
│       ├── models.ts            # Types TypeScript
│       └── env.d.ts             # Types variables d'environnement
├── assets/                       # Images et ressources
├── .env.example                 # Template variables d'environnement
├── app.json                     # Configuration Expo
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Installation

### Prérequis
- Node.js >= 18.x
- npm ou yarn
- Expo CLI
- Compte Firebase
- Clé API Google Gemini

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/pethealth.git
cd pethealth
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configurer Firebase**

Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)

Activez les services suivants :
- **Authentication** (Email/Password)
- **Cloud Firestore**
- **Storage**

4. **Obtenir une clé API Gemini**

Rendez-vous sur [Google AI Studio](https://makersuite.google.com/app/apikey) et générez une clé API.

5. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :
```bash
cp .env.example .env
```

Remplissez les variables :
```env
# Firebase Configuration
FIREBASE_API_KEY=votre_api_key
FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
FIREBASE_PROJECT_ID=votre_projet_id
FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
FIREBASE_APP_ID=votre_app_id

# Google Gemini AI
GEMINI_API_KEY=votre_gemini_api_key
```

6. **Initialiser Firestore**

Dans la console Firebase, créez les collections suivantes :
- `users`
- `pets`
- `vaccinations`
- `appointments`
- `weightRecords`
- `medications`
- `healthRecords`
- `diagnosticSessions`

7. **Lancer l'application**
```bash
npm start
# ou
npx expo start
```

Scannez le QR code avec :
- **iOS** : Application Expo Go
- **Android** : Application Expo Go ou Caméra

## 📱 Utilisation

### Première connexion
1. Créez un compte avec email/mot de passe
2. Ajoutez votre premier animal
3. Explorez les fonctionnalités

### Diagnostic IA
1. Sélectionnez un animal
2. Décrivez les symptômes observés
3. Ajoutez des informations complémentaires
4. Obtenez un diagnostic instantané

### Carnet de Santé
1. Sélectionnez un animal
2. Choisissez l'onglet (Vaccins, Poids, RDV)
3. Ajoutez des entrées via le bouton +
4. Consultez l'historique

### Système de Points
- **+10 points** : Ajouter un animal
- **+5 points** : Enregistrer une vaccination
- **+8 points** : Compléter un rendez-vous
- **+3 points** : Enregistrer le poids
- **+5 points** : Utiliser le diagnostic IA

## 🔒 Sécurité et Confidentialité

- **Authentification sécurisée** via Firebase
- **Données chiffrées** en transit et au repos
- **RGPD compliant**
- **Pas de partage de données** avec des tiers

## ⚠️ Avertissement Médical

**IMPORTANT** : Cette application ne remplace pas une consultation vétérinaire professionnelle. Les diagnostics fournis par l'IA sont indicatifs et doivent être validés par un vétérinaire qualifié. En cas d'urgence, consultez immédiatement un vétérinaire.

## 🎯 Roadmap

### Version 1.1 (À venir)
- [ ] Notifications push pour les rappels
- [ ] Export PDF du carnet de santé
- [ ] Mode hors-ligne
- [ ] Partage avec vétérinaires

### Version 1.2
- [ ] Reconnaissance d'image (détection de symptômes)
- [ ] Communauté et forums
- [ ] Géolocalisation vétérinaires
- [ ] Multi-langue

### Version 2.0
- [ ] Apple Watch & Wear OS
- [ ] Intégration appareils IoT (colliers connectés)
- [ ] Téléconsultation vétérinaire
- [ ] Marketplace (produits pour animaux)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - *Développeur Principal* - [GitHub](https://github.com/votre-username)

## 🙏 Remerciements

- Google Gemini AI pour l'intelligence artificielle
- Firebase pour l'infrastructure backend
- Expo pour le framework React Native
- La communauté React Native

## 📞 Support

Pour toute question ou problème :
- Ouvrez une [issue](https://github.com/votre-username/pethealth/issues)
- Email : support@pethealth.app
- Documentation : [docs.pethealth.app](https://docs.pethealth.app)

---

**Fait avec ❤️ pour nos compagnons à quatre pattes** 🐕🐈🐹
