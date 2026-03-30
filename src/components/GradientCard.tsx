import React from 'react';

interface Props {
  colors: readonly [string, string, ...string[]];
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function GradientCard({ colors, children, style, onClick }: Props) {
  const base: React.CSSProperties = {
    background: `linear-gradient(135deg, ${colors.join(', ')})`,
    borderRadius: 24,
    padding: 28,
    ...style,
  };

  if (onClick) {
    return (
      <button onClick={onClick} style={{ ...base, cursor: 'pointer', width: '100%', textAlign: 'left', border: 'none' }}>
        {children}
      </button>
    );
  }
  return <div style={base}>{children}</div>;
}
