# 🤖 Gemini AI Configuration

## Current Model

**Gemini 2.0 Flash (Experimental)**

```dart
model: 'gemini-2.0-flash-exp'
```

---

## Why Gemini 2.0 Flash?

| Feature | Gemini 1.5 Flash | Gemini 2.0 Flash | Winner |
|---------|------------------|------------------|---------|
| **Speed** | Fast | **Faster** | 🚀 2.0 |
| **Max Output** | 2048 tokens | **8192 tokens** | 📝 2.0 |
| **Multimodal** | ✅ Yes | ✅ **Improved** | 🎯 2.0 |
| **Cost** | $0.35/1M tokens | **$0.30/1M tokens** | 💰 2.0 |
| **Reasoning** | Good | **Better** | 🧠 2.0 |

---

## Configuration Details

### Text Model (`_model`)

```dart
GenerativeModel(
  model: 'gemini-2.0-flash-exp',
  apiKey: apiKey,
  generationConfig: GenerationConfig(
    temperature: 0.7,      // Balance creativity vs consistency
    topK: 40,              // Top 40 tokens considered
    topP: 0.95,            // 95% probability mass
    maxOutputTokens: 8192, // Up to 8K tokens output
  ),
  safetySettings: [
    // Block medium+ harassment and hate speech
    SafetySetting(HarmCategory.harassment, HarmBlockThreshold.medium),
    SafetySetting(HarmCategory.hateSpeech, HarmBlockThreshold.medium),
  ],
)
```

**Use cases:**
- ✅ Symptom analysis (text only)
- ✅ Follow-up questions
- ✅ Diagnosis report generation

---

### Vision Model (`_visionModel`)

```dart
GenerativeModel(
  model: 'gemini-2.0-flash-exp',
  apiKey: apiKey,
)
```

**Use cases:**
- ✅ Analyze pet photos + symptoms
- ✅ Visual health observations
- ✅ Skin conditions, wounds, physical changes

---

## API Key Setup

### 1. Get API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Get API Key"** or **"Create API Key"**
3. Copy your API key (starts with `AIza...`)

### 2. Add to `.env` File

Create/edit `.env` in project root:

```env
# Google Gemini API Key
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### 3. Load in Flutter

The app uses `flutter_dotenv` to load the key:

```dart
// lib/core/config/env_config.dart
class EnvConfig {
  static String get geminiApiKey => dotenv.env['GEMINI_API_KEY'] ?? '';
  static bool get isGeminiConfigured => geminiApiKey.isNotEmpty;
}
```

---

## Model Versions

### Production Model (Stable)

```dart
model: 'gemini-2.0-flash'  // When available in stable
```

### Experimental Model (Latest Features)

```dart
model: 'gemini-2.0-flash-exp'  // Current choice
```

### Legacy Model

```dart
model: 'gemini-1.5-flash'  // Previous version
```

---

## Usage Examples

### 1. Text-Only Diagnosis

```dart
final gemini = GeminiService();

final analysis = await gemini.analyzeSymptoms(
  petName: 'Max',
  species: 'Dog',
  breed: 'Labrador',
  ageInYears: 5,
  symptoms: 'Vomiting and lethargy for 2 days',
);

print(analysis);  // Formatted markdown response
```

### 2. Photo Analysis

```dart
final analysis = await gemini.analyzeWithPhoto(
  petName: 'Bella',
  species: 'Cat',
  breed: 'Persian',
  ageInYears: 3,
  symptoms: 'Red patches on skin',
  photoFile: File('/path/to/photo.jpg'),
);
```

### 3. Follow-Up Question

```dart
final response = await gemini.askFollowUp(
  conversationContext: previousAnalysis,
  userQuestion: 'Should I give medication?',
);
```

---

## Performance Optimization

### Current Settings

✅ **Temperature: 0.7**
- Not too random (1.0) = consistent medical advice
- Not too strict (0.0) = natural conversation

✅ **Max Tokens: 8192**
- Detailed diagnosis reports
- Multiple follow-up questions
- Comprehensive recommendations

✅ **Safety Filters: Medium**
- Blocks harmful content
- Allows medical discussions
- Protects users

---

## Cost Estimation

**Gemini 2.0 Flash Pricing:**
- **Input**: $0.15 / 1M tokens
- **Output**: $0.30 / 1M tokens

**Average per diagnosis:**
```
Input:  ~500 tokens  → $0.000075
Output: ~1500 tokens → $0.00045
───────────────────────────────
Total:  ~$0.000525 per diagnosis
```

**Monthly cost for 1000 diagnoses:**
```
1000 × $0.000525 = ~$0.53/month
```

💰 **Very affordable!**

---

## Error Handling

```dart
try {
  final analysis = await gemini.analyzeSymptoms(...);
} catch (e) {
  if (e.toString().contains('API_KEY_INVALID')) {
    // Show: "Please configure Gemini API key"
  } else if (e.toString().contains('QUOTA_EXCEEDED')) {
    // Show: "Daily limit reached, try tomorrow"
  } else {
    // Show: "Analysis failed, please retry"
  }
}
```

---

## Migration from 1.5 → 2.0

### What Changed?

1. ✅ **Model name**:
   ```dart
   // Before
   model: 'gemini-1.5-flash'

   // After
   model: 'gemini-2.0-flash-exp'
   ```

2. ✅ **Max tokens**:
   ```dart
   // Before
   maxOutputTokens: 2048

   // After
   maxOutputTokens: 8192
   ```

3. ✅ **No breaking changes**
   - Same API interface
   - Same response format
   - Drop-in replacement

---

## Testing

### Test API Key Works

```bash
# Quick test
curl "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello!"}]}]}'
```

### Test in App

```dart
// Check if configured
if (GeminiService.isConfigured) {
  print('✅ Gemini API ready');
} else {
  print('❌ Add GEMINI_API_KEY to .env');
}
```

---

## Troubleshooting

### "API key not valid"
- ✅ Check `.env` file exists
- ✅ Verify key starts with `AIza`
- ✅ Run `flutter clean && flutter pub get`
- ✅ Restart the app

### "Model not found"
- ✅ Use `gemini-2.0-flash-exp` (experimental)
- ✅ Or `gemini-1.5-flash` (stable fallback)

### "Quota exceeded"
- ✅ Free tier: 60 requests/minute
- ✅ Wait 1 minute and retry
- ✅ Upgrade to paid plan if needed

---

## Resources

- 📚 [Gemini API Docs](https://ai.google.dev/docs)
- 🔑 [Get API Key](https://aistudio.google.com/apikey)
- 💰 [Pricing](https://ai.google.dev/pricing)
- 🎯 [Model Comparison](https://ai.google.dev/models/gemini)
- 📦 [Flutter Package](https://pub.dev/packages/google_generative_ai)

---

## Security Best Practices

🔐 **DO:**
- ✅ Store API key in `.env` (NOT in code)
- ✅ Add `.env` to `.gitignore`
- ✅ Use environment variables in production
- ✅ Rotate keys periodically

🚫 **DON'T:**
- ❌ Commit API keys to Git
- ❌ Share keys publicly
- ❌ Hardcode keys in source code
- ❌ Use same key for dev + prod
