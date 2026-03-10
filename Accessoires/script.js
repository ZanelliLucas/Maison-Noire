/* ============================================================
   Accessoires — script.js
   ============================================================ */

(function initFilters() {
  const cats  = document.querySelectorAll('.cat-card');
  const cards = document.querySelectorAll('.acc-card');

  cats.forEach(cat => {
    cat.addEventListener('click', () => {
      // 1. Activer la catégorie cliquée
      cats.forEach(c => c.classList.remove('active'));
      cat.classList.add('active');

      const filter = cat.dataset.filter;

      // 2. Afficher / masquer les cartes
      cards.forEach(card => {
        const cats2 = card.dataset.category || '';
        const show  = filter === 'tout' || cats2.includes(filter);

        if (show) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();
