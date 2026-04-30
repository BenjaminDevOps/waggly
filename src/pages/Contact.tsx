import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Colors } from '../theme/colors';
import { Spacing, Radius, Font, Weight } from '../theme/spacing';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const TOPICS = [
  { id: 'bug', label: { en: 'Bug Report', fr: 'Signaler un bug', es: 'Reportar un error' } },
  { id: 'feature', label: { en: 'Feature Request', fr: 'Suggestion', es: 'Sugerencia' } },
  { id: 'account', label: { en: 'Account Issue', fr: 'Problème de compte', es: 'Problema de cuenta' } },
  { id: 'other', label: { en: 'Other', fr: 'Autre', es: 'Otro' } },
];

export function ContactPage() {
  const navigate = useNavigate();
  const { firebaseUser, user } = useAuth();
  const { locale } = useI18n();
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const labels = locale === 'fr'
    ? { title: 'Aide & Contact', topicLabel: 'Sujet', messagePlaceholder: 'Décrivez votre problème ou suggestion...', send: 'Envoyer', successTitle: 'Message envoyé !', successDesc: 'Nous reviendrons vers vous rapidement.', back: 'Retour', selectTopic: 'Sélectionnez un sujet' }
    : locale === 'es'
    ? { title: 'Ayuda y Contacto', topicLabel: 'Tema', messagePlaceholder: 'Describa su problema o sugerencia...', send: 'Enviar', successTitle: '¡Mensaje enviado!', successDesc: 'Le responderemos pronto.', back: 'Volver', selectTopic: 'Seleccione un tema' }
    : { title: 'Help & Contact', topicLabel: 'Topic', messagePlaceholder: 'Describe your issue or suggestion...', send: 'Send', successTitle: 'Message sent!', successDesc: 'We\'ll get back to you shortly.', back: 'Go back', selectTopic: 'Select a topic' };

  async function handleSend() {
    if (!topic || !message.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        userId: firebaseUser?.uid ?? null,
        email: firebaseUser?.email ?? null,
        displayName: user?.displayName ?? null,
        topic,
        message: message.trim(),
        locale,
        createdAt: new Date().toISOString(),
        status: 'new',
      });
      setSent(true);
    } catch (e) {
      console.error('Error sending contact message:', e);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="fade-in" style={{ backgroundColor: Colors.background, minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, padding: `${Spacing.lg}px ${Spacing.xl}px` }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: Spacing.xs }}>
            <ArrowLeft size={22} color={Colors.ink} />
          </button>
          <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{labels.title}</span>
        </div>
        <div style={{ padding: `80px ${Spacing.xl}px`, textAlign: 'center' }}>
          <CheckCircle size={64} color={Colors.success} style={{ margin: '0 auto' }} />
          <h2 style={{ fontSize: Font.title2, fontWeight: Weight.bold, color: Colors.ink, marginTop: 20 }}>{labels.successTitle}</h2>
          <p style={{ fontSize: Font.body, color: Colors.inkSecondary, marginTop: 8, lineHeight: 1.5 }}>{labels.successDesc}</p>
          <Button label={labels.back} onPress={() => navigate(-1)} variant="primary" style={{ marginTop: 32 }} />
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
        <span style={{ fontSize: Font.title3, fontWeight: Weight.bold, color: Colors.ink }}>{labels.title}</span>
      </div>

      <div style={{ padding: `0 ${Spacing.xl}px`, display: 'flex', flexDirection: 'column', gap: Spacing.xl }}>
        <Card>
          <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>
            {labels.topicLabel}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.sm }}>
            {TOPICS.map(t => {
              const active = topic === t.id;
              const loc = locale as 'en' | 'fr' | 'es';
              return (
                <button
                  key={t.id}
                  onClick={() => setTopic(t.id)}
                  style={{
                    padding: `${Spacing.sm}px ${Spacing.lg}px`,
                    borderRadius: Radius.pill,
                    border: `1.5px solid ${active ? Colors.primary : Colors.hairline}`,
                    backgroundColor: active ? Colors.primaryPale : Colors.surfaceSecondary,
                    color: active ? Colors.primary : Colors.ink,
                    fontSize: Font.sm, fontWeight: active ? Weight.bold : Weight.regular,
                    cursor: 'pointer',
                  }}
                >
                  {t.label[loc] ?? t.label.en}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: Font.sm, fontWeight: Weight.semibold, color: Colors.inkSecondary, marginBottom: Spacing.sm }}>
            Message
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={labels.messagePlaceholder}
            rows={6}
            maxLength={2000}
            style={{
              width: '100%', padding: Spacing.md,
              borderRadius: Radius.md, border: `1.5px solid ${Colors.hairline}`,
              fontSize: Font.body, color: Colors.ink,
              backgroundColor: Colors.surfaceSecondary, outline: 'none',
              resize: 'none', fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ textAlign: 'right', fontSize: Font.xs, color: Colors.inkTertiary, marginTop: 4 }}>
            {message.length}/2000
          </div>
        </Card>

        <Button
          label={labels.send}
          onPress={handleSend}
          variant="primary"
          size="large"
          loading={sending}
          icon={<Send size={18} color="#fff" />}
        />
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
