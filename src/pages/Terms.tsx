import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Colors } from '../theme/colors';
import { Spacing, Font, Weight } from '../theme/spacing';

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>Terms of Service</span>
      </div>
      <div style={{ padding: `0 ${Spacing.xl}px ${Spacing.xxl}px`, fontSize: Font.body, color: Colors.inkSecondary, lineHeight: 1.7 }}>
        <p style={{ color: Colors.inkTertiary, fontSize: Font.sm }}>Last updated: April 2026</p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>1. Acceptance of Terms</h2>
        <p>
          By downloading, installing, or using the Waggly mobile application, you agree to be bound by these
          Terms of Service. If you do not agree to these terms, do not use the app.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>2. Description of Service</h2>
        <p>
          Waggly is a pet health companion app that provides pet profile management, health record tracking,
          AI-powered symptom analysis, walk tracking, and gamification features.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>3. AI Diagnosis Disclaimer</h2>
        <p style={{ fontWeight: Weight.semibold, color: Colors.error }}>
          IMPORTANT: The AI diagnosis feature is for informational purposes only and is NOT a substitute for
          professional veterinary advice, diagnosis, or treatment. Always seek the advice of a qualified
          veterinarian for any questions regarding your pet's health.
        </p>
        <p>
          Waggly and its AI-powered analysis shall not be held responsible for any decisions made based on
          the information provided by the app. If your pet is experiencing a medical emergency, contact your
          veterinarian or emergency animal hospital immediately.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>4. Subscriptions & Payments</h2>
        <p><strong style={{ color: Colors.ink }}>Free Tier:</strong> Includes basic features with a limit of 3 AI diagnoses.</p>
        <p><strong style={{ color: Colors.ink }}>Premium Subscription:</strong> Unlocks unlimited AI diagnoses, priority responses,
        health reports, exclusive badges, and an ad-free experience.</p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Payment is charged to your Apple ID account at confirmation of purchase</li>
          <li>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period</li>
          <li>Your account will be charged for renewal within 24 hours prior to the end of the current period</li>
          <li>You can manage and cancel subscriptions in your device's Settings &gt; Apple ID &gt; Subscriptions</li>
          <li>No refunds for partial subscription periods</li>
        </ul>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>5. User Content</h2>
        <p>
          You retain ownership of all content you submit to Waggly (pet data, photos, health records).
          By using the app, you grant us a limited license to store and process this content solely
          for providing the service.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>6. Prohibited Use</h2>
        <p>You agree not to:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Use the app for any unlawful purpose</li>
          <li>Attempt to reverse engineer or modify the app</li>
          <li>Interfere with the app's security or proper functioning</li>
          <li>Use automated systems to access the app</li>
          <li>Share your account with others</li>
        </ul>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Waggly shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages resulting from your use of the app, including but not
          limited to any harm to your pet resulting from reliance on AI diagnosis information.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>8. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to Waggly at any time for violation
          of these terms. Upon termination, your right to use the app ceases immediately.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>9. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the app after
          changes constitutes acceptance of the new terms.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>10. Contact</h2>
        <p>
          For questions about these Terms of Service, contact us at:
          <br />
          <strong style={{ color: Colors.ink }}>legal@waggly.app</strong>
        </p>
      </div>
    </div>
  );
}
