/* ========================================================
   PORTFOLIO PAGE JS
   ======================================================== */

// ─── PORTFOLIO DATA ────────────────────────────────────
const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'Brand Reel — Fashion Drop',
    category: 'short-form',
    catLabel: 'Short Form Videos',
    image: 'assets/images/portfolio_shortform_1784733870986.png',
    tags: ['Instagram', 'Reels', 'Fashion'],
    desc: 'A high-energy 30-second brand reel for a fashion label launch.'
  },
  {
    id: 2,
    title: 'Gaming Montage — Pro Level',
    category: 'gaming',
    catLabel: 'Gaming Videos',
    image: 'assets/images/portfolio_gaming_1784733883250.png',
    tags: ['Gaming', 'Montage', 'Cinematic'],
    desc: 'Dynamic gaming montage with synced edits and custom VFX.'
  },
  {
    id: 3,
    title: 'Cinematic Color Grade',
    category: 'color-grading',
    catLabel: 'Color Grading',
    image: 'assets/images/portfolio_colorgrade_1784733894933.png',
    tags: ['Color', 'Cinematic', 'Grading'],
    desc: 'Before & after color grading transformation for a travel film.'
  },
  {
    id: 4,
    title: 'Luxury Product Ad',
    category: 'ecommerce',
    catLabel: 'eCommerce Ads',
    image: 'assets/images/portfolio_ecommerce_1784733905947.png',
    tags: ['Product', 'Ad', 'Luxury'],
    desc: 'Premium product advertisement for a cosmetics e-commerce brand.'
  },
  {
    id: 5,
    title: 'Champions League Edit',
    category: 'football',
    catLabel: 'Football Edits',
    image: 'assets/images/portfolio_football_1784733924182.png',
    tags: ['Football', 'Sports', 'Cinematic'],
    desc: 'Cinematic football edit with slow-motion moments and epic music.'
  },
  {
    id: 6,
    title: 'Human Stories — Documentary',
    category: 'documentary',
    catLabel: 'Documentary Style',
    image: 'assets/images/portfolio_documentary_1784733944762.png',
    tags: ['Documentary', 'Film', 'Storytelling'],
    desc: 'Powerful short documentary capturing real human stories.'
  },
  {
    id: 7,
    title: 'Anime AMV — Epic Cuts',
    category: 'anime',
    catLabel: 'Anime Videos',
    image: 'assets/images/portfolio_anime_1784733960098.png',
    tags: ['Anime', 'AMV', 'Action'],
    desc: 'High-energy anime music video with precision cuts and effects.'
  },
  {
    id: 8,
    title: 'Travel Vlog — Himalayas',
    category: 'long-form',
    catLabel: 'Long Form Videos',
    image: 'assets/images/portfolio_longform_1784733997929.png',
    tags: ['Travel', 'Vlog', 'YouTube'],
    desc: 'Full-length travel documentary from the Himalayan expedition.'
  },
  {
    id: 9,
    title: 'Motion Brand Identity',
    category: 'short-form',
    catLabel: 'Short Form Videos',
    image: 'assets/images/portfolio_colorgrade_1784733894933.png',
    tags: ['Brand', 'Motion', 'Identity'],
    desc: 'Animated brand identity reveal for a tech startup.'
  },
  {
    id: 10,
    title: 'Product Launch — Smartwatch',
    category: 'ecommerce',
    catLabel: 'eCommerce Ads',
    image: 'assets/images/portfolio_ecommerce_1784733905947.png',
    tags: ['Product', 'Tech', 'Launch'],
    desc: 'Sleek product launch video for a premium smartwatch brand.'
  },
  {
    id: 11,
    title: 'Street Football Freestyle',
    category: 'football',
    catLabel: 'Football Edits',
    image: 'assets/images/portfolio_football_1784733924182.png',
    tags: ['Football', 'Freestyle', 'Street'],
    desc: 'Creative freestyle football edit with urban aesthetics.'
  },
  {
    id: 12,
    title: 'Drone Reel — City Lights',
    category: 'long-form',
    catLabel: 'Long Form Videos',
    image: 'assets/images/portfolio_longform_1784733997929.png',
    tags: ['Drone', 'Aerial', 'Cityscape'],
    desc: 'Breathtaking aerial drone footage from metropolitan cities.'
  },
  {
    id: 13,
    title: 'Battle Scene — Naruto Edit',
    category: 'anime',
    catLabel: 'Anime Videos',
    image: 'assets/images/portfolio_anime_1784733960098.png',
    tags: ['Naruto', 'Anime', 'Edit'],
    desc: 'Precision-cut battle scene compilation with sound design.'
  },
  {
    id: 14,
    title: 'Food Documentary',
    category: 'documentary',
    catLabel: 'Documentary Style',
    image: 'assets/images/portfolio_documentary_1784733944762.png',
    tags: ['Food', 'Documentary', 'Culture'],
    desc: 'A culinary journey through the streets of India.'
  },
  {
    id: 15,
    title: 'Gaming Setup Tour',
    category: 'gaming',
    catLabel: 'Gaming Videos',
    image: 'assets/images/portfolio_gaming_1784733883250.png',
    tags: ['Gaming', 'Setup', 'Review'],
    desc: 'Cinematic setup tour for a popular gaming content creator.'
  },
];

