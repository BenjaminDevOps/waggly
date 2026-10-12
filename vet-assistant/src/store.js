import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DAY = 24 * 60 * 60 * 1000;

/**
 * Stockage minimal en JSON lines, un fichier par clinique.
 * Suffisant pour les premières cliniques ; à migrer vers Firestore/Postgres ensuite.
 */
export class EventStore {
  constructor(dir, { retentionDays = 90 } = {}) {
    this.dir = dir;
    this.retentionDays = retentionDays;
    mkdirSync(dir, { recursive: true });
  }

  file(clinicId) {
    return join(this.dir, `${clinicId}.jsonl`);
  }

  add(clinicId, event) {
    const record = { ts: new Date().toISOString(), ...event };
    appendFileSync(this.file(clinicId), JSON.stringify(record) + '\n');
    return record;
  }

  list(clinicId, { sinceDays = 30 } = {}) {
    const path = this.file(clinicId);
    if (!existsSync(path)) return [];
    const since = Date.now() - sinceDays * DAY;
    return readFileSync(path, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try { return JSON.parse(line); } catch { return null; }
      })
      .filter((e) => e && Date.parse(e.ts) >= since);
  }

  /** RGPD : supprime les événements plus vieux que la durée de conservation. */
  purge(clinicId) {
    const path = this.file(clinicId);
    if (!existsSync(path)) return;
    const kept = this.list(clinicId, { sinceDays: this.retentionDays });
    writeFileSync(path, kept.map((e) => JSON.stringify(e) + '\n').join(''));
  }

  stats(clinicId, { sinceDays = 7 } = {}) {
    const events = this.list(clinicId, { sinceDays });
    const messages = events.filter((e) => e.type === 'message');
    const byIntent = {};
    for (const m of messages) byIntent[m.intent] = (byIntent[m.intent] ?? 0) + 1;
    const outsideHours = messages.filter((m) => m.outsideHours).length;
    return {
      sinceDays,
      conversations: new Set(messages.map((m) => m.sessionId)).size,
      messages: messages.length,
      outsideHours,
      emergencies: messages.filter((m) => m.emergency).length,
      appointments: events.filter((e) => e.type === 'appointment').reverse(),
      byIntent,
      recentQuestions: messages.slice(-30).reverse().map((m) => ({ ts: m.ts, question: m.question, intent: m.intent })),
    };
  }
}
