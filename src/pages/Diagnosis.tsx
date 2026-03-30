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

/* ── colours ───────────────────────────────────────────────── */
const C = {
  primary: '#5B5EA6', primaryPale: '#EDEDF7', primaryDark: '#44478A',
  secondary: '#E8985E', secondaryPale: '#FDF2E9',
  accent: '#D4726A', success: '#6EAF7B', successPale: '#E7F4EA',
  warning: '#E5A84B', error: '#D4605A', errorPale: '#FBEAE9',
  background: '#FAF8F5', surface: '#FFFFFF', surfaceSecondary: '#F3F0EB',
  ink: '#2D2D3A', inkSecondary: '#6B6B80', inkTertiary: '#9D9DAF',
  hairline: '#E8E4DF',
};

/* ── demo data ─────────────────────────────────────────────── */
const pets = [
  { id: '1', name: 'Luna', emoji: '🐕', color: '#5B5EA6' },
  { id: '2', name: 'Milo', emoji: '🐈', color: '#D4726A' },
  { id: '3', name: 'Coco', emoji: '🐰', color: '#E8985E' },
];

const symptomChips = [
  'Vomiting', 'Diarrhea', 'Scratching', 'Limping', 'Not Eating', 'Coughing',
  'Sneezing', 'Lethargy', 'Hair Loss', 'Eye Discharge', 'Swelling', 'Bad Breath',
];

const demoConditions = [
  { name: 'Gastroenteritis', probability: 72, color: C.warning },
  { name: 'Food Allergy', probability: 54, color: C.secondary },
  { name: 'Pancreatitis', probability: 31, color: C.accent },
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
      <div style={{ backgroundColor: C.background, minHeight: '100vh', paddingBottom: 32 }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ArrowLeft size={22} color={C.ink} />
          </button>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>Diagnosis Results</span>
        </div>

        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* severity banner */}
          <GradientCard colors={['#E8985E', '#D4726A']} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertTriangle size={28} color="#fff" />
              <div>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', display: 'block' }}>Moderate Concern</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Vet visit recommended within 48 hours</span>
              </div>
            </div>
          </GradientCard>

          {/* assessment */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Sparkles size={18} color={C.primary} />
              <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>AI Assessment</span>
            </div>
            <p style={{ fontSize: 14, color: C.inkSecondary, lineHeight: 1.6, margin: 0 }}>
              Based on the symptoms reported (vomiting, not eating), your pet may be experiencing
              gastrointestinal distress. The combination of these symptoms suggests a digestive issue
              that could range from mild food sensitivity to a more serious condition. Monitoring and
              a vet consultation are recommended.
            </p>
          </Card>

          {/* possible conditions */}
          <div>
            <SectionHeader title="Possible Conditions" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {demoConditions.map(c => (
                <Card key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* probability circle */}
                  <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
                    <svg width={56} height={56} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={28} cy={28} r={23} fill="none" stroke={C.surfaceSecondary} strokeWidth={5} />
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
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{c.probability}%</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, display: 'block' }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: C.inkTertiary, marginTop: 2, display: 'block' }}>Probability match</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* recommendations */}
          <div>
            <SectionHeader title="Recommendations" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {demoRecommendations.map((r, i) => (
                <Card key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle size={18} color={C.success} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.5, display: 'block' }}>{r.text}</span>
                    <div style={{ marginTop: 6 }}>
                      <StatusBadge
                        label={r.urgency}
                        color={r.urgency === 'High' ? C.error : r.urgency === 'Medium' ? C.warning : C.success}
                        small
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* emergency box */}
          <Card style={{ backgroundColor: C.errorPale, borderLeft: `4px solid ${C.error}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Phone size={18} color={C.error} />
              <span style={{ fontSize: 15, fontWeight: 700, color: C.error }}>Emergency Contact</span>
            </div>
            <p style={{ fontSize: 13, color: C.ink, lineHeight: 1.5, margin: 0 }}>
              If symptoms worsen rapidly or your pet shows signs of severe dehydration,
              contact your emergency vet immediately.
            </p>
          </Card>

          {/* points earned */}
          <Card style={{ backgroundColor: C.successPale, textAlign: 'center' as const }}>
            <span style={{ fontSize: 28, display: 'block', marginBottom: 4 }}>🎉</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.success, display: 'block' }}>+25 Points Earned!</span>
            <span style={{ fontSize: 13, color: C.inkSecondary, marginTop: 4, display: 'block' }}>For using AI Diagnosis</span>
          </Card>

          {/* action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 20 }}>
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
    <div style={{ backgroundColor: C.background, minHeight: '100vh', paddingBottom: 32 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ArrowLeft size={22} color={C.ink} />
          </button>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>AI Diagnosis</span>
        </div>
        <StatusBadge label="3/3 free" color={C.success} />
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* info banner */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10, padding: 16,
          backgroundColor: '#E8F0FE', borderRadius: 16, border: '1px solid #C4D7F5',
        }}>
          <Info size={18} color="#3B78D4" style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 13, color: '#3B78D4', lineHeight: 1.5 }}>
            AI diagnosis is not a substitute for professional veterinary advice.
            Always consult a vet for serious concerns.
          </span>
        </div>

        {/* pet selector */}
        <div>
          <SectionHeader title="Select Pet" />
          <div style={{ display: 'flex', gap: 12 }}>
            {pets.map(p => {
              const active = selectedPet === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPet(p.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '12px 16px', borderRadius: 16, border: 'none', cursor: 'pointer',
                    backgroundColor: active ? p.color + '18' : C.surface,
                    boxShadow: active ? `0 0 0 2px ${p.color}` : '0 2px 8px rgba(45,45,58,0.06)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{p.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: active ? p.color : C.ink }}>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* symptom chips */}
        <div>
          <SectionHeader title="Symptoms" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {symptomChips.map(s => {
              const active = selectedSymptoms.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  style={{
                    padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: active ? C.primary : C.surface,
                    color: active ? '#fff' : C.ink,
                    boxShadow: active ? `0 2px 8px ${C.primary}40` : '0 2px 8px rgba(45,45,58,0.06)',
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
              width: '100%', padding: 16, borderRadius: 16, border: `1px solid ${C.hairline}`,
              backgroundColor: C.surface, fontSize: 14, color: C.ink, resize: 'vertical',
              fontFamily: 'inherit', lineHeight: 1.5, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* photo upload */}
        <div>
          <SectionHeader title="Add Photo (Optional)" />
          <button
            style={{
              width: '100%', padding: '32px 20px', borderRadius: 16,
              border: `2px dashed ${C.hairline}`, backgroundColor: C.surface,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              cursor: 'pointer',
            }}
          >
            <Camera size={28} color={C.inkTertiary} />
            <span style={{ fontSize: 14, color: C.inkTertiary, fontWeight: 500 }}>Tap to upload a photo</span>
            <span style={{ fontSize: 12, color: C.inkTertiary }}>JPG, PNG up to 5MB</span>
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
          icon={<Sparkles size={20} color="#fff" />}
        />
      </div>
    </div>
  );
}
