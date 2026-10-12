/*
 * Widget d'accueil IA - à intégrer sur le site de la clinique :
 *   <script src="https://VOTRE-SERVEUR/widget.js" data-clinic="demo" defer></script>
 */
(function () {
  'use strict';
  var script = document.currentScript;
  if (!script) return;
  var clinicId = script.getAttribute('data-clinic');
  var apiBase = new URL(script.src).origin;
  var storageKey = 'vet-assistant:' + clinicId;

  var state = { clinic: null, messages: [], sessionId: null, open: false, busy: false };

  function load() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
      if (saved) {
        state.messages = saved.messages || [];
        state.sessionId = saved.sessionId;
      }
    } catch (e) { /* stockage indisponible : on continue sans */ }
    if (!state.sessionId) {
      state.sessionId = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
    }
  }

  function save() {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ messages: state.messages.slice(-30), sessionId: state.sessionId }));
    } catch (e) { /* ignore */ }
  }

  var host = document.createElement('div');
  host.style.cssText = 'position:fixed;z-index:2147483000;bottom:0;right:0;';
  var root = host.attachShadow({ mode: 'open' });

  function css(color) {
    return '' +
      ':host{all:initial}' +
      '*{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
      '.bubble{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;border:0;background:' + color + ';color:#fff;font-size:28px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);transition:transform .15s}' +
      '.bubble:hover{transform:scale(1.06)}' +
      '.teaser{position:fixed;bottom:90px;right:20px;max-width:240px;background:#fff;color:#1f2937;padding:10px 14px;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.15);font-size:14px;cursor:pointer}' +
      '.panel{position:fixed;bottom:92px;right:20px;width:370px;height:560px;max-height:calc(100vh - 110px);background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden}' +
      '@media (max-width:480px){.panel{inset:0;width:100%;height:100%;max-height:none;border-radius:0}.bubble.is-open{display:none}}' +
      '.head{background:' + color + ';color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}' +
      '.head .t{flex:1}.head b{display:block;font-size:15px}.head small{opacity:.85;font-size:12px}' +
      '.close{background:none;border:0;color:#fff;font-size:22px;cursor:pointer;line-height:1}' +
      '.msgs{flex:1;overflow-y:auto;padding:16px;background:#f7f8fa;display:flex;flex-direction:column;gap:10px}' +
      '.m{max-width:85%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}' +
      '.m.assistant{background:#fff;color:#1f2937;border:1px solid #e5e7eb;align-self:flex-start;border-bottom-left-radius:4px}' +
      '.m.user{background:' + color + ';color:#fff;align-self:flex-end;border-bottom-right-radius:4px}' +
      '.m.emergency{background:#fef2f2;border-color:#fca5a5;color:#991b1b}' +
      '.m.ok{background:#ecfdf5;border-color:#6ee7b7;color:#065f46}' +
      '.call{display:inline-block;margin-top:8px;background:#dc2626;color:#fff;text-decoration:none;padding:8px 12px;border-radius:8px;font-weight:600}' +
      '.typing{align-self:flex-start;color:#6b7280;font-size:13px;padding:4px 6px}' +
      '.chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px 0;background:#fff}' +
      '.chip{border:1px solid ' + color + ';color:' + color + ';background:#fff;border-radius:999px;padding:6px 10px;font-size:13px;cursor:pointer}' +
      '.chip:hover{background:' + color + ';color:#fff}' +
      'form{display:flex;gap:8px;padding:10px 12px;background:#fff;border-top:1px solid #eee}' +
      'textarea{flex:1;resize:none;border:1px solid #d1d5db;border-radius:10px;padding:9px 11px;font-size:14px;height:42px;max-height:110px;outline:none}' +
      'textarea:focus{border-color:' + color + '}' +
      '.send{border:0;background:' + color + ';color:#fff;border-radius:10px;padding:0 14px;font-size:15px;cursor:pointer}' +
      '.send:disabled{opacity:.5;cursor:default}' +
      '.legal{font-size:11px;color:#9ca3af;text-align:center;padding:0 12px 8px;background:#fff}';
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var ui = {};

  function build() {
    var c = state.clinic;
    var style = el('style');
    style.textContent = css(c.primaryColor);
    root.appendChild(style);

    ui.bubble = el('button', 'bubble', '🐾');
    ui.bubble.setAttribute('aria-label', 'Ouvrir l\'assistant de ' + c.name);
    ui.bubble.onclick = toggle;

    ui.teaser = el('div', 'teaser', '👋 Une question ? Je réponds 24h/24.');
    ui.teaser.onclick = toggle;

    ui.panel = el('div', 'panel');
    ui.panel.style.display = 'none';
    ui.panel.setAttribute('role', 'dialog');
    ui.panel.setAttribute('aria-label', 'Assistant ' + c.name);

    var head = el('div', 'head');
    var t = el('div', 't');
    t.appendChild(el('b', null, c.assistantName + ' · ' + c.name));
    t.appendChild(el('small', null, 'Assistant virtuel IA · répond 24h/24'));
    var close = el('button', 'close', '×');
    close.setAttribute('aria-label', 'Fermer');
    close.onclick = toggle;
    head.appendChild(el('span', null, '🐾'));
    head.appendChild(t);
    head.appendChild(close);

    ui.msgs = el('div', 'msgs');
    ui.msgs.setAttribute('aria-live', 'polite');

    ui.chips = el('div', 'chips');
    ['Vos horaires ?', 'Tarif d\'un vaccin ?', 'Prendre rendez-vous', 'C\'est une urgence'].forEach(function (label) {
      var chip = el('button', 'chip', label);
      chip.type = 'button';
      chip.onclick = function () { send(label); };
      ui.chips.appendChild(chip);
    });

    var form = el('form');
    ui.input = el('textarea');
    ui.input.placeholder = 'Écrivez votre message…';
    ui.input.maxLength = 1000;
    ui.input.setAttribute('aria-label', 'Votre message');
    ui.input.onkeydown = function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
    };
    ui.send = el('button', 'send', '➤');
    ui.send.type = 'submit';
    ui.send.setAttribute('aria-label', 'Envoyer');
    form.onsubmit = function (e) { e.preventDefault(); send(ui.input.value); };
    form.appendChild(ui.input);
    form.appendChild(ui.send);

    var legal = el('div', 'legal', 'Je suis une IA et ne remplace pas un vétérinaire. Urgence : ' + c.emergencyPhone);

    ui.panel.appendChild(head);
    ui.panel.appendChild(ui.msgs);
    ui.panel.appendChild(ui.chips);
    ui.panel.appendChild(form);
    ui.panel.appendChild(legal);

    root.appendChild(ui.panel);
    root.appendChild(ui.teaser);
    root.appendChild(ui.bubble);
    document.body.appendChild(host);

    if (!state.messages.length) {
      state.messages.push({
        role: 'assistant',
        text: 'Bonjour 👋 Je suis ' + c.assistantName + ', l\'assistant virtuel de la ' + c.name +
          '. Je peux vous renseigner sur nos horaires, nos tarifs et nos services, ou transmettre une demande de rendez-vous.',
      });
    }
    render();
  }

  function toggle() {
    state.open = !state.open;
    ui.panel.style.display = state.open ? 'flex' : 'none';
    ui.teaser.style.display = 'none';
    ui.bubble.textContent = state.open ? '×' : '🐾';
    ui.bubble.classList.toggle('is-open', state.open);
    if (state.open) { ui.input.focus(); scroll(); }
  }

  function scroll() { ui.msgs.scrollTop = ui.msgs.scrollHeight; }

  function render() {
    ui.msgs.textContent = '';
    state.messages.forEach(function (m) {
      var cls = 'm ' + m.role + (m.emergency ? ' emergency' : '') + (m.appointmentSaved ? ' ok' : '');
      var bubble = el('div', cls, m.text);
      if (m.emergency) {
        var call = el('a', 'call', '📞 Appeler ' + state.clinic.phone);
        call.href = 'tel:' + state.clinic.phone.replace(/\s/g, '');
        bubble.appendChild(document.createElement('br'));
        bubble.appendChild(call);
      }
      ui.msgs.appendChild(bubble);
    });
    if (state.busy) ui.msgs.appendChild(el('div', 'typing', state.clinic.assistantName + ' écrit…'));
    ui.chips.style.display = state.messages.length > 1 ? 'none' : 'flex';
    ui.send.disabled = state.busy;
    scroll();
  }

  function send(text) {
    text = (text || '').trim();
    if (!text || state.busy) return;
    ui.input.value = '';
    state.messages.push({ role: 'user', text: text });
    state.busy = true;
    render();

    fetch(apiBase + '/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        clinicId: clinicId,
        sessionId: state.sessionId,
        messages: state.messages.map(function (m) { return { role: m.role, text: m.text }; }),
      }),
    })
      .then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) throw new Error(data.error || 'Erreur');
          return data;
        });
      })
      .then(function (data) {
        state.messages.push({ role: 'assistant', text: data.reply, emergency: data.emergency, appointmentSaved: data.appointmentSaved });
      })
      .catch(function (err) {
        state.messages.push({
          role: 'assistant',
          text: (err && err.message && err.message !== 'Failed to fetch' ? err.message + '\n' : '') +
            'Je ne parviens pas à répondre pour le moment. Appelez la clinique au ' + state.clinic.phone + '.',
        });
      })
      .then(function () {
        state.busy = false;
        save();
        render();
      });
  }

  function start() {
    load();
    fetch(apiBase + '/api/clinics/' + encodeURIComponent(clinicId))
      .then(function (r) { if (!r.ok) throw new Error('clinique introuvable'); return r.json(); })
      .then(function (clinic) { state.clinic = clinic; build(); })
      .catch(function (e) { console.warn('[vet-assistant] ' + e.message); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
