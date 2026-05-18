// Mobile menu toggle — full-screen overlay, scroll-locked while open.
(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const closeBtn = document.querySelector('[data-menu-close]');
  if (!toggle || !menu) return;

  const open = () => {
    menu.setAttribute('data-open', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    const firstLink = menu.querySelector('a, button');
    if (firstLink) firstLink.focus();
  };

  const close = () => {
    menu.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.getAttribute('data-open') === 'true';
    isOpen ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener('click', close);

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => close());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.getAttribute('data-open') === 'true') close();
  });
})();
