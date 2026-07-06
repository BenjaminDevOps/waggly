import '../../shared/models/pet_model.dart';
import '../localization/app_language.dart';

/// Trilingual care-sheet content for a NAC (exotic pet) species category.
class SpeciesCareSheet {
  final PetType type;
  final String emoji;
  final Map<String, String> name;
  final Map<String, String> examples;
  final Map<String, String> habitat;
  final Map<String, String> diet;
  final Map<String, String> temperature;
  final Map<String, String> maintenance;

  const SpeciesCareSheet({
    required this.type,
    required this.emoji,
    required this.name,
    required this.examples,
    required this.habitat,
    required this.diet,
    required this.temperature,
    required this.maintenance,
  });

  String _pick(Map<String, String> values, AppLanguage lang) =>
      values[lang.code] ?? values['en'] ?? '';

  String nameFor(AppLanguage lang) => _pick(name, lang);
  String examplesFor(AppLanguage lang) => _pick(examples, lang);
  String habitatFor(AppLanguage lang) => _pick(habitat, lang);
  String dietFor(AppLanguage lang) => _pick(diet, lang);
  String temperatureFor(AppLanguage lang) => _pick(temperature, lang);
  String maintenanceFor(AppLanguage lang) => _pick(maintenance, lang);
}

/// Catalog of NAC species care sheets shown in the Species Guide screen
/// and used to power the AI Diagnosis species picker.
class NacSpeciesCatalog {
  const NacSpeciesCatalog._();

