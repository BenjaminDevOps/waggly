import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { CheckCircle, AlertTriangle, Info, X, WifiOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Colors } from '../theme/colors';
import { Font, Weight, Radius, Shadow } from '../theme/spacing';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'offline';

interface ToastMessage {
  id: string;
  type: ToastType;
  text: string;
}

const TOAST_CONFIG: Record<ToastType, { icon: LucideIcon; bg: string; color: string }> = {
  success: { icon: CheckCircle, bg: Colors.successPale, color: Colors.success },
  error: { icon: AlertTriangle, bg: Colors.errorPale, color: Colors.error },
  info: { icon: Info, bg: Colors.skyPale, color: Colors.sky },
  warning: { icon: AlertTriangle, bg: Colors.secondaryPale, color: Colors.secondary },
  offline: { icon: WifiOff, bg: Colors.errorPale, color: Colors.error },
};

interface ToastContextValue {
  showToast: (type: ToastType, text: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, text: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Network status detection
  useEffect(() => {
    const handleOffline = () => showToast('offline', 'You are offline. Some features may be unavailable.');
    const handleOnline = () => showToast('success', 'Back online!');

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', gap: 8,
        zIndex: 9999, width: '100%', maxWidth: 400, padding: '0 16px',
        pointerEvents: 'none',
      }}>
        {toasts.map(toast => {
          const config = TOAST_CONFIG[toast.type];
          const Icon = config.icon;
          return (
            <div
              key={toast.id}
              className="slide-up"
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                backgroundColor: config.bg, borderRadius: Radius.md,
                border: `1px solid ${config.color}30`,
                boxShadow: Shadow.medium, pointerEvents: 'auto',
              }}
            >
              <Icon size={18} color={config.color} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: Font.sm, fontWeight: Weight.medium, color: config.color, lineHeight: 1.4 }}>
                {toast.text}
              </span>
              <button onClick={() => dismiss(toast.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0,
              }}>
                <X size={14} color={config.color} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
