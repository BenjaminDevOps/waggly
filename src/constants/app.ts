export const APP = {
  name: 'Waggly NAC',
  version: '1.0.0',
  tagline: 'Your Exotic Pet\'s Health Companion',
};

export const FREEMIUM = {
  freeAiDiagnosisLimit: 3,
  premiumDiagnosisLimit: -1,
};

export const POINTS = {
  healthCheck: 10,
  vetVisit: 50,
  dailyStreak: 5,
  weeklyStreak: 25,
  diagnosis: 10,
  shopPurchase: 15,
  badgeEarned: 50,
};

export const COLLECTIONS = {
  users: 'users',
  pets: 'pets',
  healthRecords: 'health_records',
  diagnoses: 'diagnoses',
  badges: 'badges',
  shopItems: 'shop_items',
  nacJournal: 'nac_journal_entries',
  appointments: 'appointments',
};

export const AFFILIATE = {
  // Your Amazon Associates tracking tag — the single place it is configured.
  // It must match the storefront in utils/amazon.ts: amazon.fr only credits
  // tags ending in -21 ("-20" is amazon.com). A mismatch still opens the
  // product, it just earns nothing; utils/amazon.ts warns about it on startup.
  amazonId: 'waggly-20',
  zooplusId: 'waggly',
};
