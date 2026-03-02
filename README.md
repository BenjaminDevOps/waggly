# 🐾 Waggly - AI-Powered Pet Health & Wellness App

> Your Pet's Health Companion - Built with Flutter, Firebase, and Gemini AI

## 🌟 Features

### 🤖 AI-Powered Veterinary Diagnosis
- **Gemini 3.0 Flash Preview** - Latest generation AI model
  - ⚡ Ultra-fast responses (<1 second)
  - 🧠 State-of-the-art medical reasoning
  - 🎯 Superior image analysis
  - 💰 Cost-effective (~$0.43/1000 diagnoses)
- Intelligent pet health assessments with photo support
- Preliminary health condition identification
- Smart recommendations and care guidance
- Severity level assessment (low/medium/high/emergency)

### 🎮 Gamification System
- **Points & Rewards**: Earn points for pet care activities
- **Badges & Achievements**: Unlock special badges
- **Daily Streaks**: Build healthy habits with streak tracking
- **Leaderboards**: Compete with other pet parents
- Visual progress tracking with animations

### 💎 Freemium Model
- **Free Tier**: 3 AI diagnoses per month
- **Premium Tier**: Unlimited AI diagnoses + advanced features
- In-app purchase integration
- Feature-gated premium content

### 🛒 Pet Product Shop with Affiliate Marketing
- Personalized food recommendations
- Curated pet products
- Amazon & Zooplus affiliate integration
- Product reviews and comparisons
- Special deals and discounts

### 📊 Pet Health Management
- Multiple pet profiles
- Health record tracking
- Weight monitoring
- Vaccination schedules
- Vet appointment reminders
- Medical history logging

## 🏗️ Architecture

```
lib/
├── core/
│   ├── config/           # Firebase & Gemini configuration
│   ├── constants/        # App-wide constants
│   ├── theme/           # Material 3 theme
│   └── utils/           # Helper functions
├── features/
│   ├── auth/            # Authentication (Firebase Auth)
│   ├── pets/            # Pet management
│   ├── health/          # Health tracking
│   ├── ai_diagnosis/    # Gemini AI diagnosis
│   ├── gamification/    # Points, badges, streaks
│   ├── shop/            # Affiliate shop
│   └── profile/         # User profile
└── shared/
    ├── models/          # Data models
    ├── services/        # Business logic
    ├── providers/       # State management (Riverpod)
    └── widgets/         # Reusable UI components
```

## 🛠️ Tech Stack

- **Framework**: Flutter 3.41.2 (Dart 3.11.0)
- **Backend**: Firebase (Auth, Firestore, Storage, Analytics)
- **AI**: Google Generative AI (Gemini 3.0 Flash Preview)
- **Environment**: flutter_dotenv 6.0.0
- **State Management**: Riverpod + Provider
- **UI/UX**: Material 3 Design
- **Payments**: In-App Purchase
- **Charts**: FL Chart
- **Animations**: Flutter Animate, Lottie, Confetti

## 🚀 Getting Started

### Prerequisites
- Flutter SDK 3.41.2+
- Dart 3.11.0+
- Firebase project setup
- Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd waggly
```

2. **Install dependencies**
```bash
flutter pub get
```

3. **Configure environment variables**
```bash
# Create .env file from template
cp .env.example .env

# Add your Gemini API key
# Get it from: https://aistudio.google.com/apikey
nano .env
```

4. **Configure Firebase**
```bash
# Download from: https://console.firebase.google.com/
# - google-services.json → android/app/
# - GoogleService-Info.plist → ios/Runner/
```

5. **Run the app**
```bash
flutter run
```

### 📚 Detailed Setup Guides

- 🔐 **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment variables configuration (flutter_dotenv 6.0.0)
- 🤖 **[GEMINI_CONFIG.md](./GEMINI_CONFIG.md)** - Gemini 3.0 AI setup and usage
- 🔥 **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Complete Firebase configuration guide

## 📄 License

This project is licensed under the MIT License.

---

**Disclaimer**: Waggly is not a substitute for professional veterinary care. Always consult a licensed veterinarian for medical advice.