// ─── STATE ─────────────────────────────────────────────
let activeFilter = 'all';
let searchQuery  = '';

// ─── RENDER ────────────────────────────────────────────
function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  const countEl = document.getElementById('portCount');
  const emptyEl = document.getElementById('portEmpty');
  if (!grid) return;

  const filtered = PORTFOLIO_ITEMS.filter(item => {
    const matchFilter = activeFilter === 'all' || item.category === activeFilter;
    const matchSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery) ||
      item.catLabel.toLowerCase().includes(searchQuery) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery));
    return matchFilter && matchSearch;
  });

  if (countEl) {
    countEl.innerHTML = `Showing <span>${filtered.length}</span> of ${PORTFOLIO_ITEMS.length} projects`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyEl && emptyEl.classList.add('visible');
    return;
  }

  emptyEl && emptyEl.classList.remove('visible');

  grid.innerHTML = filtered.map((item, idx) => `
    <div class="port-grid-item reveal" style="transition-delay:${(idx % 6) * 0.07}s"
         data-id="${item.id}" role="button" tabindex="0"
         aria-label="View ${item.title}">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="port-grid-item__overlay">
        <div class="port-grid-item__top">
          <span class="badge badge-accent">${item.catLabel}</span>
        </div>
        <div class="port-grid-item__play">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div class="port-grid-item__bottom">
          <div class="port-grid-item__title">${item.title}</div>
          <div class="port-grid-item__cat">${item.catLabel}</div>
        </div>
      </div>
    </div>
  `).join('');

  // Re-observe reveals
  document.querySelectorAll('.port-grid-item.reveal').forEach(el => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    observer.observe(el);
  });

  // Click handlers
  grid.querySelectorAll('.port-grid-item').forEach(item => {
    const open = () => openModal(parseInt(item.dataset.id, 10));
    item.addEventListener('click', open);
    item.addEventListener('keydown', e => e.key === 'Enter' && open());
  });
}

// ─── FILTERS ───────────────────────────────────────────
(function initFilters() {
  document.querySelectorAll('.port-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.port-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderPortfolio();
    });
  });
})();

// ─── SEARCH ────────────────────────────────────────────
(function initSearch() {
  const input = document.getElementById('portSearch');
  if (!input) return;

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      searchQuery = input.value.toLowerCase().trim();
      renderPortfolio();
    }, 250);
  });
})();

// ─── MODAL ─────────────────────────────────────────────
function openModal(id) {
  const item = PORTFOLIO_ITEMS.find(p => p.id === id);
  if (!item) return;

  const overlay = document.getElementById('videoModal');
  if (!overlay) return;

  overlay.querySelector('.modal__title').textContent = item.title;
  overlay.querySelector('.modal__cat').textContent   = item.catLabel;
  overlay.querySelector('.modal__video img').src     = item.image;
  overlay.querySelector('.modal__video img').alt     = item.title;

  const tagsEl = overlay.querySelector('.modal__tags');
  if (tagsEl) {
    tagsEl.innerHTML = item.tags.map(t => `<span class="badge badge-light">${t}</span>`).join('');
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('videoModal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

(function initModal() {
  const overlay = document.getElementById('videoModal');
  if (!overlay) return;

  overlay.querySelector('.modal__close').addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

// ─── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', renderPortfolio);
