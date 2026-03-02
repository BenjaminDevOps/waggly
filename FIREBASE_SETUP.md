# 🔥 Firebase Configuration Guide

## Prerequisites

1. **Firebase Project**: Create a project at [Firebase Console](https://console.firebase.google.com/)
2. **Firebase CLI**: Install with `npm install -g firebase-tools`

---

## 📱 Step 1: Android Configuration

### 1.1 Download google-services.json

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Waggly project
3. Click the gear icon ⚙️ > **Project Settings**
4. Scroll to "Your apps" section
5. Click on the Android app (or add one if needed)
   - **Package name**: `com.waggly.app`
6. Download `google-services.json`
7. Place it at: `android/app/google-services.json`

### 1.2 Enable Google Services Plugin

Uncomment in `android/settings.gradle.kts`:
```kotlin
id("com.google.gms.google-services") version "4.4.2" apply false
```

Uncomment in `android/app/build.gradle.kts`:
```kotlin
id("com.google.gms.google-services")
```

---

## 🔐 Step 2: Enable Firebase Authentication

1. Firebase Console > **Authentication**
2. Click **Get Started**
3. Enable sign-in methods:
   - ✅ **Email/Password**
   - ✅ **Google** (optional)
   - ✅ **Apple** (optional for iOS)

---

## 🗄️ Step 3: Enable Firestore Database

1. Firebase Console > **Firestore Database**
2. Click **Create Database**
3. Choose:
   - **Start in test mode** (for development)
   - **Location**: Choose closest to your users
4. Click **Enable**

---

## 📊 Step 4: Create Composite Index

### Option A: Automatic (Recommended)

1. Run the app
2. Perform a diagnosis
3. When the error appears, **copy the link** from logs
4. Open the link in browser
5. Click **Create Index**
6. Wait 2-5 minutes for index to build

### Option B: Manual

1. Firebase Console > **Firestore Database** > **Indexes**
2. Click **+ Create Index**
3. Fill in:
   ```
   Collection ID:  diagnoses

   Fields:
   ┌─────────────┬───────────┐
   │ Field path  │ Order     │
   ├─────────────┼───────────┤
   │ userId      │ Ascending │
   │ createdAt   │ Ascending │
   └─────────────┴───────────┘
   ```
4. Click **Create**

### Option C: Firebase CLI (Advanced)

```bash
# Login to Firebase
firebase login

# Initialize Firebase (select Firestore)
firebase init firestore

# Deploy indexes
firebase deploy --only firestore:indexes
```

This will deploy the indexes from `firestore.indexes.json`.

---

## 🗂️ Step 5: Deploy Security Rules

### Via Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

### Or manually in Console:

1. Firebase Console > **Firestore Database** > **Rules**
2. Copy content from `firestore.rules`
3. Click **Publish**

---

## 💾 Step 6: Enable Firebase Storage

1. Firebase Console > **Storage**
2. Click **Get Started**
3. Choose **Start in test mode**
4. Click **Next** and **Done**

### Storage Security Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Diagnoses photos
    match /diagnoses/{diagnosisId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Pet photos
    match /pets/{petId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🔑 Step 7: Google AI (Gemini) API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click **Get API Key**
3. Create a new API key
4. Copy the key
5. Add to `.env` file:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```

---

## ✅ Step 8: Verify Setup

Run this checklist:

```bash
# 1. Rebuild the app
flutter clean
flutter pub get
flutter run

# 2. Test features:
# ✅ User registration/login
# ✅ Add a pet
# ✅ Create AI diagnosis
# ✅ View diagnosis history
# ✅ Upload pet photos
```

---

## 🚀 Production Checklist

Before going to production:

- [ ] Update Firestore rules to production mode
- [ ] Update Storage rules to production mode
- [ ] Enable App Check (DDoS protection)
- [ ] Set up Firebase Analytics
- [ ] Configure error reporting (Crashlytics)
- [ ] Add rate limiting to Cloud Functions
- [ ] Review API key restrictions
- [ ] Enable backup for Firestore

---

## 📝 Firebase Files

- `firestore.indexes.json` - Composite indexes configuration
- `firestore.rules` - Database security rules
- `android/app/google-services.json` - Android Firebase config (DO NOT COMMIT)
- `.env` - API keys (DO NOT COMMIT)

---

## 🛟 Troubleshooting

### "The query requires an index"
- Create the composite index (see Step 4)
- Wait 5 minutes for index to build
- Restart the app

### "Firebase not configured"
- Check `google-services.json` exists
- Verify plugin is uncommented in gradle files
- Run `flutter clean && flutter pub get`

### "Permission denied"
- Deploy security rules (Step 5)
- Verify user is authenticated
- Check userId matches auth.uid

---

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com/)
- [FlutterFire Docs](https://firebase.flutter.dev/)
- [Firestore Indexes](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Google AI Studio](https://ai.google.dev/)
