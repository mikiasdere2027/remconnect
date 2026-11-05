// RemConnect Admin — centred search palette (Ctrl K) with a blurred backdrop.
// Searches every screen (from the sidebar + top tabs) and the rows on the current screen.
window.RC_SEARCH = (() => {
  const ICON = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    screen: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/>',
    row: '<path d="M4 6h16M4 12h16M4 18h10"/>',
    enter: '<path d="M9 10 4 15l5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>'
  };
  const svg = (n, s = 16) => `<svg class="icon" viewBox="0 0 24 24" style="width:${s}px;height:${s}px">${ICON[n]}</svg>`;
  let el, input, list, items = [], hi = 0, lastFocus;

  function screens() {
    const seen = new Set(), out = [];
    document.querySelectorAll('#mainNav a[data-view], .rail a[data-side]').forEach(a => {
      const href = a.getAttribute('href'); if (seen.has(href)) return; seen.add(href);
      const label = a.getAttribute('aria-label') || a.textContent.trim();
      const group = a.closest('#mainNav') ? 'Dashboard tab' : (() => { let p = a.previousElementSibling; while (p && !p.classList.contains('rail-h')) p = p.previousElementSibling; return p ? p.textContent.trim() : 'Screen'; })();
      out.push({ kind: 'screen', label, sub: group, href });
    });
    return out;
  }
  function rows() {
    const title = (document.querySelector('#content h1')?.textContent || '').trim();
    return [...document.querySelectorAll('#content [data-sr], #content tr[data-search]')].map(r => {
      const label = (r.querySelector('.tt, .t1, .who b, h3, .role2-t b, b, strong')?.textContent || r.textContent).trim().replace(/\s+/g, ' ').slice(0, 70);
      const sub = (r.querySelector('.t2, .who small, .track-body p, p, small')?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
      return { kind: 'row', label, sub: sub ? `${sub} · ${title}` : title, node: r, text: (r.dataset.text || r.dataset.search || r.textContent).toLowerCase() };
    }).filter(r => r.label);
  }

  function build() {
    el = document.createElement('div');
    el.className = 'cmdk'; el.hidden = true;
    el.innerHTML = `<div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Search">
      <div class="cmdk-input">${svg('search', 19)}<input type="text" placeholder="Search screens, agents, applicants…" aria-label="Search" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></div>
      <div class="cmdk-list" role="listbox"></div>
      <div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
    </div>`;
    document.body.appendChild(el);
    input = el.querySelector('input'); list = el.querySelector('.cmdk-list');
    el.addEventListener('mousedown', e => { if (e.target === el) close(); });
    input.addEventListener('input', render);
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(items[hi]); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    list.addEventListener('mousemove', e => { const b = e.target.closest('[data-k]'); if (b && +b.dataset.k !== hi) { hi = +b.dataset.k; paint(); } });
    list.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) choose(items[+b.dataset.k]); });
  }

  function render() {
    const q = input.value.trim().toLowerCase();
    const sc = screens().filter(s => !q || s.label.toLowerCase().includes(q) || s.sub.toLowerCase().includes(q));
    const rw = q ? rows().filter(r => r.text.includes(q) || r.label.toLowerCase().includes(q)).slice(0, 8) : [];
    items = [...(q ? rw : []), ...sc.slice(0, q ? 8 : 10)];
    hi = 0;
    const group = (title, arr, offset) => arr.length ? `<p class="cmdk-g">${title}</p>${arr.map((it, i) => `<button type="button" class="cmdk-it" role="option" data-k="${offset + i}">
        <span class="cmdk-ic">${svg(it.kind === 'screen' ? 'screen' : 'row')}</span><span class="cmdk-t"><b>${hl(it.label, q)}</b><small>${it.sub}</small></span><span class="cmdk-go">${svg('enter', 14)}</span></button>`).join('')}` : '';
    list.innerHTML = items.length
      ? group('On this page', q ? rw : [], 0) + group(q ? 'Screens' : 'Jump to', sc.slice(0, q ? 8 : 10), q ? rw.length : 0)
      : `<div class="cmdk-empty">${svg('search', 26)}<b>No matches for “${esc(input.value)}”</b><small>Try a screen name like “Applications”, or a name on this page.</small></div>`;
    paint();
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hl = (t, q) => { const s = esc(t); if (!q) return s; const i = t.toLowerCase().indexOf(q); return i < 0 ? s : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + q.length)) + '</mark>' + esc(t.slice(i + q.length)); };
  function paint() {
    list.querySelectorAll('[data-k]').forEach(b => { const on = +b.dataset.k === hi; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); if (on) b.scrollIntoView({ block: 'nearest' }); });
  }
  function move(d) { if (!items.length) return; hi = (hi + d + items.length) % items.length; paint(); }
  function choose(it) {
    if (!it) return;
    close();
    if (it.kind === 'screen') { location.hash = it.href.replace(/^.*#/, ''); return; }
    const n = it.node;
    n.scrollIntoView({ behavior: 'smooth', block: 'center' });
    n.classList.remove('cmdk-flash'); void n.offsetWidth; n.classList.add('cmdk-flash');
  }

  function open() {
    if (!el) build();
    lastFocus = document.activeElement;
    el.hidden = false; void el.offsetWidth; el.classList.add('open');
    input.value = ''; render();
    setTimeout(() => input.focus(), 20);
  }
  function close() {
    if (!el || el.hidden) return;
    el.classList.remove('open'); el.hidden = true;
    lastFocus?.focus?.();
  }
  return { open, close };
})();
