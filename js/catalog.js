let allProducts = [];
let filteredProducts = [];

const filterState = {
  mainCategory: 'all', // all, accessories, apparel, lifestyle
  subCategory: 'all', // grinders, trays, etc.
  sort: 'pop', 
  minPrice: null,
  maxPrice: null
};

async function loadProducts() {
  try {
    const res = await fetch('data/products.json');
    const data = await res.json();
    
    // Check if the current page has a specific category lock (e.g. only accessories)
    // If not, it means we are in the master "Tienda" page
    const gridEl = document.getElementById('productGrid');
    const pageCategory = gridEl ? gridEl.getAttribute('data-category') : 'all';
    
    if (pageCategory && pageCategory !== 'all') {
      allProducts = data.products.filter(p => p.category === pageCategory);
    } else {
      allProducts = data.products; // All products for the Shop page
    }
    
    filteredProducts = [...allProducts];
    applyFilters();
  } catch (e) {
    console.error("Error loading products:", e);
  }
}

function renderGrid() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  
  if (filteredProducts.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--on-surface-variant); padding: 40px 0;">${currentLang === 'en' ? 'No products found matching these filters.' : 'No se encontraron productos con estos filtros.'}</p>`;
    return;
  }

  grid.innerHTML = filteredProducts.map(p => {
    const content = p[currentLang] || p.en; // fallback to English if missing translation
    let badgeHTML = '';
    
    if (p.badges.includes('bestseller')) {
      badgeHTML = `<span class="product-card__badge product-card__badge--bestseller">${currentLang === 'en' ? 'Bestseller' : 'Más Vendido'}</span>`;
    } else if (p.badges.includes('new')) {
      badgeHTML = `<span class="product-card__badge product-card__badge--new">${currentLang === 'en' ? 'New' : 'Nuevo'}</span>`;
    }

    let affiliateLink = p.affiliateLinks.amazon;
    if (affiliateLink === "#" || !affiliateLink) {
      affiliateLink = `https://www.amazon.es/s?k=${encodeURIComponent(content.name)}&tag=smokebloom-20`;
    } else {
      try {
        const url = new URL(affiliateLink);
        if (url.hostname.includes('amazon.') && !url.searchParams.has('tag')) {
          url.searchParams.set('tag', 'smokebloom-20');
          affiliateLink = url.toString();
        }
      } catch (e) {}
    }

    return `
      <div class="product-card reveal visible">
        <div class="product-card__image-wrap" style="cursor: pointer;" onclick="openProductModal('${p.id}')">
          <img class="product-card__image" src="${p.image}" alt="${content.name}" loading="lazy"/>
          ${badgeHTML}
        </div>
        <div class="product-card__body">
          <h2 class="product-card__title">${content.name}</h2>
          <div class="product-card__rating">${renderStars(p.rating, p.reviewCount)}</div>
          <div class="product-card__footer">
            <p class="product-card__price-hint">${content.priceDisplay}</p>
            <a class="btn btn--primary btn--full" href="${affiliateLink}" target="_blank" rel="noopener noreferrer nofollow">
              ${content.btnText}
              <span class="material-symbols-outlined" style="font-size:16px">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function applyFilters() {
  // 1. Filtrar
  filteredProducts = allProducts.filter(p => {
    // Main Category filter (if used on the global shop page)
    if (filterState.mainCategory !== 'all' && p.category !== filterState.mainCategory) return false;
    
    // Sub Category filter
    if (filterState.subCategory !== 'all' && p.subcategory !== filterState.subCategory) return false;
    
    // Price filter
    if (filterState.minPrice !== null && p.price < filterState.minPrice) return false;
    if (filterState.maxPrice !== null && p.price > filterState.maxPrice) return false;
    
    return true;
  });

  // 2. Ordenar
  if (filterState.sort === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filterState.sort === 'new') {
    filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  } else if (filterState.sort === 'pop') {
    filteredProducts.sort((a, b) => b.popularity - a.popularity);
  }

  // 3. Renderizar
  renderGrid();
}

function initFilters() {
  // Main Category Radio Buttons
  document.querySelectorAll('input[name="mainCatFilter"]').forEach(el => {
    el.addEventListener('change', (e) => {
      if (e.target.checked) {
        filterState.mainCategory = e.target.value;
        // Reset subcategory when main category changes
        filterState.subCategory = 'all';
        const subAll = document.querySelector('input[name="subCatFilter"][value="all"]');
        if (subAll) subAll.checked = true;
        
        applyFilters();
      }
    });
  });

  // Sub Category Radio Buttons
  document.querySelectorAll('input[name="subCatFilter"]').forEach(el => {
    el.addEventListener('change', (e) => {
      if (e.target.checked) {
        filterState.subCategory = e.target.value;
        applyFilters();
      }
    });
  });

  // Manejo de Chips de Ordenamiento
  document.querySelectorAll('.sidebar__chips .chip').forEach(el => {
    el.addEventListener('click', (e) => {
      document.querySelectorAll('.sidebar__chips .chip').forEach(c => {
        c.classList.remove('chip--active');
        c.classList.add('chip--default');
      });
      el.classList.add('chip--active');
      el.classList.remove('chip--default');
      
      filterState.sort = el.getAttribute('data-sort');
      applyFilters();
    });
  });

  // Manejo de Rango de Precio
  const minInput = document.getElementById('priceMin');
  const maxInput = document.getElementById('priceMax');
  
  const handlePriceChange = () => {
    filterState.minPrice = minInput.value ? parseFloat(minInput.value) : null;
    filterState.maxPrice = maxInput.value ? parseFloat(maxInput.value) : null;
    applyFilters();
  };

  minInput?.addEventListener('input', handlePriceChange);
  maxInput?.addEventListener('input', handlePriceChange);
}

document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('productGrid')) {
    initFilters();
    loadProducts();
    initModal();
  }
});

document.addEventListener('languageChanged', () => {
  renderGrid();
});

// --- MODAL LOGIC ---
let currentModalImages = [];
let currentModalImageIndex = 0;

function initModal() {
  const modalHTML = `
    <div class="modal-overlay" id="productModalOverlay">
      <div class="modal-card">
        <button class="modal-close" onclick="closeProductModal()">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="modal-gallery">
          <button class="modal-nav modal-nav--prev" onclick="prevModalImage()"><span class="material-symbols-outlined">chevron_left</span></button>
          <div class="modal-gallery__track" id="modalTrack"></div>
          <button class="modal-nav modal-nav--next" onclick="nextModalImage()"><span class="material-symbols-outlined">chevron_right</span></button>
        </div>
        <div class="modal-details">
          <h2 class="modal-title" id="modalTitle"></h2>
          <div class="modal-rating" id="modalRating"></div>
          <div class="modal-price" id="modalPrice"></div>
          <p class="modal-desc" id="modalDesc"></p>
          <div class="modal-info" id="modalInfo"></div>
          <a class="btn btn--primary btn--full" id="modalBtn" href="#" target="_blank" rel="noopener noreferrer nofollow">Ver en Amazon</a>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('modalTrack').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-gallery__img')) {
      e.target.classList.toggle('zoomed');
    }
  });

  document.getElementById('productModalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'productModalOverlay') closeProductModal();
  });
}

