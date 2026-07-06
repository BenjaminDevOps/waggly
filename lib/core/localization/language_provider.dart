import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app_language.dart';

/// Currently selected app language. Defaults to French since Waggly NAC
/// is a French exotic-pet product, with English and Spanish as alternatives.
final languageProvider = StateProvider<AppLanguage>((ref) => AppLanguage.fr);
