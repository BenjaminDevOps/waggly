import { Routes, Route, NavLink, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, PawPrint, Heart, Compass, User, Plus, X, Stethoscope, CalendarCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { HomePage } from './pages/Home';
import { CarnetIndexPage } from './pages/CarnetIndex';
import { PetCarnetPage } from './pages/PetCarnet';
import { HealthTimelinePage } from './pages/HealthTimeline';
import { PetFoodPage } from './pages/PetFood';
import { PetHabitatPage } from './pages/PetHabitat';
import { PetBehaviorPage } from './pages/PetBehavior';
import { AddPetPage } from './pages/AddPet';
import { DiagnosisPage } from './pages/Diagnosis';
import { SpeciesGuidePage } from './pages/SpeciesGuide';
import { CareChecklistPage } from './pages/CareChecklist';
import { ChallengesPage } from './pages/Challenges';
import { FoodGuideBrowsePage } from './pages/FoodGuideBrowse';
import { DiscoverPage } from './pages/Discover';
import { ShopPage } from './pages/Shop';
import { ProfilePage } from './pages/Profile';
import { PremiumPage } from './pages/Premium';
import { PrivacyPage } from './pages/Privacy';
import { TermsPage } from './pages/Terms';
import { EditProfilePage } from './pages/EditProfile';
import { ContactPage } from './pages/Contact';
import { LoginPage } from './pages/Login';
import { LanguageSelectionPage } from './pages/LanguageSelection';
import { useI18n, hasChosenLocale } from './i18n';
import { useAuth } from './hooks/useAuth';
import { useBadgeChecker } from './hooks/useBadges';
import { usePets } from './hooks/usePets';
import { Colors } from './theme/colors';
import { Spacing, Radius, Font, Weight } from './theme/spacing';

const leftTabs: { path: string; icon: LucideIcon; key: keyof ReturnType<typeof useI18n>['t']['tabs'] }[] = [
  { path: '/', icon: Home, key: 'home' },
  { path: '/carnet', icon: Heart, key: 'health' },
];
const rightTabs: { path: string; icon: LucideIcon; key: keyof ReturnType<typeof useI18n>['t']['tabs'] }[] = [
  { path: '/discover', icon: Compass, key: 'discover' },
  { path: '/profile', icon: User, key: 'profile' },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function QuickAddSheet({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { t } = useI18n();
  const singlePetId = pets.length === 1 ? pets[0].id : null;

  const actions = [
    { icon: PawPrint, label: t.quickAdd.addPet, onPress: () => navigate('/add-pet') },
    { icon: Heart, label: t.quickAdd.addHealthEntry, onPress: () => navigate(singlePetId ? `/carnet/${singlePetId}/health` : '/carnet') },
    { icon: Stethoscope, label: t.quickAdd.startDiagnosis, onPress: () => navigate(singlePetId ? `/diagnosis?petId=${singlePetId}` : '/diagnosis') },
    { icon: CalendarCheck, label: t.quickAdd.addAppointment, onPress: () => navigate(singlePetId ? `/carnet/${singlePetId}` : '/carnet') },
  ];

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: `0 ${Spacing.xl}px` }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-in"
        style={{ backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.xl, width: '100%', maxWidth: 400, boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg }}>
          <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.quickAdd.title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
            <X size={22} color={Colors.inkSecondary} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
          {actions.map((a) => (
            <button
              key={a.label}
              className="card-interactive"
              onClick={() => { a.onPress(); onClose(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: Spacing.md, width: '100%',
                padding: Spacing.md, borderRadius: Radius.md, border: 'none', cursor: 'pointer',
                backgroundColor: Colors.surfaceSecondary,
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: Radius.sm, backgroundColor: Colors.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <a.icon size={18} color={Colors.primary} />
              </div>
              <span style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink, textAlign: 'left' }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const { t } = useI18n();
  const { firebaseUser, loading } = useAuth();
  const [localeChosen, setLocaleChosen] = useState(() => hasChosenLocale());
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  useBadgeChecker();

  // Native status bar. Icon contrast follows what's actually behind the bar:
  // the language picker is a dark purple full-bleed screen, every other
  // screen is cream.
  useEffect(() => {
    if (typeof (window as any).Capacitor === 'undefined' || !(window as any).Capacitor.isNativePlatform()) return;
    import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
      StatusBar.setStyle({ style: localeChosen ? Style.Light : Style.Dark }).catch(() => {});
    }).catch(() => {});
  }, [localeChosen]);

  // Streak update — must be declared before any conditional return (Rules of Hooks)
  useEffect(() => {
    if (firebaseUser) {
      import('./services/userService').then(({ updateStreak }) => {
        const lastStreak = localStorage.getItem('waggly_last_streak');
        const today = new Date().toISOString().split('T')[0];
        if (lastStreak !== today) {
          updateStreak(firebaseUser.uid);
          localStorage.setItem('waggly_last_streak', today);
        }
      });
    }
  }, [firebaseUser]);

  // First launch — ask the user to pick a language before anything else
  if (!localeChosen) {
    return <LanguageSelectionPage onDone={() => setLocaleChosen(true)} />;
  }
  const hideTabBar = ['/add-pet', '/premium', '/privacy', '/terms', '/edit-profile', '/contact', '/species-guide', '/checklist', '/aliments', '/challenges'].some(p => location.pathname.startsWith(p))
    || location.pathname.match(/^\/carnet\/.+/);

  const isActive = (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));

  // Loading state — branded spinner while Firebase auth initializes
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FAF4E8', gap: 20,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, #3B2360, #54357F)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(59,35,96,0.3)',
          animation: 'scaleIn 0.4s ease both',
        }}>
          <PawPrint size={36} color="#fff" style={{ animation: 'spin 1.5s linear infinite' }} />
        </div>
        <div style={{
          width: 100, height: 4, borderRadius: 2, backgroundColor: '#E7E0EE', overflow: 'hidden',
        }}>
          <div style={{
            width: '40%', height: '100%', borderRadius: 2,
            background: 'linear-gradient(90deg, #3B2360, #54357F)',
            animation: 'splashLoading 1.4s ease-in-out infinite',
          }} />
        </div>
      </div>
    );
  }

  // Not authenticated — show login
  if (!firebaseUser) {
    return <LoginPage />;
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: hideTabBar ? 0 : 88 }}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/carnet" element={<CarnetIndexPage />} />
        <Route path="/carnet/:petId" element={<PetCarnetPage />} />
        <Route path="/carnet/:petId/health" element={<HealthTimelinePage />} />
        <Route path="/carnet/:petId/food" element={<PetFoodPage />} />
        <Route path="/carnet/:petId/habitat" element={<PetHabitatPage />} />
        <Route path="/carnet/:petId/behavior" element={<PetBehaviorPage />} />
        <Route path="/add-pet" element={<AddPetPage />} />
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/species-guide" element={<SpeciesGuidePage />} />
        <Route path="/checklist" element={<CareChecklistPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/aliments" element={<FoodGuideBrowsePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideTabBar && (
        <nav style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, height: 88,
          backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid #F0EDE8',
          display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: 8,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          zIndex: 100,
        }}>
          {leftTabs.map(({ path, icon: Icon, key }) => {
            const active = isActive(path);
            return (
              <NavLink key={path} to={path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none' }}>
                <Icon size={24} color={active ? '#3B2360' : '#9D9DAF'} strokeWidth={active ? 2.5 : 2} />
                <span style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? '#3B2360' : '#9D9DAF' }}>{t.tabs[key]}</span>
              </NavLink>
            );
          })}

          <button
            className="btn-press"
            onClick={() => setShowQuickAdd(true)}
            style={{
              width: 48, height: 48, borderRadius: 24, marginTop: -18,
              background: 'linear-gradient(135deg, #3B2360, #54357F)',
              border: '4px solid #fff', boxShadow: '0 6px 16px rgba(59,35,96,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Plus size={22} color="#fff" />
          </button>

          {rightTabs.map(({ path, icon: Icon, key }) => {
            const active = isActive(path);
            return (
              <NavLink key={path} to={path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none' }}>
                <Icon size={24} color={active ? '#3B2360' : '#9D9DAF'} strokeWidth={active ? 2.5 : 2} />
                <span style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? '#3B2360' : '#9D9DAF' }}>{t.tabs[key]}</span>
              </NavLink>
            );
          })}
        </nav>
      )}

      {showQuickAdd && <QuickAddSheet onClose={() => setShowQuickAdd(false)} />}
    </div>
  );
}
