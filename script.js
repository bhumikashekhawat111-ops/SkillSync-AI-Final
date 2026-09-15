/* ============================================================
   SkillSync-AI Login — validation & interactions
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const toggleBtn = document.getElementById("toggle-password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const loginBtn = document.getElementById("login-btn");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_PASSWORD_LENGTH = 6;

  /* ---------- Password show / hide ---------- */
  toggleBtn.addEventListener("click", () => {
    const hidden = password.type === "password";
    password.type = hidden ? "text" : "password";

    toggleBtn.setAttribute("aria-pressed", String(hidden));
    toggleBtn.setAttribute("aria-label", hidden ? "Hide password" : "Show password");

    const eye = toggleBtn.querySelector(".icon-eye");
    const eyeOff = toggleBtn.querySelector(".icon-eye-off");
    eye.hidden = hidden;       // eye visible while password is hidden
    eyeOff.hidden = !hidden;   // eye-off visible once password is shown

    // keep focus in the field after toggling
    password.focus();
  });

  /* ---------- Validation helpers ---------- */
  function setError(input, msgEl, message) {
    if (message) {
      input.classList.add("invalid");
      msgEl.textContent = message;
      msgEl.classList.remove("show");
      // restart shake animation
      void msgEl.offsetWidth;
      msgEl.classList.add("show");
    } else {
      input.classList.remove("invalid");
      msgEl.textContent = "";
      msgEl.classList.remove("show");
    }
  }

  function validateEmail(showError = true) {
    const value = email.value.trim();
    let message = "";

    if (!value) message = "Email is required.";
    else if (!EMAIL_RE.test(value)) message = "Enter a valid email address.";

    if (showError || message === "") setError(email, emailError, message);
    return message === "";
  }

  function validatePassword(showError = true) {
    const value = password.value;
    let message = "";

    if (!value) message = "Password is required.";
    else if (value.length < MIN_PASSWORD_LENGTH)
      message = "Password must be at least 6 characters.";

    if (showError || message === "") setError(password, passwordError, message);
    return message === "";
  }

  /* ---------- Live feedback ---------- */
  email.addEventListener("blur", () => validateEmail(true));
  email.addEventListener("input", () => {
    if (emailError.textContent) validateEmail(true);
  });

  password.addEventListener("blur", () => validatePassword(true));
  password.addEventListener("input", () => {
    if (passwordError.textContent) validatePassword(true);
  });

  /* ---------- Submit ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const okEmail = validateEmail(true);
    const okPassword = validatePassword(true);

    if (!okEmail) {
      email.focus();
      return;
    }
    if (!okPassword) {
      password.focus();
      return;
    }

    // Simulate an async login (replace with a real API call)
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in…";

    setTimeout(() => {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";

      const remember = document.getElementById("remember").checked;
      showToast(
        remember
          ? "Logged in successfully (remembered ✅)"
          : "Logged in successfully 🎉",
        "success"
      );
    }, 1200);
  });

  /* ---------- Sign up link ---------- */
  document.getElementById("signup-link").addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Redirecting to sign up…", "success");
    // window.location.href = "signup.html"; // hook up your real page here
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  function showToast(message, type = "") {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }
});
