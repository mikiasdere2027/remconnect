// RemConnect — Apply (step 1: account, step 2: application) and Sign in.
// Front-end prototype: nothing is uploaded, sent or stored.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const forms = { signup: $('#signup'), login: $('#login'), step2: $('#step2') };
  const done = $('#done');
  const SIDE = {
    signup: ['Start your path to a <span>global team.</span>', 'We train you, certify you, and match you with international teams — free to apply, free to train.', 'Apply — RemConnect'],
    login: ['Pick up <span>where you left off.</span>', 'Check your application, continue training, or open your agent portal.', 'Sign in — RemConnect'],
    step2: ['Almost <span>there.</span>', 'Five quick parts and your application is in. Here’s what happens after you submit.', 'Your application — RemConnect']
  };
  const app = { email: '', resume: null, noResume: false, voice: null, voiceLater: false, answers: {} };

  function show(screen, push) {
    const s = ['login', 'step2'].includes(screen) ? screen : 'signup';
    Object.entries(forms).forEach(([k, f]) => { f.hidden = k !== s; });
    done.hidden = true;
    // Sign in: one centred card. Create account + application: split layout with the info panel.
    $('.ap').classList.toggle('solo', s === 'login');
    $('#sideTitle').innerHTML = SIDE[s][0]; $('#sideText').textContent = SIDE[s][1]; document.title = SIDE[s][2];
    $('#nextSteps').hidden = s !== 'step2'; $('#perks').hidden = s === 'step2';
    if (push) history.pushState({ s }, '', '?screen=' + s);
    if (s === 'step2') go(0, true);
    else setTimeout(() => forms[s].querySelector('input')?.focus(), 30);
  }
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); show(g.dataset.go, true); }
  });
  addEventListener('popstate', () => show(new URLSearchParams(location.search).get('screen')));

  // show / hide password
  $$('.input .eye').forEach(b => b.addEventListener('click', () => {
    const inp = b.parentElement.querySelector('input'), vis = inp.type === 'password';
    inp.type = vis ? 'text' : 'password';
    b.setAttribute('aria-label', vis ? 'Hide password' : 'Show password');
    b.querySelector('use').setAttribute('href', vis ? '#i-eyeoff' : '#i-eye');
  }));

  const emailOk = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
  const setMsg = (form, f, text, ok) => {
    const box = form.querySelector(`[data-f="${f}"]`);
    box.classList.toggle('err', !!text); box.classList.toggle('ok', !text && !!ok);
    box.querySelector('.msg').textContent = text || '';
  };
  const busy = (btn, ms, fn) => { btn.setAttribute('aria-busy', 'true'); setTimeout(() => { btn.removeAttribute('aria-busy'); fn(); }, ms); };
  const showDone = (title, html) => { Object.values(forms).forEach(f => { f.hidden = true; }); done.hidden = false; $('#doneTitle').textContent = title; $('#doneText').innerHTML = html; };

  /* ---------------- step 1: create account ---------------- */
  const pw = $('#su-pw'), pw2 = $('#su-pw2'), meter = $('.strength'), LBL = ['—', 'Weak', 'Fair', 'Good', 'Strong'];
  function strength(v) {
    let s = 0;
    if (v.length >= 8) s++;
    if (/\d/.test(v)) s++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
    return v ? Math.max(1, s) : 0;
  }
  pw.addEventListener('input', () => {
    const v = pw.value, lv = strength(v);
    meter.dataset.lv = lv; meter.querySelector('b').textContent = LBL[lv];
    $('[data-rule="len"]').classList.toggle('met', v.length >= 8);
    $('[data-rule="num"]').classList.toggle('met', /\d/.test(v));
    if (pw2.value) setMsg(forms.signup, 'pw2', pw2.value === v ? '' : 'Passwords don’t match yet.', pw2.value === v);
  });
  pw2.addEventListener('input', () => setMsg(forms.signup, 'pw2', pw2.value && pw2.value !== pw.value ? 'Passwords don’t match yet.' : '', pw2.value && pw2.value === pw.value));
  forms.signup.email.addEventListener('blur', e => { if (e.target.value) setMsg(forms.signup, 'email', emailOk(e.target.value) ? '' : 'Enter a valid email address.', emailOk(e.target.value)); });

  forms.signup.addEventListener('submit', e => {
    e.preventDefault();
    const f = forms.signup, em = f.email.value, p = pw.value;
    const errs = {
      email: !em ? 'Enter your email address.' : !emailOk(em) ? 'Enter a valid email address.' : '',
      pw: !p ? 'Create a password.' : p.length < 8 || !/\d/.test(p) ? 'Use 8+ characters with at least one number.' : '',
      pw2: !pw2.value ? 'Re-enter your password.' : pw2.value !== p ? 'Passwords don’t match.' : ''
    };
    Object.entries(errs).forEach(([k, v]) => setMsg(f, k, v, !v));
    const first = Object.keys(errs).find(k => errs[k]);
    if (first) { f.querySelector(`[data-f="${first}"] input`).focus(); return; }
    app.email = em.trim();
    busy(f.querySelector('.submit'), 600, () => { f.reset(); meter.dataset.lv = 0; show('step2', true); });
  });

  /* ---------------- sign in ---------------- */
  forms.login.addEventListener('submit', e => {
    e.preventDefault();
    const f = forms.login, em = f.email.value;
    const errs = { email: !em ? 'Enter your email address.' : !emailOk(em) ? 'Enter a valid email address.' : '', pw: !f.pw.value ? 'Enter your password.' : '' };
    Object.entries(errs).forEach(([k, v]) => setMsg(f, k, v, !v));
    const first = Object.keys(errs).find(k => errs[k]);
    if (first) { f.querySelector(`[data-f="${first}"] input`).focus(); return; }
    busy(f.querySelector('.submit'), 600, () => { f.reset(); showDone('Welcome back.', 'On the live site you’d now land in your application or agent portal.<br><small>Prototype — you weren’t actually signed in and nothing was sent.</small>'); });
  });
  $('#forgot').addEventListener('click', e => { e.preventDefault(); $('#forgotNote').classList.add('show'); });

  /* ---------------- step 2: application wizard ---------------- */
  const f2 = forms.step2, panes = $$('.pane', f2), subs = $$('.sub li', f2);
  const prevBtn = $('#prevBtn'), nextBtn = $('#nextBtn'), nextLabel = $('#nextLabel');
  let cur = 0, reached = 0;

  function go(i, focus) {
    cur = Math.max(0, Math.min(panes.length - 1, i)); reached = Math.max(reached, cur);
    panes.forEach((p, k) => { p.hidden = k !== cur; });
    subs.forEach((li, k) => {
      li.classList.toggle('on', k === cur); li.classList.toggle('done', k < cur || (k <= reached && k !== cur && stepValid(k)));
      li.setAttribute('aria-current', k === cur ? 'step' : 'false');
      li.tabIndex = k <= reached ? 0 : -1;
    });
    prevBtn.style.visibility = cur ? 'visible' : 'hidden';
    nextLabel.textContent = cur === panes.length - 1 ? 'Submit application' : cur === 3 && !app.voice && !app.voiceLater ? 'Continue' : 'Continue';
    if (cur === 4) renderReview();
    if (focus) setTimeout(() => panes[cur].querySelector('h1')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 10);
  }
  subs.forEach((li, k) => {
    const jump = () => { if (k <= reached) go(k, true); };
    li.addEventListener('click', jump);
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jump(); } });
  });
  prevBtn.addEventListener('click', () => go(cur - 1, true));
  nextBtn.addEventListener('click', () => {
    const err = validate(cur);
    if (err) return;
    if (cur === panes.length - 1) return submitApp();
    go(cur + 1, true);
  });

  // 1 · resume
  const drop = $('#drop'), fileIn = $('#resume'), chip = $('#fileChip');
  const fmtSize = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  function takeFile(file) {
    const msg = $('#resumeMsg'); msg.textContent = '';
    if (!file) return;
    if (!/\.(pdf|docx?|DOCX?|PDF)$/.test(file.name)) { msg.textContent = 'Please upload a PDF, DOC or DOCX file.'; return; }
    if (file.size > 5 * 1048576) { msg.textContent = `That file is ${fmtSize(file.size)} — the limit is 5 MB.`; return; }
    app.resume = { name: file.name, size: file.size }; app.noResume = false;
    drop.hidden = true; chip.hidden = false; chip.classList.add('reading');
    $('#fileName').textContent = file.name; $('#fileMeta').textContent = `${fmtSize(file.size)} · Reading your resume…`;
    setTimeout(() => { chip.classList.remove('reading'); $('#fileMeta').textContent = `${fmtSize(file.size)} · Attached`; }, 1200);
  }
  fileIn.addEventListener('change', () => takeFile(fileIn.files[0]));
  ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => takeFile(e.dataTransfer.files[0]));
  $('#fileRemove').addEventListener('click', () => { app.resume = null; fileIn.value = ''; chip.hidden = true; drop.hidden = false; });
  $('#noResume').addEventListener('click', e => { e.preventDefault(); app.noResume = true; app.resume = null; $('#resumeMsg').textContent = ''; go(1, true); });

  // 3 · English
  const QUIZ = [
    ['A customer writes: “My order hasn’t arrived.” Which reply is the most professional?', ['Not my problem — contact the courier.', 'I’m sorry about the delay. Let me check your order status right now.', 'Orders always arrive late, please wait.']],
    ['Choose the correct sentence.', ['She don’t have the account details.', 'She doesn’t have the account details.', 'She not have the account details.']],
    ['“Could you hold for a moment, please?” means you are asking the customer to…', ['end the call', 'wait briefly while you check something', 'call back tomorrow']],
    ['Complete the sentence: “I’ll send the invoice to you ___ email.”', ['by', 'on', 'at']]
  ];
  $('#quiz').innerHTML = QUIZ.map(([q, opts], i) => `<fieldset class="q" data-q="${i}"><legend><b>${i + 1}</b>${q}</legend>
    <div class="q-opts">${opts.map((o, j) => `<label><input type="radio" name="q${i}" value="${j}"><span>${o}</span></label>`).join('')}</div></fieldset>`).join('');
  $('#quiz').addEventListener('change', e => { const fs = e.target.closest('.q'); app.answers[fs.dataset.q] = +e.target.value; fs.classList.remove('err'); $('#quizMsg').textContent = ''; });

  // 4 · voice
  const rec = $('#rec'), recBtn = $('#recBtn'), audio = $('#recAudio');
  let media = null, chunks = [], timer = 0, secs = 0, stream = null;
  const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  function setRec(state, title, sub) { rec.dataset.state = state; if (title) $('#recTitle').textContent = title; if (sub) $('#recSub').textContent = sub; recBtn.setAttribute('aria-label', state === 'rec' ? 'Stop recording' : 'Start recording'); }
  async function startRec() {
    $('#recMsg').textContent = '';
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { $('#recMsg').textContent = 'This browser can’t record audio. Use “Record it later” and finish from your portal.'; return; }
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (err) { $('#recMsg').textContent = 'Microphone access was blocked. Allow the mic in your browser settings, or record it later.'; return; }
    chunks = []; media = new MediaRecorder(stream);
    media.ondataavailable = e => e.data.size && chunks.push(e.data);
    media.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(chunks, { type: media.mimeType || 'audio/webm' });
      if (audio.src) URL.revokeObjectURL(audio.src);
      audio.src = URL.createObjectURL(blob); audio.hidden = false; $('#recActions').hidden = false;
      app.voice = { secs }; app.voiceLater = false;
      setRec('done', 'Sample recorded', `${mmss(secs)} · Play it back below, or record again`);
      if (secs < 10) $('#recMsg').textContent = 'That was quite short — aim for about 30 seconds if you can.';
    };
    media.start(); secs = 0; $('#recTime').textContent = '0:00';
    setRec('rec', 'Recording…', 'Speak naturally · tap stop when you’re done');
    timer = setInterval(() => { secs++; $('#recTime').textContent = mmss(secs); if (secs >= 60) stopRec(); }, 1000);
  }
  function stopRec() { clearInterval(timer); if (media && media.state === 'recording') media.stop(); }
  recBtn.addEventListener('click', () => (rec.dataset.state === 'rec' ? stopRec() : startRec()));
  $('#reRecord').addEventListener('click', () => { audio.hidden = true; $('#recActions').hidden = true; app.voice = null; startRec(); });
  $('#recLater').addEventListener('click', e => { e.preventDefault(); stopRec(); app.voiceLater = true; $('#recMsg').textContent = ''; go(4, true); });

  // validation per step
  function stepValid(k) { return !validate(k, true); }
  function validate(k, silent) {
    if (k === 0) {
      const ok = app.resume || app.noResume;
      if (!ok && !silent) $('#resumeMsg').textContent = 'Add your resume, or choose “Continue without one”.';
      return !ok;
    }
    if (k === 1) {
      const v = n => (f2.elements[n].value || '').trim();
      const errs = {
        first: v('first') ? '' : 'Enter your first name.',
        last: v('last') ? '' : 'Enter your last name.',
        phone: !v('phone') ? 'Enter a phone number.' : v('phone').replace(/[^\d]/g, '').length < 9 ? 'That number looks too short.' : '',
        city: v('city') ? '' : 'Choose your city.',
        role: v('role') ? '' : 'Choose a role, or “Not sure yet”.'
      };
      if (!silent) { Object.entries(errs).forEach(([n, m]) => setMsg(f2, n, m, !m)); const first = Object.keys(errs).find(n => errs[n]); if (first) f2.elements[first].focus(); }
      return Object.values(errs).some(Boolean);
    }
    if (k === 2) {
      const missing = QUIZ.map((_, i) => i).filter(i => app.answers[i] == null);
      if (missing.length && !silent) {
        $$('.q', f2).forEach(fs => fs.classList.toggle('err', missing.includes(+fs.dataset.q)));
        $('#quizMsg').textContent = `Answer ${missing.length === 1 ? 'question ' + (missing[0] + 1) : 'all four questions'} to continue.`;
        $(`.q[data-q="${missing[0]}"]`, f2).scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      return missing.length > 0;
    }
    if (k === 3) {
      const ok = app.voice || app.voiceLater;
      if (!ok && !silent) $('#recMsg').textContent = rec.dataset.state === 'rec' ? 'Stop the recording first.' : 'Record your sample, or choose “Record it later”.';
      return !ok;
    }
    if (k === 4) {
      const ok = $('#consent').checked;
      if (!ok && !silent) $('#consentMsg').textContent = 'Please confirm your details to submit.';
      return !ok;
    }
    return false;
  }
  $('#consent').addEventListener('change', () => { $('#consentMsg').textContent = ''; });
  f2.addEventListener('input', e => { const box = e.target.closest('.fld'); if (box?.classList.contains('err')) setMsg(f2, box.dataset.f, '', true); });

  function renderReview() {
    const v = n => (f2.elements[n].value || '').trim();
    const answered = Object.keys(app.answers).length;
    const rows = [
      [0, 'Resume', app.resume ? `${app.resume.name} · ${fmtSize(app.resume.size)}` : 'Adding later from your portal'],
      [1, 'About you', `${v('first')} ${v('last')} · ${v('phone')}<br>${v('city')} · ${v('role')}<br>${f2.elements.exp.value} experience · ${f2.elements.avail.value}`],
      [2, 'English check', `${answered} of ${QUIZ.length} questions answered`],
      [3, 'Voice sample', app.voice ? `Recorded · ${mmss(app.voice.secs)}` : 'Recording later from your portal'],
      [null, 'Account', app.email || 'Created in step 1']
    ];
    $('#review').innerHTML = rows.map(([k, t, d]) => `<div class="rv"><span class="rv-ic ${(k === 0 && !app.resume) || (k === 3 && !app.voice) ? 'later' : ''}"><svg class="icon"><use href="#i-check"/></svg></span>
      <div><b>${t}</b><small>${d}</small></div>${k != null ? `<button type="button" class="rv-edit" data-edit="${k}"><svg class="icon"><use href="#i-edit"/></svg>Edit</button>` : ''}</div>`).join('');
  }
  $('#review').addEventListener('click', e => { const b = e.target.closest('[data-edit]'); if (b) go(+b.dataset.edit, true); });

  function submitApp() {
    const first = (f2.elements.first.value || '').trim();
    busy(nextBtn, 900, () => {
      showDone('Application submitted.', `Thanks${first ? ', ' + first.replace(/</g, '') : ''}! A recruiter replies within <b>3 business days</b> — no fees, ever.<br><small>Prototype — nothing was uploaded or sent.</small>`);
      $('#sideTitle').innerHTML = 'You’re <span>in the queue.</span>';
      $('#sideText').textContent = 'Here’s what happens next. Keep an eye on your email.';
    });
  }

  show(new URLSearchParams(location.search).get('screen'));
})();
