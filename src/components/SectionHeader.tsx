import React from 'react';
import { Colors } from '../theme/colors';
import { Font, Weight, Spacing } from '../theme/spacing';

interface Props {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
      marginTop: Spacing.sm,
    }}>
      <h3 style={{
        fontSize: Font.title2,
        fontWeight: Weight.bold,
        color: Colors.ink,
        letterSpacing: -0.3,
        margin: 0,
      }}>
        {title}
      </h3>
      {actionLabel && onAction && (
        <button
          className="btn-press"
          onClick={onAction}
          style={{
            fontSize: Font.body,
            color: Colors.primary,
            fontWeight: Weight.semibold,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
