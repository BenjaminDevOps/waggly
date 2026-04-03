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
import { analyzePetSymptoms, type DiagnosisResult } from '../services/gemini';
import { addPoints } from '../services/userService';
import { incrementDiagnosisUsage, canUseDiagnosis, getRemainingDiagnoses } from '../services/purchaseService';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import { FREEMIUM } from '../constants/app';

const symptomChips = [
  'Vomiting', 'Diarrhea', 'Scratching', 'Limping', 'Not Eating', 'Coughing',
  'Sneezing', 'Lethargy', 'Hair Loss', 'Eye Discharge', 'Swelling', 'Bad Breath',
];

const SEVERITY_CONFIG: Record<string, { label: string; subtitle: string; colors: [string, string] }> = {
  low: { label: 'Low Concern', subtitle: 'Monitor at home, no urgent action needed', colors: ['#6EAF7B', '#5B9E6B'] },
  medium: { label: 'Moderate Concern', subtitle: 'Vet visit recommended within 48 hours', colors: ['#E8985E', '#D4726A'] },
  high: { label: 'High Concern', subtitle: 'Vet visit recommended as soon as possible', colors: ['#D4726A', '#C0504D'] },
  emergency: { label: 'Emergency', subtitle: 'Seek immediate veterinary care', colors: ['#C0504D', '#A03030'] },
};

