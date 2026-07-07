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

function todayStorageKey(): string {
  return `waggly_checklist_${new Date().toISOString().split('T')[0]}`;
}

export function getChecklistState(): Partial<Record<ChecklistItemKey, boolean>> {
  try {
    const raw = localStorage.getItem(todayStorageKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setChecklistItemDone(key: ChecklistItemKey, done: boolean): void {
  const state = getChecklistState();
  state[key] = done;
  try {
    localStorage.setItem(todayStorageKey(), JSON.stringify(state));
  } catch {
    // ignore write failures (e.g. private browsing)
  }
}
