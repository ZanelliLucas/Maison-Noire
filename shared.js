/* ============================================================
   MAISON NOIRE — shared.js
   ============================================================ */

// ── Nav : shrink au scroll & lien actif ───────────────────
(function initNav() {
  const nav = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  const parts = window.location.pathname.split('/');
  const currentFolder = parts[parts.length - 2] || '';

  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    const hrefParts = href.split('/');
    const targetFolder = hrefParts[hrefParts.length - 2] || '';
    if (targetFolder && currentFolder === targetFolder) {
      link.classList.add('active');
    }
  });
})();

// ── Scroll Indicator ──────────────────────────────────────
(function initScrollIndicator() {
  const dots = document.querySelectorAll('.scroll-dot');
  if (!dots.length) return;
  const thresholds = [0, 0.33, 0.66];
  window.addEventListener('scroll', () => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    let active = 0;
    thresholds.forEach((t, i) => { if (progress >= t) active = i; });
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  });
})();

// ── Scroll Reveal ─────────────────────────────────────────
(function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.product-card, .feature-item, .atelier-card, .two-col, .timeline-item, .value-item, .team-card, .acc-card'
  ).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.55s ease';
    observer.observe(el);
  });
})();

// ── Panier (localStorage — persiste entre les pages) ──────
(function initCart() {

  const PRODUCTS = {
    'Manteau Obsidienne':    { price: 1890, img: '/Images/Manteau_Obsidienne.png' },
    'Robe Velours Nuit':     { price: 720,  img: '/Images/Robe_Velours_Nuit.png' },
    'Veste Crêpe Sable':     { price: 540,  img: '/Images/Veste_Crepe_Sable.png' },
    'Veste Paillettes Nuit': { price: 860,  img: '/Images/Veste_Paillettes_Nuit.png' },
    'Pantalon Tailleur':     { price: 390,  img: '/Images/Pantalon_Tailleur.png' },
    'Top Soie Ivoire':       { price: 310,  img: '/Images/Top_Soie_Ivoire.png' },
    'Sac Nuit Absolue':      { price: 1240, img: '/Images/Sac_Nuit_Absolue.png' },
    'Foulard Soie Ombres':   { price: 280,  img: '/Images/Foulard_Soie_Ombres.png' },
    'Gants Cuir Nocturne':   { price: 195,  img: '/Images/Gants_Cuir_Nocturne.png' },
    'Broche Or Noir':        { price: 490,  img: '/Images/Broche_Or_Noir.png' },
    'Pochette Satin Minuit': { price: 380,  img: '/Images/Pochette_Satin_Minuit.png' },
    'Ceinture Cuir Verni':   { price: 220,  img: '/Images/Ceinture_Cuir_Verni.png' },
  };

  // ── Persistance via localStorage + window.name fallback ─
  // window.name persiste entre les navigations file:// contrairement à localStorage
  function loadCart() {
    // Essayer localStorage d'abord
    try {
      const ls = localStorage.getItem('mn_cart_items');
      if (ls) return JSON.parse(ls);
    } catch(e) {}
    // Fallback : window.name
    try {
      const data = JSON.parse(window.name || '{}');
      return data.mn_cart_items || [];
    } catch(e) { return []; }
  }
  function saveCart(items) {
    // Sauvegarder dans les deux
    try { localStorage.setItem('mn_cart_items', JSON.stringify(items)); } catch(e) {}
    try {
      const data = JSON.parse(window.name || '{}');
      data.mn_cart_items = items;
      window.name = JSON.stringify(data);
    } catch(e) {}
  }

  let cartItems = loadCart();

  // ── Injection du panel HTML ────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.innerHTML = `
    <div class="cart-panel">
      <div class="cart-panel-header">
        <span class="cart-panel-title">Mon Panier</span>
        <button class="cart-panel-close" aria-label="Fermer">✕</button>
      </div>
      <div class="cart-panel-body"></div>
      <div class="cart-panel-footer" style="display:none">
        <div class="cart-total">
          <span class="cart-total-label">Total</span>
          <span class="cart-total-value">€ 0</span>
        </div>
        <button class="cart-checkout-btn">Passer la commande</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const panel    = overlay.querySelector('.cart-panel');
  const body     = overlay.querySelector('.cart-panel-body');
  const footer   = overlay.querySelector('.cart-panel-footer');
  const totalVal = overlay.querySelector('.cart-total-value');
  const checkoutBtn = overlay.querySelector('.cart-checkout-btn');
  const closeBtn = overlay.querySelector('.cart-panel-close');

  // ── Ouvrir / fermer ────────────────────────────────────
  function openCart() {
    overlay.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    overlay.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!cartItems.length) return;
      const body2 = overlay.querySelector('.cart-panel-body');
      const footer2 = overlay.querySelector('.cart-panel-footer');
      footer2.style.display = 'none';
      body2.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:1.5rem;padding:3rem 2rem;text-align:center">
          <div style="font-size:2rem;color:var(--or);opacity:0.6">✦</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:300;color:var(--creme)">Commande confirmée</div>
          <div style="font-size:0.65rem;letter-spacing:0.15em;color:var(--gris);line-height:2;max-width:28ch">Votre sélection a bien été reçue. Notre équipe vous contactera sous 24h pour finaliser votre commande.</div>
          <div style="font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--or);margin-top:1rem">MAISON NOIRE · Paris</div>
        </div>`;
      cartItems = [];
      saveCart(cartItems);
      document.querySelectorAll('.cart-btn').forEach(b => b.textContent = 'Panier (0)');
    });
  }

  overlay.addEventListener('click', (e) => {
    if (!panel.contains(e.target)) closeCart();
  });
  closeBtn.addEventListener('click', closeCart);

  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.addEventListener('click', openCart);
  });

  // ── Rendu ──────────────────────────────────────────────
  function formatPrice(n) {
    return '€ ' + n.toLocaleString('fr-FR');
  }

  function render() {
    const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cartItems.reduce((s, i) => s + i.qty, 0);

    document.querySelectorAll('.cart-btn').forEach(btn => {
      btn.textContent = `Panier (${count})`;
    });

    saveCart(cartItems);

    if (cartItems.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">◻</div>
          <div class="cart-empty-text">Votre panier est vide</div>
        </div>`;
      footer.style.display = 'none';
      return;
    }

    footer.style.display = 'block';
    totalVal.textContent = formatPrice(total);

    body.innerHTML = `<div class="cart-items">${cartItems.map((item, idx) => `
      <div class="cart-item">
        ${item.img
          ? `<img class="cart-item-img" src="${item.img}" alt="${item.name}">`
          : `<div class="cart-item-img" style="display:flex;align-items:center;justify-content:center;color:rgba(201,168,76,0.2);font-size:1.5rem">◻</div>`
        }
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-qty">
            <button class="cart-qty-btn" data-idx="${idx}" data-action="dec">−</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button class="cart-qty-btn" data-idx="${idx}" data-action="inc">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-idx="${idx}" title="Retirer">✕</button>
      </div>`).join('')}
    </div>`;

    body.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.idx);
        if (btn.dataset.action === 'inc') {
          cartItems[i].qty++;
        } else {
          cartItems[i].qty--;
          if (cartItems[i].qty <= 0) cartItems.splice(i, 1);
        }
        render();
      });
    });
    body.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cartItems.splice(parseInt(btn.dataset.idx), 1);
        render();
      });
    });
  }

  // ── Ajouter au panier ──────────────────────────────────
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const card = btn.closest('.product-card, .acc-card');
      const nameEl = card && (card.querySelector('.product-name') || card.querySelector('.acc-name'));
      const name = nameEl ? nameEl.textContent.trim() : 'Pièce';
      const info = PRODUCTS[name] || { price: 0, img: '' };

      const existing = cartItems.find(i => i.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cartItems.push({ name, price: info.price, img: info.img, qty: 1 });
      }

      render();

      const original = btn.textContent;
      btn.textContent = '✓ Ajouté';
      btn.style.background = 'var(--or)';
      btn.style.color = 'var(--noir)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);
    });
  });

  render();
})();



  // Hover sur éléments interactifs
  document.querySelectorAll('a, button, .product-card, .acc-card, .cat-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('click'));
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
})();

