import React from 'react';

interface Props {
  label: string;
  color: string;
  small?: boolean;
}

export function StatusBadge({ label, color, small = false }: Props) {
  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: color + '18',
      color,
      padding: small ? '3px 10px' : '5px 12px',
      borderRadius: 999,
      fontSize: small ? 11 : 13,
      fontWeight: 700,
    }}>
      {label}
    </span>
  );
}
