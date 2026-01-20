# 📱 Guide de Build Android pour PetHealth

Ce guide explique comment créer une application Android (.apk ou .aab) à partir du projet PetHealth.

## 🎯 Options de Build

### Option 1 : Expo Application Services (EAS) - **Recommandé**
✅ Build dans le cloud (pas besoin d'Android Studio)
✅ Signature automatique
✅ Simple et rapide
✅ Compatible avec App Store et Play Store

### Option 2 : Build Local avec Expo
⚠️ Nécessite Android Studio
⚠️ Configuration complexe
⚠️ Gestion manuelle des certificats

**Nous utiliserons l'Option 1 (EAS) - plus simple et professionnelle.**

---

## 📦 Méthode 1 : Build avec Expo Application Services (EAS)

### Étape 1 : Installation d'EAS CLI

```bash
# Installer EAS CLI globalement
npm install -g eas-cli

# Vérifier l'installation
eas --version
```

### Étape 2 : Connexion à Expo

```bash
# Se connecter à votre compte Expo (créez-en un si nécessaire)
eas login

# Si vous n'avez pas de compte :
# Créez-le sur https://expo.dev
```

### Étape 3 : Configuration du Projet

```bash
# Dans le dossier Petsheath
cd /home/user/Petsheath

# Initialiser EAS pour le projet
eas build:configure
```

Cette commande va créer un fichier `eas.json` avec la configuration de build.

### Étape 4 : Configuration de l'Application

Vérifiez/modifiez `app.json` :

```json
{
  "expo": {
    "name": "PetHealth",
    "slug": "pethealth",
    "version": "1.0.0",
    "android": {
      "package": "com.pethealth.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "NOTIFICATIONS"
      ]
    }
  }
}
```

### Étape 5 : Créer le Build Android

#### Pour un APK (test/distribution directe) :

```bash
eas build --platform android --profile preview
```

#### Pour un AAB (Google Play Store) :

```bash
eas build --platform android --profile production
```

**Note :** Le build se fait dans le cloud et peut prendre 10-20 minutes.

### Étape 6 : Télécharger l'Application

Une fois le build terminé :

1. EAS affichera un lien de téléchargement
2. Téléchargez le fichier `.apk` ou `.aab`
3. Vous pouvez aussi le retrouver sur [expo.dev/accounts/[your-account]/projects/pethealth/builds](https://expo.dev)

### Étape 7 : Installation sur un Appareil Android

#### Pour APK :
```bash
# Via ADB (Android Debug Bridge)
adb install votre-app.apk

# Ou envoyez le fichier APK sur votre téléphone et installez-le
```

#### Pour AAB :
Les fichiers AAB sont uniquement pour le Play Store, pas pour installation directe.

---

## 🎨 Préparer les Assets (Important !)

Avant de builder, assurez-vous d'avoir les images requises :

### Images Nécessaires

```bash
assets/
├── icon.png           # 1024x1024 - Icône de l'app
├── adaptive-icon.png  # 1024x1024 - Icône Android adaptative
├── splash.png         # 1242x2436 - Écran de démarrage
└── favicon.png        # 48x48 - Favicon (web)
```

### Générer les Assets Automatiquement

Si vous n'avez pas les assets, vous pouvez :

1. **Créer une icône simple :**
   - Allez sur [Figma](https://www.figma.com) ou [Canva](https://www.canva.com)
   - Créez un design 1024x1024
   - Exportez en PNG

2. **Ou utiliser un générateur :**
   ```bash
   # Expo peut générer des assets à partir d'une image
   npx expo-optimize
   ```

---

## ⚙️ Configuration Avancée (eas.json)

Créez/modifiez `eas.json` :

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Profils :**
- `development` : Build de développement avec hot reload
- `preview` : APK pour tests (pas de Play Store)
- `production` : AAB pour Google Play Store

---

## 🔐 Gestion des Secrets

### Variables d'Environnement pour EAS

EAS ne lit pas le fichier `.env` par défaut. Vous devez configurer les secrets :

```bash
# Configurer les secrets EAS
eas secret:create --scope project --name FIREBASE_API_KEY --value "votre_clé"
eas secret:create --scope project --name GEMINI_API_KEY --value "votre_clé"
eas secret:create --scope project --name STRIPE_PUBLISHABLE_KEY --value "votre_clé"
# etc. pour toutes les variables
```

**Ou créer un fichier `eas.json` avec les secrets :**

```json
{
  "build": {
    "production": {
      "env": {
        "FIREBASE_API_KEY": "your_value",
        "GEMINI_API_KEY": "your_value"
      }
    }
  }
}
```

⚠️ **Ne commitez JAMAIS les secrets dans Git !**

---

## 📤 Publication sur Google Play Store

### Étape 1 : Créer un Compte Développeur

1. Allez sur [Google Play Console](https://play.google.com/console)
2. Payez les frais d'inscription (25$ une fois)
3. Complétez votre profil développeur

### Étape 2 : Créer l'Application

1. Dans Play Console, cliquez sur **Créer une application**
2. Remplissez :
   - Nom : **PetHealth**
   - Langue par défaut : **Français**
   - Type : **Application**
   - Gratuite ou payante : **Gratuite** (avec achats intégrés si freemium)

### Étape 3 : Préparer la Fiche Play Store

Vous aurez besoin de :

**Textes :**
- Titre (30 caractères max)
- Description courte (80 caractères)
- Description complète (4000 caractères)

**Graphiques :**
- Icône : 512x512
- Bannière de fonctionnalité : 1024x500
- Screenshots : Au moins 2 (téléphone), format PNG ou JPG
- Screenshots tablette (optionnel)

**Vidéo (optionnel) :**
- Lien YouTube de présentation

### Étape 4 : Upload de l'AAB

```bash
# Depuis votre projet
eas submit --platform android
```

Ou manuellement dans Play Console :
1. Production > Créer une version
2. Uploadez le fichier `.aab`
3. Ajoutez les notes de version

### Étape 5 : Contenu de l'Application

1. **Évaluation du contenu**
   - Répondez au questionnaire
   - PetHealth : Tous publics

2. **Classification du contenu**
   - Sélectionnez la catégorie : Santé et remise en forme
   - Ajoutez les tags appropriés

3. **Public cible et contenu**
   - Tranche d'âge : Tous
   - Pas de contenu sensible

4. **Politique de confidentialité**
   - URL de votre politique (obligatoire)
   - Exemple : `https://pethealth.app/privacy`

### Étape 6 : Prix et Distribution

1. Pays : Sélectionnez les pays (recommandé : tous)
2. Prix : Gratuit
3. Achats in-app : Oui (pour les abonnements Stripe)

### Étape 7 : Soumettre pour Révision

1. Vérifiez que tous les champs sont remplis
2. Cliquez sur **Soumettre pour révision**
3. Délai : 1-7 jours pour première approbation

---

## 🧪 Tests Avant Publication

### Test en Interne (Internal Testing)

```bash
# Créer une version de test interne
eas build --platform android --profile preview
```

1. Dans Play Console, créez une piste de test interne
2. Ajoutez des testeurs (emails)
3. Uploadez l'APK/AAB
4. Les testeurs reçoivent un lien de téléchargement

### Test Ouvert (Open Testing)

Pour un test public limité avant le lancement officiel.

---

## 📱 Méthode 2 : Build Local (Alternative)

Si vous préférez builder localement :

### Prérequis

```bash
# Installer Android Studio
# Télécharger depuis : https://developer.android.com/studio

# Installer Java JDK 17
sudo apt install openjdk-17-jdk  # Linux
# ou télécharger depuis Oracle (Windows/Mac)

# Configurer les variables d'environnement
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Build Local

```bash
# Installer les dépendances
npm install

# Générer le build Android
npx expo prebuild --platform android

# Builder l'APK
cd android
./gradlew assembleRelease

# L'APK sera dans :
# android/app/build/outputs/apk/release/app-release.apk
```

⚠️ **Cette méthode est plus complexe et nécessite de gérer manuellement la signature.**

---

## 🔑 Signature de l'Application

### Pour EAS (Automatique)

EAS gère automatiquement la signature. Il crée et stocke vos certificats.

### Pour Build Local (Manuel)

```bash
# Générer un keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore pethealth.keystore \
  -alias pethealth \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Signer l'APK
jarsigner -verbose -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore pethealth.keystore \
  app-release-unsigned.apk pethealth

# Optimiser avec zipalign
zipalign -v 4 app-release-unsigned.apk pethealth.apk
```

⚠️ **IMPORTANT : Conservez votre keystore en sécurité ! Sans lui, vous ne pourrez plus mettre à jour l'app.**

---

## 📊 Checklist Avant Publication

- [ ] Toutes les variables d'environnement configurées
- [ ] Assets (icônes, splash screen) créés
- [ ] Nom de package unique (`com.pethealth.app`)
- [ ] Version et versionCode définis
- [ ] Permissions Android déclarées
- [ ] Build testé sur appareil réel
- [ ] Compte Google Play créé
- [ ] Politique de confidentialité rédigée
- [ ] Screenshots et graphiques préparés
- [ ] Description de l'app rédigée

---

## 🚀 Commandes Rapides

```bash
# Build APK pour test
eas build -p android --profile preview

# Build AAB pour Play Store
eas build -p android --profile production

# Soumettre directement au Play Store
eas submit -p android

# Vérifier le statut du build
eas build:list

# Configurer les secrets
eas secret:create

# Mettre à jour la configuration
eas build:configure
```

---

## 🐛 Problèmes Courants

### "Unable to find expo-dev-client"
```bash
npm install expo-dev-client
```

### "Android SDK not found"
Pour EAS : Ce n'est pas nécessaire (build cloud)
Pour local : Installez Android Studio

### "Missing keystore"
Pour EAS : Automatique
Pour local : Générez un keystore (voir section Signature)

### "Build failed"
Consultez les logs :
```bash
eas build:view [BUILD_ID]
```

### Variables d'environnement non trouvées
Configurez-les avec `eas secret:create`

---

## 📚 Ressources

- [Documentation Expo Build](https://docs.expo.dev/build/introduction/)
- [EAS Build](https://docs.expo.dev/build/setup/)
- [Google Play Console](https://play.google.com/console)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)
- [Publishing to Play Store](https://docs.expo.dev/submit/android/)

---

## 🎯 Recommandation Finale

**Pour PetHealth, utilisez EAS (Méthode 1) :**

```bash
# 1. Installer EAS
npm install -g eas-cli

# 2. Se connecter
eas login

# 3. Configurer
eas build:configure

# 4. Build APK de test
eas build -p android --profile preview

# 5. Tester sur votre appareil
# Téléchargez l'APK et installez-le

# 6. Build AAB pour Play Store
eas build -p android --profile production

# 7. Soumettre
eas submit -p android
```

**C'est tout ! Votre app sera sur le Play Store en quelques heures. 🎉**

---

Pour toute question : dev@pethealth.app
