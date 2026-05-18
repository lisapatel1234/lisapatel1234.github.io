// Scroll reveal + hero-load reveal. Honors prefers-reduced-motion.
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero load reveal — staggered
  const heroEls = document.querySelectorAll('.hero-reveal');
  if (heroEls.length) {
    if (prefersReduced) {
      heroEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      heroEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), 80 * i);
      });
    }
  }

  // Scroll reveals
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  reveals.forEach((el) => io.observe(el));
})();
