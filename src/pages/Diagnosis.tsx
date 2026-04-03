import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, Camera, Sparkles, Info, CheckCircle, Phone, Star,
  Trophy, PawPrint,
} from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/Badge';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';
import { usePets } from '../hooks/usePets';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import { analyzePetSymptoms, type DiagnosisResult } from '../services/gemini';
import { addPoints } from '../services/userService';
import { incrementDiagnosisUsage, canUseDiagnosis, getRemainingDiagnoses } from '../services/purchaseService';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import { FREEMIUM } from '../constants/app';

export function DiagnosisPage() {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { firebaseUser, user } = useAuth();
  const { t } = useI18n();
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState('');

  const symptomChips = [
    t.diagnosis.vomiting, t.diagnosis.diarrhea, t.diagnosis.scratching, t.diagnosis.limping,
    t.diagnosis.notEating, t.diagnosis.coughing, t.diagnosis.sneezing, t.diagnosis.lethargy,
    t.diagnosis.hairLoss, t.diagnosis.eyeDischarge, t.diagnosis.swelling, t.diagnosis.badBreath,
  ];

  const SEVERITY_CONFIG: Record<string, { label: string; subtitle: string; colors: [string, string] }> = {
    low: { label: t.diagnosis.lowConcern, subtitle: t.diagnosis.lowConcernDesc, colors: ['#6EAF7B', '#5B9E6B'] },
    medium: { label: t.diagnosis.moderateConcern, subtitle: t.diagnosis.moderateConcernDesc, colors: ['#E8985E', '#D4726A'] },
    high: { label: t.diagnosis.highConcern, subtitle: t.diagnosis.highConcernDesc, colors: ['#D4726A', '#C0504D'] },
    emergency: { label: t.diagnosis.emergency, subtitle: t.diagnosis.emergencyDesc, colors: ['#C0504D', '#A03030'] },
  };

  useEffect(() => {
    if (pets.length > 0 && !selectedPet) setSelectedPet(pets[0].id);
  }, [pets, selectedPet]);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    const pet = pets.find(p => p.id === selectedPet);
    try {
      const res = await analyzePetSymptoms({
        petType: pet?.type || 'dog',
        petAge: pet?.breed || 'unknown',
        symptoms: [...selectedSymptoms, description].filter(Boolean).join(', '),
      });
      setResult(res);
      setShowResults(true);
      if (firebaseUser) {
        await addPoints(firebaseUser.uid, 25);
        await incrementDiagnosisUsage(firebaseUser.uid);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to analyze. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (showResults) setShowResults(false);
    else navigate(-1);
  };

  /* ── RESULTS VIEW ── */
  if (showResults && result) {
    const severityCfg = SEVERITY_CONFIG[result.severity] ?? SEVERITY_CONFIG.medium;
    return (
      <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh', paddingBottom: Spacing.xxl }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
            <ArrowLeft size={22} color={Colors.ink} />
          </button>
          <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.diagnosis.results}</span>
        </div>
        <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
          <GradientCard colors={severityCfg.colors} style={{ padding: Spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
              <AlertTriangle size={28} color={Colors.inkInverse} />
              <div>
                <span style={{ fontSize: Font.bodyLarge + 1, fontWeight: Weight.bold, color: Colors.inkInverse, display: 'block' }}>{severityCfg.label}</span>
                <span style={{ fontSize: Font.sm, color: 'rgba(255,255,255,0.85)' }}>{severityCfg.subtitle}</span>
              </div>
            </div>
          </GradientCard>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md }}>
              <Sparkles size={18} color={Colors.primary} />
              <span style={{ fontSize: Font.body + 1, fontWeight: Weight.bold, color: Colors.ink }}>{t.diagnosis.aiAssessment}</span>
            </div>
            <p style={{ fontSize: Font.body - 1, color: Colors.inkSecondary, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{result.fullResponse}</p>
          </Card>

          <div>
            <SectionHeader title={t.diagnosis.possibleConditions} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
              {result.possibleConditions.map((condition, i) => (
                <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: Spacing.lg }}>
                  <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
                    <svg width={56} height={56} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={28} cy={28} r={23} fill="none" stroke={Colors.surfaceSecondary} strokeWidth={5} />
                      <circle cx={28} cy={28} r={23} fill="none" stroke={Colors.warning} strokeWidth={5} strokeLinecap="round" strokeDasharray={2 * Math.PI * 23} strokeDashoffset={2 * Math.PI * 23 * 0.4} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: Font.sm, fontWeight: Weight.bold, color: Colors.warning }}>#{i + 1}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink, display: 'block' }}>{condition}</span>
                    <span style={{ fontSize: Font.xs, color: Colors.inkTertiary, marginTop: 2, display: 'block' }}>{t.diagnosis.possibleMatch}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title={t.diagnosis.recommendations} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm + 2 }}>
              {result.recommendations.map((rec, i) => (
                <Card key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: Spacing.md }}>
                  <CheckCircle size={18} color={Colors.success} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: Font.body - 1, color: Colors.ink, lineHeight: 1.5, display: 'block', flex: 1 }}>{rec}</span>
                </Card>
              ))}
            </div>
          </div>

          <Card style={{ backgroundColor: Colors.errorPale, borderLeft: `4px solid ${Colors.error}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm + 2, marginBottom: Spacing.sm }}>
              <Phone size={18} color={Colors.error} />
              <span style={{ fontSize: Font.body, fontWeight: Weight.bold, color: Colors.error }}>{t.diagnosis.emergencyContact}</span>
            </div>
            <p style={{ fontSize: Font.sm, color: Colors.ink, lineHeight: 1.5, margin: 0 }}>{t.diagnosis.emergencyContactDesc}</p>
          </Card>

          <Card style={{ backgroundColor: Colors.successPale, textAlign: 'center' as const }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: Spacing.xs }}><Trophy size={28} color={Colors.success} /></div>
            <span style={{ fontSize: Font.body + 1, fontWeight: Weight.bold, color: Colors.success, display: 'block' }}>{t.diagnosis.pointsEarned}</span>
            <span style={{ fontSize: Font.sm, color: Colors.inkSecondary, marginTop: Spacing.xs, display: 'block' }}>{t.diagnosis.forUsingDiagnosis}</span>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm + 2, paddingBottom: Spacing.xl }}>
            <Button label={t.diagnosis.findNearbyVet} onPress={() => {}} variant="primary" />
            <Button label={t.diagnosis.saveToRecords} onPress={() => {}} variant="secondary" />
            <Button label={t.diagnosis.newDiagnosis} onPress={() => { setShowResults(false); setResult(null); setSelectedSymptoms([]); setDescription(''); }} variant="ghost" />
          </div>
        </div>
      </div>
    );
  }

  /* ── INPUT FORM VIEW ── */
  const remaining = getRemainingDiagnoses(user?.isPremium ?? false, user?.aiDiagnosisUsed ?? 0, FREEMIUM.freeAiDiagnosisLimit);

  return (
    <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh', paddingBottom: Spacing.xxl }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
            <ArrowLeft size={22} color={Colors.ink} />
          </button>
          <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.diagnosis.title}</span>
        </div>
        {user?.isPremium ? (
          <StatusBadge label={t.common.premium} color={Colors.secondary} />
        ) : (
          <StatusBadge
            label={`${remaining}/${FREEMIUM.freeAiDiagnosisLimit} ${t.common.free}`}
            color={remaining > 0 ? Colors.success : Colors.error}
          />
        )}
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: Spacing.sm + 2, padding: Spacing.lg, backgroundColor: Colors.skyPale, borderRadius: Radius.md, border: `1px solid ${Colors.sky}40` }}>
          <Info size={18} color={Colors.sky} style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: Font.sm, color: Colors.sky, lineHeight: 1.5 }}>{t.diagnosis.disclaimer}</span>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: Spacing.sm + 2, padding: Spacing.lg, backgroundColor: Colors.errorPale, borderRadius: Radius.md, border: `1px solid ${Colors.error}40` }}>
            <AlertTriangle size={18} color={Colors.error} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: Font.sm, color: Colors.error, lineHeight: 1.5 }}>{error}</span>
          </div>
        )}

        <div>
          <SectionHeader title={t.diagnosis.selectPet} />
          {pets.length === 0 ? (
            <Card style={{ textAlign: 'center' as const, padding: Spacing.xl }}>
              <PawPrint size={28} color={Colors.inkTertiary} style={{ margin: '0 auto' }} />
              <p style={{ color: Colors.inkSecondary, fontSize: Font.body, marginTop: Spacing.sm }}>{t.diagnosis.addPetFirst}</p>
            </Card>
          ) : (
            <div style={{ display: 'flex', gap: Spacing.md }}>
              {pets.map(p => {
                const active = selectedPet === p.id;
                const Icon = PET_ICON_MAP[p.type] || PawPrint;
                const color = PET_COLOR_MAP[p.type] || Colors.primary;
                return (
                  <button key={p.id} className="btn-press" onClick={() => setSelectedPet(p.id)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm - 2,
                    padding: `${Spacing.md}px ${Spacing.lg}px`, borderRadius: Radius.md, border: 'none', cursor: 'pointer',
                    backgroundColor: active ? color + '18' : Colors.surface,
                    boxShadow: active ? `0 0 0 2px ${color}` : Shadow.soft, transition: 'all 0.2s',
                  }}>
                    <Icon size={28} color={active ? color : Colors.inkTertiary} />
                    <span style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: active ? color : Colors.ink }}>{p.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <SectionHeader title={t.diagnosis.symptoms} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.sm }}>
            {symptomChips.map(s => {
              const active = selectedSymptoms.includes(s);
              return (
                <button key={s} className="chip-interactive" onClick={() => toggleSymptom(s)} style={{
                  padding: `${Spacing.sm}px ${Spacing.lg}px`, borderRadius: Radius.pill, fontSize: Font.sm, fontWeight: Weight.semibold,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  backgroundColor: active ? Colors.primary : Colors.surface,
                  color: active ? Colors.inkInverse : Colors.ink,
                  boxShadow: active ? Shadow.glow(Colors.primary) : Shadow.soft,
                }}>{s}</button>
              );
            })}
          </div>
        </div>

        <div>
          <SectionHeader title={t.diagnosis.describeSymptoms} />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t.diagnosis.describePlaceholder} rows={4} style={{
            width: '100%', padding: Spacing.lg, borderRadius: Radius.md, border: `1px solid ${Colors.hairline}`,
            backgroundColor: Colors.surface, fontSize: Font.body - 1, color: Colors.ink, resize: 'vertical',
            fontFamily: 'inherit', lineHeight: 1.5, outline: 'none', boxSizing: 'border-box',
          }} />
        </div>

        <div>
          <SectionHeader title={t.diagnosis.addPhoto} />
          <button style={{
            width: '100%', padding: `${Spacing.xxl + 4}px ${Spacing.xl}px`, borderRadius: Radius.md,
            border: `2px dashed ${Colors.hairline}`, backgroundColor: Colors.surface,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm, cursor: 'pointer',
          }}>
            <Camera size={28} color={Colors.inkTertiary} />
            <span style={{ fontSize: Font.body - 1, color: Colors.inkTertiary, fontWeight: Weight.medium }}>{t.diagnosis.photoHint}</span>
            <span style={{ fontSize: Font.xs, color: Colors.inkTertiary }}>JPG, PNG max 5MB</span>
          </button>
        </div>

        {!canUseDiagnosis(user?.isPremium ?? false, user?.aiDiagnosisUsed ?? 0, FREEMIUM.freeAiDiagnosisLimit) && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: Spacing.sm + 2, padding: Spacing.lg, backgroundColor: Colors.secondaryPale, borderRadius: Radius.md, border: `1px solid ${Colors.secondary}40` }}>
            <Star size={18} color={Colors.secondary} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: Font.body, fontWeight: Weight.bold, color: Colors.secondary, display: 'block' }}>{t.diagnosis.freeDiagnosesUsed}</span>
              <span style={{ fontSize: Font.sm, color: Colors.inkSecondary, lineHeight: 1.5, display: 'block', marginTop: 4 }}>{t.diagnosis.upgradeForUnlimited}</span>
              <button className="btn-press" onClick={() => navigate('/premium')} style={{
                marginTop: 10, padding: '8px 20px', borderRadius: Radius.pill,
                backgroundColor: Colors.secondary, color: Colors.inkInverse,
                fontSize: Font.sm, fontWeight: Weight.bold, border: 'none', cursor: 'pointer',
              }}>{t.diagnosis.goPremium}</button>
            </div>
          </div>
        )}

        <Button
          label={loading ? t.diagnosis.analyzing : t.diagnosis.analyzeSymptoms}
          onPress={handleAnalyze}
          variant="primary" size="large" loading={loading}
          disabled={pets.length === 0 || (selectedSymptoms.length === 0 && description.length === 0) || !canUseDiagnosis(user?.isPremium ?? false, user?.aiDiagnosisUsed ?? 0, FREEMIUM.freeAiDiagnosisLimit)}
          icon={<Sparkles size={20} color={Colors.inkInverse} />}
        />
      </div>
    </div>
  );
}
