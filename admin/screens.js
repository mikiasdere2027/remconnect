// RemConnect Admin — management screens for the prototype.
// Everything here is in-memory: changes reset on reload and nothing is sent anywhere.
// Applicants' and agents' names are shortened and personal emails masked on purpose.
window.RC_SCREENS = function (h) {
  const { box, boxH, statbox, toast, rerender, session, ring, C } = h;

  /* ---------- icons ---------- */
  const X = {
    upload: '<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>', plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m14 6 4 4"/>', up: '<path d="m6 15 6-6 6 6"/>', dn: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    rows: '<path d="M4 6h16M4 12h16M4 18h16"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>', key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/>',
    play: '<path d="M7 4v16l13-8z"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    sortd: '<path d="m6 9 6 6 6-6"/>', sortu: '<path d="m6 15 6-6 6 6"/>', dl: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>', book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    dots: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 13h4"/>',
    swap: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>', bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'
  };
  const ic = (n, s) => X[n] ? `<svg class="icon" viewBox="0 0 24 24"${s ? ` style="width:${s}px;height:${s}px"` : ''}>${X[n]}</svg>` : h.ic(n, s);

  /* ---------- helpers ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const PAL = ['#1674e8', '#0b1b3a', '#1b9d75', '#c27c0e', '#7c5cff', '#e5484d', '#0d9488', '#318bf5'];
  const initials = n => n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  const av = (n, size = 38) => `<span class="av" style="--s:${size}px;background:${PAL[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % PAL.length]}">${esc(initials(n))}</span>`;
  const head = (eyebrow, title, sub, actions = '') => `<div class="sc-head"><div class="greet"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${sub ? `<p class="meta-line">${sub}</p>` : ''}</div>${actions ? `<div class="sc-actions">${actions}</div>` : ''}</div>`;
  const btn = (label, act, cls = 'primary', icon = '', extra = '') => `<button type="button" class="btn-pill ${cls} sc-btn" data-act="${act}" ${extra}>${icon ? ic(icon, 15) : ''}${label}</button>`;
  const chipbar = (group, items, active) => `<div class="chipbar" role="tablist">${items.map(([id, l, n]) => `<button type="button" data-act="chip" data-group="${group}" data-id="${esc(id)}" class="${id === active ? 'on' : ''}">${l}${n != null ? `<span>${n}</span>` : ''}</button>`).join('')}</div>`;
  const statTabs = (group, items, active) => `<div class="stat-tabs" style="--n:${items.length}">${items.map(([id, l, v, icon, s, c]) =>
    `<button type="button" class="stat-tab ${id === active ? 'on' : ''}" data-act="chip" data-group="${group}" data-id="${id}" style="--c:${c || 'var(--blue)'}"><span class="h">${l}<span class="i">${ic(icon, 15)}</span></span><span class="v">${v}</span><span class="s">${s}</span></button>`).join('')}</div>`;
  const search = (scope, ph) => `<label class="search-pill sc-search">${ic('search', 15)}<input data-act="search" data-scope="${scope}" type="search" placeholder="${ph}" value="${esc(Q[scope] || '')}" aria-label="${ph}"></label>`;
  const selectBox = (act, options, value, label) => `<label class="sc-select"><select data-act="${act}" aria-label="${label}">${options.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${v === value ? 'selected' : ''}>${esc(l)}</option>`; }).join('')}</select>${ic('dn')}</label>`;
  const match = (scope, text) => !Q[scope] || text.toLowerCase().includes(Q[scope].toLowerCase());
  const sr = (scope, text) => `data-sr="${scope}" data-text="${esc(text.toLowerCase())}"`;
  const fld = (label, name, value = '', type = 'text', attrs = '') => `<label class="fld"><span>${label}</span><input name="${name}" type="${type}" value="${esc(value)}" ${attrs}></label>`;
  const area = (label, name, value = '', attrs = '') => `<label class="fld"><span>${label}</span><textarea name="${name}" ${attrs}>${esc(value)}</textarea></label>`;
  const sel = (label, name, options, value) => `<label class="fld"><span>${label}</span><select name="${name}">${options.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${v === value ? 'selected' : ''}>${esc(l)}</option>`; }).join('')}</select></label>`;
  const lock = (label, value) => `<div class="fld"><span>${label}</span><div class="lock">${ic('lock', 14)}${esc(value)}</div></div>`;
  const stPill = (t, c = '') => `<span class="st-pill ${c}">${t}</span>`;
  const empty = (msg, icon = 'inbox') => `<div class="empty-box">${ic(icon)}${msg}</div>`;
  let uid = 1000;

  /* ---------- state ---------- */
  const Q = {};
  const S = {
    twofa: false, adminFilter: 'all', appStatus: 'awaiting', appRole: '', appSort: 'longest',
    agentFilter: 'all', agentView: 'list', stealth: false, rolesTab: 'catalogue', reqStatus: 'awaiting', reqWants: '',
    qMode: 'live', bankFilter: 'all', courseStatus: 'all', courseCat: '', courseTrack: '', trackFilter: 'all',
    connRange: '7d', catClosed: {}, addOpen: null, connSort: { k: 'n', dir: 1 }, net: { auto: true, every: '30 min', changed: '20 days ago' }, netDraft: null, lastSweep: '4 min ago'
  };

  /* ---------- modal / confirm / drawer ---------- */
  let modalEl, modalSubmit;
  function modal(title, body, submitLabel, onSubmit, onOpen, danger) {
    if (!modalEl) {
      modalEl = document.createElement('div'); modalEl.className = 'sc-modal'; document.body.appendChild(modalEl);
      modalEl.addEventListener('click', e => { if (e.target === modalEl || e.target.closest('[data-close]')) closeModal(); });
      modalEl.addEventListener('submit', e => {
        e.preventDefault();
        const form = e.target, fd = Object.fromEntries(new FormData(form));
        form.querySelectorAll('input[type=checkbox]').forEach(c => { fd[c.name] = c.checked; });
        const res = modalSubmit ? modalSubmit(fd, form) : true;
        if (typeof res === 'string') { form.querySelector('.sc-err').textContent = res; return; }
        if (res !== false) closeModal();
      });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeDrawer(); } });
    }
    modalSubmit = onSubmit;
    modalEl.innerHTML = `<form class="sc-dialog" role="dialog" aria-modal="true" aria-label="${esc(title)}" novalidate>
      <div class="sc-dh"><h3>${title}</h3><button type="button" class="round" data-close aria-label="Close">${ic('x', 16)}</button></div>
      ${body}<p class="sc-err" role="alert"></p>
      <div class="sc-df"><button type="button" class="btn-pill ghost sc-btn" data-close>Cancel</button><button class="btn-pill ${danger ? 'danger' : 'primary'} sc-btn" data-submit>${submitLabel}</button></div></form>`;
    modalEl.classList.add('open');
    const form = modalEl.querySelector('form');
    if (onOpen) onOpen(form);
    setTimeout(() => form.querySelector('input:not([type=checkbox]):not([type=file]),select,textarea')?.focus(), 30);
  }
  const closeModal = () => modalEl && modalEl.classList.remove('open');
  const confirmBox = (title, msg, label, fn) => modal(title, `<p style="margin:0;color:var(--muted);font-size:13.5px;line-height:1.6">${msg}</p>`, label, () => { fn(); }, null, true);
  // keep submit disabled until the named field has text
  const requireField = name => form => {
    const inp = form.querySelector(`[name="${name}"]`), b = form.querySelector('[data-submit]');
    const upd = () => { b.disabled = !inp.value.trim(); };
    inp.addEventListener('input', upd); upd();
  };

  let drawerEl, scrimEl;
  function drawer(html) {
    if (!drawerEl) {
      scrimEl = document.createElement('div'); scrimEl.className = 'drawer-scrim'; document.body.appendChild(scrimEl);
      drawerEl = document.createElement('aside'); drawerEl.className = 'drawer'; drawerEl.setAttribute('aria-label', 'Details'); document.body.appendChild(drawerEl);
      scrimEl.addEventListener('click', closeDrawer);
      drawerEl.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeDrawer(); });
    }
    drawerEl.innerHTML = html; drawerEl.classList.add('open'); scrimEl.classList.add('open');
  }
  function closeDrawer() { if (drawerEl) { drawerEl.classList.remove('open'); scrimEl.classList.remove('open'); } }

  /* =========================================================
     MY PROFILE
     ========================================================= */
  const PROF = { first: 'Rem', middle: 'SuperAdmin', last: '', dob: '2026-08-29', gender: 'Male', phone: '+25191011121314' };
  const FIELD_LABELS = { first: 'First name', middle: 'Middle name', last: 'Last name', dob: 'Date of birth', gender: 'Gender', phone: 'Phone' };
  const fullName = () => [PROF.first, PROF.middle, PROF.last].filter(Boolean).join(' ');
  function profile() {
    const keys = Object.keys(PROF), filled = keys.filter(k => PROF[k]).length, pct = Math.round(filled / keys.length * 100);
    return head('Account', 'Your profile', 'Your email and role can only be changed by a super admin.') + `<div class="sc-grid">
      <div class="sc-stack">
        <section class="box prof-hero"><div class="prof-banner"></div><div class="prof-body">
          <div class="prof-av"><img src="../assets/logo.png" alt=""></div>
          <div class="prof-id"><h2>${esc(fullName())}</h2><p>${esc(session.email)}</p>
            <div class="chips-row">${stPill('Super administrator')}${stPill('Active', 'green')}<a href="#security" class="st-pill ${S.twofa ? 'green' : 'amber'}">2FA ${S.twofa ? 'on' : 'off'} · manage</a></div></div>
          ${btn('Change photo', 'photo', 'outline', 'upload')}
        </div></section>
        <section class="box">${boxH('Personal details', 'Changes save to this browser only in the prototype.')}
          <form id="profForm" data-form="profile" onsubmit="return false"><div class="form-grid">
            ${fld('First name', 'first', PROF.first)}${fld('Middle name', 'middle', PROF.middle)}${fld('Last name', 'last', PROF.last, 'text', 'placeholder="Add a last name"')}
            ${fld('Date of birth', 'dob', PROF.dob, 'date')}${sel('Gender', 'gender', ['Male', 'Female', 'Prefer not to say'], PROF.gender)}${fld('Phone', 'phone', PROF.phone, 'tel')}
            ${lock('Email', session.email)}${lock('Role', 'Super administrator')}${lock('Status', 'Active')}
          </div>
          <div class="form-foot"><button type="button" class="btn-pill primary sc-btn" id="profSave" data-act="profsave" disabled>Save changes</button><button type="button" class="btn-pill ghost sc-btn" id="profReset" data-act="profreset" hidden>Discard</button><small id="profStatus">No changes yet</small></div></form>
        </section>
      </div>
      <div class="sc-stack">
        ${box('', boxH('Profile strength', `${filled} of ${keys.length} details filled`) + ring([['Complete', pct, C.blue, pct + '%'], ['Missing', 100 - pct, 'var(--line)', (100 - pct) + '%']], pct + '%', 'complete', 120) +
          `<ul class="checks">${keys.map(k => `<li class="${PROF[k] ? '' : 'no'}">${ic(PROF[k] ? 'check' : 'x')}${FIELD_LABELS[k]}</li>`).join('')}</ul>`)}
        ${box('', boxH('Account') + `<div class="kv-list"><div><span>Role</span><b>Super administrator</b></div><div><span>Status</span><b>Active</b></div><div><span>Two-factor</span><b><a href="#security" style="color:var(--blue)">${S.twofa ? 'On' : 'Off — turn on'}</a></b></div><div><span>Email</span><b>${esc(session.email)}</b></div></div>`)}
      </div></div>`;
  }
  function profDirty() {
    const f = document.getElementById('profForm'); if (!f) return;
    const changed = Object.keys(PROF).filter(k => (f.elements[k].value || '') !== PROF[k]);
    document.getElementById('profSave').disabled = !changed.length;
    document.getElementById('profReset').hidden = !changed.length;
    document.getElementById('profStatus').textContent = changed.length ? `${changed.length} unsaved change${changed.length > 1 ? 's' : ''}` : 'No changes yet';
  }

  /* =========================================================
     SECURITY
     ========================================================= */
  const qrCells = () => { let s = 7, out = ''; for (let i = 0; i < 169; i++) { s = (s * 9301 + 49297) % 233280; const r = Math.floor(i / 13), c = i % 13; const finder = (r < 3 && c < 3) || (r < 3 && c > 9) || (r > 9 && c < 3); out += `<i class="${finder || s / 233280 > .5 ? '' : 'o'}"></i>`; } return out; };
  function security() {
    const n = S.twofa ? 2 : 1;
    return head('Account', 'Security', 'Admin accounts can change roles, invite staff and see every agent’s data. Two-factor authentication is the single most effective way to keep that access safe.') + `<div class="sc-grid">
      <div class="sc-stack">
        <section class="box sec-card"><span class="sec-ico ${S.twofa ? 'ok' : 'warn'}">${ic('lock', 20)}</span>
          <div><h3>Two-factor authentication</h3><p>Require a code from your authenticator app as well as your password. Even if your password leaks, your account stays yours.</p>
            <ul class="checks"><li>${ic('check')}Works with any TOTP app — Google, Microsoft, Authy, 1Password</li><li>${ic('check')}Ten single-use backup codes in case your phone is unavailable</li><li>${ic('check')}Email-based recovery if you lose the device entirely</li></ul>
            ${S.twofa ? btn('Turn off two-factor', 'twofa-off', 'outline') : btn('Enable two-factor authentication', 'twofa-on', 'primary', 'shield')}</div>
          ${stPill(S.twofa ? 'On' : 'Off', S.twofa ? 'green' : 'gray')}</section>
        <section class="box sec-card"><span class="sec-ico">${ic('key', 20)}</span>
          <div><h3>Password</h3><p>Changing your password signs out every other device — the right move if you think someone else has been in your account.</p>
            <div style="margin-top:14px">${btn('Change password', 'password', 'outline', 'key')}</div></div><span></span></section>
      </div>
      <div class="sc-stack">${box('', boxH('Protection level', `${n} of 2 protections on`) + ring([['Protected', n, S.twofa ? C.green : C.amber], ['Missing', 2 - n, 'var(--line)']], `${n}/2`, 'protections', 120) +
        `<ul class="checks"><li>${ic('check')}Password set</li><li class="${S.twofa ? '' : 'no'}">${ic(S.twofa ? 'check' : 'x')}Two-factor authentication</li></ul><p class="note2">${S.twofa ? 'Your account has both protections on.' : 'Turn on two-factor to fully protect this admin account.'}</p>`)}</div></div>`;
  }

  /* =========================================================
     ADMIN MANAGEMENT
     ========================================================= */
  const ADMINS = [
    { id: 1, name: 'Bezamariam Demeke', email: 'bezamariam@remconnect.io', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Eyob Agumase Simachew', email: 'e•••••@gmail.com', role: 'Admin', status: 'Active' },
    { id: 3, name: session.name, email: session.email, role: 'Super admin', status: 'Active', me: true }
  ];
  function admins() {
    const cnt = s => ADMINS.filter(a => a.status === s).length;
    const rows = ADMINS.filter(a => S.adminFilter === 'all' || a.status === S.adminFilter);
    return head('Access control', 'Admin management', `${ADMINS.length} admins can sign in to this console`, btn('Invite admin', 'invite', 'dark', 'plus')) +
      statTabs('admin', [['all', 'All admins', ADMINS.length, 'users', 'Everyone with access'], ['Pending', 'Pending', cnt('Pending'), 'clock', 'Invites not accepted', C.amber], ['Active', 'Active', cnt('Active'), 'check', 'Can sign in', C.green], ['Deactivated', 'Deactivated', cnt('Deactivated'), 'out', 'Access removed', C.red]], S.adminFilter) +
      `<div class="toolbar">${search('admins', 'Search email or name…')}</div>
      <div class="list">${rows.length ? rows.map(a => `<div class="lrow" ${sr('admins', a.name + ' ' + a.email)}>${av(a.name)}
        <div class="who"><b>${esc(a.name)}${a.me ? '<span class="you">YOU</span>' : ''}</b><small>${esc(a.email)}</small></div>
        <div class="right"><span class="role-chip">${ic(a.role === 'Super admin' ? 'shield' : 'user', 13)}${a.role}</span>${stPill(a.status, { Active: 'green', Pending: 'amber', Deactivated: 'red' }[a.status])}
          ${a.me ? '<small class="muted" style="font-size:12px;min-width:88px;text-align:right">That’s you</small>' :
            a.status === 'Active' ? `<button class="act-btn reject" data-act="admin-deact" data-id="${a.id}">Deactivate</button>` :
            a.status === 'Pending' ? `<button class="act-btn hold" data-act="admin-resend" data-id="${a.id}">Resend</button><button class="act-btn reject" data-act="admin-revoke" data-id="${a.id}">Revoke</button>` :
            `<button class="act-btn approve" data-act="admin-react" data-id="${a.id}">Reactivate</button>`}</div></div>`).join('') : empty('No admins in this view.', 'users')}</div>`;
  }

  /* =========================================================
     APPLICATIONS
     ========================================================= */
  const ROLE_LIST = ['Executive Virtual Assistant (EVA)', 'Inside Sales Representative', 'Billing & Invoicing Specialist', 'Sales Development Representative (SDR)', 'Lead Generation Specialist', 'IT Help Desk Technician', 'IT Support Specialist'];
  const APPS = [
    ['Eyasu D.', 'e•••••@gmail.com', 'Hossana', ROLE_LIST[0], 26], ['Najwa A.', 'n•••••@gmail.com', 'Addis Ababa', ROLE_LIST[1], 21],
    ['Veronica P.', 'v•••••@icloud.com', 'Addis Ababa', ROLE_LIST[0], 20], ['Delina T.', 'd•••••@gmail.com', 'Addis Ababa', ROLE_LIST[0], 19],
    ['Nura N.', 'n•••••@gmail.com', 'Addis Ababa', ROLE_LIST[0], 19], ['Natnael Z.', 'z•••••@gmail.com', 'Bole', ROLE_LIST[2], 18],
    ['Josel A.', 'j•••••@gmail.com', 'Addis Ababa', ROLE_LIST[0], 14], ['Yohannes W.', 'y•••••@gmail.com', 'Bole, Addis Ababa', ROLE_LIST[2], 14]
  ].map(([name, email, city, role, days], i) => ({ id: i + 1, name, email, city, role, days, status: 'awaiting' }));
  const APP_COUNT = { awaiting: 36, hold: 6, approved: 59, rejected: 99 };
  const APP_ST = { awaiting: ['Awaiting decision', 'amber'], hold: ['On hold', ''], approved: ['Approved', 'green'], rejected: ['Rejected', 'red'] };
  function applications() {
    const rows = APPS.filter(a => a.status === S.appStatus && (!S.appRole || a.role === S.appRole)).sort((a, b) => S.appSort === 'longest' ? b.days - a.days : a.days - b.days);
    return head('People', 'Applications', 'Review applicants and decide who moves on to training') +
      statTabs('app', [['awaiting', 'Awaiting review', APP_COUNT.awaiting, 'clock', 'Need a decision', C.amber], ['hold', 'On hold', APP_COUNT.hold, 'timer', 'Paused for now'], ['approved', 'Approved', APP_COUNT.approved, 'check', 'Moved to training', C.green], ['rejected', 'Rejected', APP_COUNT.rejected, 'out', 'Not this time', C.red]], S.appStatus) +
      `<div class="toolbar">${search('apps', 'Search by name or email…')}${selectBox('app-role', [['', 'All roles'], ...ROLE_LIST], S.appRole, 'Filter by role')}<span class="grow"></span>
        <button type="button" class="btn-pill outline sc-btn" data-act="app-sort">${ic(S.appSort === 'longest' ? 'sortd' : 'sortu', 14)}${S.appSort === 'longest' ? 'Longest waiting' : 'Newest first'}</button></div>
      <div class="list">${rows.length ? rows.map(a => `<div class="lrow" ${sr('apps', a.name + ' ' + a.email + ' ' + a.city + ' ' + a.role)}>${av(a.name, 42)}
        <div class="who"><b>${esc(a.name)}</b><small>${esc(a.email)} · ${ic('pin', 11)} ${esc(a.city)}</small>
          <div class="meta"><span class="role-chip">${esc(a.role)}</span><button class="file-link" data-act="file" data-kind="video">${ic('play')}Video</button><button class="file-link" data-act="file" data-kind="résumé">${ic('file')}Résumé</button></div></div>
        <div class="right"><div class="wait"><b>${a.days} days</b><small>waiting</small></div>${stPill(...APP_ST[a.status])}
          ${a.status === 'awaiting' || a.status === 'hold' ? `<button class="act-btn approve" data-act="app-move" data-to="approved" data-id="${a.id}">${ic('check')}Approve</button>${a.status === 'awaiting' ? `<button class="act-btn hold" data-act="app-move" data-to="hold" data-id="${a.id}">${ic('clock')}On hold</button>` : ''}<button class="act-btn reject" data-act="app-move" data-to="rejected" data-id="${a.id}">${ic('x')}Reject</button>`
            : `<button class="act-btn" data-act="app-move" data-to="awaiting" data-id="${a.id}">Undo</button>`}</div></div>`).join('')
        : empty(S.appStatus === 'awaiting' ? 'No sample applicants match.' : 'The prototype only includes sample applicants from the review queue. Move one here to see it.', 'file')}</div>
      <div class="list-foot"><span>Showing ${rows.length} sample applicant${rows.length === 1 ? '' : 's'}</span><span>${APP_COUNT[S.appStatus]} in “${APP_ST[S.appStatus][0].replace('Awaiting decision', 'Awaiting review')}” on the live platform</span></div>`;
  }

  /* =========================================================
     AGENT DIRECTORY
     ========================================================= */
  const AGENTS = [
    ['Stephen E.', 's•••••@gmail.com', 'Lead Generation Specialist', '—', 86, 0], ['Getu C.', 'g•••••@gmail.com', 'Inside Sales Representative', 'Lumen Telecom', 89, 0],
    ['Meheret B.', 'm•••••@gmail.com', 'Sales Development Representative (SDR)', '—', 90, 0], ['Amanuel S.', 'a•••••@gmail.com', 'Sales Development Representative (SDR)', '—', 83, 0],
    ['Hanan I.', 'h•••••@gmail.com', 'Billing & Invoicing Specialist', '—', 92, 0], ['Yonas M.', 'y•••••@gmail.com', 'Sales Development Representative (SDR)', 'Lumen Telecom', 90, 4],
    ['Betelhem G.', 'b•••••@gmail.com', 'Inside Sales Representative', '—', 84, 1], ['Mulata T.', 'm•••••@gmail.com', 'IT Help Desk Technician', '—', 83, 0],
    ['Liuel A.', 'l•••••@gmail.com', 'Executive Virtual Assistant (EVA)', 'Northwind Support', 93, 0], ['Andarg Y.', 'a•••••@gmail.com', 'Inside Sales Representative', '—', 93, 0],
    ['Anhime N.', 'a•••••@gmail.com', 'Inside Sales Representative', '—', 92, 0], ['Tewo A.', 't•••••@gmail.com', 'Executive Virtual Assistant (EVA)', '—', 92, 0]
  ].map(([name, email, role, client, score, certs], i) => ({ id: i + 1, name, email, role, client, score, certs, status: 'Active' }));
  const scoreCls = s => s >= 90 ? 'hi' : s >= 85 ? 'mid' : 'lo';
  function agents() {
    const rows = AGENTS.filter(a => S.agentFilter === 'all' || (S.agentFilter === 'active') === (a.status === 'Active'));
    const list = `<div class="ft-wrap"><table class="ft"><thead><tr><th>Agent</th><th>Role</th><th>Client</th><th class="n">Score</th><th class="n">Certs</th><th>Status</th><th></th></tr></thead><tbody>
      ${rows.map(a => `<tr ${sr('agents', a.name + ' ' + a.email + ' ' + a.role + ' ' + a.client)}><td><div class="cell">${av(a.name, 32)}<div><div class="t1 pii">${esc(a.name)}</div><div class="t2 pii">${esc(a.email)}</div></div></div></td>
        <td>${esc(a.role)}</td><td>${a.client === '—' ? '<span class="muted">—</span>' : esc(a.client)}</td><td class="n"><span class="score ${scoreCls(a.score)}">${a.score}</span></td><td class="n">${a.certs}</td><td>${stPill(a.status, 'green')}</td>
        <td class="n"><button class="act-btn" data-act="agent-view" data-id="${a.id}">${ic('eye')}View</button></td></tr>`).join('')}</tbody></table></div>`;
    const grid = `<div class="agent-grid">${rows.map(a => `<div class="agent-card" ${sr('agents', a.name + ' ' + a.email + ' ' + a.role + ' ' + a.client)}>${av(a.name, 56)}<b class="pii">${esc(a.name)}</b><small>${esc(a.role)}</small>
        <div class="row3"><div><b class="score ${scoreCls(a.score)}">${a.score}</b><small>Score</small></div><div><b>${a.certs}</b><small>Certs</small></div><div><b style="font-size:11px">${a.client === '—' ? '—' : esc(a.client.split(' ')[0])}</b><small>Client</small></div></div>
        ${stPill(a.status, 'green')}<button class="act-btn" style="margin-top:6px" data-act="agent-view" data-id="${a.id}">${ic('eye')}View profile</button></div>`).join('')}</div>`;
    return head('People', 'Agent directory', '200 agents on the platform · 12 sample agents shown',
      `<button type="button" class="sw-pill" data-act="stealth" aria-pressed="${S.stealth}">${ic('eye', 14)}Stealth<span class="sw ${S.stealth ? 'on' : ''}"><i></i></span></button>
       <div class="icon-toggle" role="group" aria-label="View"><button type="button" data-act="agent-view-mode" data-mode="list" class="${S.agentView === 'list' ? 'on' : ''}" aria-label="List view">${ic('rows', 15)}</button><button type="button" data-act="agent-view-mode" data-mode="grid" class="${S.agentView === 'grid' ? 'on' : ''}" aria-label="Grid view">${ic('grid', 15)}</button></div>`) +
      `<div class="toolbar">${search('agents', 'Search by name, role or client…')}${chipbar('agent', [['all', 'All', 200], ['active', 'Active', 200], ['inactive', 'Inactive', 0]], S.agentFilter)}</div>
      <div class="${S.stealth ? 'stealth' : ''}">${rows.length ? (S.agentView === 'grid' ? grid : list) : empty('No inactive agents right now.', 'users')}</div>
      <div class="list-foot"><span>Stealth blurs names and emails — handy when sharing your screen.</span><span>Showing ${rows.length} of 200</span></div>`;
  }
  function agentDrawer(a) {
    drawer(`<div class="dh"><b>Agent profile</b><button type="button" class="round" data-close aria-label="Close">${ic('x', 16)}</button></div>
      <div class="dp">${av(a.name, 64)}<b class="${S.stealth ? 'pii' : ''}">${esc(a.name)}</b><small>${esc(a.role)}</small></div>
      <div class="kv-list"><div><span>Email</span><b>${esc(a.email)}</b></div><div><span>Client</span><b>${esc(a.client)}</b></div><div><span>QA score</span><b class="score ${scoreCls(a.score)}">${a.score}</b></div><div><span>Certificates</span><b>${a.certs}</b></div><div><span>Status</span><b>${a.status}</b></div></div>
      <div class="limit"><i style="width:${a.score}%"></i></div><div class="limit-row"><span>QA score</span><span><b>${a.score}</b> / 100</span></div>
      <p class="note2">The full agent record isn’t part of the prototype.</p>`);
  }

  /* =========================================================
     ROLES & REQUESTS
     ========================================================= */
  const CATS = [
    { id: 1, name: 'Back Office & Administrative', roles: [
      { id: 11, title: 'Billing & Invoicing Specialist', desc: 'Creates and processes invoices, tracks payments, handles vendor reconciliation' },
      { id: 12, title: 'Executive Virtual Assistant (EVA)', desc: 'Provides high-trust support to C-level executives.' }] },
    { id: 2, name: 'MSP IT', roles: [
      { id: 21, title: 'IT Help Desk Technician', desc: 'Provides first-line remote support and basic troubleshooting' },
      { id: 22, title: 'IT Support Specialist', desc: 'Handles advanced troubleshooting, system administration, VPN configuration, net…' }] },
    { id: 3, name: 'Virtual Sales Team', roles: [
      { id: 31, title: 'Inside Sales Representative', desc: 'Handles warm lead follow-up and closing for small-to-mid deal sizes.' },
      { id: 32, title: 'Lead Generation Specialist', desc: 'Builds targeted prospect lists using tools like Apollo.io, LinkedIn Sales Navigator, a…' },
      { id: 33, title: 'Sales Development Representative (SDR)', desc: '' }] }
  ];
  const REQS = [
    { id: 1, name: 'Fikrehiwot I.', email: 'i•••••@gmail.com', from: 'Sales Development Representative (SDR)', to: 'Executive Virtual Assistant (EVA)', days: 35, status: 'awaiting',
      msg: 'I’m looking to transition into an Executive Virtual Assistant role because my strengths and experience are closely aligned with organization, communication, coordination, administrativ…' },
    { id: 2, name: 'Ansar A.', email: 'a•••••@gmail.com', from: 'Executive Virtual Assistant (EVA)', to: 'Sales Development Representative (SDR)', days: 35, status: 'awaiting',
      msg: 'I would like to change my primary role to Sales Development Representative (SDR) because I am interested in B2B sales, lead generation, and client outreach. I have strong communicatio…' }
  ];
  const findRole = id => { for (const c of CATS) { const r = c.roles.find(x => x.id === id); if (r) return [c, r]; } return []; };
  function roles() {
    const activeCats = CATS.filter(c => !c.retired), activeRoles = CATS.reduce((n, c) => n + c.roles.filter(r => !r.retired).length, 0);
    const pending = REQS.filter(r => r.status === 'awaiting').length;
    const tabs = chipbar('roles-tab', [['catalogue', 'Role catalogue'], ['requests', 'Change requests', pending]], S.rolesTab);
    if (S.rolesTab === 'requests') {
      const st = { awaiting: ['Awaiting review', 'amber'], approved: ['Approved', 'green'], declined: ['Declined', 'red'], withdrawn: ['Withdrawn', 'gray'] };
      const cnt = s => REQS.filter(r => r.status === s).length;
      const rows = REQS.filter(r => r.status === S.reqStatus && (!S.reqWants || r.to === S.reqWants));
      return head('People', 'Roles & requests', 'Agents asking to switch their primary role') + `<div class="roles-tabs">${tabs}</div>` +
        `<div class="toolbar">${chipbar('req', [['awaiting', 'Awaiting review', cnt('awaiting')], ['approved', 'Approved', cnt('approved')], ['declined', 'Declined', cnt('declined')], ['withdrawn', 'Withdrawn', cnt('withdrawn')]], S.reqStatus)}
          ${search('reqs', 'Search by name or email…')}<span class="grow"></span><span class="muted" style="font-size:12.5px">Wants</span>${selectBox('req-wants', [['', 'Any role'], ...ROLE_LIST], S.reqWants, 'Wanted role')}</div>
        <div class="list">${rows.length ? rows.map(r => `<section class="box req-card" ${sr('reqs', r.name + ' ' + r.email + ' ' + r.from + ' ' + r.to)}>${av(r.name, 42)}
          <div><div class="top"><b>${esc(r.name)}</b>${stPill(...st[r.status])}${r.status === 'awaiting' ? `<span class="pill-delta red">waiting ${r.days} days</span>` : ''}</div>
            <div class="move"><span class="role-chip">${esc(r.from)}</span>${ic('arrow')}<span class="role-chip" style="background:var(--surface-blue);color:var(--blue)">${esc(r.to)}</span></div>
            <small class="muted" style="font-size:12px">${esc(r.email)}</small>
            <p class="req-msg" data-act="req-expand" title="Click to expand">${esc(r.msg)}</p></div>
          <div class="right" style="display:flex;gap:8px;flex-wrap:wrap">${r.status === 'awaiting' ? `${btn('Approve', 'req-approve', 'dark', 'check', `data-id="${r.id}"`)}${btn('Decline', 'req-decline', 'outline', '', `data-id="${r.id}"`)}` : `<button class="act-btn" data-act="req-undo" data-id="${r.id}">Undo</button>`}</div>
        </section>`).join('') : empty('No change requests here.', 'swap')}</div>`;
    }
    const retiredRoles = CATS.reduce((n, c) => n + c.roles.filter(r => r.retired).length, 0);
    const CAT_LOOK = [['brief', '#1674e8'], ['gear', '#0d9488'], ['pulse', '#7c5cff'], ['users', '#c27c0e'], ['globe', '#e5484d']];
    const tile = (l, v, icon, sub, c, extra = '') => `<${extra ? 'button type="button"' : 'div'} class="stat-tab" style="--c:${c}" ${extra}><span class="h">${l}<span class="i">${ic(icon, 15)}</span></span><span class="v">${v}</span><span class="s">${sub}</span></${extra ? 'button' : 'div'}>`;
    return head('People', 'Roles & requests', 'The roles agents can hold, grouped into categories', btn('New category', 'cat-new', 'dark', 'plus')) +
      `<div class="roles-tabs">${tabs}</div>
      <div class="stat-tabs" style="--n:4">
        ${tile('Categories', activeCats.length, 'layers', `${CATS.length - activeCats.length} retired`, 'var(--blue)')}
        ${tile('Active roles', activeRoles, 'brief', 'Can be assigned to agents', C.green)}
        ${tile('Retired roles', retiredRoles, 'archive', 'Kept for history', '#9aa8bd')}
        ${tile('Change requests', pending, 'swap', pending ? 'Waiting for review →' : 'Nothing waiting', C.amber, 'data-act="chip" data-group="roles-tab" data-id="requests"')}
      </div>
      <div class="toolbar">${search('roles', 'Search roles or descriptions…')}<span class="grow"></span><small class="muted" style="font-size:12.5px">${CATS.length} categories · ${activeRoles + retiredRoles} roles</small></div>
      <div class="cat-grid">${CATS.map((c, ci) => { const [cIcon, cCol] = CAT_LOOK[ci % CAT_LOOK.length], open = !S.catClosed?.[c.id], ret = c.roles.filter(r => r.retired).length;
        return `<section class="box cat2 ${c.retired ? 'is-retired' : ''} ${open ? '' : 'is-closed'}" style="--cc:${cCol}">
        <div class="cat2-h"><span class="cat-ic">${ic(cIcon, 18)}</span>
          <div class="cat2-t"><h3>${esc(c.name)}${c.retired ? '<span class="retired-tag">Retired</span>' : ''}</h3><small>${c.roles.length} role${c.roles.length === 1 ? '' : 's'}${ret ? ` · ${ret} retired` : ''}</small></div>
          <div class="cat2-tools"><button type="button" class="icon-btn2" data-act="menu" data-menu="cat" data-id="${c.id}" aria-label="Category actions" aria-haspopup="menu">${ic('dots')}</button>
            <button type="button" class="icon-btn2 chev" data-act="cat-toggle" data-id="${c.id}" aria-label="${open ? 'Collapse' : 'Expand'} category" aria-expanded="${open}">${ic('dn')}</button></div></div>
        <div class="cat2-body">
          ${c.roles.length ? c.roles.map(r => `<div class="role2 ${r.retired ? 'is-retired' : ''}" ${sr('roles', r.title + ' ' + r.desc + ' ' + c.name)}>
            <span class="role-ini">${esc(initials(r.title.replace(/\(.*?\)/g, '')))}</span>
            <div class="role2-t"><b>${esc(r.title)}${r.retired ? '<span class="retired-tag">Retired</span>' : ''}</b><p>${esc(r.desc) || '<em>No description yet</em>'}</p></div>
            <button type="button" class="icon-btn2 kebab" data-act="menu" data-menu="role" data-id="${r.id}" aria-label="Actions for ${esc(r.title)}" aria-haspopup="menu">${ic('dots')}</button></div>`).join('')
            : `<p class="cat-empty">No roles yet — add the first one.</p>`}
          ${S.addOpen === c.id ? `<div class="add-row add2"><input data-add-title="${c.id}" placeholder="Role title" aria-label="New role title"><input data-add-desc="${c.id}" placeholder="Short description (optional)" aria-label="Description">
              <div class="add2-btns"><button type="button" class="btn-pill ghost sc-btn" data-act="add-cancel">Cancel</button><button type="button" class="btn-pill primary sc-btn" data-act="role-add" data-id="${c.id}" disabled>Add role</button></div></div>`
            : `<button type="button" class="add-role" data-act="add-open" data-id="${c.id}">${ic('plus', 14)}Add role</button>`}
        </div></section>`; }).join('')}</div>`;
  }

  /* =========================================================
     ASSESSMENT BANK
     ========================================================= */
  const BANK = [
    { id: 1, t: 'Backend engineer', scope: 'All agents', q: 6, att: 42, pm: 50 },
    { id: 2, t: 'Coaching for sales', scope: 'All agents', q: 5, att: 38, pm: 75 },
    { id: 3, t: 'ZZ DELETED PROBE - retired, ignore', scope: 'All agents', q: 0, att: 1, pm: 70, retired: true },
    { id: 4, t: 'The Remote Work Fundamentals Assessment', scope: 'All agents', q: 5, att: 54, pm: 80 },
    { id: 5, t: 'designer', scope: 'MSP IT · 2 roles', q: 0, att: 0, pm: 70 },
    { id: 6, t: 'Back Office & Administrative Assessment', scope: 'Back Office & Administrative · 4 roles', q: 3, att: 39, pm: 75 },
    { id: 7, t: 'Sales Development Representative (SDR) Assessment', scope: 'Virtual Sales Team · 3 roles', q: 3, att: 28, pm: 65 }
  ];
  function bank() {
    const live = BANK.filter(b => !b.retired), sum = k => BANK.reduce((n, b) => n + b[k], 0);
    const rows = BANK.filter(b => S.bankFilter === 'all' || (S.bankFilter === 'live') === !b.retired);
    return head('People', 'Assessments', `${BANK.length} assessments in the bank`, btn('New assessment', 'bank-new', 'dark', 'plus')) +
      `<div style="margin-bottom:18px">${statbox([
        { label: 'In the bank', value: BANK.length, icon: 'clip', sub: `${live.length} live · ${BANK.length - live.length} retired`, hero: 1 },
        { label: 'Questions', value: sum('q'), icon: 'list', sub: 'Across all assessments' },
        { label: 'Attempts', value: sum('att'), icon: 'target', sub: 'All time' },
        { label: 'Avg pass mark', value: Math.round(sum('pm') / BANK.length) + '%', icon: 'star', sub: 'Across the bank' }
      ]).replace('class="statbox"', 'class="statbox" style="grid-template-columns:repeat(4,minmax(0,1fr))"')}</div>
      <div class="toolbar">${chipbar('bank', [['all', 'All', BANK.length], ['live', 'Live', live.length], ['retired', 'Retired', BANK.length - live.length]], S.bankFilter)}${search('bank', 'Search assessments…')}</div>
      <div class="bank-grid">${rows.map(b => `<div class="bank-card ${b.retired ? 'retired' : ''}" ${sr('bank', b.t + ' ' + b.scope)}>
        <div class="bh"><span class="ai">${ic('clip')}</span><div style="min-width:0"><h3>${esc(b.t)}${b.retired ? '<span class="retired-tag">Retired</span>' : ''}</h3><div class="scope">${esc(b.scope)}</div></div></div>
        <div class="bank-stats"><div><b>${b.q}</b><small>Questions</small></div><div><b>${b.att}</b><small>Attempts</small></div><div><b>${b.pm}%</b><small>Pass mark</small></div></div>
        <div><div class="pm"><span>Pass mark</span><span>${b.pm}%</span></div><div class="bar"><i style="width:${b.pm}%"></i></div></div>
        <div class="bf"><span class="role-chip">${b.scope === 'All agents' ? 'General' : 'Scoped'}</span><span style="display:flex;gap:6px"><button class="text-btn" data-act="bank-retire" data-id="${b.id}">${b.retired ? 'Restore' : 'Retire'}</button><button class="icon-btn2" data-act="bank-edit" data-id="${b.id}" aria-label="Edit assessment">${ic('edit')}</button></span></div>
      </div>`).join('')}</div>`;
  }

  /* =========================================================
     BEHAVIOURAL (SCREENING) QUESTIONS
     ========================================================= */
  const QS = [
    { id: 1, scope: 'General', q: 'Describe a situation where you had to work with someone whose personality was very different from yours.', g: 'One real week. Say what you dropped and who you told. Keep it under two minutes.', prep: 30, ans: 120, ret: 2,
      acc: ['Names a real week rather than a hypothetical', 'Makes the trade-off explicit instead of claiming they did everything', 'Says who they told, and when'], rej: ['Claims they never have to choose', 'Cannot name anything they dropped', 'Audio unintelligible'] },
    { id: 2, scope: 'Role: Billing & Invoicing Specialist', q: 'Sell us the last thing you bought for yourself, as if we had never heard of it.', g: 'Sixty seconds. Pick something real that you own.', prep: 20, ans: 60, ret: 1,
      acc: ['Leads with a benefit rather than a feature list', 'Handles the silence at the end without filler'], rej: ['Recites a spec sheet', 'Runs out of things to say inside twenty seconds'] },
    { id: 3, scope: 'Category: Back Office & Administrative', q: 'What do you already know about the kind of work this team does, and where did you learn it?', g: 'Ninety seconds. Say where the knowledge came from, even if it came from YouTube.', prep: 30, ans: 90, ret: 2,
      acc: ['Shows some real familiarity with the domain', 'Honest about where the gaps are'], rej: ['Generic answer that would fit any job', 'Claims expertise the profile does not support'] }
  ];
  const SCOPES = ['General', ...ROLE_LIST.map(r => 'Role: ' + r), ...CATS.map(c => 'Category: ' + c.name)];
  const scopeCls = s => s.startsWith('Role') ? 'role' : s.startsWith('Category') ? 'cat' : '';
  function screening() {
    const rows = QS.filter(q => S.qMode === 'all' || !q.retired);
    return head('People', 'Behavioural questions', 'Video questions applicants answer during screening, in this order', btn('New question', 'q-new', 'dark', 'plus')) +
      `<div class="toolbar">${chipbar('qmode', [['live', 'Live questions', QS.filter(q => !q.retired).length], ['all', 'Including retired', QS.length]], S.qMode)}${search('qs', 'Search questions…')}</div>
      <div class="sc-stack">${rows.length ? rows.map((q, i) => `<section class="box q-card" ${sr('qs', q.q + ' ' + q.g + ' ' + q.scope)}>
        <div class="q-num"><b>${QS.indexOf(q) + 1}</b><button data-act="q-up" data-id="${q.id}" ${QS.indexOf(q) === 0 ? 'disabled' : ''} aria-label="Move up">${ic('up')}</button><button data-act="q-down" data-id="${q.id}" ${QS.indexOf(q) === QS.length - 1 ? 'disabled' : ''} aria-label="Move down">${ic('dn')}</button></div>
        <div style="min-width:0"><span class="scope-chip ${scopeCls(q.scope)}">${esc(q.scope)}</span>${q.retired ? '<span class="retired-tag">Retired</span>' : ''}
          <h3>${esc(q.q)}</h3><p class="guide">${esc(q.g)}</p>
          <div class="q-meta"><span>${ic('clock')}Prep ${q.prep}s</span><span>${ic('play')}Answer ${q.ans}s</span><span>${ic('refresh')}Retakes ${q.ret}</span></div>
          <div class="criteria"><div class="acc"><h4>Accept when</h4><ul>${q.acc.map(t => `<li>${ic('check')}${esc(t)}</li>`).join('')}</ul></div><div class="rej"><h4>Reject when</h4><ul>${q.rej.map(t => `<li>${ic('x')}${esc(t)}</li>`).join('')}</ul></div></div>
          <div class="q-actions"><button class="text-btn" data-act="q-edit" data-id="${q.id}">${ic('edit', 12)} Edit</button><button class="text-btn" data-act="q-retire" data-id="${q.id}">${q.retired ? 'Restore' : 'Retire'}</button><button class="text-btn" style="color:#d64545" data-act="q-del" data-id="${q.id}">Delete</button></div></div>
      </section>`).join('') : empty('No questions yet.', 'mic')}</div><p class="note2">The prototype includes the first three questions from the live list.</p>`;
  }
  function questionForm(q = {}) {
    return `${sel('Scope', 'scope', SCOPES, q.scope || 'General')}${area('Question *', 'q', q.q, 'placeholder="What should the applicant answer on video?"')}${fld('Guidance', 'g', q.g, 'text', 'placeholder="One line shown under the question"')}
      <div class="form-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${fld('Prep (s)', 'prep', q.prep || 30, 'number', 'min="0"')}${fld('Answer (s)', 'ans', q.ans || 90, 'number', 'min="10"')}${fld('Retakes', 'ret', q.ret != null ? q.ret : 1, 'number', 'min="0"')}</div>
      ${area('Accept when — one per line', 'acc', (q.acc || []).join('\n'))}${area('Reject when — one per line', 'rej', (q.rej || []).join('\n'))}`;
  }
  const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);

  /* =========================================================
     COURSES
     ========================================================= */
  const COURSE_CATS = ['Universal', 'Channel', 'Role', 'Tool', 'Client', 'Soft skills', 'Compliance'];
  const COURSES = [
    { id: 1, t: 'Remote Ready: Succeeding in Outsourced Client Roles', d: 'Learn the key responsibilities, expectations, and best practices for working as a remote outsourced sales or support professi…', cat: 'Universal', lv: 'Beginner', vis: 'All agents', track: '', mod: 5, enr: 13, date: 'Oct 5, 2026', status: 'Published', img: '../assets/hero.webp' },
    { id: 2, t: 'Getting Started with REM', d: 'Get to know REM, our services, values, platforms, tools, and ways of working. This course covers the essential information a…', cat: 'Universal', lv: 'Beginner', vis: 'All agents', track: '', mod: 4, enr: 13, date: 'Oct 5, 2026', status: 'Published', img: '../assets/roles-team.webp' },
    { id: 3, t: 'Inside Sales Representative', d: 'Master the complete inside sales cycle, from nurturing warm leads and conducting virtual product demos to confidently closi…', cat: 'Role', lv: 'Advanced', vis: 'Role-restricted', track: 'Virtual Sales Team', mod: 2, enr: 27, date: 'Aug 29, 2026', status: 'Published', img: '../assets/hero-ai.webp' },
    { id: 4, t: 'Sales Development Representative (SDR)', d: 'Comprehensive Sales Development Representative (SDR) course.', cat: 'Soft skills', lv: 'Intermediate', vis: 'Role-restricted', track: 'Virtual Sales Team', mod: 3, enr: 16, date: 'Aug 29, 2026', status: 'Published', img: '../assets/cta-ai.webp' }
  ];
  const TRACKS = [
    { id: 1, t: 'Virtual Sales Team', d: 'Conducts outbound prospecting across cold email, phone, and LinkedIn. Responsible for qualifying…', img: '../assets/track-sales.webp', active: true, order: 0, slug: 'virtual-sales-team' },
    { id: 2, t: 'Back Office & Administrative', d: 'Back Office & Administrative teams handle the internal operations, data management, and suppo…', img: '../assets/track-backoffice.webp', active: true, order: 1, slug: 'back-office-administrative' },
    { id: 3, t: 'AI Automation & Integration', d: 'Designs and implements automated workflows using platforms like Zapier, Make (Integromat), an…', img: '../assets/track-automation.webp', active: true, order: 2, slug: 'ai-automation-integration' }
  ];
  const stCls = s => ({ Published: 'green', Draft: 'amber', Archived: 'gray' }[s]);
  function courses() {
    const cnt = s => COURSES.filter(c => c.status === s).length, sum = k => COURSES.reduce((n, c) => n + c[k], 0);
    const rows = COURSES.filter(c => (S.courseStatus === 'all' || c.status === S.courseStatus) && (!S.courseCat || c.cat === S.courseCat) && (!S.courseTrack || c.track === S.courseTrack));
    return head('Learning', 'Courses', `${COURSES.length} courses`, btn('New course', 'course-new', 'dark', 'plus')) +
      `<div style="margin-bottom:18px">${statbox([
        { label: 'Courses', value: COURSES.length, icon: 'cap', sub: `${cnt('Published')} published · ${cnt('Draft')} draft`, hero: 1 },
        { label: 'Modules', value: sum('mod'), icon: 'layers', sub: 'Across every course' },
        { label: 'Enrolments', value: sum('enr'), icon: 'users', sub: 'All time' },
        { label: 'Tracks', value: TRACKS.length, icon: 'book', sub: `${TRACKS.filter(t => t.active).length} active` }
      ]).replace('class="statbox"', 'class="statbox" style="grid-template-columns:repeat(4,minmax(0,1fr))"')}</div>
      <div class="toolbar">${chipbar('course', [['all', 'All', COURSES.length], ['Draft', 'Draft', cnt('Draft')], ['Published', 'Published', cnt('Published')], ['Archived', 'Archived', cnt('Archived')]], S.courseStatus)}
        ${selectBox('course-cat', [['', 'All categories'], ...COURSE_CATS], S.courseCat, 'Category')}
        ${S.courseTrack ? `<button type="button" class="tag-pill" data-act="course-track-clear" style="--c:var(--blue);cursor:pointer"><i></i>Track: ${esc(S.courseTrack)} ✕</button>` : ''}
        <span class="grow"></span>${search('courses', 'Search title, description or tag…')}</div>
      <div class="course-grid">${rows.length ? rows.map(c => `<article class="course-card" ${sr('courses', [c.t, c.d, c.cat, c.lv, c.vis, c.track].join(' '))}>
        <div class="cov">${c.img ? `<img src="${c.img}" alt="">` : `<div style="position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(150deg,var(--blue),var(--navy-2));color:#fff">${ic('cap', 34)}</div>`}${stPill(c.status, stCls(c.status))}</div>
        <div class="cb2"><h3>${esc(c.t)}</h3><p>${esc(c.d) || '<em>No summary yet</em>'}</p>
          <div class="tags"><span>${esc(c.cat)}</span><span class="lv">${esc(c.lv)}</span><span>${esc(c.vis)}</span>${c.track ? `<span>${esc(c.track)}</span>` : ''}</div>
          <div class="cf"><span class="nums"><span>${ic('layers')}<b>${c.mod}</b> modules</span><span>${ic('users')}<b>${c.enr}</b> enrolled</span></span>
            <span style="display:flex;gap:8px;align-items:center">${esc(c.date)}<button class="text-btn" data-act="course-status" data-id="${c.id}">${c.status === 'Published' ? 'Archive' : 'Publish'}</button><button class="icon-btn2" data-act="course-open" aria-label="Open course">${ic('arrow')}</button></span></div></div>
      </article>`).join('') : empty('No courses match these filters.', 'cap')}</div>`;
  }
  function courseForm() {
    return `${fld('Title *', 'title', '', 'text', 'placeholder="e.g. Live Chat Support Fundamentals"')}
      <div class="form-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${sel('Category', 'cat', COURSE_CATS, 'Universal')}${sel('Level', 'lv', ['Beginner', 'Intermediate', 'Advanced'], 'Beginner')}${fld('Language', 'lang', 'English')}</div>
      ${sel('Track', 'track', [['', 'No track — standalone course'], ...TRACKS.map(t => t.t)], S.courseTrack)}<p class="fld-hint">Groups this course into a learning pathway. You can change it later.</p>
      ${sel('Visibility', 'vis', ['All agents', 'Role-restricted'], 'All agents')}<p class="fld-hint">Role-restricted courses are only visible to agents holding a linked role.</p>
      ${area('Summary', 'sum', '', 'placeholder="One line agents see in the catalog"')}`;
  }

  /* =========================================================
     TRACKS
     ========================================================= */
  function tracks() {
    const rows = TRACKS.filter(t => S.trackFilter === 'all' || (S.trackFilter === 'active') === t.active).sort((a, b) => a.order - b.order);
    const count = t => COURSES.filter(c => c.track === t.t).length;
    return head('Learning', 'Tracks', `${TRACKS.length} learning pathways`, btn('New track', 'track-new', 'dark', 'plus')) +
      `<div class="toolbar">${chipbar('track', [['all', 'All', TRACKS.length], ['active', 'Active', TRACKS.filter(t => t.active).length], ['inactive', 'Inactive', TRACKS.filter(t => !t.active).length]], S.trackFilter)}<span class="grow"></span>${search('tracks', 'Search tracks…')}</div>
      <div class="track-grid">${rows.length ? rows.map(t => `<article class="track-card ${t.active ? '' : 'inactive'}" ${sr('tracks', t.t + ' ' + t.d)}>
        <div class="track-cov">${t.img ? `<img src="${esc(t.img)}" alt="">` : ''}<span class="ord">#${t.order + 1}</span>${stPill(t.active ? 'Active' : 'Inactive', t.active ? 'green' : 'gray')}<span class="tt">${esc(t.t)}</span></div>
        <div class="track-body"><p>${esc(t.d) || '<em>No description</em>'}</p>
          <div class="tm"><span>${ic('cap')}${count(t)} course${count(t) === 1 ? '' : 's'}</span><span>${ic('link')}${esc(t.slug)}</span></div>
          <div class="track-actions">${btn('Open', 'track-open', 'dark', '', `data-id="${t.id}"`)}${btn('Edit', 'track-edit', 'outline', 'edit', `data-id="${t.id}"`)}<button class="icon-btn2 del" style="height:36px;width:36px;border-radius:999px" data-act="track-del" data-id="${t.id}" aria-label="Delete track">${ic('x')}</button></div></div>
      </article>`).join('') : empty('No tracks here.', 'book')}</div>`;
  }
  function trackModal(t) {
    const editing = !!t; t = t || { t: '', d: '', img: '', active: true, order: TRACKS.length, slug: '' };
    let img = t.img, mode = 'upload';
    const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    modal(editing ? 'Edit track' : 'New track', `${fld('Title *', 'title', t.t, 'text', 'placeholder="e.g. Voice Support Path"')}
      ${area('Description', 'desc', t.d, 'placeholder="What an agent gets from finishing this path."')}
      <div class="fld"><div class="fld-head"><span>Tile image <small class="muted" style="font-weight:500">— optional</small></span><span class="seg-toggle"><button type="button" class="on" data-mode="upload">Upload</button><button type="button" data-mode="link">Paste a link</button></span></div>
        <div data-pane="upload"><label class="img-drop" id="imgDrop">${img ? `<img src="${esc(img)}" alt="">` : `${ic('image')}<span>Click or drop an image here</span>`}<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload tile image"></label></div>
        <div data-pane="link" hidden><input name="link" type="url" placeholder="https://…" style="width:100%;height:44px;border:1px solid var(--line);border-radius:12px;padding:0 14px;background:var(--card-soft);color:var(--text)"></div>
        <p class="fld-hint">JPEG, PNG or WebP · up to 5 MB.</p></div>
      <div class="form-grid" style="grid-template-columns:2fr 1fr">${fld('Slug <small class="muted" style="font-weight:500">— optional</small>', 'slug', t.slug, 'text', `placeholder="${esc(slugify(t.t) || 'voice-support-path')}"`)}${fld('Order', 'order', t.order, 'number', 'min="0"')}</div>
      <label class="check-row"><input type="checkbox" name="active" ${t.active ? 'checked' : ''}>Active — a deactivated track stays out of the course picker</label>`,
      editing ? 'Save track' : 'Create track', fd => {
        if (!fd.title.trim()) return 'Add a title first.';
        if (mode === 'link' && fd.link) img = fd.link;
        const data = { t: fd.title.trim(), d: fd.desc.trim(), img, active: fd.active, order: Math.max(0, parseInt(fd.order, 10) || 0), slug: fd.slug.trim() || slugify(fd.title) };
        if (editing) { const old = t.t; Object.assign(t, data); COURSES.forEach(c => { if (c.track === old) c.track = t.t; }); toast('Track saved'); }
        else { TRACKS.push({ id: ++uid, ...data }); toast(`Track “${data.t}” created`); }
        rerender();
      }, form => {
        requireField('title')(form);
        const slugIn = form.querySelector('[name=slug]');
        form.querySelector('[name=title]').addEventListener('input', e => { slugIn.placeholder = slugify(e.target.value) || 'voice-support-path'; });
        form.querySelectorAll('.seg-toggle button').forEach(b => b.addEventListener('click', () => {
          mode = b.dataset.mode;
          form.querySelectorAll('.seg-toggle button').forEach(x => x.classList.toggle('on', x === b));
          form.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== mode; });
        }));
        form.querySelector('input[type=file]').addEventListener('change', e => {
          const f = e.target.files[0]; if (!f) return;
          if (f.size > 5 * 1024 * 1024) { form.querySelector('.sc-err').textContent = 'That image is over 5 MB.'; return; }
          const rd = new FileReader();
          rd.onload = () => { img = rd.result; const drop = form.querySelector('#imgDrop'); drop.querySelector('img, .icon, span')?.remove(); drop.querySelectorAll('.icon, span').forEach(n => n.remove()); drop.insertAdjacentHTML('afterbegin', `<img src="${img}" alt="">`); };
          rd.readAsDataURL(f);
        });
      });
  }

  /* =========================================================
     AGENT CONNECTIONS
     ========================================================= */
  const CONN = [
    { id: 1, n: 'Eyob S.', e: 'm•••••@gmail.com', tests: 4, down: 29.9, up: 13.2, ping: 152, ok: 25, warn: 0, vpn: 0, last: '6 h ago', lastH: 6 },
    { id: 2, n: 'Rukiya M.', e: 'r•••••@gmail.com', tests: 3, down: 1.5, up: 7.3, ping: 150, ok: 0, warn: 0, vpn: 0, last: '6 days ago', lastH: 144 },
    { id: 3, n: 'Solomon T.', e: 's•••••@gmail.com', tests: 5, down: 7.2, up: 8.8, ping: 131, ok: 20, warn: 20, vpn: 0, last: '4 days ago', lastH: 96 },
    { id: 4, n: 'Yasmin Y.', e: 'l•••••@gmail.com', tests: 2, down: 1.0, up: 9.2, ping: 154, ok: 0, warn: 0, vpn: 0, last: '33 h ago', lastH: 33 },
    { id: 5, n: 'Yeabsira T.', e: 'y•••••@gmail.com', tests: 2, down: 0.4, up: 8.9, ping: 166, ok: 0, warn: 0, vpn: 0, last: '34 h ago', lastH: 34 }
  ];
  const COLS = [['n', 'Agent'], ['tests', 'Tests', 'n'], ['down', 'Avg ↓', 'n'], ['up', 'Avg ↑', 'n'], ['ping', 'Ping', 'n'], ['ok', 'Healthy'], ['vpn', 'VPN', 'n'], ['lastH', 'Last test']];
  function connections() {
    const { k, dir } = S.connSort;
    const rows = [...CONN].sort((a, b) => (typeof a[k] === 'string' ? a[k].localeCompare(b[k]) : a[k] - b[k]) * dir);
    return head('Network', 'Agent connections', `${CONN.length} agents tested in the last 7 days`,
      `${btn('Export', 'conn-export', 'outline', 'dl')}${chipbar('conn-range', [['24h', '24h'], ['7d', '7d'], ['30d', '30d']], S.connRange)}`) +
      (S.connRange !== '7d' ? `<div class="info" style="margin-bottom:14px">${ic('clock', 18)}<span>The prototype holds the 7-day snapshot only, so ${S.connRange} shows the same agents.</span></div>` : '') +
      `<div style="margin-bottom:18px">${statbox([
        { label: 'Agents tested', value: 5, icon: 'users', sub: 'In the last 7 days', hero: 1 },
        { label: 'Tests', value: 16, icon: 'gauge', sub: 'Manual and automated' },
        { label: 'Fleet avg download', value: '10.2<small style="font-size:14px;opacity:.7"> Mbps</small>', icon: 'down', sub: 'Across all tests' },
        { label: 'Healthy tests', value: '13%', icon: 'check', sub: `<span class="pill-delta red">87% unhealthy</span>` }
      ]).replace('class="statbox"', 'class="statbox" style="grid-template-columns:repeat(4,minmax(0,1fr))"')}</div>
      <section class="box">${boxH('Speed tests by agent', 'Click a column to sort', search('conn', 'Search by name or email…'))}
      <div class="ft-wrap"><table class="ft"><thead><tr>${COLS.map(([key, l, c]) => `<th class="sort ${c || ''} ${k === key ? 'on' : ''}" data-act="conn-sort" data-k="${key}">${l}${ic(k === key && dir < 0 ? 'sortu' : 'sortd')}</th>`).join('')}<th></th></tr></thead><tbody>
        ${rows.map(r => `<tr ${sr('conn', r.n + ' ' + r.e)}><td><div class="cell">${av(r.n, 32)}<div><div class="t1">${esc(r.n)}</div><div class="t2">${esc(r.e)}</div></div></div></td>
          <td class="n">${r.tests}</td><td class="n">${r.down.toFixed(1)}<span class="unit">Mbps</span></td><td class="n">${r.up.toFixed(1)}<span class="unit">Mbps</span></td><td class="n">${r.ping}<span class="unit">ms</span></td>
          <td><div class="health"><span class="hb"><i style="width:${r.ok}%;background:var(--green)"></i><i style="width:${r.warn}%;background:#f5b301"></i></span><b>${r.ok}%</b></div></td>
          <td class="n">${r.vpn}</td><td>${esc(r.last)}</td><td class="n"><button class="icon-btn2" data-act="conn-view" data-id="${r.id}" aria-label="Open ${esc(r.n)}">${ic('arrow')}</button></td></tr>`).join('')}
      </tbody></table></div>
      <div class="pager"><span>1–${CONN.length} of ${CONN.length}</span><span class="pg">Per page ${selectBox('conn-per', ['20', '50', '100'], '20', 'Rows per page')}<button disabled>← Previous</button><span>Page 1 of 1</span><button disabled>Next →</button></span></div></section>`;
  }

  /* =========================================================
     NETWORK SETTINGS
     ========================================================= */
  const INTERVALS = ['30 min', '1 hour', '2 hours', '3 hours', '4 hours'];
  function netsettings() {
    const d = S.netDraft || (S.netDraft = { ...S.net });
    const dirty = d.auto !== S.net.auto || d.every !== S.net.every;
    return head('Network', 'Network settings', 'Applies to every agent on the platform') + `<div class="sc-grid"><div class="sc-stack">
      <section class="box set-card"><div class="set-h"><div><h3>Automated testing</h3><p>While an agent is clocked in, their browser runs a speed test on this schedule in addition to any they run themselves.</p></div></div>
        <div class="set-row"><div><b>Run tests automatically</b><small>Off stops the timer for everyone. Manual tests still work.</small></div>
          <button type="button" class="sw big ${d.auto ? 'on' : ''}" data-act="net-auto" role="switch" aria-checked="${d.auto}" aria-label="Run tests automatically" style="border:0;cursor:pointer"><i></i></button></div>
        <div class="set-row col"><b>Test every</b><div class="interval">${INTERVALS.map(v => `<button type="button" data-act="net-every" data-v="${v}" class="${d.every === v ? 'on' : ''}" ${d.auto ? '' : 'disabled'}>${v}</button>`).join('')}</div>
          <small>Each test downloads and uploads for about ten seconds, so a shorter interval costs agents more data. Open agent screens pick up a change within ten minutes.</small></div>
        <div class="set-foot"><span>Last changed ${S.net.changed} by ${esc(session.name)}</span><span style="display:flex;gap:8px">${dirty ? btn('Discard', 'net-discard', 'ghost') : ''}<button type="button" class="btn-pill primary sc-btn" data-act="net-save" ${dirty ? '' : 'disabled'}>Save changes</button></span></div></section>
      <section class="box set-card"><div class="set-h"><div><h3>Session sweep</h3><p>Sessions still open after 16 hours are closed automatically, checked every 15 minutes.</p></div>${stPill('Running', 'green')}</div>
        <div class="sweep"><div><div class="k">On shift now</div><div class="v">0</div></div><div><div class="k">Past the cap</div><div class="v">0</div></div><div><div class="k">Last sweep</div><div class="v">${S.lastSweep}</div><small>closed 0</small></div></div>
        <div class="set-foot"><span>Run it now instead of waiting for the next pass.</span>${btn('Close stale sessions', 'net-sweep', 'outline', 'bolt')}</div></section>
    </div><div class="sc-stack">${box('', boxH('Current schedule') + `<div class="kv-list"><div><span>Automatic tests</span><b>${S.net.auto ? 'On' : 'Off'}</b></div><div><span>Interval</span><b>${S.net.every}</b></div><div><span>Session cap</span><b>16 hours</b></div><div><span>Sweep checks</span><b>Every 15 min</b></div></div>`)}</div></div>`;
  }

  const closePops = () => document.querySelectorAll('#content .pop').forEach(p => p.remove());
  document.addEventListener('click', e => { if (!e.target.closest('.pop, [data-act="menu"]')) closePops(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePops(); });

  /* =========================================================
     ACTIONS
     ========================================================= */
  function filterSearch(input) {
    const scope = input.dataset.scope, q = input.value.trim().toLowerCase();
    Q[scope] = input.value;
    document.querySelectorAll(`#content [data-sr="${scope}"]`).forEach(el => { el.style.display = !q || el.dataset.text.includes(q) ? '' : 'none'; });
  }
  function handle(e) {
    const t = e.target;
    if (e.type === 'input') {
      if (t.dataset.act === 'search') filterSearch(t);
      if (t.closest('#profForm')) profDirty();
      if (t.dataset.addTitle) { const b = t.closest('.add-row').querySelector('[data-act="role-add"]'); b.disabled = !t.value.trim(); }
      return;
    }
    if (e.type === 'change') {
      const a = t.dataset.act;
      if (t.closest('#profForm')) return profDirty();
      if (a === 'app-role') { S.appRole = t.value; rerender(); }
      if (a === 'req-wants') { S.reqWants = t.value; rerender(); }
      if (a === 'course-cat') { S.courseCat = t.value; rerender(); }
      if (a === 'conn-per') toast('All 5 agents already fit on one page');
      if (a === 'role-move') { const [from, r] = findRole(+t.dataset.id), to = CATS.find(c => c.id === +t.value); if (r && to && to !== from) { from.roles = from.roles.filter(x => x !== r); to.roles.push(r); toast(`Moved “${r.title}” to ${to.name}`); rerender(); } }
      return;
    }
    const el = t.closest('[data-act]'); if (!el) return;
    const a = el.dataset.act, id = +el.dataset.id;
    if (a !== 'menu') closePops();
    switch (a) {
      case 'chip': {
        const g = el.dataset.group, v = el.dataset.id;
        const map = { admin: 'adminFilter', app: 'appStatus', agent: 'agentFilter', 'roles-tab': 'rolesTab', req: 'reqStatus', qmode: 'qMode', bank: 'bankFilter', course: 'courseStatus', track: 'trackFilter', 'conn-range': 'connRange' };
        if (map[g]) { S[map[g]] = v; rerender(); }
        break;
      }
      /* profile */
      case 'photo': toast('Photo upload isn’t connected in the prototype'); break;
      case 'profsave': { const f = document.getElementById('profForm'); Object.keys(PROF).forEach(k => { PROF[k] = f.elements[k].value.trim(); }); document.getElementById('userName').textContent = fullName(); toast('Profile saved in this browser'); rerender(); break; }
      case 'profreset': rerender(); break;
      /* security */
      case 'twofa-on': modal('Turn on two-factor', `<div class="qr" aria-hidden="true">${qrCells()}</div><p class="code-note">JBSW Y3DP EHPK 3PXP</p>
          <p style="margin:0;font-size:13px;color:var(--muted);text-align:center">Scan with your authenticator app, then enter the 6-digit code.<br><small>Prototype: any 6 digits work — nothing is sent.</small></p>
          ${fld('Verification code', 'code', '', 'text', 'inputmode="numeric" maxlength="6" placeholder="123 456" autocomplete="one-time-code"')}`, 'Verify & turn on',
          fd => { if (!/^\d{6}$/.test(fd.code.replace(/\s/g, ''))) return 'Enter the 6-digit code from your app.'; S.twofa = true; toast('Two-factor authentication is on'); rerender(); }); break;
      case 'twofa-off': confirmBox('Turn off two-factor?', 'Your admin account will be protected by your password only.', 'Turn off', () => { S.twofa = false; toast('Two-factor authentication is off'); rerender(); }); break;
      case 'password': modal('Change password', `${fld('Current password', 'cur', '', 'password', 'autocomplete="current-password"')}${fld('New password', 'pw', '', 'password', 'autocomplete="new-password" minlength="8"')}${fld('Confirm new password', 'pw2', '', 'password', 'autocomplete="new-password"')}<p class="fld-hint">At least 8 characters. Prototype: nothing is stored or sent.</p>`, 'Update password',
          fd => { if (!fd.cur) return 'Enter your current password.'; if (fd.pw.length < 8) return 'Use at least 8 characters.'; if (fd.pw !== fd.pw2) return 'The new passwords don’t match.'; toast('Password updated · other devices signed out (prototype)'); }); break;
      /* admins */
      case 'invite': modal('Invite admin', `${fld('Full name', 'name', '', 'text', 'placeholder="e.g. Hana Tesfaye"')}${fld('Work email *', 'email', '', 'email', 'placeholder="name@remconnect.io"')}${sel('Role', 'role', ['Admin', 'Super admin', 'Recruiter', 'Ops'], 'Admin')}<p class="fld-hint">Prototype: no email is sent — the invite appears as Pending.</p>`, 'Send invite',
          fd => { if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fd.email)) return 'Enter a valid email address.'; ADMINS.push({ id: ++uid, name: fd.name.trim() || fd.email.split('@')[0], email: fd.email.trim(), role: fd.role, status: 'Pending' }); toast(`Invite created for ${fd.email}`); rerender(); }); break;
      case 'admin-deact': { const ad = ADMINS.find(x => x.id === id); confirmBox(`Deactivate ${esc(ad.name)}?`, 'They’ll lose access to the admin console straight away. You can reactivate them later.', 'Deactivate', () => { ad.status = 'Deactivated'; toast(`${ad.name} deactivated`); rerender(); }); break; }
      case 'admin-react': { const ad = ADMINS.find(x => x.id === id); ad.status = 'Active'; toast(`${ad.name} reactivated`); rerender(); break; }
      case 'admin-resend': toast('Invite re-sent (prototype)'); break;
      case 'admin-revoke': { const i = ADMINS.findIndex(x => x.id === id); const ad = ADMINS[i]; ADMINS.splice(i, 1); toast(`Invite for ${ad.email} revoked`); rerender(); break; }
      /* applications */
      case 'app-sort': S.appSort = S.appSort === 'longest' ? 'newest' : 'longest'; rerender(); break;
      case 'file': toast(`The applicant’s ${el.dataset.kind} isn’t included in the prototype`); break;
      case 'app-move': { const ap = APPS.find(x => x.id === id); APP_COUNT[ap.status]--; APP_COUNT[el.dataset.to]++; const lbl = { approved: 'approved', hold: 'put on hold', rejected: 'rejected', awaiting: 'moved back to review' }[el.dataset.to]; ap.status = el.dataset.to; toast(`${ap.name} ${lbl}`); rerender(); break; }
      /* agents */
      case 'stealth': S.stealth = !S.stealth; rerender(); break;
      case 'agent-view-mode': S.agentView = el.dataset.mode; rerender(); break;
      case 'agent-view': agentDrawer(AGENTS.find(x => x.id === id)); break;
      /* roles */
      case 'cat-new': modal('New category', fld('Category name *', 'name', '', 'text', 'placeholder="e.g. Customer Support"'), 'Create category', fd => { if (!fd.name.trim()) return 'Give the category a name.'; CATS.push({ id: ++uid, name: fd.name.trim(), roles: [] }); toast('Category created'); rerender(); }, requireField('name')); break;
      case 'cat-edit': { const c = CATS.find(x => x.id === id); modal('Rename category', fld('Category name *', 'name', c.name), 'Save', fd => { if (!fd.name.trim()) return 'Give the category a name.'; c.name = fd.name.trim(); rerender(); }, requireField('name')); break; }
      case 'cat-retire': { const c = CATS.find(x => x.id === id); c.retired = !c.retired; toast(`${c.name} ${c.retired ? 'retired' : 'restored'}`); rerender(); break; }
      case 'cat-del': { const c = CATS.find(x => x.id === id); confirmBox(`Delete ${esc(c.name)}?`, c.roles.length ? `Its ${c.roles.length} role${c.roles.length > 1 ? 's' : ''} will be deleted too. Retiring keeps them for history instead.` : 'This category has no roles.', 'Delete', () => { CATS.splice(CATS.indexOf(c), 1); toast('Category deleted'); rerender(); }); break; }
      case 'menu': {
        const wasOpen = el.parentElement.querySelector('.pop');
        closePops(); if (wasOpen) break;
        const items = el.dataset.menu === 'role'
          ? (() => { const [, r] = findRole(id); return [['role-edit', 'edit', 'Edit role'], ['role-move-open', 'swap', 'Move to category…'], ['role-retire', 'archive', r.retired ? 'Restore' : 'Retire'], ['role-del', 'x', 'Delete', 'danger']]; })()
          : (() => { const c = CATS.find(x => x.id === id); return [['cat-edit', 'edit', 'Rename'], ['add-open', 'plus', 'Add role'], ['cat-retire', 'archive', c.retired ? 'Restore' : 'Retire'], ['cat-del', 'x', 'Delete category', 'danger']]; })();
        el.parentElement.style.position = 'relative';
        el.insertAdjacentHTML('afterend', `<div class="pop" role="menu">${items.map(([act, icon, label, cls]) => `<button type="button" role="menuitem" class="${cls || ''}" data-act="${act}" data-id="${id}">${ic(icon, 14)}${label}</button>`).join('')}</div>`);
        break;
      }
      case 'cat-toggle': S.catClosed[id] = !S.catClosed[id]; rerender(); break;
      case 'add-open': S.addOpen = id; S.catClosed[id] = false; rerender(); setTimeout(() => document.querySelector(`[data-add-title="${id}"]`)?.focus(), 30); break;
      case 'add-cancel': S.addOpen = null; rerender(); break;
      case 'role-move-open': { const [c, r] = findRole(id); modal(`Move ${esc(r.title)}`, sel('Category', 'cat', CATS.map(x => [String(x.id), x.name]), String(c.id)), 'Move role', fd => { const to = CATS.find(x => x.id === +fd.cat); if (to && to !== c) { c.roles = c.roles.filter(x => x !== r); to.roles.push(r); toast(`Moved to ${to.name}`); rerender(); } }); break; }
      case 'role-add': { const row = el.closest('.add-row'), title = row.querySelector('[data-add-title]').value.trim(); if (!title) return; CATS.find(x => x.id === id).roles.push({ id: ++uid, title, desc: row.querySelector('[data-add-desc]').value.trim() }); S.addOpen = null; toast(`Role “${title}” added`); rerender(); break; }
      case 'role-retire': { const [, r] = findRole(id); r.retired = !r.retired; toast(`${r.title} ${r.retired ? 'retired' : 'restored'}`); rerender(); break; }
      case 'role-edit': { const [, r] = findRole(id); modal('Edit role', fld('Role title *', 'title', r.title) + area('Description', 'desc', r.desc), 'Save role', fd => { if (!fd.title.trim()) return 'Give the role a title.'; r.title = fd.title.trim(); r.desc = fd.desc.trim(); rerender(); }, requireField('title')); break; }
      case 'role-del': { const [c, r] = findRole(id); confirmBox(`Delete ${esc(r.title)}?`, 'Agents holding this role keep their history. Retiring hides it from new assignments instead.', 'Delete', () => { c.roles = c.roles.filter(x => x !== r); toast('Role deleted'); rerender(); }); break; }
      case 'req-approve': case 'req-decline': { const r = REQS.find(x => x.id === id); r.status = a === 'req-approve' ? 'approved' : 'declined'; toast(`${r.name}’s request ${r.status}`); rerender(); break; }
      case 'req-undo': { const r = REQS.find(x => x.id === id); r.status = 'awaiting'; S.reqStatus = 'awaiting'; rerender(); break; }
      case 'req-expand': el.classList.toggle('open'); break;
      /* assessment bank */
      case 'bank-new': modal('New assessment', `${fld('Title *', 'title', '', 'text', 'placeholder="e.g. Live Chat Fundamentals"')}${sel('Who takes it', 'scope', ['All agents', ...CATS.map(c => `${c.name} · ${c.roles.length} roles`)], 'All agents')}${fld('Pass mark (%)', 'pm', 70, 'number', 'min="0" max="100"')}<p class="fld-hint">Add questions after creating it. Prototype: saved in this browser only.</p>`, 'Create assessment',
          fd => { if (!fd.title.trim()) return 'Give the assessment a title.'; const pm = Math.min(100, Math.max(0, parseInt(fd.pm, 10) || 0)); BANK.push({ id: ++uid, t: fd.title.trim(), scope: fd.scope, q: 0, att: 0, pm }); toast('Assessment created'); rerender(); }, requireField('title')); break;
      case 'bank-edit': { const b = BANK.find(x => x.id === id); modal('Edit assessment', `${fld('Title *', 'title', b.t)}${fld('Pass mark (%)', 'pm', b.pm, 'number', 'min="0" max="100"')}`, 'Save', fd => { if (!fd.title.trim()) return 'Give the assessment a title.'; b.t = fd.title.trim(); b.pm = Math.min(100, Math.max(0, parseInt(fd.pm, 10) || 0)); rerender(); }, requireField('title')); break; }
      case 'bank-retire': { const b = BANK.find(x => x.id === id); b.retired = !b.retired; toast(`${b.t} ${b.retired ? 'retired' : 'restored'}`); rerender(); break; }
      /* questions */
      case 'q-up': case 'q-down': { const i = QS.findIndex(x => x.id === id), j = a === 'q-up' ? i - 1 : i + 1; if (j < 0 || j >= QS.length) return; [QS[i], QS[j]] = [QS[j], QS[i]]; rerender(); break; }
      case 'q-new': modal('New question', questionForm(), 'Add question', fd => { if (!fd.q.trim()) return 'Write the question first.'; QS.push({ id: ++uid, scope: fd.scope, q: fd.q.trim(), g: fd.g.trim(), prep: +fd.prep || 0, ans: +fd.ans || 60, ret: +fd.ret || 0, acc: lines(fd.acc), rej: lines(fd.rej) }); toast('Question added'); rerender(); }, requireField('q')); break;
      case 'q-edit': { const q = QS.find(x => x.id === id); modal('Edit question', questionForm(q), 'Save question', fd => { if (!fd.q.trim()) return 'Write the question first.'; Object.assign(q, { scope: fd.scope, q: fd.q.trim(), g: fd.g.trim(), prep: +fd.prep || 0, ans: +fd.ans || 60, ret: +fd.ret || 0, acc: lines(fd.acc), rej: lines(fd.rej) }); toast('Question saved'); rerender(); }, requireField('q')); break; }
      case 'q-retire': { const q = QS.find(x => x.id === id); q.retired = !q.retired; toast(q.retired ? 'Question retired' : 'Question restored'); rerender(); break; }
      case 'q-del': confirmBox('Delete this question?', 'Answers already recorded stay on applicants’ profiles. Retiring keeps the question for history instead.', 'Delete', () => { QS.splice(QS.findIndex(x => x.id === id), 1); toast('Question deleted'); rerender(); }); break;
      /* courses */
      case 'course-new': modal('New course', courseForm(), 'Create & build', fd => {
          if (!fd.title.trim()) return 'Add a title first.';
          COURSES.unshift({ id: ++uid, t: fd.title.trim(), d: fd.sum.trim(), cat: fd.cat, lv: fd.lv, vis: fd.vis, track: fd.track, mod: 0, enr: 0, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), status: 'Draft', img: '' });
          S.courseStatus = 'all'; toast('Draft course created — the course builder isn’t part of the prototype'); rerender();
        }, requireField('title')); break;
      case 'course-status': { const c = COURSES.find(x => x.id === id); c.status = c.status === 'Published' ? 'Archived' : 'Published'; toast(`${c.t} ${c.status.toLowerCase()}`); rerender(); break; }
      case 'course-open': toast('The course builder isn’t part of the prototype'); break;
      case 'course-track-clear': S.courseTrack = ''; rerender(); break;
      /* tracks */
      case 'track-new': trackModal(); break;
      case 'track-edit': trackModal(TRACKS.find(x => x.id === id)); break;
      case 'track-open': { const tr = TRACKS.find(x => x.id === id); S.courseTrack = tr.t; S.courseStatus = 'all'; S.courseCat = ''; location.hash = 'courses'; break; }
      case 'track-del': { const tr = TRACKS.find(x => x.id === id); const n = COURSES.filter(c => c.track === tr.t).length; confirmBox(`Delete ${esc(tr.t)}?`, n ? `${n} course${n > 1 ? 's' : ''} will become standalone. The courses themselves stay.` : 'No courses use this track.', 'Delete', () => { COURSES.forEach(c => { if (c.track === tr.t) c.track = ''; }); TRACKS.splice(TRACKS.indexOf(tr), 1); toast('Track deleted'); rerender(); }); break; }
      /* connections */
      case 'conn-sort': { const k = el.dataset.k; S.connSort = { k, dir: S.connSort.k === k ? -S.connSort.dir : 1 }; rerender(); break; }
      case 'conn-export': {
        const csv = ['Agent,Tests,Avg download (Mbps),Avg upload (Mbps),Ping (ms),Healthy %,VPN,Last test', ...CONN.map(r => [r.n, r.tests, r.down, r.up, r.ping, r.ok, r.vpn, r.last].join(','))].join('\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); const link = document.createElement('a');
        link.href = url; link.download = 'agent-connections-7d.csv'; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast('Exported agent-connections-7d.csv'); break;
      }
      case 'conn-view': { const r = CONN.find(x => x.id === id); drawer(`<div class="dh"><b>Connection details</b><button type="button" class="round" data-close aria-label="Close">${ic('x', 16)}</button></div>
          <div class="dp">${av(r.n, 64)}<b>${esc(r.n)}</b><small>${r.tests} tests · last ${esc(r.last)}</small></div>
          <div class="kv-list"><div><span>Avg download</span><b>${r.down} Mbps</b></div><div><span>Avg upload</span><b>${r.up} Mbps</b></div><div><span>Ping</span><b>${r.ping} ms</b></div><div><span>Healthy tests</span><b>${r.ok}%</b></div><div><span>Warning tests</span><b>${r.warn}%</b></div><div><span>Behind a VPN</span><b>${r.vpn}</b></div></div>
          <p class="note2">${r.ok >= 50 ? 'Mostly healthy.' : 'Most tests were unhealthy — worth a check-in before their next shift.'}</p>`); break; }
      /* network settings */
      case 'net-auto': S.netDraft.auto = !S.netDraft.auto; rerender(); break;
      case 'net-every': S.netDraft.every = el.dataset.v; rerender(); break;
      case 'net-discard': S.netDraft = null; rerender(); break;
      case 'net-save': S.net = { ...S.netDraft, changed: 'just now' }; S.netDraft = null; toast('Network settings saved (prototype)'); rerender(); break;
      case 'net-sweep': S.lastSweep = 'just now'; toast('Sweep ran — 0 stale sessions closed'); rerender(); break;
    }
  }

  return { views: { profile, security, admins, applications, agents, roles, bank, screening, courses, tracks, connections, netsettings }, handle };
};
