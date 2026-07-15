import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, Utensils, Home as HomeIcon, Brain, CalendarCheck,
  Star, ChevronRight, PawPrint, Plus, X,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useI18n } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { usePets } from '../hooks/usePets';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import { PET_EMOJI } from '../models/types';
import { CHECKLIST_ITEM_KEYS, getChecklistState } from '../services/checklistService';
import { subscribeToAppointments, addAppointment, getNextUpcoming } from '../services/appointmentService';
import type { Appointment } from '../models/types';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: Spacing.md,
  borderRadius: Radius.md, border: `1.5px solid ${Colors.hairline}`,
  fontSize: Font.body, color: Colors.ink,
  backgroundColor: Colors.surfaceSecondary, outline: 'none',
  boxSizing: 'border-box',
};
const fieldLabelStyle: React.CSSProperties = {
  fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm,
};

export function PetCarnetPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { pets, loading } = usePets();
  const { user, firebaseUser } = useAuth();
  const { t } = useI18n();
  const pet = pets.find((p) => p.id === petId);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [apptDate, setApptDate] = useState(new Date().toISOString().split('T')[0]);
  const [apptTime, setApptTime] = useState('');
  const [apptVet, setApptVet] = useState('');
  const [apptLocation, setApptLocation] = useState('');
  const [apptNote, setApptNote] = useState('');
  const [savingAppt, setSavingAppt] = useState(false);

  useEffect(() => {
    if (!petId) return;
    const unsub = subscribeToAppointments(petId, setAppointments);
    return unsub;
  }, [petId]);

  const checklistState = getChecklistState();
  const nextChecklistKey = CHECKLIST_ITEM_KEYS.find((k) => !checklistState[k]);
  const nextAppointment = getNextUpcoming(appointments);

  const totalPoints = user?.totalPoints ?? 0;
  const level = Math.floor(totalPoints / 200) + 1;
  const xpInLevel = totalPoints % 200;
  const xpPct = (xpInLevel / 200) * 100;

  async function handleSaveAppointment() {
    if (!firebaseUser || !petId || !apptVet.trim()) return;
    setSavingAppt(true);
    try {
      await addAppointment(firebaseUser.uid, petId, {
        date: apptDate,
        time: apptTime || undefined,
        vetName: apptVet.trim(),
        location: apptLocation.trim() || undefined,
        note: apptNote.trim() || undefined,
      });
      setShowAddAppt(false);
      setApptVet(''); setApptTime(''); setApptLocation(''); setApptNote('');
    } catch (e) {
      console.error('Error saving appointment:', e);
    } finally {
      setSavingAppt(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: Colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: Colors.inkSecondary, fontSize: Font.body }}>{t.common.loading}</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: Colors.background, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: Spacing.md }}>
        <Button label={t.common.back} onPress={() => navigate('/carnet')} variant="secondary" />
      </div>
    );
  }

  const PetIcon = PET_ICON_MAP[pet.type] || PawPrint;
  const petColor = PET_COLOR_MAP[pet.type] || Colors.lavender;
  const age = pet.birthDate
    ? Math.floor((Date.now() - new Date(pet.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  const shortcuts = [
    { icon: Heart, label: t.carnet.navHealth, color: Colors.accent, path: `/carnet/${pet.id}/health` },
    { icon: Utensils, label: t.carnet.navFood, color: Colors.success, path: `/carnet/${pet.id}/food` },
    { icon: HomeIcon, label: t.carnet.navHabitat, color: Colors.sky, path: `/carnet/${pet.id}/habitat` },
    { icon: Brain, label: t.carnet.navBehavior, color: Colors.lavender, path: `/carnet/${pet.id}/behavior` },
  ];

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: Colors.background, paddingBottom: Spacing.xxl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate('/carnet')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.pets.title}</span>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
        {/* Pet hero */}
        <Card style={{ display: 'flex', alignItems: 'center', gap: Spacing.lg }}>
          <div style={{ width: 72, height: 72, borderRadius: Radius.lg, backgroundColor: petColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PetIcon size={36} color={petColor} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 20, fontWeight: Weight.bold, color: Colors.ink }}>{pet.name}</span>
              {pet.gender !== 'unknown' && (
                <span style={{ fontSize: 16, color: Colors.inkTertiary }}>{pet.gender === 'male' ? '♂' : '♀'}</span>
              )}
            </div>
            <div style={{ fontSize: 14, color: Colors.inkSecondary, marginTop: 2 }}>{pet.breed || t.addPet[pet.type]}</div>
            <div style={{ fontSize: 13, color: Colors.inkTertiary, marginTop: 2 }}>
              {age !== null && t.pets.yearsOld.replace('{years}', String(age))}
              {age !== null && pet.weight ? ' • ' : ''}
              {pet.weight ? `${pet.weight} kg` : ''}
            </div>
          </div>
        </Card>

        {/* Shortcuts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: Spacing.sm }}>
          {shortcuts.map((s) => (
            <button
              key={s.label}
              className="btn-press"
              onClick={() => navigate(s.path)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.sm }}
            >
              <div style={{ width: 48, height: 48, borderRadius: Radius.md, backgroundColor: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={22} color={s.color} />
              </div>
              <span style={{ fontSize: 12, fontWeight: Weight.semibold, color: Colors.ink, textAlign: 'center' }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Rappel du jour */}
        <div>
          <SectionHeader title={t.carnet.reminderTitle} />
          <Card className="card-interactive" onClick={() => navigate('/checklist')} style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
            <CalendarCheck size={22} color={Colors.primary} />
            <span style={{ flex: 1, fontSize: Font.body, color: Colors.ink, fontWeight: Weight.semibold }}>
              {nextChecklistKey ? t.checklist[nextChecklistKey] : t.carnet.reminderNone}
            </span>
            <ChevronRight size={18} color={Colors.inkTertiary} />
          </Card>
        </div>

        {/* Prochain rendez-vous */}
        <div>
          <SectionHeader title={t.carnet.appointmentTitle} />
          <Card className="card-interactive" onClick={() => !nextAppointment && setShowAddAppt(true)} style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
            <CalendarCheck size={22} color={Colors.secondary} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {nextAppointment ? (
                <>
                  <div style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink }}>{nextAppointment.vetName}</div>
                  <div style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>
                    {nextAppointment.date}{nextAppointment.time ? ` — ${nextAppointment.time}` : ''}
                  </div>
                </>
              ) : (
                <span style={{ fontSize: Font.body, color: Colors.inkSecondary }}>{t.carnet.appointmentNone}</span>
              )}
            </div>
            {!nextAppointment && <Plus size={18} color={Colors.inkTertiary} />}
          </Card>
        </div>

        {/* Wellbeing score */}
        <div>
          <SectionHeader title={t.carnet.wellbeingTitle} />
          <Card style={{ display: 'flex', alignItems: 'center', gap: Spacing.lg }}>
            <div style={{ fontSize: 40 }}>{PET_EMOJI[pet.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Star size={16} color={Colors.secondary} />
                <span style={{ fontSize: Font.sm, fontWeight: Weight.bold, color: Colors.ink }}>{totalPoints} XP</span>
                <span style={{ fontSize: Font.xs, color: Colors.inkTertiary }}>· {t.carnet.wellbeingLevel.replace('{level}', String(level))}</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, backgroundColor: Colors.surfaceSecondary, overflow: 'hidden' }}>
                <div style={{ width: `${xpPct}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${Gradients.gold[0]}, ${Gradients.gold[1]})` }} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add appointment modal */}
      {showAddAppt && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: `0 ${Spacing.xl}px` }}>
          <div className="fade-in" style={{ backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.xl, width: '100%', maxWidth: 430, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl }}>
              <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.appointment.title}</span>
              <button onClick={() => setShowAddAppt(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
                <X size={22} color={Colors.inkSecondary} />
              </button>
            </div>

            <div style={{ marginBottom: Spacing.lg }}>
              <div style={fieldLabelStyle}>{t.appointment.vetNameLabel}</div>
              <input value={apptVet} onChange={(e) => setApptVet(e.target.value)} placeholder={t.appointment.vetNamePlaceholder} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: Spacing.md, marginBottom: Spacing.lg }}>
              <div style={{ flex: 1 }}>
                <div style={fieldLabelStyle}>{t.healthJournal.dateLabel}</div>
                <input type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={fieldLabelStyle}>{t.appointment.timeLabel}</div>
                <input type="time" value={apptTime} onChange={(e) => setApptTime(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: Spacing.lg }}>
              <div style={fieldLabelStyle}>{t.appointment.locationLabel}</div>
              <input value={apptLocation} onChange={(e) => setApptLocation(e.target.value)} placeholder={t.appointment.locationPlaceholder} style={inputStyle} />
            </div>

            <div style={{ marginBottom: Spacing.xl }}>
              <div style={fieldLabelStyle}>{t.appointment.noteLabel}</div>
              <textarea value={apptNote} onChange={(e) => setApptNote(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', gap: Spacing.md }}>
              <Button label={t.common.cancel} onPress={() => setShowAddAppt(false)} variant="secondary" style={{ flex: 1 }} />
              <Button label={t.healthJournal.save} onPress={handleSaveAppointment} variant="primary" loading={savingAppt} disabled={!apptVet.trim()} style={{ flex: 1 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
