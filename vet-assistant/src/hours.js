/** true si la clinique est ouverte à l'instant `now` (heure de Paris), d'après clinic.schedule. */
export function isOpen(clinic, now = new Date()) {
  if (!clinic.schedule) return true;
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(now).map((p) => [p.type, p.value]),
  );
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  const hhmm = `${parts.hour}:${parts.minute}`;
  return (clinic.schedule[String(day)] ?? []).some(([from, to]) => hhmm >= from && hhmm < to);
}
