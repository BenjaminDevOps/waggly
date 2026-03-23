import { WALK } from '../constants/app';

export function calculatePoints(steps: number, durationMinutes: number): number {
  let points = 0;
  points += Math.floor(steps / 100);
  points += Math.floor(durationMinutes / 5) * 2;
  if (steps >= 5000) points += 20;
  if (steps >= 10000) points += 50;
  if (durationMinutes >= 30) points += 15;
  return points;
}

export function estimateCalories(steps: number): number {
  return Math.round(steps * WALK.caloriesPerStep);
}

export function estimateDistanceKm(steps: number): number {
  return (steps * WALK.averageStrideMeters) / 1000;
}
