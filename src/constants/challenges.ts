import type { ChecklistItemKey } from '../services/checklistService';

export type ChallengeTitleKey =
  | 'habitat7' | 'water7' | 'temperature7' | 'food7' | 'observation7' | 'enrichment7' | 'perfectWeek';

export interface ChallengeDef {
  id: string;
  itemKey: ChecklistItemKey | 'perfectDay';
  targetDays: number;
  xpReward: number;
  emoji: string;
  titleKey: ChallengeTitleKey;
}

export const CHALLENGES: ChallengeDef[] = [
  { id: 'habitat7', itemKey: 'itemHabitat', targetDays: 7, xpReward: 50, emoji: '🏠', titleKey: 'habitat7' },
  { id: 'water7', itemKey: 'itemWater', targetDays: 7, xpReward: 50, emoji: '💧', titleKey: 'water7' },
  { id: 'temperature7', itemKey: 'itemTemperature', targetDays: 7, xpReward: 50, emoji: '🌡️', titleKey: 'temperature7' },
  { id: 'food7', itemKey: 'itemFood', targetDays: 7, xpReward: 50, emoji: '🍽️', titleKey: 'food7' },
  { id: 'observation7', itemKey: 'itemObservation', targetDays: 7, xpReward: 50, emoji: '👁️', titleKey: 'observation7' },
  { id: 'enrichment7', itemKey: 'itemEnrichment', targetDays: 7, xpReward: 50, emoji: '🎾', titleKey: 'enrichment7' },
  { id: 'perfectWeek', itemKey: 'perfectDay', targetDays: 7, xpReward: 100, emoji: '🏆', titleKey: 'perfectWeek' },
];