  static const List<SpeciesCareSheet> all = [
    SpeciesCareSheet(
      type: PetType.reptile,
      emoji: '🦎',
      name: {'fr': 'Reptile', 'en': 'Reptile', 'es': 'Reptil'},
      examples: {
        'fr': 'Gecko léopard, pogona, serpent, tortue',
        'en': 'Leopard gecko, bearded dragon, snake, tortoise',
        'es': 'Gecko leopardo, pogona, serpiente, tortuga',
      },
      habitat: {
        'fr': 'Terrarium fermé et sécurisé, avec cachettes et zones de gradient thermique.',
        'en': 'Secure enclosed terrarium with hides and a thermal gradient.',
        'es': 'Terrario cerrado y seguro, con escondites y gradiente térmico.',
      },
      diet: {
        'fr': 'Selon l\'espèce : insectes vivants saupoudrés de calcium, ou végétaux frais.',
        'en': 'Depends on species: gut-loaded live insects dusted with calcium, or fresh greens.',
        'es': 'Según la especie: insectos vivos espolvoreados con calcio, o vegetales frescos.',
      },
      temperature: {
        'fr': 'Point chaud 28-35°C, éclairage UVB indispensable pour la synthèse de vitamine D3.',
        'en': 'Basking spot 28-35°C (82-95°F); UVB lighting is essential for vitamin D3 synthesis.',
        'es': 'Punto caliente 28-35°C; la iluminación UVB es esencial para la síntesis de vitamina D3.',
      },
      maintenance: {
        'fr': 'Nettoyage hebdomadaire du substrat, contrôle de l\'hygrométrie et remplacement du tube UVB tous les 6-12 mois.',
        'en': 'Weekly substrate cleaning, humidity checks, and UVB tube replacement every 6-12 months.',
        'es': 'Limpieza semanal del sustrato, control de humedad y cambio del tubo UVB cada 6-12 meses.',
      },
    ),
    SpeciesCareSheet(
      type: PetType.rodent,
      emoji: '🐹',
      name: {'fr': 'Rongeur', 'en': 'Rodent', 'es': 'Roedor'},
      examples: {
        'fr': 'Hamster, cochon d\'Inde, chinchilla, rat, souris',
        'en': 'Hamster, guinea pig, chinchilla, rat, mouse',
        'es': 'Hámster, cobaya, chinchilla, rata, ratón',
      },
      habitat: {
        'fr': 'Grande cage avec litière absorbante, roue adaptée et zones d\'enrichissement.',
        'en': 'Large cage with absorbent bedding, a properly sized wheel, and enrichment areas.',
        'es': 'Jaula grande con lecho absorbente, rueda adecuada y zonas de enriquecimiento.',
      },
      diet: {
        'fr': 'Mélange de graines/granulés adapté à l\'espèce, complété de légumes frais et de foin (cochon d\'Inde, chinchilla).',
        'en': 'Species-appropriate seed/pellet mix, plus fresh vegetables and hay (guinea pigs, chinchillas).',
        'es': 'Mezcla de semillas/pienso adecuada a la especie, más verduras frescas y heno (cobayas, chinchillas).',
      },
      temperature: {
        'fr': 'Température ambiante stable 18-24°C, à l\'abri des courants d\'air et du soleil direct.',
        'en': 'Stable room temperature 18-24°C (64-75°F), away from drafts and direct sun.',
        'es': 'Temperatura ambiente estable 18-24°C, lejos de corrientes de aire y sol directo.',
      },
      maintenance: {
        'fr': 'Nettoyage de la litière 1 à 2 fois par semaine, eau fraîche quotidienne, griffes surveillées.',
        'en': 'Clean bedding 1-2 times a week, fresh water daily, monitor nail length.',
        'es': 'Limpiar el lecho 1-2 veces por semana, agua fresca a diario, vigilar las uñas.',
      },
    ),
    SpeciesCareSheet(
      type: PetType.ferret,
      emoji: '🦡',
      name: {'fr': 'Furet', 'en': 'Ferret', 'es': 'Hurón'},
      examples: {
        'fr': 'Furet domestique',
        'en': 'Domestic ferret',
        'es': 'Hurón doméstico',
      },
      habitat: {
        'fr': 'Grande cage multi-niveaux avec litière, hamac et plusieurs heures de sortie surveillée par jour.',
        'en': 'Large multi-level cage with litter box, hammock, and several hours of supervised free-roam daily.',
        'es': 'Jaula grande de varios niveles con arenero, hamaca y varias horas de tiempo libre supervisado al día.',
      },
      diet: {
        'fr': 'Alimentation carnée riche en protéines, croquettes spécifiques furet ou ration crue adaptée.',
        'en': 'High-protein carnivore diet: ferret-specific kibble or an appropriately balanced raw diet.',
        'es': 'Dieta carnívora rica en proteínas: pienso específico para hurones o dieta cruda equilibrada.',
      },
      temperature: {
        'fr': 'Confort à 15-21°C, très sensible aux coups de chaleur au-delà de 27°C.',
        'en': 'Comfortable at 15-21°C (59-70°F); very prone to heatstroke above 27°C (80°F).',
        'es': 'Cómodo entre 15-21°C; muy propenso a golpes de calor por encima de 27°C.',
      },
      maintenance: {
        'fr': 'Litière nettoyée quotidiennement, griffes coupées régulièrement, vaccination antirabique/carré à jour.',
        'en': 'Litter cleaned daily, regular nail trims, rabies/distemper vaccinations kept up to date.',
        'es': 'Arenero limpiado a diario, uñas cortadas regularmente, vacunas antirrábica/moquillo al día.',
      },
    ),
    SpeciesCareSheet(
      type: PetType.bird,
      emoji: '🦜',
      name: {'fr': 'Oiseau', 'en': 'Bird', 'es': 'Ave'},
      examples: {
        'fr': 'Perruche, perroquet, canari, cacatoès',
        'en': 'Budgie, parrot, canary, cockatoo',
        'es': 'Periquito, loro, canario, cacatúa',
      },
      habitat: {
        'fr': 'Grande cage ou volière avec perchoirs de diamètres variés et jouets d\'enrichissement.',
        'en': 'Large cage or aviary with perches of varying diameters and enrichment toys.',
        'es': 'Jaula grande o pajarera con perchas de diámetros variados y juguetes de enriquecimiento.',
      },
      diet: {
        'fr': 'Mélange de graines/granulés adapté à l\'espèce, fruits et légumes frais en complément.',
        'en': 'Species-appropriate seed/pellet mix, supplemented with fresh fruits and vegetables.',
        'es': 'Mezcla de semillas/pienso adecuada a la especie, complementada con frutas y verduras frescas.',
      },
      temperature: {
        'fr': 'Pièce stable 18-24°C, sans courants d\'air ni exposition aux fumées/aérosols.',
        'en': 'Stable room at 18-24°C (64-75°F), no drafts, and no exposure to smoke or aerosols.',
        'es': 'Habitación estable 18-24°C, sin corrientes de aire ni exposición a humo o aerosoles.',
      },
      maintenance: {
        'fr': 'Nettoyage quotidien du plateau, eau changée chaque jour, surveillance du bec et des plumes.',
        'en': 'Daily tray cleaning, fresh water every day, monitor beak and feather condition.',
        'es': 'Limpieza diaria de la bandeja, agua nueva cada día, vigilar el pico y las plumas.',
      },
    ),
    SpeciesCareSheet(
      type: PetType.fish,
      emoji: '🐠',
      name: {'fr': 'Poisson', 'en': 'Fish', 'es': 'Pez'},
      examples: {
        'fr': 'Poisson rouge, betta, guppy, poisson d\'aquarium récifal',
        'en': 'Goldfish, betta, guppy, reef aquarium fish',
        'es': 'Pez dorado, betta, guppy, peces de acuario de arrecife',
      },
      habitat: {
        'fr': 'Aquarium cyclé avec filtration adaptée au volume et cachettes/plantes.',
        'en': 'Cycled aquarium with filtration sized to volume, plus hides and plants.',
        'es': 'Acuario ciclado con filtración adecuada al volumen, escondites y plantas.',
      },
      diet: {
        'fr': 'Granulés/paillettes adaptés à l\'espèce, en petites quantités 1 à 2 fois par jour.',
        'en': 'Species-appropriate pellets/flakes, fed in small amounts once or twice a day.',
        'es': 'Gránulos/escamas adecuados a la especie, en pequeñas cantidades una o dos veces al día.',
      },
      temperature: {
        'fr': 'Selon l\'espèce (eau froide ou tropicale 22-28°C), paramètres d\'eau testés régulièrement.',
        'en': 'Species-dependent (coldwater or tropical 22-28°C/72-82°F); test water parameters regularly.',
        'es': 'Según la especie (agua fría o tropical 22-28°C); analiza los parámetros del agua con regularidad.',
      },
      maintenance: {
        'fr': 'Changement d\'eau partiel hebdomadaire (10-20%), nettoyage du filtre, test nitrites/nitrates.',
        'en': 'Weekly partial water change (10-20%), filter cleaning, nitrite/nitrate testing.',
        'es': 'Cambio parcial de agua semanal (10-20%), limpieza del filtro, test de nitritos/nitratos.',
      },
    ),
    SpeciesCareSheet(
      type: PetType.amphibian,
      emoji: '🐸',
      name: {'fr': 'Amphibien', 'en': 'Amphibian', 'es': 'Anfibio'},
      examples: {
        'fr': 'Grenouille, axolotl, triton, dendrobate',
        'en': 'Frog, axolotl, newt, dart frog',
        'es': 'Rana, ajolote, tritón, dendrobates',
      },
      habitat: {
        'fr': 'Terrarium ou aquaterrarium humide, sans produits chimiques, avec cachettes et point d\'eau.',
        'en': 'Humid terrarium or aquaterrarium, free of chemicals, with hides and a water area.',
        'es': 'Terrario o acuaterrario húmedo, sin productos químicos, con escondites y zona de agua.',
      },
      diet: {
        'fr': 'Proies vivantes (insectes, vers) ou granulés spécifiques selon l\'espèce.',
        'en': 'Live prey (insects, worms) or species-specific pellets.',
        'es': 'Presas vivas (insectos, gusanos) o gránulos específicos según la especie.',
      },
      temperature: {
        'fr': 'Généralement fraîche (16-22°C selon l\'espèce), humidité élevée à maintenir en continu.',
        'en': 'Usually cool (16-22°C/61-72°F depending on species), with continuously high humidity.',
        'es': 'Generalmente fresca (16-22°C según la especie), con humedad alta constante.',
      },
      maintenance: {
        'fr': 'Eau déchlorée uniquement, nettoyage doux du bac, jamais de manipulation à mains nues sans précaution.',
        'en': 'Dechlorinated water only, gentle enclosure cleaning, avoid bare-hand handling without precautions.',
        'es': 'Solo agua declorada, limpieza suave del recinto, evitar manipular con las manos sin precauciones.',
      },
    ),
    SpeciesCareSheet(
      type: PetType.invertebrate,
      emoji: '🕷️',
      name: {'fr': 'Invertébré', 'en': 'Invertebrate', 'es': 'Invertebrado'},
      examples: {
        'fr': 'Mygale, mille-pattes, phasme, escargot géant',
        'en': 'Tarantula, millipede, stick insect, giant snail',
        'es': 'Tarántula, milpiés, insecto palo, caracol gigante',
      },
      habitat: {
        'fr': 'Petit terrarium ventilé avec substrat adapté (fouisseur ou arboricole selon l\'espèce).',
        'en': 'Small ventilated terrarium with substrate suited to the species (burrowing or arboreal).',
        'es': 'Terrario pequeño y ventilado con sustrato adecuado (excavador o arborícola según la especie).',
      },
      diet: {
        'fr': 'Insectes vivants (grillons, blattes) une à deux fois par semaine, ou végétaux selon l\'espèce.',
        'en': 'Live insects (crickets, roaches) once or twice a week, or plant matter depending on species.',
        'es': 'Insectos vivos (grillos, cucarachas) una o dos veces por semana, o vegetales según la especie.',
      },
      temperature: {
        'fr': 'Généralement 22-28°C avec une hygrométrie spécifique à surveiller à l\'hygromètre.',
        'en': 'Generally 22-28°C (72-82°F) with species-specific humidity monitored via hygrometer.',
        'es': 'Generalmente 22-28°C con una humedad específica controlada con higrómetro.',
      },
      maintenance: {
        'fr': 'Manipulation minimale, contrôle de la mue, nettoyage ponctuel sans produits chimiques.',
        'en': 'Minimal handling, monitor molting, occasional cleaning without chemical products.',
        'es': 'Manipulación mínima, vigilar la muda, limpieza puntual sin productos químicos.',
      },
    ),
    SpeciesCareSheet(
      type: PetType.other,
      emoji: '🐾',
      name: {'fr': 'Autre NAC', 'en': 'Other exotic pet', 'es': 'Otra mascota exótica'},
      examples: {
        'fr': 'Toute autre espèce de nouvel animal de compagnie',
        'en': 'Any other exotic/companion species',
        'es': 'Cualquier otra especie de mascota exótica',
      },
      habitat: {
        'fr': 'Renseignez-vous sur les besoins précis de l\'espèce auprès d\'un vétérinaire NAC.',
        'en': 'Check the species\' exact needs with an exotics-savvy veterinarian.',
        'es': 'Consulta las necesidades exactas de la especie con un veterinario especializado en exóticos.',
      },
      diet: {
        'fr': 'Variable selon l\'espèce : demandez un plan alimentaire adapté.',
        'en': 'Varies by species: ask for a tailored feeding plan.',
        'es': 'Varía según la especie: pide un plan de alimentación adaptado.',
      },
      temperature: {
        'fr': 'Variable selon l\'espèce et son origine géographique.',
        'en': 'Varies by species and its natural geographic origin.',
        'es': 'Varía según la especie y su origen geográfico natural.',
      },
      maintenance: {
        'fr': 'Suivez les recommandations spécifiques fournies par un professionnel NAC.',
        'en': 'Follow the specific recommendations provided by an exotics professional.',
        'es': 'Sigue las recomendaciones específicas de un profesional en animales exóticos.',
      },
    ),
  ];

  static SpeciesCareSheet forType(PetType type) {
    return all.firstWhere((s) => s.type == type, orElse: () => all.last);
  }
}
