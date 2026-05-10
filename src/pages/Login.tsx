import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { PawPrint, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useI18n } from '../i18n';

export function LoginPage() {
  const { t } = useI18n();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  function mapFirebaseError(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use': return t.auth.emailInUse;
      case 'auth/invalid-email': return t.auth.invalidEmail;
      case 'auth/weak-password': return t.auth.weakPassword;
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-credential': return t.auth.wrongCredentials;
      case 'auth/network-request-failed': return 'Network error. Check your connection.';
      case 'auth/too-many-requests': return 'Too many attempts. Try again later.';
      default: return code;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResetSent(false);

    if (isSignUp && password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }
    if (password.length < 6) {
      setError(t.auth.weakPassword);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      setError('Connection timeout. Check your internet and Firebase config.');
    }, 15000);

    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: email.split('@')[0] });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      clearTimeout(timeout);
    } catch (err: any) {
      clearTimeout(timeout);
      setError(mapFirebaseError(err.code));
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError(t.auth.invalidEmail);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      setError(mapFirebaseError(err.code));
    }
  }

  async function handleAppleSignIn() {
    setLoading(true);
    setError('');
    try {
      const { AppleSignIn, SignInScope } = await import('@capawesome/capacitor-apple-sign-in');
      await AppleSignIn.initialize({ clientId: 'com.ministeredesapp.waggly' });
      const result = await AppleSignIn.signIn({
        scopes: [SignInScope.Email, SignInScope.FullName],
      });
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: result.idToken,
        rawNonce: result.authorizationCode,
      });
      await signInWithCredential(auth, credential);
    } catch (err: any) {
      if (err?.code !== '1001' && !err?.message?.includes('cancel')) {
        setError(err?.message || 'Apple Sign In failed.');
      }
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: Spacing.xxl,
      backgroundColor: Colors.background,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: `linear-gradient(135deg, ${Colors.primary}, ${Colors.primaryLight})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 32px rgba(91,94,166,0.3)',
        }}>
          <PawPrint size={40} color="#fff" />
        </div>
        <h1 style={{ fontSize: Font.title1, fontWeight: Weight.bold, color: Colors.ink }}>
          {t.auth.welcome}
        </h1>
        <p style={{ fontSize: Font.body, color: Colors.inkSecondary, marginTop: Spacing.xs }}>
          {t.auth.welcomeDesc}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: Spacing.sm,
          backgroundColor: Colors.surface, borderRadius: Radius.md,
          padding: `${Spacing.md}px ${Spacing.lg}px`,
          border: `1.5px solid ${Colors.hairline}`,
        }}>
          <Mail size={20} color={Colors.inkTertiary} />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t.auth.emailPlaceholder}
            required
            autoCapitalize="none"
            autoCorrect="off"
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: Font.body,
              backgroundColor: 'transparent', color: Colors.ink,
            }}
          />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: Spacing.sm,
          backgroundColor: Colors.surface, borderRadius: Radius.md,
          padding: `${Spacing.md}px ${Spacing.lg}px`,
          border: `1.5px solid ${Colors.hairline}`,
        }}>
          <Lock size={20} color={Colors.inkTertiary} />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t.auth.passwordPlaceholder}
            required
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: Font.body,
              backgroundColor: 'transparent', color: Colors.ink,
            }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {showPassword ? <EyeOff size={20} color={Colors.inkTertiary} /> : <Eye size={20} color={Colors.inkTertiary} />}
          </button>
        </div>

        {isSignUp && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: Spacing.sm,
            backgroundColor: Colors.surface, borderRadius: Radius.md,
            padding: `${Spacing.md}px ${Spacing.lg}px`,
            border: `1.5px solid ${Colors.hairline}`,
          }}>
            <Lock size={20} color={Colors.inkTertiary} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder={t.auth.confirmPassword}
              required
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: Font.body,
                backgroundColor: 'transparent', color: Colors.ink,
              }}
            />
          </div>
        )}

        {!isSignUp && (
          <button type="button" onClick={handleForgotPassword}
            style={{
              alignSelf: 'flex-end', color: Colors.primary,
              fontSize: Font.sm, fontWeight: Weight.semibold,
              background: 'none', border: 'none', cursor: 'pointer',
            }}>
            {t.auth.forgotPassword}
          </button>
        )}

        {error && (
          <div style={{
            padding: Spacing.md, borderRadius: Radius.sm,
            backgroundColor: Colors.errorPale, color: Colors.error,
            fontSize: Font.sm, fontWeight: Weight.semibold,
          }}>
            {error}
          </div>
        )}
        {resetSent && (
          <div style={{
            padding: Spacing.md, borderRadius: Radius.sm,
            backgroundColor: Colors.successPale, color: Colors.success,
            fontSize: Font.sm, fontWeight: Weight.semibold,
          }}>
            {t.auth.resetPasswordSent}
          </div>
        )}

        <button type="submit" disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
            padding: `${Spacing.lg}px`, borderRadius: Radius.md,
            background: `linear-gradient(135deg, ${Colors.primary}, ${Colors.primaryLight})`,
            color: '#fff', fontSize: Font.bodyLarge, fontWeight: Weight.bold,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 16px rgba(91,94,166,0.3)',
          }}>
          {loading ? <div className="spinner" /> : (
            <>
              {isSignUp ? t.auth.signUp : t.auth.signIn}
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.xl }}>
        <div style={{ flex: 1, height: 1, backgroundColor: Colors.hairline }} />
        <span style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>{t.auth.orContinueWith}</span>
        <div style={{ flex: 1, height: 1, backgroundColor: Colors.hairline }} />
      </div>

      <button onClick={handleAppleSignIn} disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
          width: '100%', padding: `${Spacing.lg}px`, marginTop: Spacing.md,
          borderRadius: Radius.md, backgroundColor: '#000', color: '#fff',
          fontSize: Font.bodyLarge, fontWeight: Weight.bold,
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        {t.auth.appleSignIn}
      </button>

      <div style={{ textAlign: 'center', marginTop: Spacing.lg }}>
        <span style={{ fontSize: Font.sm, color: Colors.inkSecondary }}>
          {isSignUp ? t.auth.hasAccount : t.auth.noAccount}{' '}
        </span>
        <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
          style={{
            fontSize: Font.sm, fontWeight: Weight.bold, color: Colors.primary,
            background: 'none', border: 'none', cursor: 'pointer',
          }}>
          {isSignUp ? t.auth.signIn : t.auth.signUp}
        </button>
      </div>
    </div>
  );
}
