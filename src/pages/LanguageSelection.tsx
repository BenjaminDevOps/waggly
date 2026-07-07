import { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { useI18n } from '../i18n';
import type { Locale } from '../i18n';

interface Props {
  onDone: () => void;
}

const LANGUAGES: { code: Locale; flag: string; native: string; subtitle: string }[] = [
  { code: 'en', flag: '🇬🇧', native: 'English',  subtitle: 'Continue in English'     },
  { code: 'fr', flag: '🇫🇷', native: 'Français', subtitle: 'Continuer en français'   },
  { code: 'es', flag: '🇪🇸', native: 'Español',  subtitle: 'Continuar en español'    },
];

export function LanguageSelectionPage({ onDone }: Props) {
  const { setLocale } = useI18n();
  const [selected, setSelected] = useState<Locale | null>(null);

  function handleContinue() {
    if (!selected) return;
    setLocale(selected);
    onDone();
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #5B5EA6 0%, #7B7FCC 100%)',
      display: 'flex', flexDirection: 'column',
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* Branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px 24px',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>
          <PawPrint size={44} color="#fff" strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontSize: 38, fontWeight: 800, color: '#fff',
          margin: '0 0 10px', letterSpacing: '-0.5px',
        }}>
          Waggly NAC
        </h1>

        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.72)',
          textAlign: 'center', lineHeight: 1.8, margin: 0,
        }}>
          Choose your language<br />
          Choisissez votre langue<br />
          Elija su idioma
        </p>
      </div>

      {/* Language cards */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {LANGUAGES.map((lang) => {
          const active = selected === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px', borderRadius: 18, width: '100%',
                background: active ? '#fff' : 'rgba(255,255,255,0.15)',
                border: `2px solid ${active ? '#fff' : 'rgba(255,255,255,0.28)'}`,
                cursor: 'pointer', outline: 'none',
                transition: 'all 0.18s ease',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 17, fontWeight: 700, lineHeight: 1.3,
                  color: active ? '#5B5EA6' : '#fff',
                }}>
                  {lang.native}
                </div>
                <div style={{
                  fontSize: 13, marginTop: 2,
                  color: active ? '#7B7FCC' : 'rgba(255,255,255,0.6)',
                }}>
                  {lang.subtitle}
                </div>
              </div>

              {/* Radio indicator */}
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${active ? '#5B5EA6' : 'rgba(255,255,255,0.45)'}`,
                background: active ? '#5B5EA6' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s ease',
              }}>
                {active && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue button */}
      <div style={{
        padding: '24px 24px',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
      }}>
        <button
          onClick={handleContinue}
          disabled={!selected}
          style={{
            width: '100%', height: 54, borderRadius: 16,
            background: selected ? '#fff' : 'rgba(255,255,255,0.22)',
            color: selected ? '#5B5EA6' : 'rgba(255,255,255,0.45)',
            fontSize: 16, fontWeight: 700, border: 'none',
            cursor: selected ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            letterSpacing: 0.2,
          }}
        >
          Continue &nbsp;·&nbsp; Continuer &nbsp;·&nbsp; Continuar
        </button>
      </div>
    </div>
  );
}
