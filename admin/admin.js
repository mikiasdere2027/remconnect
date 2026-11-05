// RemConnect Admin Console — static prototype.
// Figures mirror a 30-day snapshot of the live admin console (3 Oct – 2 Nov 2026).
// Agent names in the Network incidents table are shortened and emails masked on purpose.
(function () {
  const KEY = 'rc-admin-session';
  let session = null;
  try { session = JSON.parse(sessionStorage.getItem(KEY) || localStorage.getItem(KEY)); } catch (e) {}
  session = session || { email: REM_DEMO.account.email, name: REM_DEMO.account.name, role: REM_DEMO.account.role };
  const first = session.name.split(' ')[0];

  /* ---------- icons ---------- */
  const P = {
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    file: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
    clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    cap: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/>',
    out: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l-5-5 5-5M5 12h11"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
    chevs: '<path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16M14 10l2 2-2 2"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    down: '<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>',
    gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-5"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    inbox: '<path d="M3 13h5l2 3h4l2-3h5"/><path d="M5 5h14l2 8v6H3v-6z"/>'
  };
  const ic = (n, s) => `<svg class="icon" viewBox="0 0 24 24"${s ? ` style="width:${s}px;height:${s}px"` : ''}>${P[n] || ''}</svg>`;

  /* ---------- navigation ---------- */
  const TABS = [['overview', 'Overview'], ['assessments', 'Assessments'], ['learning', 'Learning'], ['network', 'Network'], ['leads', 'Leads'], ['trends', 'Trends']];
  // Same menu as the live admin sidebar: [route, label, icon]
  const SIDE = [
    ['Overview', [['overview', 'Dashboard', 'home'], ['profile', 'My profile', 'user'], ['security', 'Security', 'shield']]],
    ['Access control', [['admins', 'Admin management', 'lock']]],
    ['People', [['applications', 'Applications', 'file'], ['agents', 'Agent directory', 'users'], ['roles', 'Roles & requests', 'brief'], ['bank', 'Assessments', 'clip'], ['screening', 'Screening questions', 'mic']]],
    ['Learning', [['courses', 'Courses', 'cap'], ['tracks', 'Tracks', 'list']]],
    ['Network', [['connections', 'Agent connections', 'pulse'], ['netsettings', 'Network settings', 'gear']]]
  ];
  const TITLES = { overview: 'Overview', assessments: 'Assessments', learning: 'Learning', network: 'Network', leads: 'Leads', trends: 'Trends', profile: 'My profile' };
  SIDE.forEach(g => g[1].forEach(([id, l]) => { if (!TITLES[id]) TITLES[id] = l; }));

  document.getElementById('mainNav').innerHTML = TABS.map(([id, l]) => `<a href="#${id}" data-view="${id}">${l}</a>`).join('');
  const lbl = t => `<span class="lbl">${t}</span>`;
  document.getElementById('rail').innerHTML = `
    <div class="rail-group toggle-group">
      <button class="round theme-switch" id="themeSwitch" role="switch" aria-checked="false" data-tip="Dark mode" aria-label="Dark mode">
        <span class="ts-icon">${ic('moon')}</span>${lbl('Dark mode')}<span class="ts-track" aria-hidden="true"><i></i></span>
      </button>
    </div>
    <div class="rail-group grow">${SIDE.map(([g, items], gi) =>
      (gi ? '<span class="rail-sep"></span>' : '') + `<span class="rail-h">${g}</span>` +
      items.map(([id, t, i]) => `<a class="round" href="#${id}" data-side="${id}" data-tip="${t}" aria-label="${t}">${ic(i)}${lbl(t)}</a>`).join('')).join('')}
    </div>
    <div class="rail-group signout-group">
      <button class="round" id="railOut" data-tip="Sign out" aria-label="Sign out">${ic('out')}${lbl('Sign out')}</button>
    </div>
    <button type="button" class="collapse-row" id="railToggle" data-tip="Open sidebar" aria-label="Open sidebar" aria-expanded="false"><span class="cr-ic">${ic('chevs')}</span><span class="lbl">Collapse sidebar</span></button>`;

  document.getElementById('userName').textContent = session.name;
  document.getElementById('userEmail').textContent = session.email;
  document.getElementById('userInitial').textContent = session.email[0].toUpperCase();

  /* ---------- range ---------- */
  const RANGES = { '1d': 1, '3d': 3, '7d': 7, '14d': 14, '21d': 21, '30d': 30, '60d': 60, '90d': 90, 'Custom': 30 };
  let range = '30d';
  const acActive = {};
  const fmt = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  /* ---------- building blocks ---------- */
  const tile = (label, v, sub, icon, variant = '') => `<div class="k-tile ${variant}"><div class="th">${label}<span class="ti">${ic(icon, 15)}</span></div><div class="tv">${v}</div><div class="ts">${sub}</div></div>`;
  const card = (title, body, sideHtml = '') => `<section class="card2"><div class="card2-h"><h3>${title}</h3>${sideHtml}</div>${body}</section>`;
  const side = t => `<span class="side">${t}</span>`;
  const kv = (items, cols = 3) => `<div class="kv" style="--cols:${cols}">${items.map(([k, v, s, pct]) =>
    `<div><div class="k">${k}</div><div class="v">${v}</div>${s ? `<div class="s">${s}</div>` : ''}${pct != null ? `<div class="m"><i style="width:${pct}%"></i></div>` : ''}</div>`).join('')}</div>`;
  const hbars = (rows, max) => {
    const m = max || Math.max(1, ...rows.map(r => r[1]));
    return `<div class="hbars">${rows.map(([l, v, shown, c]) => `<div class="hbar"${c ? ` style="--c:${c}"` : ''}><span title="${l}">${l}</span><div class="tr"><i style="width:${(v / m) * 100}%"></i></div><b>${shown != null ? shown : v}</b></div>`).join('')}</div>`;
  };
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };
  const page = title => {
    const days = RANGES[range], end = new Date(2026, 10, 2), start = new Date(end - days * 864e5);
    const gen = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    return `<div class="page-top">
      <div class="greet"><p class="eyebrow">Staff console</p><h1>${title}</h1>
        <p class="meta-line">${session.role} · ${fmt(start)} – ${fmt(end)} · ${days} days · generated ${gen}</p></div>
      <div class="range-box">
        <div class="chips" role="group" aria-label="Date range">${Object.keys(RANGES).map(r => `<button data-range="${r}" class="${r === range ? 'on' : ''}">${r}</button>`).join('')}</div>
        <button class="btn btn-light refresh" id="refresh">${ic('refresh')} Refresh</button>
      </div></div>`;
  };

  /* ---------- modern building blocks ---------- */
  const esc = s => String(s).replace(/"/g, '&quot;');
  const box = (cls, inner) => `<section class="box ${cls}">${inner}</section>`;
  const boxH = (title, sub, right = '') => `<div class="box-h"><div><h3>${title}</h3>${sub ? `<p>${sub}</p>` : ''}</div>${right}</div>`;
  const pd = (t, c = '') => `<span class="pill-delta ${c}">${t}</span>`;
  const tagPill = (t, c) => `<span class="tag-pill" style="--c:${c || 'var(--green)'}"><i></i>${t}</span>`;
  const C = { navy: 'var(--bar-dark)', blue: 'var(--blue)', light: 'var(--hatch)', green: 'var(--green)', amber: '#f5b301', red: '#e5484d', gray: '#9aa8bd', sky: '#60a5fa' };

  function headline(o) {
    return `<div class="hl-top"><small>${o.label}</small>${o.tag || ''}</div>
      <div class="hl-num">${o.value}${o.unit ? `<em>${o.unit}</em>` : ''}</div>
      <div class="hl-sub">${o.sub || ''}</div>
      ${o.actions ? `<div class="hl-actions">${o.actions.map((a, i) => `<a class="btn-pill ${i ? 'ghost' : 'primary'}" href="${a[1]}">${ic(a[2], 16)} ${a[0]}</a>`).join('')}</div>` : ''}
      <div class="inner" style="margin-top:${o.actions ? 0 : 16}px">
        <div class="mini-head"><b>${o.miniTitle}</b> &nbsp;|&nbsp; ${o.miniSide}</div>
        <div class="minis">${o.minis.map(m => `<div class="mini" style="--c:${m.c}"><div class="mh"><span><i class="dot">${ic(m.icon)}</i>${m.name}</span></div><b>${m.value}</b><small>${m.sub}</small><div class="st">${m.status}</div></div>`).join('')}</div>
      </div>`;
  }
  const statbox = tiles => `<div class="statbox">${tiles.map(t => `<div class="st-tile ${t.hero ? 'hero' : ''}"><div class="h">${t.label}<span class="i">${ic(t.icon, 15)}</span></div><div class="v">${t.value}</div><div class="s">${t.sub}</div></div>`).join('')}</div>`;

  const niceStep = x => { if (x <= 0) return 1; const p = 10 ** Math.floor(Math.log10(x)); const n = x / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; };
  function vchart(o) {
    const top = Math.max(...o.cols.map(c => c.a + (c.b || 0)));
    const step = niceStep(top / 4), max = Math.max(step, Math.ceil(top * (o.tops ? 1.12 : 1.04) / step) * step);
    const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
    const legend = o.legend ? `<div class="vc-legend">${o.legend.map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join('')}</div>` : '';
    return `<div class="vc-wrap"><div class="vc-head"><span>${o.title}</span>${legend}</div>
      <div class="vc" style="--h:${o.h || 200}px">
        <div class="vc-y">${ticks.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="vc-plot" style="--gap:${o.gap || 8}px;--r:${o.r || 6}px;--c1:${o.c1 || C.navy};--c2:${o.c2 || C.light}">
          <div class="vc-grid">${ticks.map(() => '<span></span>').join('')}</div>
          ${o.cols.map((c, i) => `<div class="vc-col${o.hi === i ? ' hi' : ''}" data-tip="${esc(c.tip)}">
            ${c.b ? `<div class="b2" style="height:${c.b / max * 100}%"></div>` : ''}
            <div class="b1" style="height:${c.a / max * 100}%"></div>
            ${o.tops ? `<span class="top" style="bottom:calc(${(c.a + (c.b || 0)) / max * 100}% + 4px)">${c.a + (c.b || 0)}</span>` : ''}
            ${c.l ? `<span class="lb">${c.l}</span>` : ''}</div>`).join('')}
        </div>
      </div></div>`;
  }
  function ring(segs, center, centerSub, size) {
    const total = segs.reduce((s, x) => s + x[1], 0) || 1;
    let acc = 0;
    const stops = segs.filter(s => s[1] > 0).map(([, v, c]) => { const a = acc; acc += v / total * 100; return `${c} ${a}% ${acc}%`; });
    return `<div class="ring-row"><div class="ring" style="--size:${size || 132}px;background:conic-gradient(${stops.length ? stops.join(',') : 'var(--line) 0 100%'})"><div class="rc"><b>${center}</b><small>${centerSub}</small></div></div>
      <div class="legend-list">${segs.map(([l, v, c, shown]) => `<div><i class="pc${String(c).includes('line') ? ' soft' : ''}" style="background:${c}">${Math.round(v / total * 100)}%</i><span title="${l}">${l}</span><b>${shown != null ? shown : v}</b></div>`).join('')}</div></div>`;
  }
  function segBar(title, segs, note) {
    const total = segs.reduce((s, x) => s + x[1], 0);
    return `<div class="seg-title">${title}<small>${note || total}</small></div>
      <div class="seg-bar">${total ? segs.filter(s => s[1] > 0).map(([l, v, c]) => `<i style="flex:${v};background:${c}" title="${l}: ${v}"></i>`).join('') : ''}</div>
      <div class="seg-legend">${segs.map(([l, v, c]) => `<span><i style="background:${c}"></i>${l} <b>${v}</b></span>`).join('')}</div>`;
  }
  const limit = (pct, left, right, cls = '') => `<div class="limit ${cls}"><i style="width:${pct}%"></i></div><div class="limit-row"><span>${left}</span><span>${right}</span></div>`;

  // Activity-style table with search, filter, select-all and row menus
  function ftable(o) {
    const tools = `<div class="ft-tools">
      <label class="search-pill">${ic('search', 15)}<input class="ft-search" data-t="${o.id}" type="search" placeholder="Search" aria-label="Search ${o.title}"></label>
      ${o.filters ? `<label class="filter"><select class="ft-filter" data-t="${o.id}" aria-label="Filter ${o.title}"><option value="">Filter</option>${o.filters.map(f => `<option>${f}</option>`).join('')}</select>${ic('list', 15)}</label>` : ''}
    </div>`;
    const body = o.rows.length ? o.rows.map(r => `<tr data-search="${esc(r.search.toLowerCase())}" data-filter="${esc(r.filter || '')}">
        <td style="width:40px"><input type="checkbox" class="cb ft-row" data-t="${o.id}" aria-label="Select row"></td>${r.cells.join('')}
        <td style="width:40px"><button class="dots" data-toast="Actions are not connected in the prototype" aria-label="More actions">•••</button></td></tr>`).join('')
      : `<tr class="ft-empty"><td colspan="${o.cols.length + 2}">${ic('inbox')}${o.empty}</td></tr>`;
    return boxH(o.title, o.sub, tools) + `<div class="ft-wrap"><table class="ft" id="ft-${o.id}">
      <thead><tr><th><input type="checkbox" class="cb ft-all" data-t="${o.id}" aria-label="Select all"></th>${o.cols.map(([l, c]) => `<th class="${c || ''}">${l}</th>`).join('')}<th></th></tr></thead>
      <tbody>${body}</tbody></table></div>
      <div class="ft-foot"><span class="ft-sel" data-t="${o.id}">0 selected</span><span>Showing <b class="ft-shown" data-t="${o.id}">${o.rows.length}</b> of ${o.rows.length}${o.foot ? ' · ' + o.foot : ''}</span></div>`;
  }
  const td = (h, cls = '') => `<td class="${cls}">${h}</td>`;
  const dotS = (t, c) => `<span class="dot-status" style="--c:${c}">${t}</span>`;
  const unit = (v, u) => `${v}<small style="font-size:14px;font-weight:600;margin-left:4px;opacity:.75">${u}</small>`;
  const share = (v, t) => `${Math.round(v / t * 1000) / 10}%`;

  /* ---------- inspiration components: gauge, area trend, spotlight bars, diverging bars, tracker, quick actions ---------- */
  const AC = {};
  const yTicks = top => { const step = niceStep(top / 4), max = Math.max(step, Math.ceil(top * 1.08 / step) * step); return { max, ticks: Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step) }; };

  // Half-circle gauge (like "Financial health")
  function gauge(pct, label, sub) {
    const r = 80, len = Math.PI * r, val = Math.max(0, Math.min(100, pct)) / 100 * len;
    return `<div class="gauge"><svg viewBox="0 0 200 112" aria-hidden="true">
      <defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#0d4bb4"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--line)" stroke-width="18" stroke-linecap="round"/>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="url(#gg)" stroke-width="18" stroke-linecap="round" stroke-dasharray="${val} ${len}"/>
    </svg><div class="gauge-c"><b>${pct}%</b><small>${label}</small></div></div>${sub ? `<p class="note2" style="text-align:center">${sub}</p>` : ''}`;
  }

  // Smooth area trend with hover band + pill (like "Balance Trend"); series switch via tabs
  function areaChart(o) {
    AC[o.id] = o;
    const s = o.series[o.active], data = s.data, n = data.length;
    const { max, ticks } = yTicks(Math.max(...data, 1));
    const W = 600, H = 200, pts = data.map((v, i) => [i / (n - 1) * W, H - v / max * H]);
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, t = 6;
      const c1 = [p1[0] + (p2[0] - p0[0]) / t, Math.min(H, Math.max(0, p1[1] + (p2[1] - p0[1]) / t))];
      const c2 = [p2[0] - (p3[0] - p1[0]) / t, Math.min(H, Math.max(0, p2[1] - (p3[1] - p1[1]) / t))];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    const pk = data.indexOf(Math.max(...data));
    const tabs = `<div class="ac-tabs" role="tablist">${Object.entries(o.series).map(([k, x]) => `<button type="button" data-ac="${o.id}" data-series="${k}" class="${k === o.active ? 'on' : ''}">${x.label}<span>${sum(x.data)}</span></button>`).join('')}</div>`;
    return `<div class="ac-wrap" id="ac-${o.id}" style="--ac:${s.color}">${tabs}
      <div class="ac" style="--h:${o.h || 230}px"><div class="vc-y">${ticks.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="ac-plot"><div class="vc-grid">${ticks.map(() => '<span></span>').join('')}</div>
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="ag-${o.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".35"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs>
            <path d="${d} L${W},${H} L0,${H} Z" fill="url(#ag-${o.id})"/><path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>
          <div class="ac-cols">${data.map((v, i) => `<div class="ac-col${i === pk ? ' pk' : ''}" style="--y:${v / max * 100}%"><i class="band"></i><i class="pt"></i><span class="pill">${v} ${s.unit}<small>${o.label(i)}</small></span>${o.tick(i) ? `<span class="lb">${o.tick(i)}</span>` : ''}</div>`).join('')}</div>
        </div></div></div>`;
  }

  // Ghost bars with one highlighted bar + dark tooltip (like "Cash Flow")
  function spotBars(o) {
    const { max, ticks } = yTicks(Math.max(...o.cols.map(c => c.v), 1));
    return `<div class="sb" style="--h:${o.h || 210}px"><div class="vc-y">${ticks.map(t => `<span>${t}</span>`).join('')}</div>
      <div class="sb-plot"><div class="vc-grid">${ticks.map(() => '<span></span>').join('')}</div>
        ${o.cols.map((c, i) => `<div class="sb-col${i === o.hi ? ' hi' : ''}"><div class="sb-bar" style="height:${Math.max(c.v / max * 100, 1.5)}%"><span class="tip">${c.tip}</span></div>${c.l ? `<span class="lb">${c.l}</span>` : ''}</div>`).join('')}
      </div></div>`;
  }

  // Up/down bars from a centre line with a hover card (like "Income vs Expenses")
  function diverging(o) {
    const max = yTicks(Math.max(...o.cols.map(c => Math.max(c.up, c.down)), 1)).max;
    return `<div class="dv-head">${o.legend.map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join('')}</div>
      <div class="dv" style="--h:${o.h || 230}px"><div class="dv-y"><span>${max}</span><span>0</span><span>${max}</span></div>
      <div class="dv-plot">${o.cols.map(c => `<div class="dv-col" tabindex="0">
        <div class="dv-top"><i style="height:${c.up / max * 100}%"></i></div><div class="dv-bot"><i style="height:${c.down / max * 100}%"></i></div>
        <div class="dv-card"><b>${c.name}</b>${o.legend.map(([n, col], k) => `<span><i style="background:${col}"></i>${n}<b>${k ? c.down : c.up}</b></span>`).join('')}</div>
        <span class="lb">${c.l}</span></div>`).join('')}</div></div>`;
  }

  // Thumbnail + progress rows (like "Goal tracker")
  const tracker = rows => `<div class="tracker">${rows.map(r => `<div class="tk-row"><img src="${r.img}" alt=""><div class="tk-main">
      <div class="tk-top"><b>${r.title}</b><span><b>${r.done}</b>/${r.total}</span></div>
      <div class="tk-bar"><i style="width:${r.done / r.total * 100}%"></i></div><small>${r.sub}</small></div></div>`).join('')}</div>`;

  // Quick actions (like "Top up / Send / Request")
  const quickActions = items => `<div class="qa">${items.map(([l, icon, href]) => `<a href="${href}" class="qa-btn"><span>${ic(icon, 18)}</span>${l}</a>`).join('')}</div>`;

  // Avatar strip (like "Quick payment")
  const PAL2 = ['#1674e8', '#0b1b3a', '#1b9d75', '#c27c0e', '#7c5cff', '#e5484d', '#0d9488', '#318bf5'];
  const avStrip = (people, more) => `<div class="avs">${people.map(([n, d]) => `<a href="#applications" class="avs-p" title="${n} · waiting ${d} days"><span class="av" style="--s:44px;background:${PAL2[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % PAL2.length]}">${n.split(' ').map(w => w[0]).join('')}</span><small>${n.split(' ')[0]}</small></a>`).join('')}${more ? `<a href="#applications" class="avs-p"><span class="av avs-more" style="--s:44px">+${more}</span><small>more</small></a>` : ''}</div>`;

  // Tip card (like "Optimize your budget")
  const tipCard = (title, text, href, cta) => `<div class="tip-card"><h3>${title}</h3><p>${text}</p><a href="${href}">${cta} ${ic('down', 13).replace('class="icon"', 'class="icon" style="transform:rotate(-90deg)"')}</a><span class="tip-art" aria-hidden="true">${'<i></i>'.repeat(9)}</span></div>`;

  /* ---------- OVERVIEW ---------- */
  function overview() {
    return page(`${greeting()}, ${first}`) + `<div class="fx">
      ${box('fa hl-card', headline({
        label: 'Agents on platform', value: 200, tag: tagPill('200 active'),
        sub: `${pd('+88')} new this period · 0 deactivated`,
        actions: [['Agent directory', '#agents', 'users'], ['Applications', '#applications', 'file']],
        miniTitle: 'Readiness', miniSide: '200 on the platform',
        minis: [
          { name: 'Active', icon: 'check', value: 200, sub: 'of 200 agents', status: '100%', c: C.green },
          { name: 'Resume', icon: 'file', value: 176, sub: 'resumes parsed', status: '88%', c: C.blue },
          { name: 'Remote', icon: 'globe', value: 200, sub: 'remote setup', status: '100%', c: C.green }
        ]
      }))}
      ${box('fb', statbox([
        { label: 'Profile completion', value: '88%', icon: 'check', sub: 'Averaged across every agent', hero: 1 },
        { label: 'New in period', value: 88, icon: 'users', sub: `${pd('+88', 'blue')} agents` },
        { label: 'Clocked in now', value: 0, icon: 'clock', sub: 'Live count' },
        { label: 'Staff', value: 3, icon: 'shield', sub: '0 pending · 0 expired invites' }
      ]))}
      ${box('fc', boxH('Staff', 'By role and status') + ring([['Admins', 2, C.blue], ['Super admins', 1, C.navy], ['Recruiters', 0, C.sky], ['Ops', 0, C.gray]], 3, 'staff') +
        '<div style="height:16px"></div>' + segBar('Status', [['Active', 3, C.green], ['Pending invite', 0, C.amber], ['Deactivated', 0, C.red]]))}
      <div class="fd stack">
        ${box('', boxH('Role taxonomy', '5 categories · 9 roles') + limit(7 / 9 * 100, '<b>7</b> active roles out of', '<b>9</b>') + limit(3 / 5 * 100, '<b>3</b> active categories out of', '<b>5</b>', 'green') + '<p class="note2">2 roles are inactive and cannot be assigned.</p>')}
        ${box('', boxH('Clients') + `<div class="info">${ic('globe', 18)}<span>The clients module is not reporting yet, so this stays empty rather than showing zeros that would read as “no clients”.</span></div>`)}
      </div>
      ${box('fe', boxH('Agent readiness', '200 on the platform', tagPill('Live', C.blue)) + vchart({
        title: 'Agents by readiness stage', tops: 1, h: 240, gap: 22, r: 10, hi: 4,
        cols: [['Total', 200], ['Active', 200], ['Resume parsed', 176], ['Remote setup', 200], ['New in period', 88]].map(([l, v]) => ({ l, a: v, tip: `${l}: ${v}` }))
      }))}
    </div>
    <div class="row r4">
      ${box('', boxH('Profile completion', 'Averaged across every agent') + gauge(88, 'complete', '176 of 200 resumes parsed · 200 remote setups'))}
      ${box('', boxH('Quick actions', 'Jump to common jobs') + quickActions([['Review applicants', 'file', '#applications'], ['Invite admin', 'shield', '#admins'], ['New course', 'cap', '#courses'], ['Connections', 'pulse', '#connections']]))}
      ${box('', boxH('Waiting for review', '36 applicants · longest 26 days', '<a class="tag-pill" href="#applications" style="--c:#f5b301"><i></i>Review</a>') + avStrip([['Eyasu D.', 26], ['Najwa A.', 21], ['Veronica P.', 20], ['Delina T.', 19], ['Nura N.', 19]], 31))}
      ${tipCard('Protect admin access', 'Two-factor is off on your account. It’s the single most effective way to keep agent data safe.', '#security', 'Turn on 2FA')}
    </div>`;
  }

  /* ---------- ASSESSMENTS ---------- */
  const ASSESS = [
    ['The Remote Work Fundamentals Assessment', 'Remote Work', 80, 'General', '', 48, 45, '93.8%'],
    ['Backend engineer', 'Backend', 50, 'General', '', 37, 33, '89.2%'],
    ['Back Office & Administrative Assessment', 'Back Office', 75, 'Category', 'Back Office & Administrative', 36, 31, '86.1%'],
    ['Coaching for sales', 'Coaching', 75, 'General', '', 34, 29, '85.3%'],
    ['Sales Development Representative (SDR) Assessment', 'SDR', 65, 'Category', 'Virtual Sales Team', 26, 25, '96.2%']
  ];
  function assessments() {
    return page('Assessments') + `<div class="fx">
      ${box('fa hl-card', headline({
        label: 'Attempts in period', value: 64, tag: tagPill('202 all time', C.blue),
        sub: `${pd('163 passed')} ${pd('18 failed', 'red')}`,
        miniTitle: 'Attempts by status', miniSide: '202 total',
        minis: [
          { name: 'In progress', icon: 'clock', value: 2, sub: 'attempts', status: share(2, 202), c: C.amber },
          { name: 'Completed', icon: 'check', value: 181, sub: 'attempts', status: share(181, 202), c: C.green },
          { name: 'Abandoned', icon: 'out', value: 19, sub: 'attempts', status: share(19, 202), c: C.red }
        ]
      }))}
      ${box('fb', statbox([
        { label: 'Assessments', value: 7, icon: 'clip', sub: '6 active', hero: 1 },
        { label: 'Pass rate', value: '90.1%', icon: 'check', sub: `${pd('163 passed')}` },
        { label: 'Average score', value: '92.8%', icon: 'star', sub: 'Across completed attempts' },
        { label: 'Failed', value: 18, icon: 'alert', sub: `${pd('18 failed', 'red')}` }
      ]))}
      ${box('fc', boxH('Passed vs not passed', 'Most attempted · hover a column') + diverging({
        legend: [['Passed', 'var(--blue)'], ['Not passed', '#f08a4b']], h: 220,
        cols: ASSESS.map(a => ({ l: a[1], name: `${a[1]} · ${a[5]} attempts · ${a[7]}`, up: a[6], down: a[5] - a[6] }))
      }))}
      <div class="fd stack">
        ${box('', boxH('By scope', '7 assessments') + ring([['General', 4, C.blue], ['Category', 3, C.navy]], 7, 'total', 120))}
        ${box('', boxH('Pass rate', 'Completed attempts') + limit(163 / 181 * 100, '<b>163</b> passed out of', '<b>181</b>', 'green') + '<p class="note2">90.1% pass rate · 18 failed</p>')}
      </div>
      ${box('fe', ftable({
        id: 'assess', title: 'Most attempted', sub: '5 shown', filters: ['General', 'Category'],
        cols: [['Assessment'], ['Scope'], ['Attempts', 'n'], ['Passed', 'n'], ['Pass rate', 'n']],
        rows: ASSESS.map(a => ({
          search: `${a[0]} ${a[3]} ${a[4]}`, filter: a[3],
          cells: [td(`<div class="cell"><span class="ai">${ic('clip')}</span><div><div class="t1">${a[0]}</div><div class="t2">Pass mark ${a[2]}%</div></div></div>`),
            td(`${dotS(a[3], a[3] === 'General' ? C.blue : C.navy)}${a[4] ? `<div class="t2">${a[4]}</div>` : ''}`),
            td(a[5], 'n'), td(a[6], 'n'), td(pd(a[7]), 'n')]
        }))
      }))}
    </div>`;
  }

  /* ---------- LEARNING ---------- */
  const COURSES = [
    ['Inside Sales Representative', 'Inside Sales', 'role', 'Advanced', 27, 23, '85.2%', 'hero-ai.webp'],
    ['Sales Development Representative (SDR)', 'SDR', 'soft_skills', 'Intermediate', 16, 16, '100%', 'cta-ai.webp'],
    ['Getting Started with REM', 'Getting Started', 'universal', 'Beginner', 13, 12, '92.3%', 'roles-team.webp'],
    ['Remote Ready: Succeeding in Outsourced Client Roles', 'Remote Ready', 'universal', 'Beginner', 13, 12, '92.3%', 'hero.webp']
  ];
  function learning() {
    return page('Learning') + `<div class="fx">
      ${box('fa hl-card', headline({
        label: 'Enrolments', value: 69, tag: tagPill('39 in period', C.blue),
        sub: `${pd('91.3% completion')} Avg progress 95.2% · Dropout 0%`,
        miniTitle: 'Enrolments by status', miniSide: '0 awaiting final · 0 expired',
        minis: [
          { name: 'In progress', icon: 'clock', value: 6, sub: 'active learners', status: 'Active', c: C.amber },
          { name: 'Completed', icon: 'check', value: 63, sub: 'enrolments', status: 'Done', c: C.green },
          { name: 'Dropped', icon: 'out', value: 0, sub: 'enrolments', status: '0% dropout', c: C.red }
        ]
      }))}
      ${box('fb', statbox([
        { label: 'Courses', value: 4, icon: 'cap', sub: '4 published · 2 this period', hero: 1 },
        { label: 'Completion rate', value: '91.3%', icon: 'check', sub: '69 enrolments' },
        { label: 'Overdue', value: 0, icon: 'timer', sub: `${pd('Nothing past due')}` },
        { label: 'Certificates', value: 63, icon: 'award', sub: '63 issued · 0 revoked' }
      ]))}
      ${box('fc', boxH('Course completion', 'Done out of enrolled') + tracker(COURSES.map(c => ({ img: `../assets/${c[7]}`, title: c[1], done: c[5], total: c[4], sub: `${c[6]} complete · ${c[4] - c[5]} still learning · ${c[3]}` }))))}
      <div class="fd stack">
        ${box('', boxH('Certificates', '63 issued', '<a class="tag-pill" href="#learning" style="--c:var(--blue)"><i></i>Course library</a>') + `<div class="fc-wrap">
          <button type="button" class="fc-arr prev" data-fc="-1" aria-label="Previous card" hidden>${ic('down', 16)}</button>
          <button type="button" class="fc-arr next" data-fc="1" aria-label="Next card">${ic('down', 16)}</button>
          <div class="fcards">
          <div class="fcard dark"><div class="ft"><span class="badge2">Valid 63</span>${ic('award', 18)}</div>
            <div><div class="fl">Certificates issued</div><div class="fv">63</div>
            <div class="fm"><span>In period<b>36</b></span><span>Revoked<b>0</b></span><span>Expiring 30d<b>0</b></span></div></div></div>
          <div class="fcard blue"><div class="ft"><span class="badge2">This period</span>${ic('star', 18)}</div>
            <div><div class="fl">Issued in period</div><div class="fv">36</div>
            <div class="fm"><span>Issued<b>63</b></span><span>Valid<b>63</b></span><span>Revoked<b>0</b></span></div></div></div>
        </div><div class="fc-dots"><i class="on"></i><i></i></div></div>`)}
        ${box('', boxH('Library', '3 active tracks') + `<div class="lib"><div><b>3</b><small>Tracks</small></div><div><b>14</b><small>Modules</small></div><div><b>40</b><small>Lessons</small></div><div><b>59</b><small>Quiz Qs</small></div></div>`)}
        ${box('', boxH('Course mix', '4 courses') +
          segBar('By level', [['Beginner', 2, C.blue], ['Intermediate', 1, C.navy], ['Advanced', 1, C.sky]]) +
          segBar('By status', [['Draft', 0, C.gray], ['Published', 4, C.green], ['Archived', 0, C.amber]]) +
          segBar('By visibility', [['Role restricted', 2, C.navy], ['All agents', 2, C.blue]]))}
      </div>
      ${box('fe', ftable({
        id: 'courses', title: 'Most enrolled courses', sub: '4 published', filters: ['Beginner', 'Intermediate', 'Advanced'],
        cols: [['Course'], ['Status'], ['Level'], ['Enrolled', 'n'], ['Done', 'n'], ['Rate', 'n']],
        rows: COURSES.map(c => ({
          search: `${c[0]} ${c[2]} ${c[3]}`, filter: c[3],
          cells: [td(`<div class="cell"><img class="thumb" src="../assets/${c[7]}" alt=""><div><div class="t1">${c[0]}</div><div class="t2">${c[2]}</div></div></div>`),
            td(dotS('Published', C.green)), td(c[3]), td(c[4], 'n'), td(c[5], 'n'), td(pd(c[6]), 'n')]
        }))
      }))}
    </div>`;
  }

  /* ---------- NETWORK ---------- */
  // Names shortened and emails masked for privacy — the figures are unchanged.
  const INCIDENTS = [
    ['Eyob S.', 'm•••••@gmail.com', 0.6, 3.6, 111, 121, 'Nov 2, 1:30 PM'],
    ['Eyob S.', 'm•••••@gmail.com', 0.2, 1.8, 118, 92, 'Nov 2, 1:30 PM'],
    ['Yasmin Y.', 'l•••••@gmail.com', 0.2, 9.5, 152, 65, 'Nov 1, 11:35 AM'],
    ['Yasmin Y.', 'l•••••@gmail.com', 1.8, 8.9, 156, 7, 'Nov 1, 11:05 AM'],
    ['Yeabsira T.', 'y•••••@gmail.com', 0.3, 12.5, 169, 26, 'Nov 1, 10:48 AM'],
    ['Yeabsira T.', 'y•••••@gmail.com', 0.5, 5.3, 162, 28, 'Nov 1, 10:47 AM']
  ];
  function network() {
    return page('Network') + `<div class="fx">
      ${box('fa hl-card', headline({
        label: 'Speed tests in period', value: 165, tag: tagPill('53.3% unhealthy', C.red),
        sub: 'Clocked in now 0 · 55 sessions started',
        miniTitle: 'Tests by health', miniSide: '0 failed',
        minis: [
          { name: 'Healthy', icon: 'check', value: 36, sub: 'tests', status: share(36, 165), c: C.green },
          { name: 'Warning', icon: 'alert', value: 41, sub: 'tests', status: share(41, 165), c: C.amber },
          { name: 'Critical', icon: 'alert', value: 88, sub: 'tests', status: share(88, 165), c: C.red }
        ]
      }))}
      ${box('fb', statbox([
        { label: 'Avg download', value: unit('17.5', 'Mbps'), icon: 'down', sub: '15.7 Mbps up', hero: 1 },
        { label: 'Avg latency', value: unit('869', 'ms'), icon: 'gauge', sub: '158 ms ping · 96 ms jitter' },
        { label: 'Unhealthy rate', value: '53.3%', icon: 'alert', sub: `${pd('165 tests', 'red')}` },
        { label: 'Clocked in now', value: 0, icon: 'clock', sub: '55 sessions started' }
      ]))}
      ${box('fc', boxH('ISPs', 'Share of speed tests') + ring([['Ethio Telecom', 81.2, C.navy, '81.2%'], ['Safaricom Telecom.', 12.7, C.blue, '12.7%'], ['Hostinger Intl.', 2.4, C.sky, '2.4%'], ['Cloudflare, Inc.', 1.8, C.gray, '1.8%']], '81%', 'Ethio Telecom'))}
      <div class="fd stack">
        ${box('', boxH('VPN', 'Detected during tests') + limit(6.1, '<b>10</b> tests behind a VPN', '<b>6.1%</b>') + '<p class="note2">A test behind a VPN measures the tunnel, not the agent’s own line.</p>')}
        ${box('', boxH('Tests by type') + segBar('Manual vs automated', [['Manual', 162, C.navy], ['Automated', 3, C.blue]]))}
      </div>
      ${box('fe', ftable({
        id: 'incidents', title: 'Recent incidents', sub: '6 shown', filters: ['Eyob S.', 'Yasmin Y.', 'Yeabsira T.'],
        cols: [['Agent'], ['Health'], ['Down', 'n'], ['Up', 'n'], ['Ping', 'n'], ['Jitter', 'n'], ['ISP'], ['Tested']],
        rows: INCIDENTS.map(r => ({
          search: `${r[0]} ethio telecom critical`, filter: r[0],
          cells: [td(`<div class="cell"><span class="avatar" style="width:30px;height:30px;font-size:11px">${r[0].split(' ').map(w => w[0]).join('')}</span><div><div class="t1">${r[0]}</div><div class="t2">${r[1]}</div></div></div>`),
            td(dotS('Critical', C.red)), td(r[2], 'n'), td(r[3], 'n'), td(r[4], 'n'), td(r[5], 'n'), td('Ethio Telecom'), td(r[6])]
        }))
      }))}
    </div>`;
  }


  /* ---------- lead components: pipeline funnel, status bubbles, day heatmap, insight strip ---------- */
  // Pipeline funnel (like "Pipeline overview"): stage · count · drop · trapezoid with % of first stage
  function pipeline(stages) {
    const first = stages[0][1], shades = ['#b9d8ff', '#7db6fb', '#3f8ff0', '#1674e8', '#0d4bb4', '#0b1b3a'];
    const shape = [100, 84, 68, 54, 40, 30];
    return `<div class="pipe">${stages.map(([l, v], i) => {
      const prev = i ? stages[i - 1][1] : null, pct = first ? Math.round(v / first * 100) + '%' : '—';
      const drop = i === 0 ? '' : prev ? `−${Math.round((1 - v / prev) * 100)}%` : '—';
      const w = first ? Math.max(24, v / first * 100) : shape[i];
      return `<div class="pipe-row"><span class="pl">${l}</span><b class="pv">${v}</b><span class="pd">${drop}</span>
        <div class="pt"><i style="width:${w}%;background:${shades[i]};color:${i < 2 ? 'var(--navy)' : '#fff'}">${pct}</i></div></div>`;
    }).join('')}</div>`;
  }
  // Status bubbles (like "Leads" circles); equal soft bubbles when everything is zero
  function bubbles(items) {
    const max = Math.max(...items.map(x => x[1])), pos = [[34, 40], [68, 34], [24, 76], [58, 74], [86, 70]];
    return `<div class="bub">${items.map(([l, v, c], i) => {
      const size = max ? 46 + Math.sqrt(v / max) * 74 : 62;
      return `<div class="bb${max ? '' : ' empty'}" style="left:${pos[i][0]}%;top:${pos[i][1]}%;--s:${size}px;--c:${c}"><b>${v}</b><span class="bl"><i></i>${l}</span></div>`;
    }).join('')}</div>`;
  }
  // Day-by-day heatmap (like "Visits by time"), Monday-first weeks
  function heatmap(data, startDate, unit) {
    const max = Math.max(...data), lead = (startDate.getDay() + 6) % 7;
    const cells = Array(lead).fill(null).concat(data);
    const lvl = v => v == null ? -1 : !max || !v ? 0 : Math.ceil(v / max * 4);
    return `<div class="hm"><div class="hm-days">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<span>${d}</span>`).join('')}</div>
      <div class="hm-grid">${cells.map((v, i) => v == null ? '<i class="pad"></i>' : `<i class="l${lvl(v)}" title="${fmt(new Date(startDate.getTime() + (i - lead) * 864e5))}: ${v} ${unit}"></i>`).join('')}</div>
      <div class="hm-key">Less ${[0, 1, 2, 3, 4].map(k => `<i class="l${k}"></i>`).join('')} More</div></div>`;
  }
  const insight = (icon, html) => `<div class="insight"><span class="in-ic">${ic(icon, 16)}</span><p>${html}</p></div>`;

  /* ---------- LEADS ---------- */
  function leads() {
    return page('Leads') + `<div class="fx">
      ${box('fa hl-card', headline({
        label: 'Leads', value: 0, tag: tagPill('0 added this period', C.gray),
        sub: `${pd('0% qualified', 'amber')} 0 qualified · 0 not`,
        miniTitle: 'By status', miniSide: 'Token sent 0 · Watched 0',
        minis: [
          { name: 'Pending', icon: 'clock', value: 0, sub: 'leads', status: '—', c: C.amber },
          { name: 'Video ready', icon: 'video', value: 0, sub: 'leads', status: '—', c: C.blue },
          { name: 'Unqualified', icon: 'out', value: 0, sub: 'leads', status: '—', c: C.red }
        ]
      }))}
      ${box('fb', statbox([
        { label: 'Leads', value: 0, icon: 'inbox', sub: '0 added this period', hero: 1 },
        { label: 'Qualification rate', value: '0%', icon: 'percent', sub: '0 qualified · 0 not' },
        { label: 'Awaiting video', value: 0, icon: 'video', sub: '0 ready to send' },
        { label: 'Watch rate', value: '0%', icon: 'pulse', sub: '0 of 0 links opened' }
      ]))}
      ${box('fc', boxH('Video funnel', 'Leads by stage · % of first stage · drop from previous') + pipeline([['Awaiting video', 0], ['Ready to send', 0], ['Links sent', 0], ['Watched', 0]]) +
        `<p class="note2">Expired unwatched: <b>0</b> · the funnel fills in as soon as leads arrive.</p>`)}
      <div class="fd stack">
        ${box('', boxH('By status', '0 leads in this window') + bubbles([['Pending', 0, '#f5b301'], ['Video ready', 0, 'var(--blue)'], ['Token sent', 0, '#60a5fa'], ['Watched', 0, 'var(--green)'], ['Unqualified', 0, '#e5484d']]))}
        ${box('', boxH('Scoring') + `<div class="lib" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div><b>0%</b><small>Avg score</small></div><div><b>0</b><small>Qualified</small></div><div><b>0</b><small>Unqualified</small></div></div>` + limit(0, '<b>0</b> qualified out of', '<b>0</b>'))}
      </div>
      ${box('fe', ftable({ id: 'leads', title: 'Recent leads', sub: '0 in this window', cols: [['Lead'], ['Status'], ['Score', 'n'], ['Added']], rows: [], empty: 'No leads in this window.' }))}
    </div>
    <div class="row">
      ${box('', boxH('Leads by day', '3 Oct – 2 Nov · each square is one day', tagPill('0 leads', C.gray)) + heatmap(SERIES.leads, new Date(2026, 9, 3), 'leads') +
        insight('inbox', '<b>Quiet for the whole window.</b> No leads between 3 Oct and 2 Nov — the busiest day will be called out here once they start coming in.'))}
    </div>`;
  }

  /* ---------- TRENDS ---------- */
  // Daily counts, 3 Oct → 2 Nov 2026 (31 days)
  const SERIES = {
    enrol: [0, 1, 2, 1, 1, 2, 0, 1, 1, 1, 2, 3, 3, 5, 1, 2, 1, 2, 2, 0, 1, 0, 0, 1, 2, 1, 1, 2, 0, 0, 0],
    certs: [0, 1, 1, 1, 1, 0, 0, 0, 0, 2, 1, 1, 5, 4, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 2, 2, 1, 0, 0, 0],
    leads: Array(31).fill(0),
    speed: [0, 0, 1, 3, 14, 4, 3, 2, 1, 14, 4, 2, 12, 39, 10, 8, 6, 4, 3, 3, 4, 3, 4, 5, 3, 2, 2, 1, 1, 4, 3]
  };
  const dayISO = i => { const d = new Date(2026, 9, 3 + i); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dayLbl = i => fmt(new Date(2026, 9, 3 + i));
  const sum = a => a.reduce((x, y) => x + y, 0);
  const peak = a => { const m = Math.max(...a); return m ? `Peak ${m} on ${dayISO(a.indexOf(m))}` : 'Quiet for the whole window'; };
  function trends() {
    const lab = i => (i % 5 === 0 || i === 30) ? dayLbl(i) : '';
    return page('Trends') + `<div class="fx wide-top">
      ${box('fe', boxH('Learning activity', 'Daily totals · 31 days · hover the line') + areaChart({
        id: 'learn', active: acActive.learn || 'enrol', h: 240, label: i => dayLbl(i), tick: lab,
        series: { enrol: { label: 'Enrolments', data: SERIES.enrol, color: '#1674e8', unit: 'enrolments' }, certs: { label: 'Certificates', data: SERIES.certs, color: '#1b9d75', unit: 'certificates' } }
      }))}
      ${box('fb', statbox([
        { label: 'Enrolments', value: sum(SERIES.enrol), icon: 'cap', sub: peak(SERIES.enrol), hero: 1 },
        { label: 'Certificates', value: sum(SERIES.certs), icon: 'award', sub: peak(SERIES.certs) },
        { label: 'Speed tests', value: sum(SERIES.speed), icon: 'gauge', sub: peak(SERIES.speed) },
        { label: 'Leads', value: sum(SERIES.leads), icon: 'inbox', sub: peak(SERIES.leads) }
      ]))}
      ${box('fd', boxH('Speed tests', `${sum(SERIES.speed)} tests · 31 days`, tagPill(peak(SERIES.speed), C.blue)) + spotBars({
        h: 230, hi: SERIES.speed.indexOf(Math.max(...SERIES.speed)),
        cols: SERIES.speed.map((v, i) => ({ l: lab(i), v, tip: `${v} tests · ${dayLbl(i)}` }))
      }))}
      ${box('fc', boxH('Leads', '0 leads · 31 days') + `<div class="vc-wrap"><div class="vc-empty" style="--h:210px"><div>${ic('inbox')}Quiet for the whole window.<br><small>No leads between Oct 3 and Nov 2.</small></div></div></div>`)}
    </div>`;
  }

  /* ---------- other screens ---------- */
  const profile = () => page('My profile') + card('Account', `<div style="display:flex;gap:18px;align-items:center"><span class="avatar" style="width:64px;height:64px;font-size:24px">${session.email[0].toUpperCase()}</span><div><h3>${session.name}</h3><p class="muted" style="margin:4px 0 0">${session.email} · <span class="chip">${session.role}</span></p></div></div>`);
  const placeholder = id => page(TITLES[id]) + `<section class="card2 placeholder2">${ic('gear', 30)}<h3>${TITLES[id]} is not built yet</h3><p>This screen is a placeholder in the prototype.</p><a class="btn-pill primary" href="#overview" style="display:inline-flex;padding:0 22px;margin-top:8px">Back to overview</a></section>`;
  const EXTRA = window.RC_SCREENS ? window.RC_SCREENS({ ic, box, boxH, statbox, ring, C, session, toast: m => toast(m), rerender: () => render() }) : { views: {}, handle() {} };
  const VIEWS = { overview, assessments, learning, network, leads, trends, profile, ...EXTRA.views };

  /* ---------- router ---------- */
  const content = document.getElementById('content');
  let current = 'overview';
  function render() {
    const raw = (location.hash || '#overview').slice(1);
    const id = TITLES[raw] ? raw : 'overview';
    current = id;
    document.querySelectorAll('#mainNav [data-view]').forEach(a => a.classList.toggle('on', a.dataset.view === id));
    document.querySelectorAll('[data-side]').forEach(a => a.classList.toggle('on', a.dataset.side === id));
    document.title = `${TITLES[id]} — RemConnect Admin Console`;
    content.innerHTML = (VIEWS[id] || placeholder)(id);
    applySearch();
  }
  window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); content.scrollTop = 0; });

  /* ---------- events ---------- */
  content.addEventListener('click', e => {
    const r = e.target.closest('[data-range]');
    if (r) { range = r.dataset.range; render(); toast('Prototype data is a fixed 30-day snapshot'); }
    const rf = e.target.closest('#refresh');
    if (rf) { rf.querySelector('svg').classList.add('spin'); setTimeout(() => { render(); toast('Dashboard refreshed'); }, 500); }
  });

  // Activity tables: search box, filter, select-all, row selection
  function ftUpdate(id) {
    const tb = document.getElementById('ft-' + id); if (!tb) return;
    const q = (content.querySelector(`.ft-search[data-t="${id}"]`)?.value || '').trim().toLowerCase();
    const f = content.querySelector(`.ft-filter[data-t="${id}"]`)?.value || '';
    let shown = 0;
    tb.querySelectorAll('tbody tr[data-search]').forEach(tr => {
      const ok = (!q || tr.dataset.search.includes(q)) && (!f || tr.dataset.filter === f) && (!query || tr.dataset.search.includes(query));
      tr.style.display = ok ? '' : 'none'; if (ok) shown++;
      tr.classList.toggle('sel', tr.querySelector('.ft-row').checked);
    });
    const sh = content.querySelector(`.ft-shown[data-t="${id}"]`); if (sh) sh.textContent = shown;
    const sel = content.querySelector(`.ft-sel[data-t="${id}"]`); if (sel) sel.textContent = `${tb.querySelectorAll('.ft-row:checked').length} selected`;
  }
  content.addEventListener('input', e => { if (e.target.classList.contains('ft-search')) ftUpdate(e.target.dataset.t); });
  content.addEventListener('change', e => {
    const t = e.target, id = t.dataset.t;
    if (t.classList.contains('ft-all')) document.querySelectorAll(`#ft-${id} tbody tr:not([style*="none"]) .ft-row`).forEach(c => { c.checked = t.checked; });
    if (t.classList.contains('ft-filter') || t.classList.contains('ft-all') || t.classList.contains('ft-row')) ftUpdate(id);
  });
  content.addEventListener('click', e => { const t = e.target.closest('[data-toast]'); if (t) toast(t.dataset.toast); });
  // Card carousels: arrow buttons + dots instead of a scrollbar
  const fcUpdate = wrap => {
    const sc = wrap.querySelector('.fcards'), max = sc.scrollWidth - sc.clientWidth;
    wrap.querySelector('.fc-arr.prev').hidden = sc.scrollLeft < 8;
    wrap.querySelector('.fc-arr.next').hidden = sc.scrollLeft > max - 8;
    const cards = [...sc.children], idx = cards.findIndex(c => c.offsetLeft - sc.offsetLeft >= sc.scrollLeft - 8);
    wrap.querySelectorAll('.fc-dots i').forEach((d, i) => d.classList.toggle('on', i === (sc.scrollLeft > max - 8 ? cards.length - 1 : Math.max(0, idx))));
  };
  content.addEventListener('click', e => {
    const b = e.target.closest('[data-fc]'); if (!b) return;
    const sc = b.closest('.fc-wrap').querySelector('.fcards');
    const wrap = b.closest('.fc-wrap'), max = sc.scrollWidth - sc.clientWidth;
    const target = Math.max(0, Math.min(max, sc.scrollLeft + +b.dataset.fc * (sc.firstElementChild.offsetWidth + 12)));
    sc.scrollTo({ left: target, behavior: 'smooth' });
    setTimeout(() => { if (Math.abs(sc.scrollLeft - target) > 2) { sc.style.scrollBehavior = 'auto'; sc.scrollLeft = target; sc.style.scrollBehavior = ''; } fcUpdate(wrap); }, 450);
  });
  content.addEventListener('scroll', e => { if (e.target.classList?.contains('fcards')) fcUpdate(e.target.closest('.fc-wrap')); }, true);
  ['click', 'input', 'change'].forEach(type => content.addEventListener(type, e => EXTRA.handle(e)));
  content.addEventListener('click', e => {
    const b = e.target.closest('[data-ac]'); if (!b) return;
    acActive[b.dataset.ac] = b.dataset.series;
    document.getElementById('ac-' + b.dataset.ac).outerHTML = areaChart({ ...AC[b.dataset.ac], active: b.dataset.series });
  });

  // Search: filters table rows on the current tab
  let query = '';
  function applySearch() {
    content.querySelectorAll('tr[data-search]').forEach(tr => { tr.style.display = !query || tr.dataset.search.includes(query) ? '' : 'none'; });
  }
  // Centred search palette (search.js); Ctrl K or the search button opens it
  function openSearch() { if (window.RC_SEARCH) RC_SEARCH.open(); }
  document.getElementById('searchBtn').addEventListener('click', openSearch);
  document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); } });

  document.addEventListener('click', e => {
    const th = e.target.closest('[data-theme-set]');
    if (th) setTheme(th.dataset.themeSet);
    const pill = document.getElementById('userPill');
    if (pill.contains(e.target) && !e.target.closest('.user-menu')) document.getElementById('userMenu').classList.toggle('open');
    else if (!pill.contains(e.target)) document.getElementById('userMenu').classList.remove('open');
  });
  document.getElementById('userPill').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('userMenu').classList.toggle('open'); });
  document.getElementById('bell').addEventListener('click', () => toast('No new notifications'));
  document.getElementById('alertBtn').addEventListener('click', () => toast('Network: 53.3% of speed tests were unhealthy this period'));
  document.getElementById('helpBtn').addEventListener('click', () => toast('Need help? Email apply@remconnect.io'));

  const signOut = () => { try { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); } catch (e) {} location.href = 'login.html'; };
  document.getElementById('signOut').addEventListener('click', signOut);
  document.getElementById('railOut').addEventListener('click', signOut);
  document.getElementById('themeToggle').addEventListener('click', () => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  function setTheme(t) {
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('rc-admin-theme', t); } catch (e) {}
    // One switch: shows the mode you can switch to (moon in light mode, sun in dark mode)
    const sw = document.getElementById('themeSwitch'), dark = t === 'dark';
    sw.setAttribute('aria-checked', dark);
    sw.classList.toggle('on', dark);
    sw.querySelector('.ts-icon').innerHTML = ic(dark ? 'sun' : 'moon');
    sw.dataset.tip = dark ? 'Light mode' : 'Dark mode';
    sw.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  document.getElementById('themeSwitch').addEventListener('click', () => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  // Expandable sidebar (remembered between visits)
  const wrap = document.querySelector('.body-wrap');
  const railToggle = document.getElementById('railToggle');
  function setRail(open) {
    wrap.classList.toggle('rail-open', open);
    railToggle.setAttribute('aria-expanded', open);
    railToggle.setAttribute('aria-label', open ? 'Collapse sidebar' : 'Open sidebar');
    railToggle.dataset.tip = open ? 'Collapse sidebar' : 'Open sidebar';
    try { localStorage.setItem('rc-admin-rail', open ? 'open' : 'closed'); } catch (e) {}
  }
  railToggle.addEventListener('click', () => setRail(!wrap.classList.contains('rail-open')));
  let railSaved = null;
  try { railSaved = localStorage.getItem('rc-admin-rail'); } catch (e) {}
  setRail(railSaved === 'open');

  let tt;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2400);
  }

  render();
})();
