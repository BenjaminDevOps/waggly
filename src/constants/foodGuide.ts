import type { PetType } from '../models/types';
import type { Locale } from '../i18n';

export interface FoodItem {
  name: Record<Locale, string>;
  note?: Record<Locale, string>;
}

export interface SpeciesFoodGuide {
  type: PetType;
  allowed: FoodItem[];
  limit: FoodItem[];
  toxic: FoodItem[];
}

const item = (fr: string, en: string, es: string, noteFr?: string, noteEn?: string, noteEs?: string): FoodItem => ({
  name: { fr, en, es },
  ...(noteFr && noteEn && noteEs ? { note: { fr: noteFr, en: noteEn, es: noteEs } } : {}),
});

export const FOOD_GUIDE: SpeciesFoodGuide[] = [
  {
    type: 'reptile',
    allowed: [
      item('Grillons et vers de farine gut-loaded', 'Gut-loaded crickets and mealworms', 'Grillos y gusanos de la harina gut-loaded'),
      item('Chou frisé, pissenlit, endive', 'Kale, dandelion greens, endive', 'Col rizada, diente de león, endibia'),
      item('Courge butternut cuite', 'Cooked butternut squash', 'Calabaza butternut cocida'),
      item('Myrtilles et fraises (petite quantité)', 'Blueberries and strawberries (small amounts)', 'Arándanos y fresas (pequeñas cantidades)'),
    ],
    limit: [
      item('Épinards', 'Spinach', 'Espinacas', 'Riche en oxalates, bloque l\'absorption du calcium', 'High in oxalates, blocks calcium absorption', 'Ricos en oxalatos, bloquean la absorción de calcio'),
      item('Laitue iceberg', 'Iceberg lettuce', 'Lechuga iceberg', 'Peu nutritive, à éviter en base alimentaire', 'Low nutritional value, avoid as a diet staple', 'Poco nutritiva, evitar como base de la dieta'),
      item('Fruits très sucrés (banane)', 'Very sweet fruit (banana)', 'Frutas muy dulces (plátano)'),
    ],
    toxic: [
      item('Avocat', 'Avocado', 'Aguacate', 'Persine toxique pour de nombreux reptiles', 'Persin is toxic to many reptiles', 'La persina es tóxica para muchos reptiles'),
      item('Rhubarbe', 'Rhubarb', 'Ruibarbo', 'Feuilles très riches en oxalates', 'Leaves are extremely high in oxalates', 'Las hojas son muy ricas en oxalatos'),
      item('Feuilles de tomate et pomme de terre', 'Tomato and potato leaves', 'Hojas de tomate y patata', 'Contiennent des solanines toxiques', 'Contain toxic solanine', 'Contienen solanina tóxica'),
      item('Insectes lumineux (lucioles)', 'Fireflies', 'Luciérnagas', 'Mortelles pour de nombreux agames', 'Fatal to many lizard species', 'Mortales para muchas especies de lagartos'),
    ],
  },
  {
    type: 'rodent',
    allowed: [
      item('Foin de qualité à volonté', 'Quality hay, free access', 'Heno de calidad a voluntad'),
      item('Poivron, concombre, carotte', 'Bell pepper, cucumber, carrot', 'Pimiento, pepino, zanahoria'),
      item('Granulés spécifiques à l\'espèce', 'Species-specific pellets', 'Pienso específico de la especie'),
      item('Petits fruits en petite quantité', 'Small amounts of fruit', 'Pequeñas cantidades de fruta'),
    ],
    limit: [
      item('Graines grasses (tournesol)', 'Fatty seeds (sunflower)', 'Semillas grasas (girasol)', 'Trop caloriques en grande quantité', 'Too calorie-dense in large amounts', 'Demasiado calóricas en grandes cantidades'),
      item('Fruits sucrés', 'Sugary fruit', 'Fruta azucarada'),
      item('Noix et fruits à coque', 'Nuts', 'Frutos secos'),
    ],
    toxic: [
      item('Chocolat', 'Chocolate', 'Chocolate', 'Théobromine toxique', 'Theobromine is toxic', 'La teobromina es tóxica'),
      item('Oignon et ail', 'Onion and garlic', 'Cebolla y ajo', 'Toxiques pour les globules rouges', 'Toxic to red blood cells', 'Tóxicos para los glóbulos rojos'),
      item('Amandes amères', 'Bitter almonds', 'Almendras amargas', 'Contiennent du cyanure', 'Contain cyanide compounds', 'Contienen compuestos de cianuro'),
      item('Avocat', 'Avocado', 'Aguacate'),
    ],
  },
  {
    type: 'ferret',
    allowed: [
      item('Viande crue ou cuite (poulet, dinde)', 'Raw or cooked meat (chicken, turkey)', 'Carne cruda o cocida (pollo, pavo)'),
      item('Croquettes riches en protéines animales', 'High animal-protein kibble', 'Pienso rico en proteína animal'),
      item('Œuf cuit (occasionnel)', 'Cooked egg (occasional)', 'Huevo cocido (ocasional)'),
    ],
    limit: [
      item('Produits laitiers', 'Dairy products', 'Lácteos', 'Mal digérés, peuvent causer des diarrhées', 'Poorly digested, can cause diarrhea', 'Mal digeridos, pueden causar diarrea'),
      item('Fruits et légumes', 'Fruits and vegetables', 'Frutas y verduras', 'Faible valeur nutritive pour un carnivore strict', 'Low nutritional value for an obligate carnivore', 'Poco valor nutricional para un carnívoro estricto'),
      item('Friandises industrielles sucrées', 'Sugary commercial treats', 'Golosinas comerciales azucaradas'),
    ],
    toxic: [
      item('Chocolat', 'Chocolate', 'Chocolate', 'Théobromine toxique', 'Theobromine is toxic', 'La teobromina es tóxica'),
      item('Raisins et raisins secs', 'Grapes and raisins', 'Uvas y pasas'),
      item('Xylitol (édulcorant)', 'Xylitol (sweetener)', 'Xilitol (edulcorante)'),
      item('Oignon et ail', 'Onion and garlic', 'Cebolla y ajo'),
    ],
  },
  {
    type: 'bird',
    allowed: [
      item('Granulés/graines adaptés à l\'espèce', 'Species-appropriate pellets/seed mix', 'Pienso/semillas adecuados a la especie'),
      item('Légumes verts (brocoli, épinard cuit)', 'Leafy greens (broccoli, cooked spinach)', 'Verduras de hoja (brócoli, espinaca cocida)'),
      item('Pomme sans pépins, poire', 'Seedless apple, pear', 'Manzana sin pepitas, pera'),
    ],
    limit: [
      item('Graines grasses en excès (tournesol)', 'Excess fatty seeds (sunflower)', 'Exceso de semillas grasas (girasol)'),
      item('Fruits très sucrés', 'Very sweet fruit', 'Frutas muy dulces'),
    ],
    toxic: [
      item('Avocat', 'Avocado', 'Aguacate', 'Persine toxique pour les oiseaux', 'Persin is toxic to birds', 'La persina es tóxica para las aves'),
      item('Chocolat et caféine', 'Chocolate and caffeine', 'Chocolate y cafeína'),
      item('Pépins de pomme', 'Apple seeds', 'Semillas de manzana', 'Contiennent des composés cyanurés', 'Contain cyanogenic compounds', 'Contienen compuestos cianogénicos'),
      item('Sel en excès', 'Excess salt', 'Exceso de sal'),
      item('Oignon et ail', 'Onion and garlic', 'Cebolla y ajo'),
    ],
  },
  {
    type: 'fish',
    allowed: [
      item('Granulés/paillettes adaptés à l\'espèce', 'Species-appropriate pellets/flakes', 'Gránulos/escamas adecuados a la especie'),
      item('Vers de vase congelés', 'Frozen bloodworms', 'Gusanos de sangre congelados'),
      item('Artémias (nauplies)', 'Brine shrimp (nauplii)', 'Artemia (nauplios)'),
    ],
    limit: [
      item('Pain', 'Bread', 'Pan', 'Gonfle dans l\'estomac et pollue l\'eau', 'Swells in the stomach and fouls the water', 'Se hincha en el estómago y contamina el agua'),
      item('Nourriture terrestre non adaptée', 'Unsuitable land-animal food', 'Alimento terrestre no adecuado'),
    ],
    toxic: [
      item('Aliments gras ou salés destinés à l\'humain', 'Fatty or salty human food', 'Alimentos grasos o salados para humanos'),
      item('Nourriture périmée', 'Expired food', 'Comida caducada', 'Peut développer des toxines', 'Can develop harmful toxins', 'Puede desarrollar toxinas dañinas'),
    ],
  },
  {
    type: 'amphibian',
    allowed: [
      item('Grillons et drosophiles vivants', 'Live crickets and fruit flies', 'Grillos y moscas de la fruta vivos'),
      item('Vers de terre', 'Earthworms', 'Lombrices de tierra'),
      item('Granulés spécifiques (axolotl)', 'Species-specific pellets (axolotl)', 'Gránulos específicos (ajolote)'),
    ],
    limit: [
      item('Insectes sauvages non élevés', 'Wild-caught insects', 'Insectos silvestres no criados', 'Risque de pesticides et parasites', 'Risk of pesticides and parasites', 'Riesgo de pesticidas y parásitos'),
      item('Poisson cru en excès', 'Excess raw fish', 'Exceso de pescado crudo'),
    ],
    toxic: [
      item('Insectes traités aux pesticides', 'Pesticide-treated insects', 'Insectos tratados con pesticidas'),
      item('Aliments salés ou épicés', 'Salty or spicy food', 'Alimentos salados o picantes'),
      item('Produits laitiers', 'Dairy products', 'Lácteos'),
    ],
  },
  {
    type: 'invertebrate',
    allowed: [
      item('Grillons et blattes élevées', 'Farmed crickets and roaches', 'Grillos y cucarachas de cría'),
      item('Feuilles fraîches (ronce, chêne)', 'Fresh leaves (bramble, oak)', 'Hojas frescas (zarza, roble)'),
      item('Fruits et légumes frais', 'Fresh fruits and vegetables', 'Frutas y verduras frescas'),
    ],
    limit: [
      item('Fruits très sucrés', 'Very sweet fruit', 'Frutas muy dulces', 'Favorise le développement de moisissures', 'Encourages mold growth', 'Favorece el desarrollo de moho'),
      item('Insectes sauvages non élevés', 'Wild-caught insects', 'Insectos silvestres no criados'),
    ],
    toxic: [
      item('Résidus de pesticides/produits chimiques', 'Pesticide or chemical residue', 'Residuos de pesticidas o productos químicos'),
      item('Agrumes pour certaines espèces', 'Citrus for some species', 'Cítricos para algunas especies', 'Acidité mal tolérée par certains invertébrés', 'Acidity poorly tolerated by some invertebrates', 'Acidez mal tolerada por algunos invertebrados'),
      item('Sel', 'Salt', 'Sal'),
    ],
  },
];
