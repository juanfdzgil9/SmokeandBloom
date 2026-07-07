/* ============================================
   SMOKE & BLOOM — Main JavaScript
   Age Gate, Navigation, Animations, Utilities
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initAgeGate();
  initNavbar();
  initRevealAnimations();
});

/* --------- AGE GATE --------- */
function initAgeGate() {
  const verified = localStorage.getItem('sb_age_verified');
  if (verified === 'true') return;

  const overlay = document.createElement('div');
  overlay.className = 'age-gate';
  overlay.id = 'ageGate';
  overlay.innerHTML = `
    <div class="age-gate__card">
      <div class="age-gate__logo">Smoke &amp; Bloom</div>
      <div class="age-gate__subtitle">Lifestyle Boutique</div>
      <div style="width:60px;height:2px;background:var(--tertiary-container);margin:0 auto var(--space-4) auto;border-radius:2px;"></div>
      <p class="age-gate__question">¿Eres mayor de 21 años?</p>
      <p class="age-gate__desc">Debes ser mayor de edad para acceder a este sitio.</p>
      <div class="age-gate__actions">
        <button class="btn btn--primary btn--lg" id="ageYes">Sí, soy mayor de 21</button>
        <button class="btn btn--secondary btn--lg" id="ageNo">No</button>
      </div>
      <p class="age-gate__legal">Al continuar, confirmas que cumples con la edad legal requerida en tu jurisdicción.</p>
    </div>
  `;

  document.body.prepend(overlay);
  document.body.classList.add('no-scroll');

  document.getElementById('ageYes').addEventListener('click', () => {
    localStorage.setItem('sb_age_verified', 'true');
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('no-scroll');
    }, 400);
  });

  document.getElementById('ageNo').addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
  });
}

/* --------- NAVBAR --------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');

  // Scroll effect
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 5) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = current;
    }, { passive: true });
  }

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }
}

/* --------- REVEAL ON SCROLL --------- */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* --------- UTILITY: Star Rating HTML --------- */
function renderStars(rating, count) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3 ? 1 : 0;
  const empty = 5 - full - half;
  let html = '<div class="product-card__stars">';
  const starFull = `<svg class="star-icon" viewBox="0 0 24 24" fill="currentColor" style="color:var(--tertiary-container)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01z"/></svg>`;
  const starHalf = `<svg class="star-icon" viewBox="0 0 24 24" style="color:var(--tertiary-container)"><defs><linearGradient id="hg"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="var(--surface-variant)"/></linearGradient></defs><path fill="url(#hg)" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01z"/></svg>`;
  const starEmpty = `<svg class="star-icon" viewBox="0 0 24 24" fill="currentColor" style="color:var(--surface-variant)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01z"/></svg>`;
  for (let i = 0; i < full; i++) html += starFull;
  if (half) html += starHalf;
  for (let i = 0; i < empty; i++) html += starEmpty;
  html += '</div>';
  html += `<span class="product-card__review-count">(${count})</span>`;
  return html;
}
// SEARCH MODAL LOGIC
document.addEventListener("DOMContentLoaded", () => {
  const searchIcons = document.querySelectorAll('.navbar__search');
  const searchModal = document.getElementById('searchModal');
  const searchModalClose = document.getElementById('searchModalClose');
  const searchModalBackdrop = document.getElementById('searchModalBackdrop');
  const searchInput = document.getElementById('searchInput');

  function openSearch() {
    if(searchModal) {
      searchModal.classList.add('search-modal--open');
      setTimeout(() => searchInput && searchInput.focus(), 100);
    }
  }

  function closeSearch() {
    if(searchModal) searchModal.classList.remove('search-modal--open');
  }

  searchIcons.forEach(icon => {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', openSearch);
  });

  if (searchModalClose) searchModalClose.addEventListener('click', closeSearch);
  if (searchModalBackdrop) searchModalBackdrop.addEventListener('click', closeSearch);

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `tienda.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }
});
