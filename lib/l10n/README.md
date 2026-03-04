# Internationalization (i18n) Guide

This app supports multiple languages using Flutter's official localization system.

## Supported Languages

- 🇬🇧 English (en) - Default
- 🇫🇷 French (fr)
- 🇪🇸 Spanish (es)

## How to Use Localized Strings

### 1. Import AppLocalizations

```dart
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
```

### 2. Access Localized Strings in Your Widget

```dart
@override
Widget build(BuildContext context) {
  final l10n = AppLocalizations.of(context)!;

  return Text(l10n.appName); // Returns "Waggly"
  return Text(l10n.navHome); // Returns "Home" (EN), "Accueil" (FR), "Inicio" (ES)
}
```

### 3. Add New Translations

1. **Add to English ARB file** (`app_en.arb`):
```json
{
  "myNewKey": "My New Text",
  "@myNewKey": {
    "description": "Description of what this key is for"
  }
}
```

2. **Add translations** to `app_fr.arb` and `app_es.arb`:
```json
{
  "myNewKey": "Mon Nouveau Texte"  // French
}
```

```json
{
  "myNewKey": "Mi Nuevo Texto"  // Spanish
}
```

3. **Run code generation**:
```bash
flutter pub get
# or
flutter build
```

4. **Use in your code**:
```dart
Text(l10n.myNewKey)
```

## Available Translation Keys

See `app_en.arb` for all available keys including:
- Navigation labels (`navHome`, `navPets`, etc.)
- Common actions (`cancel`, `save`, `edit`, etc.)
- Gamification badges
- Settings and profile strings
- Authentication strings

## Testing Different Languages

### On Device/Emulator
Change the device language in system settings.

### In Code (for testing)
Temporarily set a specific locale in `main.dart`:
```dart
MaterialApp(
  locale: const Locale('fr'), // Force French
  // ... other properties
)
```

## Dynamic Language Switching

To add runtime language switching:
1. Create a locale provider using Riverpod
2. Update MaterialApp's `locale` property
3. Add a language selector in Settings

## Notes

- The system automatically detects the device language
- Falls back to English if device language is not supported
- ARB files must be in valid JSON format
- All keys in non-English files must match English keys
