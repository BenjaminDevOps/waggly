import React from 'react';

interface Props {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 }}>
      <h3 style={{ fontSize: 22, fontWeight: 700, color: '#2D2D3A', letterSpacing: -0.3, margin: 0 }}>{title}</h3>
      {actionLabel && onAction && (
        <button onClick={onAction} style={{ fontSize: 15, color: '#5B5EA6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
