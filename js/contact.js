/* ========================================================
   CONTACT PAGE JS
   ======================================================== */

// ─── CONFIG ────────────────────────────────────────────
// Replace with your deployed Google Apps Script Web App URL
const CONTACT_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// ─── FORM VALIDATION ──────────────────────────────────
function validateField(input, errorEl) {
  const value = input.value.trim();
  let valid = true;
  let msg = '';

  if (input.required && !value) {
    valid = false;
    msg = 'This field is required.';
  } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    valid = false;
    msg = 'Please enter a valid email address.';
  } else if (input.name === 'phone' && value && !/^[\d\s+\-()]{7,15}$/.test(value)) {
    valid = false;
    msg = 'Please enter a valid phone number.';
  }

  input.classList.toggle('error', !valid);
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.toggle('visible', !valid);
  }

  return valid;
}

// ─── CONTACT FORM ─────────────────────────────────────
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('formSubmitBtn');
  if (!form) return;

  // Live validation
  form.querySelectorAll('input, textarea').forEach(input => {
    const errorEl = document.getElementById(input.id + 'Error');
    input.addEventListener('blur', () => validateField(input, errorEl));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input, errorEl);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all
    let allValid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
      const errorEl = document.getElementById(input.id + 'Error');
      if (!validateField(input, errorEl)) allValid = false;
    });

    if (!allValid) return;

    // Collect services
    const services = [...form.querySelectorAll('input[name="service"]:checked')]
      .map(cb => cb.value).join(', ');

    const payload = {
      name:      form.querySelector('[name="name"]').value.trim(),
      email:     form.querySelector('[name="email"]').value.trim(),
      phone:     form.querySelector('[name="phone"]').value.trim(),
      message:   form.querySelector('[name="message"]').value.trim(),
      services,
      timestamp: new Date().toISOString(),
      source:    'editkaro_website',
    };

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      if (CONTACT_APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        await fetch(CONTACT_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Demo mode
        console.log('Contact form submission (demo mode):', payload);
        await new Promise(r => setTimeout(r, 1200));
      }

      // Show success
      form.style.display = 'none';
      success.classList.add('visible');

    } catch (err) {
      console.error('Submission error:', err);
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Try Again';
      setTimeout(() => {
        submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      }, 3000);
    }
  });
})();
