import React from 'react';

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  padded?: boolean;
}

export function Card({ children, style, onClick, padded = true }: Props) {
  const base: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    boxShadow: '0 4px 12px rgba(45, 45, 58, 0.06)',
    ...(padded ? { padding: 20 } : {}),
    ...style,
  };

  if (onClick) {
    return (
      <button onClick={onClick} style={{ ...base, cursor: 'pointer', width: '100%', textAlign: 'left' }}>
        {children}
      </button>
    );
  }
  return <div style={base}>{children}</div>;
}
