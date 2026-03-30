import React from 'react';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  size?: 'default' | 'large';
}

export function Button({
  label, onPress, variant = 'primary', icon, loading = false, disabled = false, style, size = 'default',
}: Props) {
  const isLarge = size === 'large';

  const baseStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: isLarge ? '20px 28px' : '16px 28px',
    borderRadius: isLarge ? 20 : 16,
    fontSize: isLarge ? 20 : 17,
    fontWeight: 600,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s ease',
    width: '100%',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(90deg, #5B5EA6, #7B7FCC)',
      color: '#fff',
      boxShadow: '0 6px 16px rgba(91, 94, 166, 0.25)',
    },
    secondary: { background: '#F3F0EB', color: '#2D2D3A' },
    ghost: { background: 'transparent', color: '#5B5EA6', border: '2px solid #5B5EA6' },
    danger: { background: '#FBEAE9', color: '#D4605A' },
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {loading ? <span>...</span> : <>{icon}<span>{label}</span></>}
    </button>
  );
}
