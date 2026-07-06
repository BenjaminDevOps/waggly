/// Supported languages for the Waggly NAC experience.
enum AppLanguage { fr, en, es }

extension AppLanguageX on AppLanguage {
  String get code {
    switch (this) {
      case AppLanguage.fr:
        return 'fr';
      case AppLanguage.en:
        return 'en';
      case AppLanguage.es:
        return 'es';
    }
  }

  String get flag {
    switch (this) {
      case AppLanguage.fr:
        return '🇫🇷';
      case AppLanguage.en:
        return '🇬🇧';
      case AppLanguage.es:
        return '🇪🇸';
    }
  }

  String get label {
    switch (this) {
      case AppLanguage.fr:
        return 'Français';
      case AppLanguage.en:
        return 'English';
      case AppLanguage.es:
        return 'Español';
    }
  }
}
