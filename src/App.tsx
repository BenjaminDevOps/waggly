import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home, PawPrint, Stethoscope, Footprints, ShoppingBag, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { HomePage } from './pages/Home';
import { PetsPage } from './pages/Pets';
import { AddPetPage } from './pages/AddPet';
import { PetDetailPage } from './pages/PetDetail';
import { DiagnosisPage } from './pages/Diagnosis';
import { WalkPage } from './pages/Walk';
import { ShopPage } from './pages/Shop';
import { ProfilePage } from './pages/Profile';
import { PremiumPage } from './pages/Premium';
import { PrivacyPage } from './pages/Privacy';
import { TermsPage } from './pages/Terms';
import { useI18n } from './i18n';

const tabDefs: { path: string; icon: LucideIcon; key: keyof ReturnType<typeof useI18n>['t']['tabs'] }[] = [
  { path: '/', icon: Home, key: 'home' },
  { path: '/pets', icon: PawPrint, key: 'pets' },
  { path: '/diagnosis', icon: Stethoscope, key: 'diagnosis' },
  { path: '/walk', icon: Footprints, key: 'walk' },
  { path: '/shop', icon: ShoppingBag, key: 'shop' },
  { path: '/profile', icon: User, key: 'profile' },
];

export default function App() {
  const location = useLocation();
  const { t } = useI18n();
  const hideTabBar = ['/add-pet', '/premium', '/privacy', '/terms'].some(p => location.pathname.startsWith(p)) || location.pathname.match(/^\/pet\//);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: hideTabBar ? 0 : 88 }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/add-pet" element={<AddPetPage />} />
        <Route path="/pet/:id" element={<PetDetailPage />} />
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/walk" element={<WalkPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>

      {!hideTabBar && (
        <nav style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, height: 88,
          backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid #F0EDE8',
          display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: 8,
          zIndex: 100,
        }}>
          {tabDefs.map(({ path, icon: Icon, key }) => {
            const active = location.pathname === path;
            return (
              <NavLink key={path} to={path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none' }}>
                <Icon size={24} color={active ? '#5B5EA6' : '#9D9DAF'} strokeWidth={active ? 2.5 : 2} />
                <span style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? '#5B5EA6' : '#9D9DAF' }}>{t.tabs[key]}</span>
              </NavLink>
            );
          })}
        </nav>
      )}
    </div>
  );
}
