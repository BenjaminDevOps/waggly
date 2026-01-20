# 🚀 Guide Rapide : Créer l'APK Android

## Méthode Simple (5 minutes)

### 1. Installation

```bash
# Installer EAS CLI
npm install -g eas-cli
```

### 2. Connexion

```bash
# Se connecter à Expo (créez un compte gratuit sur expo.dev)
eas login
```

### 3. Configuration

```bash
# Dans le dossier du projet
cd /home/user/Petsheath

# Initialiser EAS
eas build:configure
```

Cela crée un fichier `eas.json`. Remplacez son contenu par :

```json
{
  "build": {
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
  }
}
```

### 4. Build de Test (APK)

```bash
# Créer l'APK pour tester
eas build -p android --profile preview
```

**Attendez 10-20 minutes** ⏳

Le build se fait dans le cloud, vous n'avez besoin de rien installer !

### 5. Télécharger et Installer

1. EAS affichera un lien de téléchargement
2. Téléchargez le fichier `.apk`
3. Envoyez-le sur votre téléphone Android
4. Installez-le (autorisez "Sources inconnues" si nécessaire)

### 6. Build pour Play Store (AAB)

```bash
# Créer l'AAB pour le Play Store
eas build -p android --profile production
```

## ⚠️ Avant de Builder

### Créer les Icônes (Rapide)

Créez une image 1024x1024 simple et sauvegardez-la :

```bash
assets/icon.png           # Votre logo
assets/adaptive-icon.png  # Même image
assets/splash.png         # Image de démarrage
```

**Astuce :** Utilisez [Canva](https://www.canva.com) pour créer rapidement un logo.

### Configurer les Variables d'Environnement

```bash
# Configurer Firebase
eas secret:create --scope project --name FIREBASE_API_KEY --value "votre_clé"
eas secret:create --scope project --name FIREBASE_PROJECT_ID --value "votre_projet"

# Configurer Gemini
eas secret:create --scope project --name GEMINI_API_KEY --value "votre_clé"

# Configurer Stripe
eas secret:create --scope project --name STRIPE_PUBLISHABLE_KEY --value "pk_test_..."
```

## 📱 Installer sur Android

### Option 1 : Via Câble USB

```bash
# Activer le débogage USB sur votre téléphone
# Puis :
adb install votre-app.apk
```

### Option 2 : Via Transfert de Fichier

1. Téléchargez l'APK sur votre ordinateur
2. Envoyez-le sur votre téléphone (email, Drive, USB)
3. Sur le téléphone, ouvrez le fichier APK
4. Autorisez l'installation depuis "Sources inconnues"
5. Installez

## 🎉 C'est Tout !

Votre application PetHealth est maintenant installée sur Android !

---

## 🏪 Publier sur Google Play Store

### 1. Créer un Compte

- Allez sur [Google Play Console](https://play.google.com/console)
- Payez 25$ (frais uniques)
- Complétez votre profil

### 2. Créer l'Application

- Cliquez sur "Créer une application"
- Nom : **PetHealth**
- Gratuit : **Oui**

### 3. Soumettre

```bash
# Build AAB
eas build -p android --profile production

# Soumettre automatiquement
eas submit -p android
```

**Ou manuellement :**
1. Téléchargez l'AAB depuis EAS
2. Uploadez dans Play Console
3. Remplissez la fiche (description, screenshots)
4. Soumettez pour révision

**Délai d'approbation : 1-7 jours**

---

## 🆘 Aide Rapide

### Le build échoue ?

```bash
# Voir les logs
eas build:list
eas build:view [BUILD_ID]
```

### Pas d'icônes ?

Créez au moins `assets/icon.png` (1024x1024).

### Variables d'environnement manquantes ?

Utilisez `eas secret:create` pour chaque variable.

---

**Documentation complète :** Voir `ANDROID_BUILD.md`

**Support :** dev@pethealth.app
