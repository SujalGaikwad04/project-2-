/* ========================================================
   HOME PAGE JS
   ======================================================== */

// ─── HERO PARALLAX ────────────────────────────────────
(function initHeroParallax() {
  const floatCards = document.querySelectorAll('.hero__float-card');
  if (!floatCards.length) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    floatCards.forEach((card, i) => {
      const depth = (i + 1) * 0.6;
      card.style.transform = `translate(${dx * depth * 8}px, ${dy * depth * 8}px)`;
    });
  }, { passive: true });
})();

// ─── COUNTER ANIMATION ────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ─── SUBSCRIPTION FORM ────────────────────────────────
(function initSubscription() {
  const form = document.querySelector('.subscription__form');
  const input = document.querySelector('.subscription__input');
  const btn   = document.querySelector('.subscription__btn');

  if (!form) return;

  // ── Google Sheets ready ──
  // Replace this URL with your deployed Google Apps Script URL:
  const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = '#E53935';
      input.focus();
      setTimeout(() => input.style.borderColor = '', 2000);
      return;
    }

    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    try {
      if (APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, timestamp: new Date().toISOString(), source: 'website_subscription' }),
        });
      } else {
        // Demo mode
        console.log('Subscription (demo):', email);
        await new Promise(r => setTimeout(r, 800));
      }

      btn.textContent = '✓ Subscribed!';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
      }, 3000);
    } catch {
      btn.textContent = 'Try again';
      btn.disabled = false;
    }
  });
})();

// ─── TESTIMONIALS DRAG SCROLL ─────────────────────────
(function initTestimonialsScroll() {
  const track = document.querySelector('.testimonials__track');
  if (!track) return;

  let isDown = false, startX, scrollLeft;

  track.addEventListener('mousedown', e => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });

  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  track.style.cursor = 'grab';
})();

// ─── FEATURED PORTFOLIO CARDS ─────────────────────────
(function initFeatPortfolio() {
  const cards = document.querySelectorAll('.port-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = 'portfolio.html';
    });
  });
})();
