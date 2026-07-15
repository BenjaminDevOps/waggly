import React from 'react';
import { Colors } from '../theme/colors';
import { Font } from '../theme/spacing';

interface Point {
  date: string;
  value: number;
}

interface Props {
  points: Point[]; // expected sorted ascending by date
  unit?: string;
  height?: number;
}

/** Minimal responsive SVG line chart — no charting library is available in this project. */
export function WeightChart({ points, unit = 'g', height = 140 }: Props) {
  if (points.length === 0) return null;

  const width = 320;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padY = 16;
  const padX = 12;
  const innerH = height - padY * 2;
  const innerW = width - padX * 2;

  const coords = points.map((p, i) => {
    const x = padX + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = padY + innerH - ((p.value - min) / range) * innerH;
    return { x, y };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(height - padY).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(height - padY).toFixed(1)} Z`;
  const gradientId = 'weightChartFill';

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={Colors.primary} stopOpacity={0.22} />
            <stop offset="100%" stopColor={Colors.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path d={linePath} fill="none" stroke={Colors.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={3.5} fill={Colors.surface} stroke={Colors.primary} strokeWidth={2} />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: Font.xs, color: Colors.inkTertiary }}>{min}{unit}</span>
        <span style={{ fontSize: Font.xs, color: Colors.inkTertiary }}>{max}{unit}</span>
      </div>
    </div>
  );
}
