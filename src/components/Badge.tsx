import React from 'react';
import { Font, Weight, Radius } from '../theme/spacing';

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
      borderRadius: Radius.pill,
      fontSize: small ? Font.xs : Font.sm,
      fontWeight: Weight.bold,
      letterSpacing: 0.3,
    }}>
      {label}
    </span>
  );
}
