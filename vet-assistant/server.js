import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { loadClinics } from './src/clinics.js';
import { EventStore } from './src/store.js';
import { createApp } from './src/app.js';

const root = dirname(fileURLToPath(import.meta.url));
if (existsSync(join(root, '.env'))) process.loadEnvFile(join(root, '.env'));

const env = process.env;
const clinics = loadClinics(join(root, 'clinics'));
const store = new EventStore(resolve(root, env.DATA_DIR ?? 'data'));

// Purge RGPD au démarrage puis une fois par jour.
const purgeAll = () => clinics.forEach((c) => store.purge(c.id));
purgeAll();
setInterval(purgeAll, 24 * 60 * 60 * 1000).unref();

const handler = createApp({
  clinics,
  store,
  publicDir: join(root, 'public'),
  apiKey: env.GEMINI_API_KEY,
  model: env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
  adminToken: env.ADMIN_TOKEN,
  notifyWebhookUrl: env.NOTIFY_WEBHOOK_URL,
});

const port = Number(env.PORT) || 3000;
createServer(handler).listen(port, () => {
  console.log(`Assistant vétérinaire prêt sur http://localhost:${port}`);
  console.log(`Mode : ${env.GEMINI_API_KEY ? `Gemini (${env.GEMINI_MODEL || 'gemini-2.5-flash-lite'})` : 'démo (sans clé API)'}`);
  console.log(`Cliniques : ${[...clinics.keys()].join(', ')}`);
  if (!env.ADMIN_TOKEN) console.warn('ADMIN_TOKEN absent : le tableau de bord est désactivé.');
});
