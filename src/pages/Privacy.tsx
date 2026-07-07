import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Colors } from '../theme/colors';
import { Spacing, Font, Weight } from '../theme/spacing';

export function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
          <ArrowLeft size={22} color={Colors.ink} />
        </button>
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>Privacy Policy</span>
      </div>
      <div style={{ padding: `0 ${Spacing.xl}px ${Spacing.xxl}px`, fontSize: Font.body, color: Colors.inkSecondary, lineHeight: 1.7 }}>
        <p style={{ color: Colors.inkTertiary, fontSize: Font.sm }}>Last updated: April 2026</p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>1. Introduction</h2>
        <p>
          Waggly ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains
          how we collect, use, and safeguard your information when you use the Waggly mobile application.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>2. Information We Collect</h2>
        <p><strong style={{ color: Colors.ink }}>Account Information:</strong> When you use Waggly, we create an anonymous account.
        No email or password is required. If you sign in with Apple, we store your Apple-provided identifier.</p>
        <p><strong style={{ color: Colors.ink }}>Pet Data:</strong> Pet profiles, health records, vaccination history, and other
        pet-related information you voluntarily enter.</p>
        <p><strong style={{ color: Colors.ink }}>AI Diagnosis Data:</strong> Symptoms and descriptions you submit for AI analysis
        are sent to Google Gemini API for processing. We do not store the raw AI responses long-term.</p>
        <p><strong style={{ color: Colors.ink }}>Care Checklist Data:</strong> Daily care task completion, stored locally on your device.</p>
        <p><strong style={{ color: Colors.ink }}>Usage Data:</strong> General analytics about app usage patterns to improve our service.</p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>3. How We Use Your Information</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>Provide and maintain the Waggly NAC app services</li>
          <li>Process AI-powered symptom analysis via Google Gemini</li>
          <li>Track your pet's health history and care activity</li>
          <li>Manage gamification features (points, badges, streaks)</li>
          <li>Process subscriptions and in-app purchases via Apple</li>
          <li>Improve and optimize the app experience</li>
        </ul>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>4. Data Storage & Security</h2>
        <p>
          Your data is stored securely using Google Firebase (Firestore) with encryption at rest and in transit.
          We implement industry-standard security measures to protect your information.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>5. Third-Party Services</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li><strong style={{ color: Colors.ink }}>Google Firebase:</strong> Authentication, database, and storage</li>
          <li><strong style={{ color: Colors.ink }}>Google Gemini AI:</strong> Pet symptom analysis processing</li>
          <li><strong style={{ color: Colors.ink }}>Apple StoreKit:</strong> Subscription and payment processing</li>
        </ul>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>6. Data Retention</h2>
        <p>
          We retain your data as long as your account is active. You can request deletion of your data
          at any time by contacting us. Upon deletion, all pet data, health records, and account
          information will be permanently removed within 30 days.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>7. Children's Privacy</h2>
        <p>
          Waggly is not directed at children under 13. We do not knowingly collect personal information
          from children under 13 years of age.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>8. Your Rights</h2>
        <p>You have the right to:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your pet health data</li>
          <li>Opt out of analytics tracking</li>
        </ul>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes
          by updating the "Last updated" date above.
        </p>

        <h2 style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink, marginTop: 24 }}>10. Contact Us</h2>
        <p>
          For questions about this Privacy Policy or your data, contact us at:
          <br />
          <strong style={{ color: Colors.ink }}>privacy@waggly.app</strong>
        </p>
      </div>
    </div>
  );
}
