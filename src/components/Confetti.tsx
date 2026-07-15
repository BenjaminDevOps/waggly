import React, { useMemo } from 'react';
import { Colors } from '../theme/colors';

const CONFETTI_COLORS = [Colors.primary, Colors.secondary, Colors.success, Colors.sky, Colors.accent, Colors.lavender];

interface Piece {
  left: number;
  color: string;
  delay: number;
  duration: number;
  rotate: number;
  round: boolean;
}

/** Lightweight CSS-only confetti burst — no external animation library. */
export function Confetti({ count = 28 }: { count?: number }) {
  const pieces = useMemo<Piece[]>(() => Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 0.4,
    duration: 2.2 + Math.random() * 1.2,
    rotate: Math.random() * 360,
    round: Math.random() > 0.6,
  })), [count]);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 250 }}>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
            borderRadius: p.round ? '50%' : 2,
          }}
        />
      ))}
    </div>
  );
}
