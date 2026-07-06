import 'app_language.dart';

/// Lightweight FR/EN/ES string table for the NAC-dedicated experience.
///
/// This avoids pulling in the full Flutter `gen-l10n` toolchain for a small,
/// hand-curated set of strings: [of] looks a key up for the given language,
/// falling back to English, then to the key itself.
class NacStrings {
  const NacStrings._();

  static String of(AppLanguage lang, String key) {
    final entry = _values[key];
    if (entry == null) return key;
    return entry[lang.code] ?? entry['en'] ?? key;
  }

  static const Map<String, Map<String, String>> _values = {
    // App
    'app_name': {
      'fr': 'Waggly NAC',
      'en': 'Waggly NAC',
      'es': 'Waggly NAC',
    },
    'app_tagline': {
      'fr': '🦎 Le compagnon santé de votre NAC',
      'en': '🦎 Your exotic pet\'s health companion',
      'es': '🦎 El compañero de salud de tu mascota exótica',
    },

    // Navigation
    'nav_home': {'fr': 'Accueil', 'en': 'Home', 'es': 'Inicio'},
    'nav_pets': {'fr': 'Mes NAC', 'en': 'My Pets', 'es': 'Mis Mascotas'},
    'nav_diagnosis': {'fr': 'Diagnostic', 'en': 'Diagnosis', 'es': 'Diagnóstico'},
    'nav_shop': {'fr': 'Boutique', 'en': 'Shop', 'es': 'Tienda'},
    'nav_profile': {'fr': 'Profil', 'en': 'Profile', 'es': 'Perfil'},
    'pets_coming_soon': {
      'fr': 'Bientôt disponible',
      'en': 'Coming Soon',
      'es': 'Próximamente',
    },
    'pets_add_button': {
      'fr': 'Ajouter un NAC',
      'en': 'Add Pet',
      'es': 'Añadir mascota',
    },

    // Home / Dashboard
    'home_welcome': {
      'fr': 'Bienvenue ! 👋',
      'en': 'Welcome back! 👋',
      'es': '¡Bienvenido! 👋',
    },
    'home_subtitle': {
      'fr': 'Prenez soin de votre NAC au quotidien',
      'en': 'Keep your exotic pet healthy every day',
      'es': 'Cuida a tu mascota exótica cada día',
    },
    'home_streak_title': {
      'fr': 'Série de 7 jours !',
      'en': '7 Day Streak!',
      'es': '¡Racha de 7 días!',
    },
    'home_streak_subtitle': {
      'fr': 'Continuez à suivre votre NAC chaque jour',
      'en': 'Keep checking on your pet daily',
      'es': 'Sigue revisando a tu mascota cada día',
    },
    'home_quick_actions': {
      'fr': 'Actions rapides',
      'en': 'Quick Actions',
      'es': 'Acciones rápidas',
    },
    'action_diagnosis': {
      'fr': 'Diagnostic IA',
      'en': 'AI Diagnosis',
      'es': 'Diagnóstico IA',
    },
    'action_add_pet': {
      'fr': 'Ajouter un NAC',
      'en': 'Add a Pet',
      'es': 'Añadir mascota',
    },
    'action_species_guide': {
      'fr': 'Fiches par espèce',
      'en': 'Species Guides',
      'es': 'Fichas por especie',
    },
    'action_checklist': {
      'fr': 'Entretien',
      'en': 'Care Checklist',
      'es': 'Cuidados',
    },
    'action_shop': {
      'fr': 'Boutique NAC',
      'en': 'NAC Shop',
      'es': 'Tienda NAC',
    },
    'action_badges': {
      'fr': 'Badges',
      'en': 'Badges',
      'es': 'Insignias',
    },
    'language_picker_title': {
      'fr': 'Langue',
      'en': 'Language',
      'es': 'Idioma',
    },

    // AI Diagnosis
    'diagnosis_title': {
      'fr': 'Diagnostic IA NAC',
      'en': 'NAC AI Diagnosis',
      'es': 'Diagnóstico IA NAC',
    },
    'diagnosis_intro': {
      'fr': 'Décrivez les symptômes de votre animal pour une première évaluation adaptée aux NAC.',
      'en': 'Describe your pet\'s symptoms for a preliminary assessment tailored to exotic pets.',
      'es': 'Describe los síntomas de tu mascota para una evaluación preliminar adaptada a mascotas exóticas.',
    },
    'diagnosis_species_label': {
      'fr': 'Espèce de NAC',
      'en': 'Exotic pet species',
      'es': 'Especie de mascota exótica',
    },
    'diagnosis_age_label': {
      'fr': 'Âge approximatif',
      'en': 'Approximate age',
      'es': 'Edad aproximada',
    },
    'diagnosis_age_hint': {
      'fr': 'ex : 2 ans, 6 mois',
      'en': 'e.g. 2 years, 6 months',
      'es': 'ej.: 2 años, 6 meses',
    },
    'diagnosis_symptoms_label': {
      'fr': 'Symptômes observés',
      'en': 'Observed symptoms',
      'es': 'Síntomas observados',
    },
    'diagnosis_symptoms_hint': {
      'fr': 'ex : perte d\'appétit, léthargie, mue anormale...',
      'en': 'e.g. loss of appetite, lethargy, abnormal shedding...',
      'es': 'ej.: pérdida de apetito, letargo, muda anormal...',
    },
    'diagnosis_add_photo': {
      'fr': 'Ajouter des photos',
      'en': 'Add photos',
      'es': 'Añadir fotos',
    },
    'diagnosis_submit': {
      'fr': 'Analyser les symptômes',
      'en': 'Analyze symptoms',
      'es': 'Analizar síntomas',
    },
    'diagnosis_analyzing': {
      'fr': 'Analyse en cours...',
      'en': 'Analyzing...',
      'es': 'Analizando...',
    },
    'diagnosis_disclaimer': {
      'fr': 'Cette IA fournit une première orientation éducative et ne remplace pas un vétérinaire spécialisé NAC. De nombreuses espèces exotiques nécessitent des soins très spécifiques.',
      'en': 'This AI provides an educational first assessment and does not replace an exotics-savvy veterinarian. Many exotic species require very specific care.',
      'es': 'Esta IA ofrece una primera orientación educativa y no sustituye a un veterinario especializado en exóticos. Muchas especies exóticas requieren cuidados muy específicos.',
    },
    'diagnosis_result_title': {
      'fr': 'Résultat de l\'analyse',
      'en': 'Analysis result',
      'es': 'Resultado del análisis',
    },
    'diagnosis_severity_label': {
      'fr': 'Niveau de gravité',
      'en': 'Severity level',
      'es': 'Nivel de gravedad',
    },
    'diagnosis_conditions_label': {
      'fr': 'Pistes possibles',
      'en': 'Possible conditions',
      'es': 'Posibles causas',
    },
    'diagnosis_recommendations_label': {
      'fr': 'Recommandations',
      'en': 'Recommendations',
      'es': 'Recomendaciones',
    },
    'diagnosis_vet_warning': {
      'fr': '⚠️ Consultez rapidement un vétérinaire spécialisé NAC.',
      'en': '⚠️ Please consult an exotics-savvy veterinarian promptly.',
      'es': '⚠️ Consulta cuanto antes a un veterinario especializado en exóticos.',
    },
    'diagnosis_error': {
      'fr': 'Une erreur est survenue pendant l\'analyse. Réessayez plus tard.',
      'en': 'Something went wrong during analysis. Please try again later.',
      'es': 'Ocurrió un error durante el análisis. Inténtalo de nuevo más tarde.',
    },
    'diagnosis_missing_symptoms': {
      'fr': 'Merci de décrire au moins un symptôme.',
      'en': 'Please describe at least one symptom.',
      'es': 'Describe al menos un síntoma.',
    },
    'severity_low': {'fr': 'Faible', 'en': 'Low', 'es': 'Baja'},
    'severity_medium': {'fr': 'Modérée', 'en': 'Medium', 'es': 'Moderada'},
    'severity_high': {'fr': 'Élevée', 'en': 'High', 'es': 'Alta'},
    'severity_emergency': {'fr': 'Urgence', 'en': 'Emergency', 'es': 'Urgencia'},

    // Species guide
    'species_guide_title': {
      'fr': 'Fiches de soins par espèce',
      'en': 'Species care guides',
      'es': 'Fichas de cuidados por especie',
    },
    'species_guide_subtitle': {
      'fr': 'Les bases pour bien s\'occuper de chaque type de NAC.',
      'en': 'The essentials for caring well for each type of exotic pet.',
      'es': 'Lo esencial para cuidar bien cada tipo de mascota exótica.',
    },
    'care_habitat': {
      'fr': 'Habitat',
      'en': 'Habitat',
      'es': 'Hábitat',
    },
    'care_diet': {
      'fr': 'Alimentation',
      'en': 'Diet',
      'es': 'Alimentación',
    },
    'care_temperature': {
      'fr': 'Température & éclairage',
      'en': 'Temperature & lighting',
      'es': 'Temperatura e iluminación',
    },
    'care_maintenance': {
      'fr': 'Entretien',
      'en': 'Maintenance',
      'es': 'Mantenimiento',
    },
    'care_examples': {
      'fr': 'Exemples',
      'en': 'Examples',
      'es': 'Ejemplos',
    },

    // Checklist
    'checklist_title': {
      'fr': 'Checklist d\'entretien',
      'en': 'Care checklist',
      'es': 'Lista de cuidados',
    },
    'checklist_subtitle': {
      'fr': 'Cochez les gestes d\'entretien réalisés aujourd\'hui.',
      'en': 'Check off today\'s completed care tasks.',
      'es': 'Marca las tareas de cuidado realizadas hoy.',
    },
    'checklist_progress': {
      'fr': 'complétées',
      'en': 'completed',
      'es': 'completadas',
    },
    'checklist_points_earned': {
      'fr': 'points gagnés',
      'en': 'points earned',
      'es': 'puntos ganados',
    },
    'checklist_item_habitat': {
      'fr': 'Nettoyer l\'habitat (cage, terrarium, aquarium)',
      'en': 'Clean the habitat (cage, terrarium, tank)',
      'es': 'Limpiar el hábitat (jaula, terrario, acuario)',
    },
    'checklist_item_water': {
      'fr': 'Changer l\'eau ou l\'eau de l\'aquarium',
      'en': 'Change the water or tank water',
      'es': 'Cambiar el agua o el agua del acuario',
    },
    'checklist_item_temperature': {
      'fr': 'Vérifier température, UVB/UVA et hygrométrie',
      'en': 'Check temperature, UVB/UVA and humidity',
      'es': 'Comprobar temperatura, UVB/UVA y humedad',
    },
    'checklist_item_food': {
      'fr': 'Distribuer l\'alimentation adaptée à l\'espèce',
      'en': 'Give species-appropriate food',
      'es': 'Dar la alimentación adecuada a la especie',
    },
    'checklist_item_observation': {
      'fr': 'Observer comportement, mue, selles et appétit',
      'en': 'Observe behavior, shedding/molting, droppings and appetite',
      'es': 'Observar comportamiento, muda, heces y apetito',
    },
    'checklist_item_enrichment': {
      'fr': 'Proposer un enrichissement ou une sortie surveillée',
      'en': 'Offer enrichment or supervised free-roam time',
      'es': 'Ofrecer enriquecimiento o tiempo libre supervisado',
    },

    // Shop
    'shop_title': {
      'fr': 'Boutique NAC',
      'en': 'NAC Shop',
      'es': 'Tienda NAC',
    },
    'shop_subtitle': {
      'fr': 'Le matériel essentiel pour votre animal exotique.',
      'en': 'Essential gear for your exotic pet.',
      'es': 'El equipo esencial para tu mascota exótica.',
    },
    'shop_view_deals': {
      'fr': 'Voir les offres',
      'en': 'View deals',
      'es': 'Ver ofertas',
    },
    'shop_cat_terrariums_title': {
      'fr': 'Terrariums & habitats',
      'en': 'Terrariums & habitats',
      'es': 'Terrarios y hábitats',
    },
    'shop_cat_terrariums_desc': {
      'fr': 'Terrariums, cages, aquariums et accessoires d\'aménagement.',
      'en': 'Terrariums, cages, tanks and setup accessories.',
      'es': 'Terrarios, jaulas, acuarios y accesorios de instalación.',
    },
    'shop_cat_substrate_title': {
      'fr': 'Substrats & litières',
      'en': 'Substrate & bedding',
      'es': 'Sustratos y lechos',
    },
    'shop_cat_substrate_desc': {
      'fr': 'Substrats fouisseurs, litières absorbantes et copeaux adaptés.',
      'en': 'Burrowing substrates, absorbent bedding and suitable wood shavings.',
      'es': 'Sustratos excavadores, lechos absorbentes y virutas adecuadas.',
    },
    'shop_cat_uv_title': {
      'fr': 'Éclairage UV & chauffage',
      'en': 'UV lighting & heating',
      'es': 'Iluminación UV y calefacción',
    },
    'shop_cat_uv_desc': {
      'fr': 'Rampes UVB/UVA, tapis chauffants, thermostats et hygromètres.',
      'en': 'UVB/UVA lamps, heat mats, thermostats and hygrometers.',
      'es': 'Lámparas UVB/UVA, esteras térmicas, termostatos e higrómetros.',
    },
    'shop_cat_food_title': {
      'fr': 'Alimentation spécialisée',
      'en': 'Specialized food',
      'es': 'Alimentación especializada',
    },
    'shop_cat_food_desc': {
      'fr': 'Granulés, insectes vivants/déshydratés, foin et compléments.',
      'en': 'Pellets, live/dried insects, hay and supplements.',
      'es': 'Gránulos, insectos vivos/deshidratados, heno y suplementos.',
    },
    'shop_cat_accessories_title': {
      'fr': 'Accessoires & enrichissement',
      'en': 'Accessories & enrichment',
      'es': 'Accesorios y enriquecimiento',
    },
    'shop_cat_accessories_desc': {
      'fr': 'Cachettes, hamacs, roues, jouets et transport.',
      'en': 'Hides, hammocks, wheels, toys and carriers.',
      'es': 'Escondites, hamacas, ruedas, juguetes y transportines.',
    },
  };
}
