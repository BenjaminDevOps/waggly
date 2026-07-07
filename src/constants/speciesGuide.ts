import type { PetType } from '../models/types';
import type { Locale } from '../i18n';

export interface SpeciesCareSheet {
  type: PetType;
  emoji: string;
  examples: Record<Locale, string>;
  habitat: Record<Locale, string>;
  diet: Record<Locale, string>;
  temperature: Record<Locale, string>;
  maintenance: Record<Locale, string>;
}

export const SPECIES_GUIDE: SpeciesCareSheet[] = [
  {
    type: 'reptile',
    emoji: '\u{1F98E}',
    examples: {
      en: 'Leopard gecko, bearded dragon, snake, tortoise',
      fr: 'Gecko léopard, pogona, serpent, tortue',
      es: 'Gecko leopardo, pogona, serpiente, tortuga',
    },
    habitat: {
      en: 'Secure enclosed terrarium with hides and a thermal gradient.',
      fr: 'Terrarium fermé et sécurisé, avec cachettes et zones de gradient thermique.',
      es: 'Terrario cerrado y seguro, con escondites y gradiente térmico.',
    },
    diet: {
      en: 'Depends on species: gut-loaded live insects dusted with calcium, or fresh greens.',
      fr: 'Selon l\'espèce : insectes vivants saupoudrés de calcium, ou végétaux frais.',
      es: 'Según la especie: insectos vivos espolvoreados con calcio, o vegetales frescos.',
    },
    temperature: {
      en: 'Basking spot 28-35°C (82-95°F); UVB lighting is essential for vitamin D3 synthesis.',
      fr: 'Point chaud 28-35°C, éclairage UVB indispensable pour la synthèse de vitamine D3.',
      es: 'Punto caliente 28-35°C; la iluminación UVB es esencial para la síntesis de vitamina D3.',
    },
    maintenance: {
      en: 'Weekly substrate cleaning, humidity checks, and UVB tube replacement every 6-12 months.',
      fr: 'Nettoyage hebdomadaire du substrat, contrôle de l\'hygrométrie et remplacement du tube UVB tous les 6-12 mois.',
      es: 'Limpieza semanal del sustrato, control de humedad y cambio del tubo UVB cada 6-12 meses.',
    },
  },
  {
    type: 'rodent',
    emoji: '\u{1F439}',
    examples: {
      en: 'Hamster, guinea pig, chinchilla, rat, mouse',
      fr: 'Hamster, cochon d\'Inde, chinchilla, rat, souris',
      es: 'Hámster, cobaya, chinchilla, rata, ratón',
    },
    habitat: {
      en: 'Large cage with absorbent bedding, a properly sized wheel, and enrichment areas.',
      fr: 'Grande cage avec litière absorbante, roue adaptée et zones d\'enrichissement.',
      es: 'Jaula grande con lecho absorbente, rueda adecuada y zonas de enriquecimiento.',
    },
    diet: {
      en: 'Species-appropriate seed/pellet mix, plus fresh vegetables and hay (guinea pigs, chinchillas).',
      fr: 'Mélange de graines/granulés adapté à l\'espèce, complété de légumes frais et de foin (cochon d\'Inde, chinchilla).',
      es: 'Mezcla de semillas/pienso adecuada a la especie, más verduras frescas y heno (cobayas, chinchillas).',
    },
    temperature: {
      en: 'Stable room temperature 18-24°C (64-75°F), away from drafts and direct sun.',
      fr: 'Température ambiante stable 18-24°C, à l\'abri des courants d\'air et du soleil direct.',
      es: 'Temperatura ambiente estable 18-24°C, lejos de corrientes de aire y sol directo.',
    },
    maintenance: {
      en: 'Clean bedding 1-2 times a week, fresh water daily, monitor nail length.',
      fr: 'Nettoyage de la litière 1 à 2 fois par semaine, eau fraîche quotidienne, griffes surveillées.',
      es: 'Limpiar el lecho 1-2 veces por semana, agua fresca a diario, vigilar las uñas.',
    },
  },
  {
    type: 'ferret',
    emoji: '\u{1F9A1}',
    examples: {
      en: 'Domestic ferret',
      fr: 'Furet domestique',
      es: 'Hurón doméstico',
    },
    habitat: {
      en: 'Large multi-level cage with litter box, hammock, and several hours of supervised free-roam daily.',
      fr: 'Grande cage multi-niveaux avec litière, hamac et plusieurs heures de sortie surveillée par jour.',
      es: 'Jaula grande de varios niveles con arenero, hamaca y varias horas de tiempo libre supervisado al día.',
    },
    diet: {
      en: 'High-protein carnivore diet: ferret-specific kibble or an appropriately balanced raw diet.',
      fr: 'Alimentation carnée riche en protéines, croquettes spécifiques furet ou ration crue adaptée.',
      es: 'Dieta carnívora rica en proteínas: pienso específico para hurones o dieta cruda equilibrada.',
    },
    temperature: {
      en: 'Comfortable at 15-21°C (59-70°F); very prone to heatstroke above 27°C (80°F).',
      fr: 'Confort à 15-21°C, très sensible aux coups de chaleur au-delà de 27°C.',
      es: 'Cómodo entre 15-21°C; muy propenso a golpes de calor por encima de 27°C.',
    },
    maintenance: {
      en: 'Litter cleaned daily, regular nail trims, rabies/distemper vaccinations kept up to date.',
      fr: 'Litière nettoyée quotidiennement, griffes coupées régulièrement, vaccination antirabique/carré à jour.',
      es: 'Arenero limpiado a diario, uñas cortadas regularmente, vacunas antirrábica/moquillo al día.',
    },
  },
  {
    type: 'bird',
    emoji: '\u{1F99C}',
    examples: {
      en: 'Budgie, parrot, canary, cockatoo',
      fr: 'Perruche, perroquet, canari, cacatoès',
      es: 'Periquito, loro, canario, cacatúa',
    },
    habitat: {
      en: 'Large cage or aviary with perches of varying diameters and enrichment toys.',
      fr: 'Grande cage ou volière avec perchoirs de diamètres variés et jouets d\'enrichissement.',
      es: 'Jaula grande o pajarera con perchas de diámetros variados y juguetes de enriquecimiento.',
    },
    diet: {
      en: 'Species-appropriate seed/pellet mix, supplemented with fresh fruits and vegetables.',
      fr: 'Mélange de graines/granulés adapté à l\'espèce, fruits et légumes frais en complément.',
      es: 'Mezcla de semillas/pienso adecuada a la especie, complementada con frutas y verduras frescas.',
    },
    temperature: {
      en: 'Stable room at 18-24°C (64-75°F), no drafts, and no exposure to smoke or aerosols.',
      fr: 'Pièce stable 18-24°C, sans courants d\'air ni exposition aux fumées/aérosols.',
      es: 'Habitación estable 18-24°C, sin corrientes de aire ni exposición a humo o aerosoles.',
    },
    maintenance: {
      en: 'Daily tray cleaning, fresh water every day, monitor beak and feather condition.',
      fr: 'Nettoyage quotidien du plateau, eau changée chaque jour, surveillance du bec et des plumes.',
      es: 'Limpieza diaria de la bandeja, agua nueva cada día, vigilar el pico y las plumas.',
    },
  },
  {
    type: 'fish',
    emoji: '\u{1F420}',
    examples: {
      en: 'Goldfish, betta, guppy, reef aquarium fish',
      fr: 'Poisson rouge, betta, guppy, poisson d\'aquarium récifal',
      es: 'Pez dorado, betta, guppy, peces de acuario de arrecife',
    },
    habitat: {
      en: 'Cycled aquarium with filtration sized to volume, plus hides and plants.',
      fr: 'Aquarium cyclé avec filtration adaptée au volume et cachettes/plantes.',
      es: 'Acuario ciclado con filtración adecuada al volumen, escondites y plantas.',
    },
    diet: {
      en: 'Species-appropriate pellets/flakes, fed in small amounts once or twice a day.',
      fr: 'Granulés/paillettes adaptés à l\'espèce, en petites quantités 1 à 2 fois par jour.',
      es: 'Gránulos/escamas adecuados a la especie, en pequeñas cantidades una o dos veces al día.',
    },
    temperature: {
      en: 'Species-dependent (coldwater or tropical 22-28°C/72-82°F); test water parameters regularly.',
      fr: 'Selon l\'espèce (eau froide ou tropicale 22-28°C), paramètres d\'eau testés régulièrement.',
      es: 'Según la especie (agua fría o tropical 22-28°C); analiza los parámetros del agua con regularidad.',
    },
    maintenance: {
      en: 'Weekly partial water change (10-20%), filter cleaning, nitrite/nitrate testing.',
      fr: 'Changement d\'eau partiel hebdomadaire (10-20%), nettoyage du filtre, test nitrites/nitrates.',
      es: 'Cambio parcial de agua semanal (10-20%), limpieza del filtro, test de nitritos/nitratos.',
    },
  },
  {
    type: 'amphibian',
    emoji: '\u{1F438}',
    examples: {
      en: 'Frog, axolotl, newt, dart frog',
      fr: 'Grenouille, axolotl, triton, dendrobate',
      es: 'Rana, ajolote, tritón, dendrobates',
    },
    habitat: {
      en: 'Humid terrarium or aquaterrarium, free of chemicals, with hides and a water area.',
      fr: 'Terrarium ou aquaterrarium humide, sans produits chimiques, avec cachettes et point d\'eau.',
      es: 'Terrario o acuaterrario húmedo, sin productos químicos, con escondites y zona de agua.',
    },
    diet: {
      en: 'Live prey (insects, worms) or species-specific pellets.',
      fr: 'Proies vivantes (insectes, vers) ou granulés spécifiques selon l\'espèce.',
      es: 'Presas vivas (insectos, gusanos) o gránulos específicos según la especie.',
    },
    temperature: {
      en: 'Usually cool (16-22°C/61-72°F depending on species), with continuously high humidity.',
      fr: 'Généralement fraîche (16-22°C selon l\'espèce), humidité élevée à maintenir en continu.',
      es: 'Generalmente fresca (16-22°C según la especie), con humedad alta constante.',
    },
    maintenance: {
      en: 'Dechlorinated water only, gentle enclosure cleaning, avoid bare-hand handling without precautions.',
      fr: 'Eau déchlorée uniquement, nettoyage doux du bac, jamais de manipulation à mains nues sans précaution.',
      es: 'Solo agua declorada, limpieza suave del recinto, evitar manipular con las manos sin precauciones.',
    },
  },
  {
    type: 'invertebrate',
    emoji: '\u{1F577}\u{FE0F}',
    examples: {
      en: 'Tarantula, millipede, stick insect, giant snail',
      fr: 'Mygale, mille-pattes, phasme, escargot géant',
      es: 'Tarántula, milpiés, insecto palo, caracol gigante',
    },
    habitat: {
      en: 'Small ventilated terrarium with substrate suited to the species (burrowing or arboreal).',
      fr: 'Petit terrarium ventilé avec substrat adapté (fouisseur ou arboricole selon l\'espèce).',
      es: 'Terrario pequeño y ventilado con sustrato adecuado (excavador o arborícola según la especie).',
    },
    diet: {
      en: 'Live insects (crickets, roaches) once or twice a week, or plant matter depending on species.',
      fr: 'Insectes vivants (grillons, blattes) une à deux fois par semaine, ou végétaux selon l\'espèce.',
      es: 'Insectos vivos (grillos, cucarachas) una o dos veces por semana, o vegetales según la especie.',
    },
    temperature: {
      en: 'Generally 22-28°C (72-82°F) with species-specific humidity monitored via hygrometer.',
      fr: 'Généralement 22-28°C avec une hygrométrie spécifique à surveiller à l\'hygromètre.',
      es: 'Generalmente 22-28°C con una humedad específica controlada con higrómetro.',
    },
    maintenance: {
      en: 'Minimal handling, monitor molting, occasional cleaning without chemical products.',
      fr: 'Manipulation minimale, contrôle de la mue, nettoyage ponctuel sans produits chimiques.',
      es: 'Manipulación mínima, vigilar la muda, limpieza puntual sin productos químicos.',
    },
  },
  {
    type: 'other',
    emoji: '\u{1F43E}',
    examples: {
      en: 'Any other exotic/companion species',
      fr: 'Toute autre espèce de nouvel animal de compagnie',
      es: 'Cualquier otra especie de mascota exótica',
    },
    habitat: {
      en: 'Check the species\' exact needs with an exotics-savvy veterinarian.',
      fr: 'Renseignez-vous sur les besoins précis de l\'espèce auprès d\'un vétérinaire NAC.',
      es: 'Consulta las necesidades exactas de la especie con un veterinario especializado en exóticos.',
    },
    diet: {
      en: 'Varies by species: ask for a tailored feeding plan.',
      fr: 'Variable selon l\'espèce : demandez un plan alimentaire adapté.',
      es: 'Varía según la especie: pide un plan de alimentación adaptado.',
    },
    temperature: {
      en: 'Varies by species and its natural geographic origin.',
      fr: 'Variable selon l\'espèce et son origine géographique.',
      es: 'Varía según la especie y su origen geográfico natural.',
    },
    maintenance: {
      en: 'Follow the specific recommendations provided by an exotics professional.',
      fr: 'Suivez les recommandations spécifiques fournies par un professionnel NAC.',
      es: 'Sigue las recomendaciones específicas de un profesional en animales exóticos.',
    },
  },
];
