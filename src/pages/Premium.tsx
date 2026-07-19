import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Diamond, Check, Sparkles, Shield, Crown, Zap, Star, RefreshCw,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import { PREMIUM_PLANS, purchasePremium, restorePurchases, getPlatform, fetchProductPricing, type LiveProductPricing } from '../services/purchaseService';

const FEATURE_ICONS = [Sparkles, Zap, Shield, Crown, Star];

export function PremiumPage() {
  const navigate = useNavigate();
  const { firebaseUser, user } = useAuth();
  const { t } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState(PREMIUM_PLANS[1].id);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState('');
  const [livePricing, setLivePricing] = useState<Record<string, LiveProductPricing> | null>(null);

  // Real, localized StoreKit / Play Billing prices — falls back to the static
  // catalog below when unavailable (web preview, offline, products not yet
  // configured in App Store Connect / Play Console).
  useEffect(() => {
    fetchProductPricing().then(setLivePricing);
  }, []);

  const features = [
    { title: t.premiumPage.unlimitedDiagnoses, desc: t.premiumPage.unlimitedDiagnosesDesc },
    { title: t.premiumPage.priorityAI, desc: t.premiumPage.priorityAIDesc },
    { title: t.premiumPage.healthReports, desc: t.premiumPage.healthReportsDesc },
    { title: t.premiumPage.exclusiveBadges, desc: t.premiumPage.exclusiveBadgesDesc },
    { title: t.premiumPage.adFree, desc: t.premiumPage.adFreeDesc },
  ];

  const planLabels: Record<string, { name: string; period: string; savings?: string }> = {
    [PREMIUM_PLANS[0].id]: { name: t.premiumPage.monthly, period: t.premiumPage.perMonth },
    [PREMIUM_PLANS[1].id]: { name: t.premiumPage.yearly, period: t.premiumPage.perYear, savings: t.premiumPage.savePct },
  };

  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handlePurchase = async () => {
    if (!firebaseUser || loading) return;
    setLoading(true);
    setMessage('');
    setMessageType('');
    try {
      const result = await purchasePremium(selectedPlan, firebaseUser.uid);
      setMessage(result.message);
      setMessageType(result.success ? 'success' : 'error');
      if (result.success) setTimeout(() => navigate(-1), 1500);
    } catch (e: any) {
      setMessage(e?.message || 'An unexpected error occurred.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!firebaseUser || restoring) return;
    setRestoring(true);
    setMessage('');
    setMessageType('');
    try {
      const result = await restorePurchases(firebaseUser.uid);
      setMessage(result.message);
      setMessageType(result.success ? 'success' : 'error');
    } catch (e: any) {
      setMessage(e?.message || 'An unexpected error occurred.');
      setMessageType('error');
    } finally {
      setRestoring(false);
    }
  };

  if (user?.isPremium) {
    return (
      <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
            <ArrowLeft size={22} color={Colors.ink} />
          </button>
          <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.common.premium}</span>
        </div>
        <div style={{ padding: `60px ${Spacing.xl}px`, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, margin: '0 auto', background: `linear-gradient(135deg, ${Colors.secondary}, ${Colors.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Crown size={40} color={Colors.inkInverse} />
          </div>
          <h2 style={{ fontSize: Font.title2, fontWeight: Weight.bold, color: Colors.ink, marginTop: 20 }}>{t.premiumPage.youArePremium}</h2>
          <p style={{ fontSize: Font.body, color: Colors.inkSecondary, marginTop: 8, lineHeight: 1.5 }}>{t.premiumPage.enjoyPremium}</p>
          <Button label={t.premiumPage.backToApp} onPress={() => navigate(-1)} variant="primary" style={{ marginTop: 32 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{t.premiumPage.title}</span>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
        <GradientCard colors={[Colors.secondary, Colors.accent]} style={{ textAlign: 'center', padding: `${Spacing.xxl}px ${Spacing.xl}px` }}>
          <Diamond size={48} color={Colors.inkInverse} style={{ margin: '0 auto' }} />
          <h1 style={{ fontSize: Font.title1, fontWeight: Weight.bold, color: Colors.inkInverse, marginTop: 16, marginBottom: 8 }}>{t.premiumPage.unlockPremium}</h1>
          <p style={{ fontSize: Font.body, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 }}>{t.premiumPage.unlockDesc}</p>
        </GradientCard>

        <div>
          {features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
            return (
              <div key={feature.title} style={{
                display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.md}px 0`,
                borderBottom: i < features.length - 1 ? `1px solid ${Colors.hairlineLight}` : 'none',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={Colors.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink }}>{feature.title}</div>
                  <div style={{ fontSize: Font.sm, color: Colors.inkSecondary, marginTop: 2 }}>{feature.desc}</div>
                </div>
                <Check size={18} color={Colors.success} />
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: Spacing.md }}>
          {PREMIUM_PLANS.map(plan => {
            const active = selectedPlan === plan.id;
            const labels = planLabels[plan.id];
            return (
              <button key={plan.id} className="btn-press" onClick={() => setSelectedPlan(plan.id)} style={{
                flex: 1, padding: Spacing.lg, borderRadius: Radius.lg, cursor: 'pointer',
                backgroundColor: active ? Colors.primaryPale : Colors.surface,
                border: `2px solid ${active ? Colors.primary : Colors.hairline}`,
                position: 'relative', textAlign: 'center',
              }}>
                {plan.recommended && (
                  <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', backgroundColor: Colors.primary, color: Colors.inkInverse, fontSize: 10, fontWeight: Weight.bold, padding: '2px 10px', borderRadius: 10, whiteSpace: 'nowrap' }}>
                    {t.premiumPage.bestValue}
                  </span>
                )}
                <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary }}>{labels?.name}</div>
                <div style={{ fontSize: Font.title2, fontWeight: Weight.bold, color: active ? Colors.primary : Colors.ink, marginTop: 4 }}>
                  {livePricing?.[plan.id]?.priceString ?? plan.price}
                </div>
                <div style={{ fontSize: Font.xs, color: Colors.inkTertiary }}>{labels?.period}</div>
                {labels?.savings && (
                  <div style={{ fontSize: Font.xs, fontWeight: Weight.bold, color: Colors.success, marginTop: 6, backgroundColor: Colors.successPale, borderRadius: 8, padding: '2px 8px', display: 'inline-block' }}>
                    {labels.savings}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {message && (
          <Card style={{ backgroundColor: messageType === 'success' ? Colors.successPale : Colors.secondaryPale, textAlign: 'center' as const }}>
            <span style={{ fontSize: Font.body, fontWeight: Weight.semibold, color: messageType === 'success' ? Colors.success : Colors.ink }}>{message}</span>
          </Card>
        )}

        <Button
          label={loading ? t.premiumPage.processing : t.premiumPage.subscribeNow}
          onPress={handlePurchase}
          variant="primary"
          size="large"
          loading={loading}
          icon={<Diamond size={20} color={Colors.inkInverse} />}
        />

        <button className="btn-press" onClick={handleRestore} disabled={restoring} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: Spacing.md, color: Colors.primary, fontSize: Font.body, fontWeight: Weight.semibold, cursor: 'pointer', background: 'none', border: 'none' }}>
          <RefreshCw size={16} color={Colors.primary} className={restoring ? 'spin' : ''} />
          {restoring ? t.common.loading : t.premiumPage.restorePurchases}
        </button>

        <div style={{ textAlign: 'center', paddingBottom: Spacing.xxl }}>
          <p style={{ fontSize: Font.xs, color: Colors.inkTertiary, lineHeight: 1.6, margin: 0 }}>{t.premiumPage.paymentDisclaimer}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: Spacing.lg, marginTop: Spacing.md }}>
            <button onClick={() => navigate('/privacy')} style={{ fontSize: Font.xs, color: Colors.primary, background: 'none', border: 'none', cursor: 'pointer' }}>{t.profile.privacyPolicy}</button>
            <button onClick={() => navigate('/terms')} style={{ fontSize: Font.xs, color: Colors.primary, background: 'none', border: 'none', cursor: 'pointer' }}>{t.profile.termsOfService}</button>
            <button onClick={async () => {
              const eulaUrl = getPlatform() === 'android'
                ? 'https://play.google.com/about/play-terms/'
                : 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
              try { const { Browser } = await import('@capacitor/browser'); await Browser.open({ url: eulaUrl }); }
              catch { window.open(eulaUrl, '_blank'); }
            }} style={{ fontSize: Font.xs, color: Colors.inkTertiary, background: 'none', border: 'none', cursor: 'pointer' }}>EULA</button>
          </div>
        </div>
      </div>
    </div>
  );
}
