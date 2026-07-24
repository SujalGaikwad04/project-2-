/* ========================================================
   CONTACT PAGE JS — Production Ready
   ======================================================== */

// ─── GOOGLE SHEETS CONFIGURATION ──────────────────────
//
// How to connect this form to Google Sheets:
//
// Step 1: Create a Google Sheet with these column headers:
//         Name | Email | Phone | Services | Message | Timestamp | Source
//
// Step 2: Open Extensions → Apps Script and paste this code:
//
//   function doPost(e) {
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//     var data  = JSON.parse(e.postData.contents);
//     sheet.appendRow([
//       data.name, data.email, data.phone,
//       data.services, data.message,
//       data.timestamp, data.source
//     ]);
//     return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
//
// Step 3: Deploy → New Deployment → Web App
//         Execute as: Me | Who has access: Anyone
//
// Step 4: Copy the Web App URL and paste it below:
//
const CONTACT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4mDnR4pB2cR5ZChcI1lsEmBx5SiuaaecYTf_H54N2sMT1Knwi_pcKcJGmNzzo2K7DgA/exec';

// ─── VALIDATION HELPERS ────────────────────────────────

/**
 * Validates a single form field and shows/hides its error element.
 * @returns {boolean} true if valid
 */
function validateField(input, errorEl) {
  const value = input.value.trim();
  let valid = true;
  let msg = '';

  if (input.required && !value) {
    valid = false;
    msg = 'This field is required.';
  } else if (input.type === 'email' && value) {
    // RFC 5322 simplified — stricter than the basic version
    const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!emailRe.test(value)) {
      valid = false;
      msg = 'Please enter a valid email address (e.g. name@domain.com).';
    }
  } else if (input.name === 'phone' && value) {
    // Accepts: +91 98765 43210, (022) 12345678, 9876543210, +1-800-555-0100
    const phoneRe = /^[+]?[\d\s\-().]{7,20}$/;
    if (!phoneRe.test(value)) {
      valid = false;
      msg = 'Please enter a valid phone number.';
    }
  }

  input.classList.toggle('error', !valid);

  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.toggle('visible', !valid);
  }

  // Update aria-invalid for accessibility
  input.setAttribute('aria-invalid', valid ? 'false' : 'true');

  return valid;
}

// ─── CONTACT FORM ─────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('formSubmitBtn');
  const netErrEl = document.getElementById('formNetError');

  if (!form) return;

  // ── Live validation on blur / input ──────────────────
  form.querySelectorAll('input, textarea').forEach(input => {
    const errorEl = document.getElementById(input.id + 'Error');
    input.addEventListener('blur', () => validateField(input, errorEl));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input, errorEl);
    });
  });

  // ── Submit ────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide any previous network error
    if (netErrEl) netErrEl.style.display = 'none';

    // Validate all required fields
    let allValid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
      const errorEl = document.getElementById(input.id + 'Error');
      if (!validateField(input, errorEl)) allValid = false;
    });

    if (!allValid) {
      // Focus the first invalid field for accessibility
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Collect checked services
    const services = [...form.querySelectorAll('input[name="service"]:checked')]
      .map(cb => cb.value)
      .join(', ');

    const payload = {
      name: form.querySelector('[name="name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim(),
      message: form.querySelector('[name="message"]').value.trim(),
      services: services || 'Not specified',
      timestamp: new Date().toISOString(),
      source: 'editkaro_contact_form',
    };

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      if (CONTACT_APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        await fetch(CONTACT_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',          // Required for Apps Script cross-origin
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Demo mode — logs payload and simulates delay
        console.log('[Editkaro] Contact form (demo mode):', payload);
        await new Promise(r => setTimeout(r, 1200));
      }

      // Show success state
      form.style.display = 'none';
      if (successEl) successEl.classList.add('visible');

    } catch (err) {
      console.error('[Editkaro] Submission error:', err);

      // Show network error banner
      if (netErrEl) {
        netErrEl.style.display = 'block';
        // Auto-hide after 6 seconds
        setTimeout(() => { netErrEl.style.display = 'none'; }, 6000);
      }

      // Reset button
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) {
        btnText.textContent = 'Try Again';
        setTimeout(() => { btnText.textContent = 'Send Message'; }, 4000);
      }
    }
  });
})();
