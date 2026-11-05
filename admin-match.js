// RemConnect website — highlights the menu pill for the section in view (like the admin's active tab).
(() => {
  const links = [...document.querySelectorAll('.nav-links-box a[href^="#"]')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;
  const update = () => {
    const y = window.scrollY + 140;
    let current = null;
    sections.forEach(s => { if (s.offsetTop <= y) current = s; });
    const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (bottom) current = sections[sections.length - 1];
    links.forEach(a => a.classList.toggle('is-current', !!current && a.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
