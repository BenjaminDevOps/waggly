import React from 'react';
import { Radius, Spacing } from '../theme/spacing';

interface Props {
  colors: readonly [string, string, ...string[]];
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function GradientCard({ colors, children, style, onClick }: Props) {
  const base: React.CSSProperties = {
    background: `linear-gradient(135deg, ${colors.join(', ')})`,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    ...style,
  };

  const interactiveClass = onClick ? 'card-interactive' : undefined;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={interactiveClass}
        style={{ ...base, cursor: 'pointer', width: '100%', textAlign: 'left' as const, border: 'none' }}
      >
        {children}
      </button>
    );
  }

  return <div style={base}>{children}</div>;
}
