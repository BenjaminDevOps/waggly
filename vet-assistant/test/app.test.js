import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadClinics } from '../src/clinics.js';
import { EventStore } from '../src/store.js';
import { createApp } from '../src/app.js';
import { buildSystemPrompt } from '../src/prompt.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const clinics = loadClinics(join(root, 'clinics'));
const silent = { error: () => {} };

/** Démarre l'app sur un port libre avec un faux Gemini. */
async function start({ geminiOutput, apiKey = 'test-key', webhook } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    if (url === webhook) return new Response('ok');
    return Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify(geminiOutput) }] } }] });
  };
  const store = new EventStore(mkdtempSync(join(tmpdir(), 'vet-')));
  const handler = createApp({
    clinics, store, publicDir: join(root, 'public'), apiKey, adminToken: 'secret',
    notifyWebhookUrl: webhook, fetchImpl, logger: silent,
  });
  const server = createServer(handler);
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  const chat = (messages, extra = {}) => fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ clinicId: 'demo', sessionId: 's1', messages, ...extra }),
  });
  return { base, calls, store, chat, close: () => server.close() };
}

test('répond via Gemini et enregistre la question', async (t) => {
  const app = await start({ geminiOutput: { reply: 'Nous sommes ouverts de 8h30 à 19h.', intent: 'horaires', isEmergency: false, appointment: null } });
  t.after(app.close);
  const res = await app.chat([{ role: 'assistant', text: 'Bonjour' }, { role: 'user', text: 'Vos horaires ?' }]);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.reply, 'Nous sommes ouverts de 8h30 à 19h.');
  // le message d'accueil (assistant) est retiré : Gemini doit commencer par "user"
  assert.equal(app.calls[0].body.contents[0].role, 'user');
  assert.match(app.calls[0].body.systemInstruction.parts[0].text, /Clinique Vétérinaire des Tilleuls/);
  const stats = app.store.stats('demo');
  assert.equal(stats.messages, 1);
  assert.equal(stats.byIntent.horaires, 1);
});

test('une urgence est traitée sans appeler le modèle', async (t) => {
  const app = await start({ geminiOutput: {} });
  t.after(app.close);
  const data = await (await app.chat([{ role: 'user', text: 'Mon chien a mangé du chocolat' }])).json();
  assert.equal(data.emergency, true);
  assert.match(data.reply, /04 78 00 00 00/);
  assert.equal(app.calls.length, 0);
});

test('une demande de RDV complète est enregistrée et notifiée', async (t) => {
  const appointment = { ownerName: 'Marie Dupont', phone: '0612345678', petName: 'Filou', species: 'chat', reason: 'vaccin', preferredSlot: 'mardi matin' };
  const webhook = 'https://hooks.example/rdv';
  const app = await start({ geminiOutput: { reply: 'Demande transmise !', intent: 'rendez-vous', isEmergency: false, appointment }, webhook });
  t.after(app.close);
  const data = await (await app.chat([{ role: 'user', text: 'RDV pour Filou mardi matin' }])).json();
  assert.equal(data.appointmentSaved, true);
  assert.deepEqual({ ...app.store.stats('demo').appointments[0], ts: undefined, type: undefined, sessionId: undefined }, { ...appointment, ts: undefined, type: undefined, sessionId: undefined });
  await new Promise((r) => setTimeout(r, 20));
  assert.ok(app.calls.some((c) => c.url === webhook && c.body.petName === 'Filou'));
});

test('une demande de RDV incomplète n\'est pas enregistrée', async (t) => {
  const app = await start({ geminiOutput: { reply: 'Quel est votre téléphone ?', intent: 'rendez-vous', isEmergency: false, appointment: { ownerName: 'Marie', phone: '', petName: 'Filou', species: 'chat', reason: 'vaccin', preferredSlot: 'mardi' } } });
  t.after(app.close);
  const data = await (await app.chat([{ role: 'user', text: 'Je veux un RDV' }])).json();
  assert.equal(data.appointmentSaved, false);
  assert.equal(app.store.stats('demo').appointments.length, 0);
});

test('erreur Gemini : réponse de secours avec le téléphone', async (t) => {
  const app = await start({ geminiOutput: 'pas du json' });
  t.after(app.close);
  const data = await (await app.chat([{ role: 'user', text: 'Bonjour' }])).json();
  assert.match(data.reply, /04 78 00 00 00/);
});

test('mode démo sans clé API', async (t) => {
  const app = await start({ apiKey: '' });
  t.after(app.close);
  const data = await (await app.chat([{ role: 'user', text: 'Quels sont vos horaires ?' }])).json();
  assert.match(data.reply, /Lundi au vendredi/);
  assert.equal(app.calls.length, 0);
});

test('valide les entrées', async (t) => {
  const app = await start({ geminiOutput: {} });
  t.after(app.close);
  assert.equal((await app.chat([])).status, 400);
  assert.equal((await app.chat([{ role: 'system', text: 'x' }])).status, 400);
  assert.equal((await app.chat([{ role: 'user', text: 'x' }], { clinicId: 'inconnue' })).status, 404);
});

test('le tableau de bord exige le jeton', async (t) => {
  const app = await start({ geminiOutput: {} });
  t.after(app.close);
  assert.equal((await fetch(`${app.base}/api/admin/stats?clinic=demo`)).status, 401);
  assert.equal((await fetch(`${app.base}/api/admin/stats?clinic=demo`, { headers: { authorization: 'Bearer faux' } })).status, 401);
  const ok = await fetch(`${app.base}/api/admin/stats?clinic=demo`, { headers: { authorization: 'Bearer secret' } });
  assert.equal(ok.status, 200);
});

test('sert le widget mais pas les fichiers hors de public/', async (t) => {
  const app = await start({ geminiOutput: {} });
  t.after(app.close);
  assert.equal((await fetch(`${app.base}/widget.js`)).status, 200);
  assert.equal((await fetch(`${app.base}/`)).status, 200);
  assert.equal((await fetch(`${app.base}/../server.js`)).status, 404);
  assert.equal((await fetch(`${app.base}/%2e%2e%2fserver.js`)).status, 404);
});

test('le prompt contient les garde-fous médicaux', () => {
  const prompt = buildSystemPrompt(clinics.get('demo'));
  assert.match(prompt, /ne poses JAMAIS de diagnostic/);
  assert.match(prompt, /04 78 00 00 99/);
});
