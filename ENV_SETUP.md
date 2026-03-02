# 🔐 Environment Configuration Guide

## Overview

Waggly uses **flutter_dotenv 6.0.0** to manage environment variables securely.

---

## 📦 Package Configuration

### pubspec.yaml

```yaml
dependencies:
  flutter_dotenv: ^6.0.0  # Latest version

flutter:
  assets:
    - .env  # Make .env accessible to Flutter
```

### main.dart

```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load .env file
  await dotenv.load(fileName: '.env');

  runApp(MyApp());
}
```

---

## 🚀 Quick Setup

### 1. Create .env File

```bash
# Copy the example file
cp .env.example .env
```

### 2. Add Your API Keys

Edit `.env` and replace placeholders:

```env
# Required: Gemini AI API Key
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Optional: Other configurations
API_BASE_URL=https://api.waggly.com
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Get API Key"** or **"Create API Key"**
3. Copy the key (starts with `AIza...`)
4. Paste into `.env` file

### 4. Test Configuration

```bash
flutter clean
flutter pub get
flutter run
```

Check console for:
```
✅ Environment variables loaded from .env
🔑 Gemini API configured: true
```

---

## 📝 .env File Structure

### Minimal Configuration (Required)

```env
# Google Gemini AI
GEMINI_API_KEY=YOUR_ACTUAL_KEY_HERE
```

### Full Configuration (All Options)

```env
# ========================================
# 🤖 Google Gemini AI
# ========================================
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ========================================
# 🌐 API Configuration
# ========================================
API_BASE_URL=https://api.waggly.com
API_TIMEOUT_SECONDS=30
API_VERSION=v1

# ========================================
# 🔐 Feature Flags
# ========================================
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
ENABLE_DEBUG_MODE=false

# ========================================
# 💰 In-App Purchases
# ========================================
PREMIUM_MONTHLY_SKU=waggly_premium_monthly
PREMIUM_YEARLY_SKU=waggly_premium_yearly

# ========================================
# 🔧 Development
# ========================================
APP_ENV=development
LOG_LEVEL=debug
```

---

## 🔑 Using Environment Variables

### In Code

```dart
import 'package:waggly/core/config/env_config.dart';

// Get Gemini API key (throws if not configured)
final apiKey = EnvConfig.geminiApiKey;

// Check if configured (safe, returns bool)
if (EnvConfig.isGeminiConfigured) {
  print('API key is set up!');
}

// Get custom variable with default
final apiUrl = EnvConfig.get('API_BASE_URL', 
  defaultValue: 'https://api.example.com'
);

// Check if key exists
if (EnvConfig.has('ENABLE_ANALYTICS')) {
  final enabled = EnvConfig.get('ENABLE_ANALYTICS') == 'true';
}
```

### Direct Access (Advanced)

```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