/* ── main component ────────────────────────────────────────── */
export function DiagnosisPage() {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { firebaseUser, user } = useAuth();
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState('');

  // Select first pet when pets load
  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0].id);
    }
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
    if (showResults) {
      setShowResults(false);
    } else {
      navigate(-1);
    }
  };

  /* ── RESULTS VIEW ──────────────────────────────────────── */
  if (showResults && result) {
    const severityCfg = SEVERITY_CONFIG[result.severity] ?? SEVERITY_CONFIG.medium;
    return (
      <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh', paddingBottom: Spacing.xxl }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
            <ArrowLeft size={22} color={Colors.ink} />
          </button>
          <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>Diagnosis Results</span>
        </div>

        <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
          {/* severity banner */}
          <GradientCard colors={severityCfg.colors} style={{ padding: Spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
              <AlertTriangle size={28} color={Colors.inkInverse} />
              <div>
                <span style={{ fontSize: Font.bodyLarge + 1, fontWeight: Weight.bold, color: Colors.inkInverse, display: 'block' }}>{severityCfg.label}</span>
                <span style={{ fontSize: Font.sm, color: 'rgba(255,255,255,0.85)' }}>{severityCfg.subtitle}</span>
              </div>
            </div>
          </GradientCard>

          {/* assessment */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md }}>
              <Sparkles size={18} color={Colors.primary} />
              <span style={{ fontSize: Font.body + 1, fontWeight: Weight.bold, color: Colors.ink }}>AI Assessment</span>
            </div>
            <p style={{ fontSize: Font.body - 1, color: Colors.inkSecondary, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
              {result.fullResponse}
            </p>
          </Card>

          {/* possible conditions */}
          <div>
            <SectionHeader title="Possible Conditions" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
              {result.possibleConditions.map((condition, i) => (
                <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: Spacing.lg }}>
                  <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
                    <svg width={56} height={56} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={28} cy={28} r={23} fill="none" stroke={Colors.surfaceSecondary} strokeWidth={5} />
                      <circle
                        cx={28} cy={28} r={23} fill="none"
                        stroke={Colors.warning} strokeWidth={5} strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 23}
                        strokeDashoffset={2 * Math.PI * 23 * 0.4}
                      />
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: Font.sm, fontWeight: Weight.bold, color: Colors.warning }}>#{i + 1}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink, display: 'block' }}>{condition}</span>
                    <span style={{ fontSize: Font.xs, color: Colors.inkTertiary, marginTop: 2, display: 'block' }}>Possible match</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* recommendations */}
          <div>
            <SectionHeader title="Recommendations" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm + 2 }}>
              {result.recommendations.map((rec, i) => (
                <Card key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: Spacing.md }}>
                  <CheckCircle size={18} color={Colors.success} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: Font.body - 1, color: Colors.ink, lineHeight: 1.5, display: 'block' }}>{rec}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* emergency box */}
          <Card style={{ backgroundColor: Colors.errorPale, borderLeft: `4px solid ${Colors.error}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm + 2, marginBottom: Spacing.sm }}>
              <Phone size={18} color={Colors.error} />
              <span style={{ fontSize: Font.body, fontWeight: Weight.bold, color: Colors.error }}>Emergency Contact</span>
            </div>
            <p style={{ fontSize: Font.sm, color: Colors.ink, lineHeight: 1.5, margin: 0 }}>
              If symptoms worsen rapidly or your pet shows signs of severe dehydration,
              contact your emergency vet immediately.
            </p>
          </Card>

          {/* points earned */}
          <Card style={{ backgroundColor: Colors.successPale, textAlign: 'center' as const }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: Spacing.xs }}><Trophy size={28} color={Colors.success} /></div>
            <span style={{ fontSize: Font.body + 1, fontWeight: Weight.bold, color: Colors.success, display: 'block' }}>+25 Points Earned!</span>
            <span style={{ fontSize: Font.sm, color: Colors.inkSecondary, marginTop: Spacing.xs, display: 'block' }}>For using AI Diagnosis</span>
          </Card>

          {/* action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm + 2, paddingBottom: Spacing.xl }}>
            <Button label="Find Nearby Vet" onPress={() => {}} variant="primary" />
            <Button label="Save to Health Records" onPress={() => {}} variant="secondary" />
            <Button label="New Diagnosis" onPress={() => { setShowResults(false); setResult(null); setSelectedSymptoms([]); setDescription(''); }} variant="ghost" />
          </div>
        </div>
      </div>
    );
  }

  /* ── INPUT FORM VIEW ───────────────────────────────────── */
  return (
    <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh', paddingBottom: Spacing.xxl }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
            <ArrowLeft size={22} color={Colors.ink} />
          </button>
          <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>AI Diagnosis</span>
        </div>
        {user?.isPremium ? (
          <StatusBadge label="Premium" color={Colors.secondary} />
        ) : (
          <StatusBadge
            label={`${getRemainingDiagnoses(false, user?.aiDiagnosisUsed ?? 0, FREEMIUM.freeAiDiagnosisLimit)}/${FREEMIUM.freeAiDiagnosisLimit} free`}
            color={getRemainingDiagnoses(false, user?.aiDiagnosisUsed ?? 0, FREEMIUM.freeAiDiagnosisLimit) > 0 ? Colors.success : Colors.error}
          />
        )}
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
        {/* info banner */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: Spacing.sm + 2, padding: Spacing.lg,
          backgroundColor: Colors.skyPale, borderRadius: Radius.md, border: `1px solid ${Colors.sky}40`,
        }}>
          <Info size={18} color={Colors.sky} style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: Font.sm, color: Colors.sky, lineHeight: 1.5 }}>
            AI diagnosis is not a substitute for professional veterinary advice.
            Always consult a vet for serious concerns.
          </span>
        </div>

        {/* error message */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: Spacing.sm + 2, padding: Spacing.lg,
            backgroundColor: Colors.errorPale, borderRadius: Radius.md, border: `1px solid ${Colors.error}40`,
          }}>
            <AlertTriangle size={18} color={Colors.error} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: Font.sm, color: Colors.error, lineHeight: 1.5 }}>{error}</span>
          </div>
        )}

        {/* pet selector */}
        <div>
          <SectionHeader title="Select Pet" />
          {pets.length === 0 ? (
            <Card style={{ textAlign: 'center' as const, padding: Spacing.xl }}>
              <PawPrint size={28} color={Colors.inkTertiary} style={{ margin: '0 auto' }} />
              <p style={{ color: Colors.inkSecondary, fontSize: Font.body, marginTop: Spacing.sm }}>Add a pet first to use AI Diagnosis</p>
            </Card>
          ) : (
            <div style={{ display: 'flex', gap: Spacing.md }}>
              {pets.map(p => {
                const active = selectedPet === p.id;
                const Icon = PET_ICON_MAP[p.type] || PawPrint;
                const color = PET_COLOR_MAP[p.type] || Colors.primary;
                return (
                  <button
                    key={p.id}
                    className="btn-press"
                    onClick={() => setSelectedPet(p.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm - 2,
                      padding: `${Spacing.md}px ${Spacing.lg}px`, borderRadius: Radius.md, border: 'none', cursor: 'pointer',
                      backgroundColor: active ? color + '18' : Colors.surface,
                      boxShadow: active ? `0 0 0 2px ${color}` : Shadow.soft,
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={28} color={active ? color : Colors.inkTertiary} />
                    <span style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: active ? color : Colors.ink }}>{p.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* symptom chips */}
        <div>
          <SectionHeader title="Symptoms" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.sm }}>
            {symptomChips.map(s => {
              const active = selectedSymptoms.includes(s);
              return (
                <button
                  key={s}
                  className="chip-interactive"
                  onClick={() => toggleSymptom(s)}
                  style={{
                    padding: `${Spacing.sm}px ${Spacing.lg}px`, borderRadius: Radius.pill, fontSize: Font.sm, fontWeight: Weight.semibold,
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: active ? Colors.primary : Colors.surface,
                    color: active ? Colors.inkInverse : Colors.ink,
                    boxShadow: active ? Shadow.glow(Colors.primary) : Shadow.soft,
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* description textarea */}
        <div>
          <SectionHeader title="Describe Symptoms" />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what you've observed in more detail..."
            rows={4}
            style={{
              width: '100%', padding: Spacing.lg, borderRadius: Radius.md, border: `1px solid ${Colors.hairline}`,
              backgroundColor: Colors.surface, fontSize: Font.body - 1, color: Colors.ink, resize: 'vertical',
              fontFamily: 'inherit', lineHeight: 1.5, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* photo upload */}
        <div>
          <SectionHeader title="Add Photo (Optional)" />
          <button
            style={{
              width: '100%', padding: `${Spacing.xxl + 4}px ${Spacing.xl}px`, borderRadius: Radius.md,
              border: `2px dashed ${Colors.hairline}`, backgroundColor: Colors.surface,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm,
              cursor: 'pointer',
            }}
          >
            <Camera size={28} color={Colors.inkTertiary} />
            <span style={{ fontSize: Font.body - 1, color: Colors.inkTertiary, fontWeight: Weight.medium }}>Tap to upload a photo</span>
            <span style={{ fontSize: Font.xs, color: Colors.inkTertiary }}>JPG, PNG up to 5MB</span>
          </button>
        </div>

        {/* paywall gate */}
        {!canUseDiagnosis(user?.isPremium ?? false, user?.aiDiagnosisUsed ?? 0, FREEMIUM.freeAiDiagnosisLimit) && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: Spacing.sm + 2, padding: Spacing.lg,
            backgroundColor: Colors.secondaryPale, borderRadius: Radius.md, border: `1px solid ${Colors.secondary}40`,
          }}>
            <Star size={18} color={Colors.secondary} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: Font.body, fontWeight: Weight.bold, color: Colors.secondary, display: 'block' }}>
                Free diagnoses used
              </span>
              <span style={{ fontSize: Font.sm, color: Colors.inkSecondary, lineHeight: 1.5, display: 'block', marginTop: 4 }}>
                Upgrade to Premium for unlimited AI diagnoses and more.
              </span>
              <button
                className="btn-press"
                onClick={() => navigate('/premium')}
                style={{
                  marginTop: 10, padding: '8px 20px', borderRadius: Radius.pill,
                  backgroundColor: Colors.secondary, color: Colors.inkInverse,
                  fontSize: Font.sm, fontWeight: Weight.bold, border: 'none', cursor: 'pointer',
                }}
              >
                Go Premium
              </button>
            </div>
          </div>
        )}

        {/* analyze button */}
        <Button
          label={loading ? 'Analyzing...' : 'Analyze Symptoms'}
          onPress={handleAnalyze}
          variant="primary"
          size="large"
          loading={loading}
          disabled={
            pets.length === 0 ||
            (selectedSymptoms.length === 0 && description.length === 0) ||
            !canUseDiagnosis(user?.isPremium ?? false, user?.aiDiagnosisUsed ?? 0, FREEMIUM.freeAiDiagnosisLimit)
          }
          icon={<Sparkles size={20} color={Colors.inkInverse} />}
        />
      </div>
    </div>
  );
}