window.openProductModal = function(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  const content = p[currentLang] || p.en;

  document.getElementById('modalTitle').textContent = content.name;
  document.getElementById('modalRating').innerHTML = renderStars(p.rating, p.reviewCount);
  document.getElementById('modalPrice').textContent = content.priceDisplay;
  document.getElementById('modalDesc').innerHTML = content.description;
  document.getElementById('modalInfo').innerHTML = content.details || '';
  
  let affiliateLink = p.affiliateLinks.amazon;
  if (affiliateLink === "#" || !affiliateLink) {
    affiliateLink = `https://www.amazon.es/s?k=${encodeURIComponent(content.name)}&tag=smokebloom-20`;
  } else {
    try {
      const url = new URL(affiliateLink);
      if (url.hostname.includes('amazon.') && !url.searchParams.has('tag')) {
        url.searchParams.set('tag', 'smokebloom-20');
        affiliateLink = url.toString();
      }
    } catch (e) {}
  }
  
  const btn = document.getElementById('modalBtn');
  btn.href = affiliateLink;
  btn.innerHTML = `${content.btnText} <span class="material-symbols-outlined" style="font-size:16px">open_in_new</span>`;

  currentModalImages = p.images || [p.image];
  currentModalImageIndex = 0;
  renderModalImages();

  const overlay = document.getElementById('productModalOverlay');
  overlay.classList.add('open');
  document.body.classList.add('no-scroll');
};

window.closeProductModal = function() {
  const overlay = document.getElementById('productModalOverlay');
  overlay.classList.remove('open');
  document.body.classList.remove('no-scroll');
  document.querySelectorAll('.modal-gallery__img').forEach(img => img.classList.remove('zoomed'));
};

window.renderModalImages = function() {
  const track = document.getElementById('modalTrack');
  track.innerHTML = currentModalImages.map(img => `
    <div class="modal-gallery__slide">
      <img class="modal-gallery__img" src="${img}" alt="Product Image" />
    </div>
  `).join('');
  updateModalCarousel();
};

window.nextModalImage = function() {
  if (currentModalImageIndex < currentModalImages.length - 1) {
    currentModalImageIndex++;
    updateModalCarousel();
  }
};

window.prevModalImage = function() {
  if (currentModalImageIndex > 0) {
    currentModalImageIndex--;
    updateModalCarousel();
  }
};

window.updateModalCarousel = function() {
  const track = document.getElementById('modalTrack');
  track.style.transform = `translateX(-${currentModalImageIndex * 100}%)`;
  track.querySelectorAll('.modal-gallery__img').forEach(img => img.classList.remove('zoomed'));
};
