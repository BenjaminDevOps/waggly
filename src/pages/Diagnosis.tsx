import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, Camera, Sparkles, Info, CheckCircle, Phone, Star,
} from 'lucide-react';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/Badge';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight, Shadow } from '../theme/spacing';

/* ── demo data ─────────────────────────────────────────────── */
const pets = [
  { id: '1', name: 'Luna', emoji: '🐕', color: Colors.primary },
  { id: '2', name: 'Milo', emoji: '🐈', color: Colors.accent },
  { id: '3', name: 'Coco', emoji: '🐰', color: Colors.secondary },
];

const symptomChips = [
  'Vomiting', 'Diarrhea', 'Scratching', 'Limping', 'Not Eating', 'Coughing',
  'Sneezing', 'Lethargy', 'Hair Loss', 'Eye Discharge', 'Swelling', 'Bad Breath',
];

const demoConditions = [
  { name: 'Gastroenteritis', probability: 72, color: Colors.warning },
  { name: 'Food Allergy', probability: 54, color: Colors.secondary },
  { name: 'Pancreatitis', probability: 31, color: Colors.accent },
];

const demoRecommendations = [
  { text: 'Withhold food for 12-24 hours, then introduce bland diet', urgency: 'High' },
  { text: 'Monitor hydration levels closely', urgency: 'Medium' },
  { text: 'Schedule a vet visit within 48 hours if symptoms persist', urgency: 'High' },
  { text: 'Avoid treats and table food temporarily', urgency: 'Low' },
];

/* ── main component ────────────────────────────────────────── */
export function DiagnosisPage() {
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState('1');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500);
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else {
      navigate(-1);
    }
  };

  /* ── RESULTS VIEW ──────────────────────────────────────── */
  if (showResults) {
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
          <GradientCard colors={['#E8985E', '#D4726A']} style={{ padding: Spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md }}>
              <AlertTriangle size={28} color={Colors.inkInverse} />
              <div>
                <span style={{ fontSize: Font.bodyLarge + 1, fontWeight: Weight.bold, color: Colors.inkInverse, display: 'block' }}>Moderate Concern</span>
                <span style={{ fontSize: Font.sm, color: 'rgba(255,255,255,0.85)' }}>Vet visit recommended within 48 hours</span>
              </div>
            </div>
          </GradientCard>

          {/* assessment */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md }}>
              <Sparkles size={18} color={Colors.primary} />
              <span style={{ fontSize: Font.body + 1, fontWeight: Weight.bold, color: Colors.ink }}>AI Assessment</span>
            </div>
            <p style={{ fontSize: Font.body - 1, color: Colors.inkSecondary, lineHeight: 1.6, margin: 0 }}>
              Based on the symptoms reported (vomiting, not eating), your pet may be experiencing
              gastrointestinal distress. The combination of these symptoms suggests a digestive issue
              that could range from mild food sensitivity to a more serious condition. Monitoring and
              a vet consultation are recommended.
            </p>
          </Card>

          {/* possible conditions */}
          <div>
            <SectionHeader title="Possible Conditions" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
              {demoConditions.map(c => (
                <Card key={c.name} style={{ display: 'flex', alignItems: 'center', gap: Spacing.lg }}>
                  {/* probability circle */}
                  <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
                    <svg width={56} height={56} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={28} cy={28} r={23} fill="none" stroke={Colors.surfaceSecondary} strokeWidth={5} />
                      <circle
                        cx={28} cy={28} r={23} fill="none"
                        stroke={c.color} strokeWidth={5} strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 23}
                        strokeDashoffset={2 * Math.PI * 23 * (1 - c.probability / 100)}
                      />
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: Font.sm, fontWeight: Weight.bold, color: c.color }}>{c.probability}%</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink, display: 'block' }}>{c.name}</span>
                    <span style={{ fontSize: Font.xs, color: Colors.inkTertiary, marginTop: 2, display: 'block' }}>Probability match</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* recommendations */}
          <div>
            <SectionHeader title="Recommendations" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm + 2 }}>
              {demoRecommendations.map((r, i) => (
                <Card key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: Spacing.md }}>
                  <CheckCircle size={18} color={Colors.success} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: Font.body - 1, color: Colors.ink, lineHeight: 1.5, display: 'block' }}>{r.text}</span>
                    <div style={{ marginTop: Spacing.sm - 2 }}>
                      <StatusBadge
                        label={r.urgency}
                        color={r.urgency === 'High' ? Colors.error : r.urgency === 'Medium' ? Colors.warning : Colors.success}
                        small
                      />
                    </div>
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
            <span style={{ fontSize: Font.title1, display: 'block', marginBottom: Spacing.xs }}>🎉</span>
            <span style={{ fontSize: Font.body + 1, fontWeight: Weight.bold, color: Colors.success, display: 'block' }}>+25 Points Earned!</span>
            <span style={{ fontSize: Font.sm, color: Colors.inkSecondary, marginTop: Spacing.xs, display: 'block' }}>For using AI Diagnosis</span>
          </Card>

          {/* action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm + 2, paddingBottom: Spacing.xl }}>
            <Button label="Find Nearby Vet" onPress={() => {}} variant="primary" />
            <Button label="Save to Health Records" onPress={() => {}} variant="secondary" />
            <Button label="New Diagnosis" onPress={() => { setShowResults(false); setSelectedSymptoms([]); setDescription(''); }} variant="ghost" />
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
        <StatusBadge label="3/3 free" color={Colors.success} />
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

        {/* pet selector */}
        <div>
          <SectionHeader title="Select Pet" />
          <div style={{ display: 'flex', gap: Spacing.md }}>
            {pets.map(p => {
              const active = selectedPet === p.id;
              return (
                <button
                  key={p.id}
                  className="btn-press"
                  onClick={() => setSelectedPet(p.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.sm - 2,
                    padding: `${Spacing.md}px ${Spacing.lg}px`, borderRadius: Radius.md, border: 'none', cursor: 'pointer',
                    backgroundColor: active ? p.color + '18' : Colors.surface,
                    boxShadow: active ? `0 0 0 2px ${p.color}` : Shadow.soft,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: Font.title1 }}>{p.emoji}</span>
                  <span style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: active ? p.color : Colors.ink }}>{p.name}</span>
                </button>
              );
            })}
          </div>
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

        {/* analyze button */}
        <Button
          label={loading ? 'Analyzing...' : 'Analyze Symptoms'}
          onPress={handleAnalyze}
          variant="primary"
          size="large"
          loading={loading}
          disabled={selectedSymptoms.length === 0 && description.length === 0}
          icon={<Sparkles size={20} color={Colors.inkInverse} />}
        />
      </div>
    </div>
  );
}
