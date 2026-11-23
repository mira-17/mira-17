/* ==========================================================================
   EventHub — Form behaviour (Contact, Login, Sign Up)
   - Show / hide password toggles
   - Client-side validation with inline, accessible error messages
   - Front-end demo submissions (no backend is connected)
   ========================================================================== */

(function () {
  "use strict";

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- Show / hide password ---------- */
  document.querySelectorAll(".password-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      const input = document.getElementById(button.getAttribute("aria-controls"));
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.setAttribute("aria-pressed", String(show));
      button.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  /* ---------- Validation helpers ---------- */

  // Returns an error message for a field, or "" if it is valid.
  function getError(input) {
    const value = input.value.trim();
    const label = input.dataset.label || "This field";

    if (input.type === "checkbox") {
      return input.required && !input.checked ? input.dataset.requiredMessage || "Please check this box." : "";
    }

    if (input.required && value === "") {
      return label + " is required.";
    }
    if (value === "") return "";

    if (input.type === "email" && !EMAIL_PATTERN.test(value)) {
      return "Please enter a valid email address (e.g. name@example.com).";
    }

    const min = parseInt(input.getAttribute("minlength"), 10);
    if (min && value.length < min) {
      return label + " must be at least " + min + " characters.";
    }

    if (input.dataset.rule === "name" && !/^[\p{L}][\p{L}\s.'-]*$/u.test(value)) {
      return "Please use letters only for your name.";
    }

    if (input.dataset.rule === "password" && !(/[A-Za-z]/.test(value) && /\d/.test(value))) {
      return "Password must include at least one letter and one number.";
    }

    if (input.dataset.match) {
      const other = document.getElementById(input.dataset.match);
      if (other && other.value !== input.value) {
        return "Passwords do not match.";
      }
    }

    return "";
  }

  function showError(input, message) {
    const field = input.closest(".field");
    if (!field) return;
    const errorEl = field.querySelector(".field-error");
    field.classList.toggle("has-error", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (errorEl) errorEl.querySelector("span").textContent = message;
  }

  function validateField(input) {
    const message = getError(input);
    showError(input, message);
    return !message;
  }

  function showAlert(alertEl, type, title, text) {
    if (!alertEl) return;
    alertEl.className = "alert alert--" + type + " is-visible";
    alertEl.querySelector("[data-alert-title]").textContent = title;
    alertEl.querySelector("[data-alert-text]").textContent = text;
  }

  function hideAlert(alertEl) {
    if (alertEl) alertEl.classList.remove("is-visible");
  }

  // Simulates a short network delay so the UI feels realistic.
  function fakeRequest(button, loadingText, done) {
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = loadingText;
    setTimeout(function () {
      button.disabled = false;
      button.innerHTML = original;
      done();
    }, 700);
  }

  /* ---------- Wire up every form with data-form ---------- */
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    const inputs = Array.from(form.querySelectorAll("[data-validate]"));
    const alertEl = form.querySelector(".alert");
    const submitBtn = form.querySelector('[type="submit"]');

    inputs.forEach(function (input) {
      // Validate when leaving a field that has been typed in.
      input.addEventListener("blur", function () {
        if (input.value.trim() !== "" || input.dataset.touched) {
          input.dataset.touched = "true";
          validateField(input);
        }
      });

      // Re-validate live once a field is showing an error.
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") validateField(input);

        // Keep "confirm password" in sync when the original password changes.
        const dependant = form.querySelector('[data-match="' + input.id + '"]');
        if (dependant && dependant.value !== "") validateField(dependant);
      });

      input.addEventListener("change", function () {
        if (input.type === "checkbox") validateField(input);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      hideAlert(alertEl);

      let firstInvalid = null;
      inputs.forEach(function (input) {
        input.dataset.touched = "true";
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        showAlert(alertEl, "error", "Please check the highlighted fields.", "Some information is missing or invalid.");
        firstInvalid.focus();
        return;
      }

      const handler = handlers[form.dataset.form];
      if (handler) handler(form, alertEl, submitBtn);
    });
  });

  /* ---------- Per-form demo handlers ---------- */
  const STORAGE_KEY = "eventhub:remembered-email";

  const handlers = {
    contact: function (form, alertEl, submitBtn) {
      fakeRequest(submitBtn, "Sending…", function () {
        const name = form.querySelector("#contact-name").value.trim().split(/\s+/)[0];
        showAlert(
          alertEl,
          "success",
          "Thanks, " + name + "! Your message passed validation.",
          "This is a front-end demo: no message was actually sent because no backend is connected yet."
        );
        form.reset();
        form.querySelectorAll("[data-validate]").forEach(function (i) {
          delete i.dataset.touched;
          i.removeAttribute("aria-invalid");
        });
      });
    },

    login: function (form, alertEl, submitBtn) {
      const email = form.querySelector("#login-email").value.trim();
      const remember = form.querySelector("#login-remember");

      // "Remember me" stores only the email address, in this browser.
      try {
        if (remember && remember.checked) localStorage.setItem(STORAGE_KEY, email);
        else localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        /* storage unavailable — ignore */
      }

      fakeRequest(submitBtn, "Signing in…", function () {
        showAlert(
          alertEl,
          "info",
          "Your login details look valid (" + email + ").",
          "Real authentication is not implemented yet. No account was checked and you have not been signed in."
        );
      });
    },

    signup: function (form, alertEl, submitBtn) {
      fakeRequest(submitBtn, "Creating account…", function () {
        const name = form.querySelector("#signup-name").value.trim().split(/\s+/)[0];
        showAlert(
          alertEl,
          "success",
          "Welcome to EventHub, " + name + "!",
          "This is a front-end demo: your details passed validation, but no account was created and nothing was stored."
        );
        form.reset();
        updateStrength("");
      });
    },
  };

  /* ---------- Login extras ---------- */
  const loginEmail = document.getElementById("login-email");
  if (loginEmail) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        loginEmail.value = saved;
        const remember = document.getElementById("login-remember");
        if (remember) remember.checked = true;
      }
    } catch (e) {
      /* storage unavailable — ignore */
    }
  }

  const forgotBtn = document.getElementById("forgot-password");
  if (forgotBtn) {
    forgotBtn.addEventListener("click", function () {
      const alertEl = forgotBtn.closest("form").querySelector(".alert");
      showAlert(
        alertEl,
        "info",
        "Password reset isn't available in this demo.",
        "Once a backend is connected, a reset link will be emailed to you from here."
      );
    });
  }

  /* ---------- Sign up: password strength meter ---------- */
  const strengthEl = document.querySelector("[data-strength]");
  const strengthLabel = document.querySelector("[data-strength-label]");
  const signupPassword = document.getElementById("signup-password");

  function updateStrength(value) {
    if (!strengthEl) return;
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value) || value.length >= 12) score++;
    if (value === "") score = 0;
    strengthEl.dataset.level = String(score);
    if (strengthLabel) {
      strengthLabel.textContent = value
        ? "Strength: " + ["Too weak", "Weak", "Fair", "Good", "Strong"][score]
        : "Use 8+ characters with letters and numbers.";
    }
  }

  if (signupPassword) {
    signupPassword.addEventListener("input", function () {
      updateStrength(signupPassword.value);
    });
  }
})();
