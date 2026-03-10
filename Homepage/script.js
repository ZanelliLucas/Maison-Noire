/* ============================================================
   Homepage — script.js
   ============================================================ */

(function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    splash.classList.add('animate');
  });

  // Réduit à 1.5s au lieu de 2.8s
  setTimeout(() => {
    splash.style.transition = 'opacity 0.7s cubic-bezier(0.76, 0, 0.24, 1)';
    splash.style.opacity = '0';
    document.body.style.overflow = '';

    setTimeout(() => {
      splash.style.display = 'none';
    }, 700);
  }, 1500);
})();

document.addEventListener('DOMContentLoaded', () => {
  const dots = document.querySelectorAll('.scroll-dot');
  const thresholds = [0, 0.33, 0.66];
  window.addEventListener('scroll', () => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    let active = 0;
    thresholds.forEach((t, i) => { if (progress >= t) active = i; });
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  });
});
