import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { timingSafeEqual, createHash } from 'node:crypto';
import { publicClinicInfo } from './clinics.js';
import { isEmergency, emergencyReply } from './emergency.js';
import { askGemini, mockAnswer } from './llm.js';
import { isOpen } from './hours.js';

const MAX_BODY = 32 * 1024;
const MAX_MESSAGES = 20;
const MAX_TEXT = 1000;
const RATE_LIMIT = { windowMs: 5 * 60 * 1000, max: 40 };

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Crée le handler HTTP. Toutes les dépendances sont injectées pour les tests.
 * options : { clinics, store, publicDir, apiKey, model, adminToken, notifyWebhookUrl, fetchImpl, logger }
 */
export function createApp(options) {
  const {
    clinics, store, publicDir, apiKey, model = 'gemini-2.5-flash-lite',
    adminToken, notifyWebhookUrl, fetchImpl = fetch, logger = console,
  } = options;
  const hits = new Map();

  function rateLimited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 10000) hits.clear();
    return recent.length > RATE_LIMIT.max;
  }

  function originAllowed(origin, clinic) {
    if (!origin) return true;
    const list = clinic ? clinic.allowedOrigins : [...clinics.values()].flatMap((c) => c.allowedOrigins);
    return list.includes('*') || list.includes(origin);
  }

  function setCors(req, res, clinic) {
    const origin = req.headers.origin;
    if (origin && originAllowed(origin, clinic)) {
      res.setHeader('access-control-allow-origin', origin);
      res.setHeader('vary', 'origin');
      res.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS');
      res.setHeader('access-control-allow-headers', 'content-type');
    }
  }

  function getClinic(id) {
    const clinic = typeof id === 'string' ? clinics.get(id) : undefined;
    if (!clinic) throw new HttpError(404, 'Clinique inconnue');
    return clinic;
  }

  async function readJson(req) {
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BODY) throw new HttpError(413, 'Requête trop volumineuse');
      chunks.push(chunk);
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      throw new HttpError(400, 'JSON invalide');
    }
  }

  function validateMessages(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new HttpError(400, '"messages" doit être une liste non vide');
    }
    const history = messages.slice(-MAX_MESSAGES).map((m) => {
      if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.text !== 'string') {
        throw new HttpError(400, 'Message invalide');
      }
      return { role: m.role, text: m.text.trim().slice(0, MAX_TEXT) };
    });
    // Gemini exige que la conversation commence par un message utilisateur.
    while (history.length && history[0].role !== 'user') history.shift();
    const last = history.at(-1);
    if (!last || last.role !== 'user' || !last.text) {
      throw new HttpError(400, 'Le dernier message doit venir du client');
    }
    return history;
  }

  async function notify(clinic, appointment) {
    if (!notifyWebhookUrl) return;
    try {
      await fetchImpl(notifyWebhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'appointment_request', clinicId: clinic.id, clinicName: clinic.name, clinicEmail: clinic.email, ...appointment }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      logger.error(`[notify] ${clinic.id}: ${err.message}`);
    }
  }

  async function chat(req, res) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
    const body = await readJson(req);
    const clinic = getClinic(body.clinicId);
    setCors(req, res, clinic);
    if (!originAllowed(req.headers.origin, clinic)) throw new HttpError(403, 'Origine non autorisée');
    if (rateLimited(ip)) throw new HttpError(429, 'Trop de messages, réessayez dans quelques minutes.');

    const history = validateMessages(body.messages);
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : 'anonyme';
    const question = history.at(-1).text;

    let result;
    if (isEmergency(question)) {
      result = { reply: emergencyReply(clinic), intent: 'urgence', isEmergency: true, appointment: null };
    } else if (!apiKey) {
      result = mockAnswer(clinic, question);
    } else {
      try {
        result = await askGemini({ clinic, history, apiKey, model, fetchImpl });
      } catch (err) {
        logger.error(`[gemini] ${clinic.id}: ${err.message}`);
        result = {
          reply: `Désolé, je rencontre un problème technique. Vous pouvez joindre l'équipe au ${clinic.phone}.`,
          intent: 'autre', isEmergency: false, appointment: null,
        };
      }
      if (result.isEmergency && !result.reply.includes(clinic.phone)) {
        result.reply += `\n\n${emergencyReply(clinic)}`;
      }
    }

    store.add(clinic.id, {
      type: 'message',
      sessionId,
      intent: result.intent,
      emergency: result.isEmergency,
      outsideHours: !isOpen(clinic),
      question: question.slice(0, 200),
    });

    let appointmentSaved = false;
    if (result.appointment) {
      store.add(clinic.id, { type: 'appointment', sessionId, ...result.appointment });
      appointmentSaved = true;
      notify(clinic, result.appointment);
    }

    return { reply: result.reply, emergency: result.isEmergency, appointmentSaved };
  }

  function checkAdmin(req) {
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const hash = (s) => createHash('sha256').update(s).digest();
    if (!adminToken || !token || !timingSafeEqual(hash(token), hash(adminToken))) {
      throw new HttpError(401, 'Non autorisé');
    }
  }

  async function serveStatic(res, pathname) {
    const file = pathname === '/' ? 'demo.html' : pathname.slice(1);
    if (!/^[a-z0-9-]+\.(html|js|css|svg)$/.test(file)) throw new HttpError(404, 'Introuvable');
    try {
      const content = await readFile(join(publicDir, file));
      res.writeHead(200, { 'content-type': MIME[extname(file)], 'cache-control': 'public, max-age=300' });
      res.end(content);
    } catch {
      throw new HttpError(404, 'Introuvable');
    }
  }

  function sendJson(res, status, data) {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  }

  return async function handler(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const { pathname } = url;
    try {
      if (req.method === 'OPTIONS') {
        setCors(req, res);
        res.writeHead(204).end();
        return;
      }
      if (req.method === 'POST' && pathname === '/api/chat') {
        return sendJson(res, 200, await chat(req, res));
      }
      const clinicMatch = pathname.match(/^\/api\/clinics\/([a-z0-9-]+)$/);
      if (req.method === 'GET' && clinicMatch) {
        const clinic = getClinic(clinicMatch[1]);
        setCors(req, res, clinic);
        return sendJson(res, 200, publicClinicInfo(clinic));
      }
      if (req.method === 'GET' && pathname === '/api/admin/stats') {
        checkAdmin(req);
        const clinic = getClinic(url.searchParams.get('clinic'));
        const days = Math.min(Math.max(Number(url.searchParams.get('days')) || 7, 1), 90);
        return sendJson(res, 200, { clinic: publicClinicInfo(clinic), ...store.stats(clinic.id, { sinceDays: days }) });
      }
      if (req.method === 'GET' && pathname === '/api/health') {
        return sendJson(res, 200, { ok: true, mode: apiKey ? 'gemini' : 'demo', clinics: clinics.size });
      }
      if (req.method === 'GET') return await serveStatic(res, pathname);
      throw new HttpError(404, 'Introuvable');
    } catch (err) {
      if (!(err instanceof HttpError)) logger.error(err);
      if (!res.headersSent) sendJson(res, err.status ?? 500, { error: err.status ? err.message : 'Erreur interne' });
    }
  };
}