// ── Transitions de page ───────────────────────────────────
(function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  // Entrée : animation "in"
  overlay.classList.add('in');
  setTimeout(() => overlay.classList.remove('in'), 600);

  function bindLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      if (link._transitionBound) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;
      link._transitionBound = true;
      link.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('out');
        setTimeout(() => { window.location.href = href; }, 500);
      });
    });
  }

  // Binder au DOMContentLoaded ET après (pour les éléments tardifs)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindLinks);
  } else {
    bindLinks();
  }
  // Rebind après un court délai pour les éléments injectés dynamiquement
  setTimeout(bindLinks, 300);
})();

// ── Newsletter feedback ───────────────────────────────────
(function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const input  = form.querySelector('.newsletter-input');
    const submit = form.querySelector('.newsletter-submit');
    if (!submit) return;

    // Ajouter le message de succès
    const msg = document.createElement('p');
    msg.className = 'newsletter-success';
    msg.textContent = '✦ Bienvenue dans la Maison — vous serez informé en avant-première';
    form.parentElement.appendChild(msg);

    submit.addEventListener('click', () => {
      if (!input || !input.value.includes('@')) {
        input.style.borderColor = 'rgba(201,68,76,0.6)';
        setTimeout(() => input.style.borderColor = '', 1500);
        return;
      }
      form.style.opacity = '0';
      form.style.transform = 'translateY(-8px)';
      form.style.transition = 'all 0.4s ease';
      setTimeout(() => {
        form.style.display = 'none';
        msg.classList.add('show');
      }, 400);
    });
  });
})();
