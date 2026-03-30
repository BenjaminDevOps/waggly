import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home, PawPrint, Stethoscope, Footprints, ShoppingBag, User } from 'lucide-react';
import { HomePage } from './pages/Home';
import { PetsPage } from './pages/Pets';
import { AddPetPage } from './pages/AddPet';
import { PetDetailPage } from './pages/PetDetail';
import { DiagnosisPage } from './pages/Diagnosis';
import { WalkPage } from './pages/Walk';
import { ShopPage } from './pages/Shop';
import { ProfilePage } from './pages/Profile';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/pets', icon: PawPrint, label: 'Pets' },
  { path: '/diagnosis', icon: Stethoscope, label: 'Diagnosis' },
  { path: '/walk', icon: Footprints, label: 'Walk' },
  { path: '/shop', icon: ShoppingBag, label: 'Shop' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function App() {
  const location = useLocation();
  const hideTabBar = ['/add-pet'].some(p => location.pathname.startsWith(p)) || location.pathname.match(/^\/pet\//);

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
          {tabs.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <NavLink key={path} to={path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none' }}>
                <Icon size={24} color={active ? '#5B5EA6' : '#9D9DAF'} strokeWidth={active ? 2.5 : 2} />
                <span style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? '#5B5EA6' : '#9D9DAF' }}>{label}</span>
              </NavLink>
            );
          })}
        </nav>
      )}
    </div>
  );
}
