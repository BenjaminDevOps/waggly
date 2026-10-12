import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const REQUIRED = ['id', 'name', 'phone', 'emergencyPhone', 'hours'];

/** Charge toutes les fiches clinique (clinics/*.json), indexées par id. */
export function loadClinics(dir) {
  const clinics = new Map();
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const clinic = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    const missing = REQUIRED.filter((k) => !clinic[k]);
    if (missing.length) {
      throw new Error(`${file} : champs manquants ${missing.join(', ')}`);
    }
    if (!/^[a-z0-9-]+$/.test(clinic.id)) {
      throw new Error(`${file} : id invalide "${clinic.id}" (a-z, 0-9, -)`);
    }
    clinic.assistantName ??= 'l\'assistant';
    clinic.allowedOrigins ??= [];
    clinics.set(clinic.id, clinic);
  }
  return clinics;
}

/** Infos exposées publiquement au widget (jamais la config complète). */
export function publicClinicInfo(clinic) {
  return {
    id: clinic.id,
    name: clinic.name,
    assistantName: clinic.assistantName,
    phone: clinic.phone,
    emergencyPhone: clinic.emergencyPhone,
    primaryColor: clinic.primaryColor ?? '#0f766e',
  };
}
