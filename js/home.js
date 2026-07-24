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
  const form = document.getElementById('subscriptionForm');
  const input = document.getElementById('subEmail');
  const btn = document.getElementById('subBtn');
  const errorEl = document.getElementById('subEmailError');
  const successEl = document.getElementById('subSuccess');
  const netErrEl = document.getElementById('subNetError');

  if (!form) return;

  // ─────────────────────────────────────────────────────
  // GOOGLE SHEETS INTEGRATION
  // Step 1: Create a Google Sheet with columns: Email | Timestamp | Source
  // Step 2: In Google Sheets → Extensions → Apps Script, paste:
  //
  //   function doPost(e) {
  //     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //     var data  = JSON.parse(e.postData.contents);
  //     sheet.appendRow([data.email, data.timestamp, data.source]);
  //     return ContentService.createTextOutput('OK');
  //   }
  //
  // Step 3: Deploy → New Deployment → Web App → Anyone can access
  // Step 4: Replace the URL below with your deployed Apps Script URL:
  // ─────────────────────────────────────────────────────
  const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  // Email validation helper — RFC 5322 simplified
  const isValidEmail = (val) =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(val);

  // Hide all feedback messages
  const hideAll = () => {
    [errorEl, successEl, netErrEl].forEach(el => { if (el) el.style.display = 'none'; });
  };

  // Show a specific feedback element
  const show = (el, msg) => {
    if (!el) return;
    if (msg) el.textContent = msg;
    el.style.display = 'block';
  };

  // Reset button to default state
  const resetBtn = () => {
    btn.textContent = 'Subscribe';
    btn.disabled = false;
  };

  // Clear error on typing
  input.addEventListener('input', () => {
    input.style.borderColor = '';
    if (errorEl) errorEl.style.display = 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAll();

    const email = input.value.trim();

    // Validate
    if (!email) {
      input.style.borderColor = '#E53935';
      show(errorEl, 'Please enter your email address.');
      input.focus();
      return;
    }
    if (!isValidEmail(email)) {
      input.style.borderColor = '#E53935';
      show(errorEl, 'Please enter a valid email address (e.g. name@domain.com).');
      input.focus();
      return;
    }

    // Loading state
    btn.textContent = 'Subscribing\u2026';
    btn.disabled = true;

    try {
      if (APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            timestamp: new Date().toISOString(),
            source: 'editkaro_subscription',
          }),
        });
      } else {
        // Demo mode — simulates network delay
        console.log('[Editkaro] Subscription demo:', { email, timestamp: new Date().toISOString() });
        await new Promise(r => setTimeout(r, 800));
      }

      // Success
      input.value = '';
      input.style.borderColor = '';
      show(successEl);
      btn.textContent = '\u2713 Subscribed!';
      setTimeout(() => {
        resetBtn();
        if (successEl) successEl.style.display = 'none';
      }, 5000);

    } catch (err) {
      console.error('[Editkaro] Subscription error:', err);
      show(netErrEl);
      resetBtn();
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
