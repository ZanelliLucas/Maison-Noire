/* ============================================================
   Homepage — script.js
   ============================================================ */

// ── Splash Screen (une seule fois par visite) ─────────────
(function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Bloquer le scroll pendant le splash
  document.body.style.overflow = 'hidden';

  // Déclencher les animations CSS
  requestAnimationFrame(() => {
    splash.classList.add('animate');
  });

  // Masquer le splash après 2.8s
  setTimeout(() => {
    splash.style.transition = 'opacity 0.9s cubic-bezier(0.76, 0, 0.24, 1)';
    splash.style.opacity = '0';
    document.body.style.overflow = '';

    setTimeout(() => {
      splash.style.display = 'none';
    }, 900);
  }, 2800);
})();

// Charge le script partagé
document.addEventListener('DOMContentLoaded', () => {
  // Scroll indicator 3 points
  const dots = document.querySelectorAll('.scroll-dot');
  const thresholds = [0, 0.33, 0.66];
  window.addEventListener('scroll', () => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    let active = 0;
    thresholds.forEach((t, i) => { if (progress >= t) active = i; });
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  });
});
