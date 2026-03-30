import React from 'react';
import { Colors, Gradients } from '../theme/colors';
import { Radius, Shadow } from '../theme/spacing';

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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: isLarge ? '20px 28px' : '16px 28px',
    borderRadius: isLarge ? Radius.lg : Radius.md,
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
      background: `linear-gradient(90deg, ${Gradients.primary[0]}, ${Gradients.primary[1]})`,
      color: Colors.inkInverse,
      boxShadow: Shadow.glow(Colors.primary),
    },
    secondary: {
      background: Colors.surfaceSecondary,
      color: Colors.ink,
    },
    ghost: {
      background: 'transparent',
      color: Colors.primary,
      border: `2px solid ${Colors.primary}`,
    },
    danger: {
      background: Colors.errorPale,
      color: Colors.error,
    },
  };

  const spinnerClass = variant === 'primary' ? 'spinner' : 'spinner spinner--dark';

  return (
    <button
      className="btn-press"
      onClick={onPress}
      disabled={disabled || loading}
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {loading ? (
        <span className={spinnerClass} />
      ) : (
        <>
          {icon}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
