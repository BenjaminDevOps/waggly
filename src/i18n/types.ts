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
    diagnosis: string;
    walk: string;
    shop: string;
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
    todaysWalk: string;
    ofDailyGoal: string;
    reminders: string;
    dueInDays: string;
    quickActions: string;
    aiDiagnosis: string;
    shop: string;
    badges: string;
    featuredProducts: string;
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
    dog: string;
    cat: string;
    bird: string;
    rabbit: string;
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
    vomiting: string;
    diarrhea: string;
    scratching: string;
    limping: string;
    notEating: string;
    coughing: string;
    sneezing: string;
    lethargy: string;
    hairLoss: string;
    eyeDischarge: string;
    swelling: string;
    badBreath: string;
  };

  // Walk page
  walk: {
    title: string;
    walkingWith: string;
    startWalk: string;
    stopWalk: string;
    currentWalk: string;
    goalReached: string;
    todaysSummary: string;
    totalSteps: string;
    kmWalked: string;
    calories: string;
    thisWeek: string;
    achievements: string;
    firstWalk: string;
    firstWalkDesc: string;
    fiveKSteps: string;
    fiveKStepsDesc: string;
    sevenDayStreak: string;
    sevenDayStreakDesc: string;
    marathonWalker: string;
    marathonWalkerDesc: string;
    greatWalk: string;
    distance: string;
    time: string;
    pointsEarned: string;
    // Days
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };

  // Shop page
  shop: {
    title: string;
    searchProducts: string;
    noProducts: string;
    all: string;
    dogs: string;
    cats: string;
    nac: string;
    food: string;
    toys: string;
    health: string;
    accessories: string;
    grooming: string;
    training: string;
    viewOnAmazon: string;
    reviews: string;
    earnPoints: string;
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
    walks: string;
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
