// RemConnect website — "Career paths" mega menu (desktop).
// Built from the role cards already on the page, so titles, descriptions and levels stay in sync.
(() => {
  const trigger = document.querySelector('.nav-links-box a[href="#roles"]');
  const header = document.querySelector('.site-header');
  const cards = [...document.querySelectorAll('#roles-grid .role-card')];
  if (!trigger || !header || !cards.length) return;
  const desktop = matchMedia('(min-width: 761px)');

  const short = t => (t.length > 64 ? t.slice(0, 62).replace(/\s+\S*$/, '') + '…' : t);
  const items = cards.map((c, i) => {
    const title = c.querySelector('h3')?.textContent.trim() || '';
    const desc = c.querySelector('h3 + p, .role-content > p, p')?.textContent.trim() || '';
    const pill = c.querySelector('.level-pill');
    const icon = c.querySelector('.role-icon svg')?.outerHTML || '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 11l2 2 4-4"/></svg>';
    return `<a class="mega-item" href="#roles" data-i="${i}" role="menuitem">
      <span class="mi-ic" aria-hidden="true">${icon}</span>
      <span class="mi-t"><b>${title}</b><small>${short(desc)}</small></span>
      ${pill ? `<span class="${pill.className}">${pill.textContent.trim()}</span>` : ''}</a>`;
  }).join('');

  const panel = document.createElement('div');
  panel.className = 'mega'; panel.id = 'mega-roles'; panel.hidden = true;
  panel.innerHTML = `<div class="mega-inner">
    <div class="mega-list">
      <p class="eyebrow">Support disciplines</p>
      <div class="mega-grid" role="menu" aria-label="Career paths">${items}</div>
      <div class="mega-foot"><a href="#roles" class="mega-all">View all career paths <span aria-hidden="true">→</span></a><span>${cards.length} paths · all fully remote</span></div>
    </div>
    <div class="mega-cards">
      <a class="mcard" href="#method"><img src="assets/team-remconnect.webp" alt=""><span><small>Cohort 14</small><b>In training now</b></span></a>
      <a class="mcard" href="#stories"><img src="assets/agent-kalkidan.webp" alt=""><span><small>Your profile</small><b>Travels with you</b></span></a>
    </div></div>`;
  header.appendChild(panel);

  trigger.classList.add('mega-trigger');
  trigger.setAttribute('aria-haspopup', 'true');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'mega-roles');
  trigger.insertAdjacentHTML('beforeend', '<svg class="mega-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>');

  let closeTimer;
  const open = () => { if (!desktop.matches) return; clearTimeout(closeTimer); panel.hidden = false; void panel.offsetWidth; panel.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); };
  const close = () => { panel.classList.remove('open'); panel.hidden = true; trigger.setAttribute('aria-expanded', 'false'); };
  const later = () => { clearTimeout(closeTimer); closeTimer = setTimeout(close, 180); };

  trigger.addEventListener('mouseenter', open);
  trigger.addEventListener('mouseleave', later);
  panel.addEventListener('mouseenter', () => clearTimeout(closeTimer));
  panel.addEventListener('mouseleave', later);
  trigger.addEventListener('click', e => {
    if (!desktop.matches) return;          // phones: plain link to the section
    e.preventDefault();
    trigger.getAttribute('aria-expanded') === 'true' ? close() : open();
  });
  trigger.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' && desktop.matches) { e.preventDefault(); open(); panel.querySelector('.mega-item')?.focus(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { close(); trigger.focus(); } });
  document.addEventListener('click', e => { if (!panel.hidden && !panel.contains(e.target) && !trigger.contains(e.target)) close(); });
  desktop.addEventListener('change', close);

  // choosing a role: show all roles, scroll to that card and briefly highlight it
  panel.addEventListener('click', e => {
    const item = e.target.closest('.mega-item');
    if (!e.target.closest('a')) return;
    close();
    if (!item) return;
    e.preventDefault();
    document.querySelector('.filter-chip[data-filter="all"]')?.click();
    const card = cards[+item.dataset.i];
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.remove('mega-flash'); void card.offsetWidth; card.classList.add('mega-flash');
  });
})();
