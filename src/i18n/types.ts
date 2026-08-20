export type Locale = 'en' | 'fr' | 'es';

export interface Translations {
  // Common
  common: {
    loading: string;
    save: string;
    cancel: string;
    done: string;
    close: string;
    back: string;
    seeAll: string;
    search: string;
    delete: string;
    edit: string;
    confirm: string;
    error: string;
    success: string;
    retry: string;
    points: string;
    steps: string;
    km: string;
    cal: string;
    free: string;
    premium: string;
    of: string;
  };

  // Tab bar
  tabs: {
    home: string;
    pets: string;
    health: string;
    discover: string;
    profile: string;
  };

  // Home page
  home: {
    goodMorning: string;
    welcomeBack: string;
    dailyTip: string;
    myPets: string;
    noPetsYet: string;
    addPet: string;
    todaysCare: string;
    careProgress: string;
    quickActions: string;
    aiDiagnosis: string;
    speciesGuide: string;
    shop: string;
    badges: string;
    goToShop: string;
  };

  // Pets page
  pets: {
    title: string;
    subtitle: string;
    noPetsTitle: string;
    noPetsDesc: string;
    addFirstPet: string;
    yearsOld: string;
  };

  // Add Pet page
  addPet: {
    title: string;
    addPhoto: string;
    petType: string;
    name: string;
    namePlaceholder: string;
    breed: string;
    breedPlaceholder: string;
    gender: string;
    male: string;
    female: string;
    weight: string;
    weightPlaceholder: string;
    microchipId: string;
    microchipPlaceholder: string;
    savePet: string;
    reptile: string;
    rodent: string;
    ferret: string;
    bird: string;
    fish: string;
    amphibian: string;
    invertebrate: string;
    other: string;
  };

  // Pet Detail page
  petDetail: {
    healthScore: string;
    excellent: string;
    good: string;
    fair: string;
    needsAttention: string;
    age: string;
    weightLabel: string;
    genderLabel: string;
    quickActions: string;
    healthRecord: string;
    vaccination: string;
    vetVisit: string;
    healthHistory: string;
    noRecords: string;
    noRecordsDesc: string;
    addRecord: string;
    deworming: string;
    tickTreatment: string;
    recordType: string;
    recordTitle: string;
    recordTitlePlaceholder: string;
    recordDate: string;
    nextDueDate: string;
    notes: string;
    notesPlaceholder: string;
    save: string;
    cancel: string;
    recordSaved: string;
  };

  // Diagnosis page
  diagnosis: {
    title: string;
    disclaimer: string;
    selectPet: string;
    addPetFirst: string;
    symptoms: string;
    describeSymptoms: string;
    describePlaceholder: string;
    addPhoto: string;
    photoHint: string;
    analyzeSymptoms: string;
    analyzing: string;
    results: string;
    aiAssessment: string;
    possibleConditions: string;
    possibleMatch: string;
    recommendations: string;
    emergencyContact: string;
    emergencyContactDesc: string;
    pointsEarned: string;
    forUsingDiagnosis: string;
    findNearbyVet: string;
    saveToRecords: string;
    newDiagnosis: string;
    freeDiagnosesUsed: string;
    upgradeForUnlimited: string;
    goPremium: string;
    // Severity
    lowConcern: string;
    lowConcernDesc: string;
    moderateConcern: string;
    moderateConcernDesc: string;
    highConcern: string;
    highConcernDesc: string;
    emergency: string;
    emergencyDesc: string;
    // Symptom chips
    lossOfAppetite: string;
    lethargy: string;
    abnormalShedding: string;
    swelling: string;
    discharge: string;
    breathingDifficulty: string;
    abnormalDroppings: string;
    skinChanges: string;
    weightLoss: string;
    vomiting: string;
    limping: string;
    reducedActivity: string;
  };

  // Species Guide page
  speciesGuide: {
    title: string;
    subtitle: string;
    examples: string;
    habitat: string;
    diet: string;
    temperature: string;
    maintenance: string;
  };

  // Care Checklist page
  checklist: {
    title: string;
    subtitle: string;
    completed: string;
    pointsEarned: string;
    itemHabitat: string;
    itemWater: string;
    itemTemperature: string;
    itemFood: string;
    itemObservation: string;
    itemEnrichment: string;
  };

