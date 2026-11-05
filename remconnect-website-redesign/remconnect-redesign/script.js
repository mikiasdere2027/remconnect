(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      navigation.classList.toggle('is-open', !expanded);
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        navigation.classList.remove('is-open');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        navigation.classList.remove('is-open');
        menuButton.focus();
      }
    });
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const roleCards = [...document.querySelectorAll('.role-card[data-level]')];
  const emptyMessage = document.querySelector('#filter-empty');

  function filterRoles(filter) {
    let visibleCount = 0;
    roleCards.forEach((card) => {
      const visible = filter === 'all' || card.dataset.level === filter;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => filterRoles(button.dataset.filter));
  });

  // Keep only one FAQ item open at a time for easier scanning on small screens.
  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.filter((other) => other !== item).forEach((other) => { other.open = false; });
    });
  });
})();
