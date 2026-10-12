// Détection déterministe des urgences, AVANT tout appel au modèle :
// une urgence ne doit jamais dépendre d'une réponse d'IA.

const PATTERNS = [
  /convuls/, /crise d.?epilep/, /\bepilep/,
  /ne respire (plus|pas|mal)/, /respire (mal|difficilement|tres vite)/, /du mal a respirer/,
  /s.?etouffe/, /etouffement/, /langue (bleue|violette)/, /gencives? (blanches?|bleues?)/,
  /empoisonn/, /intoxi/, /raticide/, /mort.?aux.?rats/, /antigel/, /a (mange|avale) (du|de la|des|un|une) (chocolat|raisin|lys|medicament|paracetamol|ibuprofene|xylitol)/,
  /saigne (beaucoup|abondamment|enormement)/, /hemorragi/, /perd (beaucoup )?(de )?sang/, /vomit du sang/,
  /renverse par/, /\bpercute\b/, /accident/, /tombe (du|d.?un) (balcon|etage|fenetre)/, /defenestr/,
  /ventre.{0,40}(gonfle|ballonne|tres dur)/, /ventre (dur|tendu)/, /torsion/, /dilatation/,
  /inconscient/, /ne se (leve|reveille) plus/, /evanoui/, /\bparalys/, /ne bouge plus/,
  /n.?urine plus/, /ne fait plus pipi/, /bloque.{0,20}(urin|pipi)/,
  /coup de chaleur/, /mise.?bas/, /met bas/,
  /morsure de vipere/, /vipere/, /piqure.{0,30}(gonfl|gorge)/,
  /urgen/,
];

export function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ');
}

export function isEmergency(text) {
  const t = normalize(text);
  return PATTERNS.some((p) => p.test(t));
}

export function emergencyReply(clinic) {
  return (
    `⚠️ Cela peut être une urgence. N'attendez pas : appelez immédiatement la clinique au ${clinic.phone}` +
    ` ou, en dehors des horaires d'ouverture, le service d'urgence au ${clinic.emergencyPhone}.` +
    ` Je suis un assistant automatique et je ne peux pas évaluer l'état de votre animal.`
  );
}