  // Food Guide + Health Journal page
  foodGuide: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    segmentFood: string;
    segmentJournal: string;
    allowed: string;
    limit: string;
    toxic: string;
    noResults: string;
    otherSpeciesNotice: string;
  };

  healthJournal: {
    selectPet: string;
    addPetFirst: string;
    dateLabel: string;
    save: string;
    weightTitle: string;
    weightSubtitle: string;
    weightAdd: string;
    weightValueLabel: string;
    weightValuePlaceholder: string;
    weightEntryTitle: string;
    weightEmpty: string;
    sheddingTitle: string;
    sheddingSubtitle: string;
    sheddingAdd: string;
    sheddingNoteLabel: string;
    sheddingNotePlaceholder: string;
    sheddingEmpty: string;
    habitatTitle: string;
    habitatSubtitle: string;
    habitatAdd: string;
    habitatTempLabel: string;
    habitatHumidityLabel: string;
    habitatNoteLabel: string;
    habitatEmpty: string;
    sheddingSave: string;
    habitatSave: string;
  };

  // Pet Carnet page (new Santé tab landing)
  carnet: {
    navHealth: string;
    navFood: string;
    navHabitat: string;
    navBehavior: string;
    reminderTitle: string;
    reminderNone: string;
    reminderCta: string;
    appointmentTitle: string;
    appointmentNone: string;
    appointmentAdd: string;
    wellbeingTitle: string;
    wellbeingLevel: string;
  };

  // Appointment add form
  appointment: {
    title: string;
    vetNameLabel: string;
    vetNamePlaceholder: string;
    timeLabel: string;
    locationLabel: string;
    locationPlaceholder: string;
    noteLabel: string;
    save: string;
  };

  // Unified health history timeline
  healthTimeline: {
    title: string;
    filterAll: string;
    filterTreatments: string;
    filterWeight: string;
    filterVaccines: string;
    filterDocs: string;
    historyTitle: string;
    addEntry: string;
    empty: string;
    downloadReport: string;
    saveEntry: string;
  };

  // Simplified AI diagnosis intro screen
  diagnosisIntro: {
    title: string;
    question: string;
    start: string;
    disclaimer: string;
  };

  // Discover tab
  discover: {
    title: string;
    subtitle: string;
    shopTitle: string;
    shopDesc: string;
    speciesGuideTitle: string;
    speciesGuideDesc: string;
    foodGuideTitle: string;
    foodGuideDesc: string;
    professionalsTitle: string;
    professionalsSubtitle: string;
    proVetsNac: string;
    proPetSitting: string;
    proGrooming: string;
    proShops: string;
  };

  // Floating "+" quick-add sheet
  quickAdd: {
    title: string;
    addPet: string;
    addHealthEntry: string;
    startDiagnosis: string;
    addAppointment: string;
  };

  // Wellbeing challenges + badges (unified "Rewards" hub)
  challenges: {
    title: string;
    subtitle: string;
    tabChallenges: string;
    tabBadges: string;
    progressLabel: string;
    completed: string;
    celebrationTitle: string;
    celebrationSubtitle: string;
    xpEarned: string;
    habitat7: string;
    water7: string;
    temperature7: string;
    food7: string;
    observation7: string;
    enrichment7: string;
    perfectWeek: string;
  };

  // Badge catalog (unlocked in the Rewards hub)
  badges: {
    earned: string;
    locked: string;
    celebrationSubtitle: string;
    firstPetName: string;
    firstPetDescription: string;
    firstDiagnosisName: string;
    firstDiagnosisDescription: string;
    streak7DaysName: string;
    streak7DaysDescription: string;
    streak30DaysName: string;
    streak30DaysDescription: string;
    points100Name: string;
    points100Description: string;
    points500Name: string;
    points500Description: string;
    points1000Name: string;
    points1000Description: string;
    vetVisit5Name: string;
    vetVisit5Description: string;
    healthChampionName: string;
    healthChampionDescription: string;
  };

  // Shop page
  shop: {
    title: string;
    searchProducts: string;
    noProducts: string;
    all: string;
    reptiles: string;
    rodents: string;
    ferrets: string;
    birds: string;
    fish: string;
    amphibians: string;
    invertebrates: string;
    terrariums: string;
    substrate: string;
    heatingLighting: string;
    food: string;
    accessories: string;
    viewOnAmazon: string;
    reviews: string;
    earnPoints: string;
    comingSoon: string;
  };

  // Profile page
  profile: {
    level: string;
    xpTo: string;
    dayStreak: string;
    goPremium: string;
    premiumActive: string;
    premiumDesc: string;
    premiumActiveDesc: string;
    myBadges: string;
    leaderboard: string;
    activitySummary: string;
    aiDiagnoses: string;
    careTasks: string;
    healthRecords: string;
    shopVisits: string;
    account: string;
    editProfile: string;
    notifications: string;
    privacyPolicy: string;
    termsOfService: string;
    helpSupport: string;
    signOut: string;
    signOutConfirm: string;
    language: string;
    deleteAccount: string;
    deleteAccountTitle: string;
    deleteAccountConfirm: string;
    deleteAccountPasswordLabel: string;
    deleteAccountError: string;
  };

  // Premium page
  premiumPage: {
    title: string;
    youArePremium: string;
    enjoyPremium: string;
    backToApp: string;
    unlockPremium: string;
    unlockDesc: string;
    subscribeNow: string;
    processing: string;
    restorePurchases: string;
    manageSubscription: string;
    bestValue: string;
    monthly: string;
    yearly: string;
    perMonth: string;
    perYear: string;
    savePct: string;
    paymentDisclaimer: string;
    // Features
    unlimitedDiagnoses: string;
    unlimitedDiagnosesDesc: string;
    priorityAI: string;
    priorityAIDesc: string;
    healthReports: string;
    healthReportsDesc: string;
    exclusiveBadges: string;
    exclusiveBadgesDesc: string;
    adFree: string;
    adFreeDesc: string;
  };

  // Auth
  auth: {
    welcome: string;
    welcomeDesc: string;
    signIn: string;
    signUp: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    noAccount: string;
    hasAccount: string;
    orContinueWith: string;
    googleSignIn: string;
    forgotPassword: string;
    resetPasswordSent: string;
    passwordMismatch: string;
    weakPassword: string;
    emailInUse: string;
    invalidEmail: string;
    wrongCredentials: string;
  };

  // Toast / Network
  toast: {
    offline: string;
    backOnline: string;
  };
}
