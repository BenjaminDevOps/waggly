import React from 'react';
import { Colors } from '../theme/colors';
import { Radius, Spacing, Shadow } from '../theme/spacing';

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  padded?: boolean;
  className?: string;
}

export function Card({ children, style, onClick, padded = true, className }: Props) {
  const base: React.CSSProperties = {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    boxShadow: Shadow.soft,
    ...(padded ? { padding: Spacing.xl } : {}),
    ...style,
  };

  const classes = [className, onClick ? 'card-interactive' : ''].filter(Boolean).join(' ') || undefined;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={classes}
        style={{ ...base, cursor: 'pointer', width: '100%', textAlign: 'left' as const }}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={classes} style={base}>
      {children}
    </div>
  );
}
