// Contact form — POSTs to contact.php, client-side validation, a11y.
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = form.querySelector('[data-status]');
  const submitBtn = form.querySelector('[data-submit]');
  const defaultBtnLabel = submitBtn ? submitBtn.textContent : 'Send message';

  const validators = {
    name: (v) => (v.trim().length > 0 ? null : 'Please enter your name.'),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Please enter a valid email.',
    message: (v) =>
      v.trim().length >= 10 ? null : 'Please tell us a bit more (10+ characters).',
  };

  const setFieldError = (field, msg) => {
    const wrap = field.closest('.form-field');
    if (!wrap) return;
    const errorEl = wrap.querySelector('.form-field__error');
    if (msg) {
      wrap.setAttribute('data-error', 'true');
      field.setAttribute('aria-invalid', 'true');
      if (errorEl) errorEl.textContent = msg;
    } else {
      wrap.removeAttribute('data-error');
      field.removeAttribute('aria-invalid');
      if (errorEl) errorEl.textContent = '';
    }
  };

  const validate = () => {
    let firstInvalid = null;
    Object.keys(validators).forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      const err = validators[name](field.value);
      setFieldError(field, err);
      if (err && !firstInvalid) firstInvalid = field;
    });
    return firstInvalid;
  };

  ['name', 'email', 'message'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    field.addEventListener('blur', () => {
      const err = validators[name](field.value);
      setFieldError(field, err);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstInvalid = validate();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    if (status) {
      status.removeAttribute('data-visible');
      status.textContent = '';
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      let data = {};
      try { data = await res.json(); } catch (_) { /* ignore parse error */ }

      if (res.ok && data.success) {
        window.location.href = 'thank-you.html';
        return;
      }
      throw new Error(data.message || 'Submission failed');
    } catch (err) {
      console.error('Contact form error:', err);
      if (status) {
        status.textContent =
          (err && err.message) ||
          'Something went wrong. Please try again or call us directly.';
        status.setAttribute('data-visible', 'true');
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultBtnLabel;
      }
    }
  });
})();
