import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, ChevronDown, AlertTriangle, Scale, Sparkles, Thermometer,
  Droplet, Plus, PawPrint, Check, Salad,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { WeightChart } from '../components/WeightChart';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { useI18n } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { usePets } from '../hooks/usePets';
import { FOOD_GUIDE } from '../constants/foodGuide';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import { subscribeToHealthRecords, addHealthRecord } from '../services/healthRecordService';
import { subscribeToJournalEntries, addJournalEntry } from '../services/nacJournalService';
import type { HealthRecord, NacJournalEntry, PetType } from '../models/types';

type Segment = 'food' | 'journal';
type AddKind = 'weight' | 'shedding' | 'habitat' | null;

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

export function FoodHealthGuidePage() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const { firebaseUser } = useAuth();
  const { pets } = usePets();

  const [segment, setSegment] = useState<Segment>('food');

  // ---- Food guide state ----
  const [search, setSearch] = useState('');
  const [expandedSpecies, setExpandedSpecies] = useState<PetType | null>(FOOD_GUIDE[0]?.type ?? null);

  const filteredGuides = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return FOOD_GUIDE;
    return FOOD_GUIDE
      .map((g) => ({
        ...g,
        allowed: g.allowed.filter((i) => i.name[locale].toLowerCase().includes(q)),
        limit: g.limit.filter((i) => i.name[locale].toLowerCase().includes(q)),
        toxic: g.toxic.filter((i) => i.name[locale].toLowerCase().includes(q)),
      }))
      .filter((g) => g.allowed.length + g.limit.length + g.toxic.length > 0);
  }, [search, locale]);

  // ---- Health journal state ----
  const [selectedPetId, setSelectedPetId] = useState('');
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [journalEntries, setJournalEntries] = useState<NacJournalEntry[]>([]);
  const [addKind, setAddKind] = useState<AddKind>(null);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightValue, setWeightValue] = useState('');
  const [sheddingNote, setSheddingNote] = useState('');
  const [habitatTemp, setHabitatTemp] = useState('');
  const [habitatHumidity, setHabitatHumidity] = useState('');
  const [habitatNote, setHabitatNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (pets.length > 0 && !selectedPetId) setSelectedPetId(pets[0].id);
  }, [pets, selectedPetId]);

  useEffect(() => {
    if (!selectedPetId) { setRecords([]); return; }
    const unsub = subscribeToHealthRecords(selectedPetId, setRecords);
    return unsub;
  }, [selectedPetId]);

  useEffect(() => {
    if (!selectedPetId) { setJournalEntries([]); return; }
    const unsub = subscribeToJournalEntries(selectedPetId, setJournalEntries);
    return unsub;
  }, [selectedPetId]);

  const weightPoints = records
    .filter((r) => r.type === 'weight' && typeof r.weight === 'number')
    .map((r) => ({ date: r.date, value: r.weight as number }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const sheddingEntries = journalEntries.filter((e) => e.type === 'shedding');
  const habitatEntries = journalEntries.filter((e) => e.type === 'habitat');

  function openAdd(kind: AddKind) {
    setEntryDate(new Date().toISOString().split('T')[0]);
    setWeightValue('');
    setSheddingNote('');
    setHabitatTemp('');
    setHabitatHumidity('');
    setHabitatNote('');
    setSaved(false);
    setAddKind(kind);
  }

  async function handleSaveEntry() {
    if (!firebaseUser || !selectedPetId || !addKind) return;
    setSaving(true);
    try {
      if (addKind === 'weight') {
        const grams = parseFloat(weightValue);
        if (!grams) { setSaving(false); return; }
        await addHealthRecord(firebaseUser.uid, selectedPetId, {
          type: 'weight',
          title: t.healthJournal.weightEntryTitle,
          date: entryDate,
          weight: grams,
        });
      } else if (addKind === 'shedding') {
        await addJournalEntry(firebaseUser.uid, selectedPetId, {
          type: 'shedding',
          date: entryDate,
          note: sheddingNote.trim() || undefined,
        });
      } else if (addKind === 'habitat') {
        await addJournalEntry(firebaseUser.uid, selectedPetId, {
          type: 'habitat',
          date: entryDate,
          temperatureC: habitatTemp ? parseFloat(habitatTemp) : undefined,
          humidityPct: habitatHumidity ? parseFloat(habitatHumidity) : undefined,
          note: habitatNote.trim() || undefined,
        });
      }
      setSaved(true);
      setTimeout(() => setAddKind(null), 700);
    } catch (e) {
      console.error('Error saving journal entry:', e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh', paddingBottom: Spacing.xxl }}>
      <div style={{ padding: `${Spacing.lg}px ${Spacing.xl}px 0` }}>
        <h1 style={{ fontSize: Font.title1, fontWeight: Weight.bold, color: Colors.ink, margin: 0, letterSpacing: -0.3 }}>
          {t.foodGuide.title}
        </h1>
        <p style={{ fontSize: Font.body, color: Colors.inkSecondary, margin: '6px 0 0', lineHeight: 1.4 }}>
          {t.foodGuide.subtitle}
        </p>
      </div>

      {/* Segmented control */}
      <div style={{ display: 'flex', gap: Spacing.sm, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        {([
          { key: 'food' as Segment, label: t.foodGuide.segmentFood, icon: Salad },
          { key: 'journal' as Segment, label: t.foodGuide.segmentJournal, icon: Scale },
        ]).map((s) => {
          const active = segment === s.key;
          return (
            <button
              key={s.key}
              className="btn-press"
              onClick={() => setSegment(s.key)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
                padding: `${Spacing.md}px 0`, borderRadius: Radius.md, cursor: 'pointer',
                border: `1.5px solid ${active ? Colors.primary : Colors.hairline}`,
                backgroundColor: active ? Colors.primaryPale : Colors.surface,
                color: active ? Colors.primary : Colors.inkSecondary,
                fontSize: Font.body, fontWeight: active ? Weight.bold : Weight.medium,
              }}
            >
              <s.icon size={18} color={active ? Colors.primary : Colors.inkTertiary} />
              {s.label}
            </button>
          );
        })}
      </div>

      {segment === 'food' ? (
        <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.md, padding: '8px 12px', gap: 8 }}>
            <Search size={18} color={Colors.inkTertiary} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.foodGuide.searchPlaceholder}
              style={{ flex: 1, fontSize: Font.body, color: Colors.ink, backgroundColor: 'transparent', border: 'none', outline: 'none' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                <X size={18} color={Colors.inkTertiary} />
              </button>
            )}
          </div>

          {filteredGuides.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: Spacing.xxl }}>
              <Search size={28} color={Colors.inkTertiary} style={{ margin: '0 auto 12px' }} />
              <p style={{ color: Colors.inkSecondary, fontSize: Font.body, margin: 0 }}>{t.foodGuide.noResults}</p>
            </Card>
          ) : filteredGuides.map((guide) => {
            const isOpen = search.trim() ? true : expandedSpecies === guide.type;
            const Icon = PET_ICON_MAP[guide.type] || PawPrint;
            const color = PET_COLOR_MAP[guide.type] || Colors.primary;
            return (
              <div key={guide.type} style={{ backgroundColor: Colors.surface, borderRadius: Radius.lg, boxShadow: Shadow.soft, overflow: 'hidden' }}>
                <button
                  onClick={() => setExpandedSpecies(isOpen && !search.trim() ? null : guide.type)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: Spacing.md,
                    padding: Spacing.lg, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <span style={{ flex: 1, fontSize: Font.body, fontWeight: Weight.bold, color: Colors.ink }}>
                    {t.addPet[guide.type]}
                  </span>
                  {!search.trim() && (
                    <ChevronDown size={18} color={Colors.inkTertiary} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  )}
                </button>
                {isOpen && (
                  <div style={{ padding: `0 ${Spacing.lg}px ${Spacing.lg}px`, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
                    <FoodCategory label={t.foodGuide.allowed} color={Colors.success} bg={Colors.successPale} items={guide.allowed} locale={locale} />
                    <FoodCategory label={t.foodGuide.limit} color={Colors.warning} bg={Colors.warningPale} items={guide.limit} locale={locale} />
                    <FoodCategory label={t.foodGuide.toxic} color={Colors.error} bg={Colors.errorPale} items={guide.toxic} locale={locale} icon={<AlertTriangle size={14} />} />
                  </div>
                )}
              </div>
            );
          })}

          {!search.trim() && (
            <Card style={{ display: 'flex', gap: Spacing.md, alignItems: 'flex-start' }}>
              <AlertTriangle size={20} color={Colors.inkTertiary} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: Font.sm, color: Colors.inkSecondary, lineHeight: 1.5, margin: 0 }}>
                {t.foodGuide.otherSpeciesNotice}
              </p>
            </Card>
          )}
        </div>
      ) : (
        <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
          {pets.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: Spacing.xxl }}>
              <PawPrint size={28} color={Colors.inkTertiary} style={{ margin: '0 auto 12px' }} />
              <p style={{ color: Colors.inkSecondary, fontSize: Font.body, margin: 0 }}>{t.healthJournal.addPetFirst}</p>
              <div style={{ marginTop: Spacing.lg }}>
                <Button label={t.pets.addFirstPet} onPress={() => navigate('/add-pet')} variant="primary" icon={<Plus size={16} color="#fff" />} />
              </div>
            </Card>
          ) : (
            <>
              <div>
                <div style={fieldLabelStyle}>{t.healthJournal.selectPet}</div>
                <div style={{ display: 'flex', gap: Spacing.md, overflowX: 'auto' }}>
                  {pets.map((p) => {
                    const active = selectedPetId === p.id;
                    const Icon = PET_ICON_MAP[p.type] || PawPrint;
                    const color = PET_COLOR_MAP[p.type] || Colors.primary;
                    return (
                      <button
                        key={p.id}
                        className="btn-press"
                        onClick={() => setSelectedPetId(p.id)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0,
                          padding: `${Spacing.md}px ${Spacing.lg}px`, borderRadius: Radius.md, border: 'none', cursor: 'pointer',
                          backgroundColor: active ? color + '18' : Colors.surface,
                          boxShadow: active ? `0 0 0 2px ${color}` : Shadow.soft,
                        }}
                      >
                        <Icon size={24} color={active ? color : Colors.inkTertiary} />
                        <span style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: active ? color : Colors.ink }}>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight & growth */}
              <JournalSection
                title={t.healthJournal.weightTitle}
                subtitle={t.healthJournal.weightSubtitle}
                addLabel={t.healthJournal.weightAdd}
                onAdd={() => openAdd('weight')}
              >
                {weightPoints.length === 0 ? (
                  <EmptyRow icon={<Scale size={20} color={Colors.inkTertiary} />} label={t.healthJournal.weightEmpty} />
                ) : (
                  <>
                    <WeightChart points={weightPoints} unit="g" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: Spacing.sm }}>
                      {weightPoints.slice().reverse().slice(0, 5).map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: Font.sm, color: Colors.inkSecondary }}>
                          <span>{p.date}</span>
                          <span style={{ fontWeight: Weight.semibold, color: Colors.ink }}>{p.value} g</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </JournalSection>

              {/* Shedding & behavior */}
              <JournalSection
                title={t.healthJournal.sheddingTitle}
                subtitle={t.healthJournal.sheddingSubtitle}
                addLabel={t.healthJournal.sheddingAdd}
                onAdd={() => openAdd('shedding')}
              >
                {sheddingEntries.length === 0 ? (
                  <EmptyRow icon={<Sparkles size={20} color={Colors.inkTertiary} />} label={t.healthJournal.sheddingEmpty} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
                    {sheddingEntries.map((e) => (
                      <div key={e.id} style={{ display: 'flex', gap: Spacing.sm, alignItems: 'flex-start', padding: '8px 0', borderTop: `1px solid ${Colors.hairlineLight}` }}>
                        <Sparkles size={16} color={Colors.lavender} style={{ marginTop: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: Font.xs, color: Colors.inkTertiary }}>{e.date}</div>
                          {e.note && <div style={{ fontSize: Font.sm, color: Colors.ink }}>{e.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </JournalSection>

              {/* Habitat */}
              <JournalSection
                title={t.healthJournal.habitatTitle}
                subtitle={t.healthJournal.habitatSubtitle}
                addLabel={t.healthJournal.habitatAdd}
                onAdd={() => openAdd('habitat')}
              >
                {habitatEntries.length === 0 ? (
                  <EmptyRow icon={<Thermometer size={20} color={Colors.inkTertiary} />} label={t.healthJournal.habitatEmpty} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
                    {habitatEntries.map((e) => (
                      <div key={e.id} style={{ display: 'flex', gap: Spacing.md, alignItems: 'center', padding: '8px 0', borderTop: `1px solid ${Colors.hairlineLight}` }}>
                        <div style={{ fontSize: Font.xs, color: Colors.inkTertiary, minWidth: 78 }}>{e.date}</div>
                        <div style={{ display: 'flex', gap: Spacing.md, flex: 1 }}>
                          {typeof e.temperatureC === 'number' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: Font.sm, color: Colors.ink }}>
                              <Thermometer size={14} color={Colors.warning} />{e.temperatureC}°C
                            </span>
                          )}
                          {typeof e.humidityPct === 'number' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: Font.sm, color: Colors.ink }}>
                              <Droplet size={14} color={Colors.sky} />{e.humidityPct}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </JournalSection>
            </>
          )}
        </div>
      )}

      {/* Add entry modal */}
      {addKind && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: Colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: `0 ${Spacing.xl}px` }}>
          <div className="fade-in" style={{ backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.xl, width: '100%', maxWidth: 430, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl }}>
              <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>
                {addKind === 'weight' ? t.healthJournal.weightAdd : addKind === 'shedding' ? t.healthJournal.sheddingAdd : t.healthJournal.habitatAdd}
              </span>
              <button onClick={() => setAddKind(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
                <X size={22} color={Colors.inkSecondary} />
              </button>
            </div>

            {saved ? (
              <div style={{ textAlign: 'center', padding: Spacing.xxl }}>
                <Check size={48} color={Colors.success} style={{ margin: '0 auto' }} />
              </div>
            ) : (
              <>
                <div style={{ marginBottom: Spacing.lg }}>
                  <div style={fieldLabelStyle}>{t.healthJournal.dateLabel}</div>
                  <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} style={inputStyle} />
                </div>

                {addKind === 'weight' && (
                  <div style={{ marginBottom: Spacing.xl }}>
                    <div style={fieldLabelStyle}>{t.healthJournal.weightValueLabel}</div>
                    <input
                      type="number" inputMode="decimal" value={weightValue}
                      onChange={(e) => setWeightValue(e.target.value)}
                      placeholder={t.healthJournal.weightValuePlaceholder}
                      style={inputStyle}
                    />
                  </div>
                )}

                {addKind === 'shedding' && (
                  <div style={{ marginBottom: Spacing.xl }}>
                    <div style={fieldLabelStyle}>{t.healthJournal.sheddingNoteLabel}</div>
                    <textarea
                      value={sheddingNote} onChange={(e) => setSheddingNote(e.target.value)}
                      placeholder={t.healthJournal.sheddingNotePlaceholder} rows={3}
                      style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                )}

                {addKind === 'habitat' && (
                  <>
                    <div style={{ display: 'flex', gap: Spacing.md, marginBottom: Spacing.lg }}>
                      <div style={{ flex: 1 }}>
                        <div style={fieldLabelStyle}>{t.healthJournal.habitatTempLabel}</div>
                        <input type="number" inputMode="decimal" value={habitatTemp} onChange={(e) => setHabitatTemp(e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={fieldLabelStyle}>{t.healthJournal.habitatHumidityLabel}</div>
                        <input type="number" inputMode="decimal" value={habitatHumidity} onChange={(e) => setHabitatHumidity(e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ marginBottom: Spacing.xl }}>
                      <div style={fieldLabelStyle}>{t.healthJournal.habitatNoteLabel}</div>
                      <textarea
                        value={habitatNote} onChange={(e) => setHabitatNote(e.target.value)}
                        rows={2}
                        style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: Spacing.md }}>
                  <Button label={t.common.cancel} onPress={() => setAddKind(null)} variant="secondary" style={{ flex: 1 }} />
                  <Button label={t.healthJournal.save} onPress={handleSaveEntry} variant="primary" loading={saving} style={{ flex: 1 }} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FoodCategory({ label, color, bg, items, locale, icon }: {
  label: string; color: string; bg: string;
  items: { name: Record<string, string>; note?: Record<string, string> }[];
  locale: string; icon?: React.ReactNode;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: Spacing.sm }}>
        {icon}
        <span style={{ fontSize: Font.sm, fontWeight: Weight.bold, color }}>{label}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((food, i) => (
          <div key={i} style={{ backgroundColor: bg, borderRadius: Radius.sm, padding: '8px 12px' }}>
            <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.ink }}>{food.name[locale]}</div>
            {food.note && <div style={{ fontSize: Font.xs, color: Colors.inkSecondary, marginTop: 2 }}>{food.note[locale]}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function JournalSection({ title, subtitle, addLabel, onAdd, children }: {
  title: string; subtitle: string; addLabel: string; onAdd: () => void; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm }}>
        <div>
          <div style={{ fontSize: Font.bodyLarge, fontWeight: Weight.bold, color: Colors.ink }}>{title}</div>
          <div style={{ fontSize: Font.sm, color: Colors.inkTertiary, marginTop: 2 }}>{subtitle}</div>
        </div>
      </div>
      <Card>
        {children}
        <div style={{ marginTop: Spacing.md }}>
          <Button label={addLabel} onPress={onAdd} variant="secondary" icon={<Plus size={16} color={Colors.primary} />} />
        </div>
      </Card>
    </div>
  );
}

function EmptyRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm, padding: `${Spacing.lg}px 0` }}>
      {icon}
      <span style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>{label}</span>
    </div>
  );
}