// Direct access to dotenv
final value = dotenv.env['MY_KEY'];
final allVars = dotenv.env;  // Map<String, String>
```

---

## 🔒 Security Best Practices

### ✅ DO:

1. **Add .env to .gitignore**
   ```gitignore
   # .gitignore
   .env
   ```

2. **Use .env.example as template**
   - Commit `.env.example` (no secrets)
   - Don't commit `.env` (contains secrets)

3. **Rotate API keys regularly**
   - Change keys every 3-6 months
   - Use different keys for dev/staging/prod

4. **Use environment-specific files**
   ```bash
   .env.development
   .env.staging
   .env.production
   ```

   ```dart
   // Load specific env file
   await dotenv.load(fileName: '.env.production');
   ```

### ❌ DON'T:

1. **Never commit .env to git**
   ```bash
   # If accidentally committed:
   git rm --cached .env
   git commit -m "Remove .env from tracking"
   ```

2. **Never hardcode API keys**
   ```dart
   // ❌ BAD
   const apiKey = 'AIzaSy...';

   // ✅ GOOD
   final apiKey = EnvConfig.geminiApiKey;
   ```

3. **Never share .env files**
   - Use secure password managers
   - Share via encrypted channels only

4. **Never log sensitive values**
   ```dart
   // ❌ BAD
   print('API Key: $apiKey');

   // ✅ GOOD
   print('API Key configured: ${apiKey.isNotEmpty}');
   ```

---

## 🧪 Testing

### Check .env is Loaded

```dart
void main() {
  test('Environment variables loaded', () {
    // In tests, load manually:
    await dotenv.load(fileName: '.env.test');
    
    expect(EnvConfig.isGeminiConfigured, isTrue);
  });
}
```

### Mock Environment Variables

```dart
// For testing without real API keys
void main() {
  setUp(() {
    dotenv.testLoad(fileInput: '''
      GEMINI_API_KEY=test_key_123
      API_BASE_URL=https://test.api.com
    ''');
  });

  test('Uses test environment', () {
    expect(EnvConfig.geminiApiKey, equals('test_key_123'));
  });
}
```

---

## 🐛 Troubleshooting

### ".env file not found"

**Problem:** App can't find `.env` file.

**Solutions:**
1. Check file exists in project root:
   ```bash
   ls -la .env
   ```

2. Verify it's in `pubspec.yaml` assets:
   ```yaml
   flutter:
     assets:
       - .env
   ```

3. Run clean and rebuild:
   ```bash
   flutter clean
   flutter pub get
   flutter run
   ```

---

### "GEMINI_API_KEY not configured"

**Problem:** API key is empty or placeholder.

**Solutions:**
1. Check `.env` file:
   ```bash
   cat .env
   ```

2. Verify key starts with `AIza`:
   ```env
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXX
   ```

3. Get a valid key:
   - https://aistudio.google.com/apikey

---

### "Environment variables not loading"

**Problem:** `dotenv.env` is empty.

**Solutions:**
1. Ensure `dotenv.load()` is called in `main()`:
   ```dart
   void main() async {
     WidgetsFlutterBinding.ensureInitialized();
     await dotenv.load(fileName: '.env');  // ✅ Before runApp
     runApp(MyApp());
   }
   ```

2. Check file name is correct:
   ```dart
   // ✅ Correct
   await dotenv.load(fileName: '.env');

   // ❌ Wrong
   await dotenv.load(fileName: 'env');
   ```

3. Verify file encoding is UTF-8 (not UTF-16)

---

### "Hot reload doesn't pick up .env changes"

**Problem:** Changed `.env` but app still uses old values.

**Solution:** Hot reload doesn't reload assets. Do full restart:
```bash
# Press 'R' in flutter run console
# Or stop and restart:
flutter run
```

---

## 🌍 Multiple Environments

### Setup

Create environment-specific files:

```
.env.development
.env.staging  
.env.production
```

### Load Based on Build Mode

```dart
Future<void> loadEnvironment() async {
  String fileName = '.env';

  // Determine environment
  if (kDebugMode) {
    fileName = '.env.development';
  } else if (kProfileMode) {
    fileName = '.env.staging';
  } else {
    fileName = '.env.production';
  }

  await dotenv.load(fileName: fileName);
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await loadEnvironment();
  runApp(MyApp());
}
```

### Build Commands

```bash
# Development (debug mode)
flutter run

# Staging (profile mode)
flutter run --profile

# Production (release mode)
flutter build apk --release
```

---

## 📚 Resources

- **flutter_dotenv Documentation**: https://pub.dev/packages/flutter_dotenv
- **Gemini API Keys**: https://aistudio.google.com/apikey
- **Firebase Console**: https://console.firebase.google.com/
- **Waggly Gemini Config**: See `GEMINI_CONFIG.md`
- **Waggly Firebase Config**: See `FIREBASE_SETUP.md`

---

## ✅ Checklist

Before deploying to production:

- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` is committed (no secrets)
- [ ] All required keys are set
- [ ] API keys are valid and tested
- [ ] Different keys for dev/staging/prod
- [ ] Team members have their own `.env` files
- [ ] Keys are stored in team password manager
- [ ] Logging doesn't expose secrets
- [ ] Error messages don't leak API keys

---

## 🆘 Support

If you encounter issues:

1. Check this guide thoroughly
2. Review `GEMINI_CONFIG.md` for API-specific issues
3. Review `FIREBASE_SETUP.md` for Firebase issues
4. Check Flutter console for error messages
5. Verify all files are in correct locations

**Still stuck?** Create an issue with:
- Error message
- Steps to reproduce
- Environment (Flutter version, OS)
- Relevant code snippets (NO API KEYS!)
