/* ============================================================
   Collection — script.js
   ============================================================ */

(function initFilters() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');
  const count = document.querySelector('.collection-count');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Activer le bouton cliqué
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // 2. Afficher / masquer les cartes
      let visible = 0;
      cards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'tout' || cats.includes(filter);

        if (show) {
          card.style.display = '';
          // Petite animation d'apparition
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      // 3. Mettre à jour le compteur
      if (count) count.textContent = visible + ' pièce' + (visible > 1 ? 's' : '');
    });
  });
})();
