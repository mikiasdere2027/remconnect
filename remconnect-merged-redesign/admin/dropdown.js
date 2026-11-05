// RemConnect Admin — custom dropdowns.
// Progressively enhances every <select> on the page: the native select stays in the DOM
// (so forms, FormData and existing change handlers keep working) and a styled button + menu
// is shown in its place. Choosing an option sets select.value and fires input + change.
(function () {
  const CHEV = '<svg class="icon dd-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';
  const FILTER = '<svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></svg>';
  const CHECK = '<svg class="icon dd-check" viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>';
  let open = null, uid = 0;

  function label(sel) {
    const o = sel.options[sel.selectedIndex];
    return o ? o.textContent : '';
  }

  function enhance(sel) {
    if (sel.dataset.enh || sel.multiple) return;
    sel.dataset.enh = '1';
    const id = 'dd-' + (++uid);
    const isFilter = !!sel.closest('.filter');
    const wrap = document.createElement('div');
    wrap.className = 'dd' + (isFilter ? ' dd-filter' : '') + (sel.closest('.fld') ? ' dd-field' : '') + (sel.closest('.role-row') ? ' dd-small' : '');
    wrap.innerHTML = `<button type="button" class="dd-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}">
        ${isFilter ? FILTER : ''}<span class="dd-val"></span>${isFilter ? '' : CHEV}</button>
      <ul class="dd-menu" id="${id}" role="listbox" tabindex="-1" hidden></ul>`;
    sel.after(wrap);
    sel.classList.add('dd-native');
    sel.tabIndex = -1;
    sel.setAttribute('aria-hidden', 'true');
    const btn = wrap.querySelector('.dd-btn');
    btn.setAttribute('aria-label', sel.getAttribute('aria-label') || sel.closest('label')?.querySelector(':scope > span')?.textContent || 'Choose an option');
    const sync = () => {
      const v = label(sel);
      wrap.querySelector('.dd-val').textContent = isFilter && !sel.value ? 'Filter' : v;
      wrap.classList.toggle('dd-active', isFilter && !!sel.value);
    };
    sync();
    sel.addEventListener('change', sync);
    wrap._sel = sel; wrap._sync = sync;
  }

  function build(wrap) {
    const sel = wrap._sel, menu = wrap.querySelector('.dd-menu');
    menu.innerHTML = [...sel.options].map((o, i) => `<li role="option" data-i="${i}" aria-selected="${i === sel.selectedIndex}" class="${i === sel.selectedIndex ? 'sel' : ''}${o.disabled ? ' dis' : ''}">${CHECK}<span>${o.textContent.replace(/</g, '&lt;')}</span></li>`).join('');
  }

  function openMenu(wrap) {
    if (open && open !== wrap) closeMenu(open);
    build(wrap);
    const menu = wrap.querySelector('.dd-menu'), btn = wrap.querySelector('.dd-btn');
    menu.hidden = false; wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
    // keep inside the viewport: flip right/up when needed
    wrap.classList.remove('dd-right', 'dd-up');
    const r = menu.getBoundingClientRect();
    if (r.right > innerWidth - 8) wrap.classList.add('dd-right');
    if (r.bottom > innerHeight - 8 && btn.getBoundingClientRect().top > r.height + 16) wrap.classList.add('dd-up');
    open = wrap;
    focusItem(wrap, wrap._sel.selectedIndex);
  }
  function closeMenu(wrap, refocus) {
    const menu = wrap.querySelector('.dd-menu');
    menu.hidden = true; wrap.classList.remove('open'); wrap.querySelector('.dd-btn').setAttribute('aria-expanded', 'false');
    if (open === wrap) open = null;
    if (refocus) wrap.querySelector('.dd-btn').focus();
  }
  function focusItem(wrap, i) {
    const items = [...wrap.querySelectorAll('.dd-menu li')];
    items.forEach(li => li.classList.remove('hi'));
    const li = items[Math.max(0, Math.min(items.length - 1, i))];
    if (li) { li.classList.add('hi'); li.scrollIntoView({ block: 'nearest' }); wrap._hi = +li.dataset.i; }
  }
  function choose(wrap, i) {
    const sel = wrap._sel;
    if (sel.options[i]?.disabled) return;
    closeMenu(wrap, true);
    if (sel.selectedIndex === i) return;
    sel.selectedIndex = i;
    wrap._sync();
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.dd-btn');
    if (btn) { e.preventDefault(); const w = btn.closest('.dd'); w.classList.contains('open') ? closeMenu(w) : openMenu(w); return; }
    const li = e.target.closest('.dd-menu li');
    if (li) { e.preventDefault(); choose(li.closest('.dd'), +li.dataset.i); return; }
    if (open && !e.target.closest('.dd')) closeMenu(open);
  });
  document.addEventListener('mouseover', e => {
    const li = e.target.closest('.dd-menu li');
    if (li) focusItem(li.closest('.dd'), +li.dataset.i);
  });
  document.addEventListener('keydown', e => {
    const w = e.target.closest && e.target.closest('.dd'); if (!w) return;
    const isOpen = w.classList.contains('open'), n = w._sel.options.length;
    if (!isOpen && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openMenu(w); return; }
    if (!isOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(w, (w._hi + 1) % n); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(w, (w._hi - 1 + n) % n); }
    else if (e.key === 'Home') { e.preventDefault(); focusItem(w, 0); }
    else if (e.key === 'End') { e.preventDefault(); focusItem(w, n - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(w, w._hi); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeMenu(w, true); }
    else if (e.key === 'Tab') closeMenu(w);
    else if (e.key.length === 1) { // type-ahead
      const k = e.key.toLowerCase(), opts = [...w._sel.options];
      const start = (w._hi + 1) % n;
      for (let j = 0; j < n; j++) { const idx = (start + j) % n; if (opts[idx].textContent.trim().toLowerCase().startsWith(k)) { focusItem(w, idx); break; } }
    }
  }, true);
  addEventListener('resize', () => open && closeMenu(open));

  // enhance now and whenever screens re-render or dialogs open
  const run = () => document.querySelectorAll('#content select:not([data-enh]), .sc-modal select:not([data-enh])').forEach(enhance);
  // runs right after each DOM change (already-enhanced selects are skipped, so this settles immediately)
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', run) : run();
})();
