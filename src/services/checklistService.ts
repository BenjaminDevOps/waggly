// Daily NAC care checklist, persisted locally and reset every day.
export const CHECKLIST_ITEM_KEYS = [
  'itemHabitat',
  'itemWater',
  'itemTemperature',
  'itemFood',
  'itemObservation',
  'itemEnrichment',
] as const;

export type ChecklistItemKey = typeof CHECKLIST_ITEM_KEYS[number];

const STORAGE_PREFIX = 'waggly_checklist_';
const CELEBRATED_PREFIX = 'waggly_challenge_celebrated_';

function dateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function stateForDate(date: Date): Partial<Record<ChecklistItemKey, boolean>> {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + dateKey(date));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getChecklistState(): Partial<Record<ChecklistItemKey, boolean>> {
  return stateForDate(new Date());
}

export function setChecklistItemDone(key: ChecklistItemKey, done: boolean): void {
  const state = getChecklistState();
  state[key] = done;
  try {
    localStorage.setItem(STORAGE_PREFIX + dateKey(new Date()), JSON.stringify(state));
  } catch {
    // ignore write failures (e.g. private browsing)
  }
}

/**
 * Consecutive days a given item has been checked, ending today. If today
 * isn't checked yet, counts back from yesterday instead (grace period),
 * so an in-progress streak doesn't look broken before the day is over.
 */
export function getItemStreak(key: ChecklistItemKey): number {
  const cursor = new Date();
  if (!stateForDate(cursor)[key]) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  for (;;) {
    if (!stateForDate(cursor)[key]) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Same grace-period logic as getItemStreak, but requires every item checked. */
export function getPerfectDayStreak(): number {
  const isPerfect = (date: Date) => CHECKLIST_ITEM_KEYS.every((k) => stateForDate(date)[k]);
  const cursor = new Date();
  if (!isPerfect(cursor)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  for (;;) {
    if (!isPerfect(cursor)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Whether this challenge's celebration has already been shown once. */
export function isChallengeCelebrated(challengeId: string): boolean {
  try {
    return localStorage.getItem(CELEBRATED_PREFIX + challengeId) === '1';
  } catch {
    return false;
  }
}

export function markChallengeCelebrated(challengeId: string): void {
  try {
    localStorage.setItem(CELEBRATED_PREFIX + challengeId, '1');
  } catch {
    // ignore
  }
}
