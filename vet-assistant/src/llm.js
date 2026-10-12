import { buildSystemPrompt, RESPONSE_SCHEMA } from './prompt.js';
import { normalize } from './emergency.js';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Appelle Gemini avec l'historique de conversation.
 * history : [{ role: 'user' | 'assistant', text }], le dernier message est celui du client.
 */
export async function askGemini({ clinic, history, apiKey, model, fetchImpl = fetch, timeoutMs = 15000 }) {
  const body = {
    systemInstruction: { parts: [{ text: buildSystemPrompt(clinic) }] },
    contents: history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    })),
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 800,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  };

  const res = await fetchImpl(`${GEMINI_URL}/${model}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    throw new Error(`Gemini HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  return parseModelOutput(text);
}

export function parseModelOutput(text) {
  let out;
  try {
    out = JSON.parse(text);
  } catch {
    throw new Error(`Réponse du modèle non JSON : ${text.slice(0, 200)}`);
  }
  if (typeof out.reply !== 'string' || !out.reply.trim()) {
    throw new Error('Réponse du modèle sans "reply"');
  }
  const a = out.appointment;
  const complete = a && ['ownerName', 'phone', 'petName', 'species', 'reason', 'preferredSlot']
    .every((k) => typeof a[k] === 'string' && a[k].trim());
  return {
    reply: out.reply.trim(),
    intent: typeof out.intent === 'string' ? out.intent : 'autre',
    isEmergency: out.isEmergency === true,
    appointment: complete ? a : null,
  };
}

/**
 * Mode démo sans clé API : réponses par mots-clés à partir de la fiche clinique.
 * Suffisant pour montrer le widget, pas pour un client réel.
 */
export function mockAnswer(clinic, message) {
  const t = normalize(message);
  const has = (...words) => words.some((w) => t.includes(w));

  for (const f of clinic.faq ?? []) {
    const keywords = normalize(f.q).split(/\W+/).filter((w) => w.length > 4);
    const hits = keywords.filter((w) => t.includes(w)).length;
    if (keywords.length && hits / keywords.length >= 0.5) {
      return { reply: f.a, intent: 'services', isEmergency: false, appointment: null };
    }
  }
  if (has('horaire', 'ouvert', 'ferme', 'heure')) {
    return { reply: `Nos horaires :\n${clinic.hours.join('\n')}`, intent: 'horaires', isEmergency: false, appointment: null };
  }
  if (has('prix', 'tarif', 'combien', 'cout')) {
    return { reply: `Nos tarifs indicatifs :\n${(clinic.prices ?? []).join('\n')}`, intent: 'tarifs', isEmergency: false, appointment: null };
  }
  if (has('rdv', 'rendez', 'consult', 'disponib')) {
    return {
      reply: `Je peux transmettre votre demande de rendez-vous à l'équipe. Indiquez-moi votre nom, votre téléphone, le nom et l'espèce de votre animal, le motif et le créneau souhaité. Vous pouvez aussi appeler le ${clinic.phone}.`,
      intent: 'rendez-vous', isEmergency: false, appointment: null,
    };
  }
  if (has('adresse', 'ou etes', 'parking', 'venir', 'acces')) {
    return { reply: `Nous sommes au ${clinic.address}. ${clinic.parking ?? ''}`.trim(), intent: 'acces', isEmergency: false, appointment: null };
  }
  return {
    reply: `Je n'ai pas la réponse à cette question. L'équipe de la ${clinic.name} peut vous renseigner au ${clinic.phone}.`,
    intent: 'autre', isEmergency: false, appointment: null,
  };
}
