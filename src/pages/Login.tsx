import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { PawPrint, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { useI18n } from '../i18n';

const googleProvider = new GoogleAuthProvider();

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
    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: email.split('@')[0] });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(mapFirebaseError(err.code));
      }
    } finally {
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

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: Spacing.xxl,
      backgroundColor: Colors.background,
    }}>
      {/* Logo */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
        {/* Email */}
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
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: Font.body,
              backgroundColor: 'transparent', color: Colors.ink,
            }}
          />
        </div>

        {/* Password */}
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

        {/* Confirm Password (sign up only) */}
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

        {/* Forgot password */}
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

        {/* Error / Success */}
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

        {/* Submit */}
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

      {/* Divider */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: Spacing.md,
        margin: `${Spacing.xl}px 0`,
      }}>
        <div style={{ flex: 1, height: 1, backgroundColor: Colors.hairline }} />
        <span style={{ fontSize: Font.sm, color: Colors.inkTertiary }}>{t.auth.orContinueWith}</span>
        <div style={{ flex: 1, height: 1, backgroundColor: Colors.hairline }} />
      </div>

      {/* Google Sign In */}
      <button onClick={handleGoogleSignIn} disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Spacing.md,
          padding: `${Spacing.md}px`, borderRadius: Radius.md,
          backgroundColor: Colors.surface, border: `1.5px solid ${Colors.hairline}`,
          fontSize: Font.body, fontWeight: Weight.semibold, color: Colors.ink,
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
        }}>
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {t.auth.googleSignIn}
      </button>

      {/* Toggle sign in/up */}
      <div style={{ textAlign: 'center', marginTop: Spacing.xl }}>
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
