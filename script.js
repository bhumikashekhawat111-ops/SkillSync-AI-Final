/* ============================================================
   SkillSync-AI — login, profile & dashboard logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const SESSION_KEY = "skillsync_session";
  const PROFILE_KEY = "skillsync_profile";

  /* ---------- Session helpers (shared by all pages) ---------- */
  function getSession() {
    try {
      return localStorage.getItem(SESSION_KEY);
    } catch (_) {
      return null;
    }
  }

  function setSession() {
    try {
      localStorage.setItem(SESSION_KEY, "active");
    } catch (_) { /* storage unavailable — ignore */ }
  }

  function clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch (_) { /* storage unavailable — ignore */ }
  }

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY));
    } catch (_) {
      return null;
    }
  }

  /* ============================================================
     LOGIN PAGE (index.html)
     ============================================================ */
  const form = document.getElementById("login-form");

n  /* ============================================================
   OPPORTUNITY DATA - skill matching feature (Part 1A)
   ============================================================ */
  const OPPORTUNITIES = [
    {
      id: 1,
      company: "TechNova Solutions",
      role: "Software Engineering Intern",
      requiredSkills: ["JavaScript", "HTML5", "CSS3"],
      openingDate: "2024-01-15",
      applicationDeadline: "2024-02-15",
      startDate: "2024-02-01",
    },
    {
      id: 2,
      company: "DataFlow Analytics",
      role: "Data Science Intern",
      requiredSkills: ["Python", "Pandas", "NumPy"],
      openingDate: "2024-01-20",
      applicationDeadline: "2024-02-20",
      startDate: "2024-02-10",
    },
    {
      id: 3,
      company: "CloudScale Corp",
      role: "Cloud Infrastructure Intern",
      requiredSkills: ["AWS Cloud", "Docker", "Kubernetes"],
      openingDate: "2024-01-25",
      applicationDeadline: "2024-02-25",
      startDate: "2024-02-15",
    },
    {
      id: 4,
      company: "WebDev Studios",
      role: "Frontend Developer Intern",
      requiredSkills: ["React", "JavaScript", "HTML5"],
      openingDate: "2024-01-10",
      applicationDeadline: "2024-02-10",
      startDate: "2024-01-28",
    },
    {
      id: 5,
      company: "AI Innovations Inc.",
      role: "Machine Learning Intern",
      requiredSkills: ["Python", "Machine Learning", "TensorFlow"],
      openingDate: "2024-02-01",
      applicationDeadline: "2024-03-01",
      startDate: "2024-03-15",
    },
    {
      id: 6,
      company: "FullStack Labs",
      role: "Full Stack Developer Intern",
      requiredSkills: ["JavaScript", "React", "Node.js"],
      openingDate: "2024-02-05",
      applicationDeadline: "2024-03-05",
      startDate: "2024-03-18",
    },
    {
      id: 7,
      company: "CyberSecure Ltd.",
      role: "Security Operations Intern",
      requiredSkills: ["Problem Solving", "Network Security", "Python"],
      openingDate: "2024-02-10",
      applicationDeadline: "2024-03-10",
      startDate: "2024-03-20",
    },
    {
      id: 8,
      company: "DesignCo",
      role: "UI/UX Design Intern",
      requiredSkills: ["UI/UX Design", "Figma", "Adobe Creative Suite"],
      openingDate: "2024-02-15",
      applicationDeadline: "2024-03-15",
      startDate: "2024-03-25",
    },
    {
      id: 9,
      company: "GitHub Enterprise",
      role: "Developer Experience Intern",
      requiredSkills: ["Git & GitHub", "JavaScript", "Markdown"],
      openingDate: "2024-02-20",
      applicationDeadline: "2024-03-20",
      startDate: "2024-04-01",
    },
    {
      id: 10,
      company: "ExcelPro Systems",
      role: "Data Analysis Intern",
      requiredSkills: ["Data Analysis", "Excel", "SQL"],
      openingDate: "2024-02-25",
      applicationDeadline: "2024-03-25",
      startDate: "2024-04-05",
    },
  ];
  if (form) {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const toggleBtn = document.getElementById("toggle-password");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const loginBtn = document.getElementById("login-btn");

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const MIN_PASSWORD_LENGTH = 6;

    // Already logged in (via "Remember me")? Skip straight to profile.
    if (getSession() === "active") {
      window.location.replace("profile.html");
      return;
    }

    /* ---------- Password show / hide ---------- */
    toggleBtn.addEventListener("click", () => {
      const hidden = password.type === "password";
      password.type = hidden ? "text" : "password";

      toggleBtn.setAttribute("aria-pressed", String(hidden));
      toggleBtn.setAttribute("aria-label", hidden ? "Hide password" : "Show password");

      const eye = toggleBtn.querySelector(".icon-eye");
      const eyeOff = toggleBtn.querySelector(".icon-eye-off");
      eye.hidden = hidden;
      eyeOff.hidden = !hidden;

      password.focus();
    });

    /* ---------- Validation helpers ---------- */
    function setError(input, msgEl, message) {
      if (message) {
        input.classList.add("invalid");
        msgEl.textContent = message;
        msgEl.classList.remove("show");
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

        // Persist session only when "Remember me" is checked
        const remember = document.getElementById("remember").checked;
        if (remember) setSession();

        showToast("Logged in successfully. Setting up your profile…", "success");
        setTimeout(() => { window.location.href = "profile.html"; }, 600);
      }, 1200);
    });
  }

  /* ============================================================
     PROFILE PAGE (profile.html)
     ============================================================ */
  const profileForm = document.getElementById("profile-form");

  if (profileForm) {
    // Guard: not logged in? Back to login.
    if (getSession() !== "active") {
      window.location.replace("index.html");
      return;
    }

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("full-name").value.trim();
      const college = document.getElementById("college").value.trim();
      const branch = document.getElementById("branch").value.trim();
      const year = document.getElementById("year").value;
      const skills = Array.from(
        document.querySelectorAll('input[name="skills"]:checked')
      ).map((cb) => cb.value);

      let valid = true;
      valid = requireText("full-name", "name-error", "Full name is required.", fullName) && valid;
      valid = requireText("college", "college-error", "College name is required.", college) && valid;
      valid = requireText("branch", "branch-error", "Branch is required.", branch) && valid;
      valid = requireSelect("year", "year-error", "Please select your year.", year) && valid;

      if (!skills.length) {
        valid = false;
        const el = document.getElementById("skills-error");
        el.textContent = "Please select at least one skill.";
        el.classList.remove("show");
        void el.offsetWidth;
        el.classList.add("show");
      } else {
        const el = document.getElementById("skills-error");
        el.textContent = "";
        el.classList.remove("show");
      }

      if (!valid) return;

      // Save the profile
      try {
        localStorage.setItem(
          PROFILE_KEY,
          JSON.stringify({ fullName, college, branch, year, skills })
        );
      } catch (_) { /* storage unavailable — ignore */ }

      showToast("Profile saved!", "success");
      setTimeout(() => { window.location.href = "dashboard.html"; }, 600);
    });
  }

  /* ---------- Shared field validation (profile page) ---------- */
  function requireText(id, errId, message, value) {
    const input = document.getElementById(id);
    const err = document.getElementById(errId);
    if (value) {
      input.classList.remove("invalid");
      err.textContent = "";
      err.classList.remove("show");
      return true;
    }
    input.classList.add("invalid");
    err.textContent = message;
    err.classList.remove("show");
    void err.offsetWidth;
    err.classList.add("show");
    return false;
  }

  function requireSelect(id, errId, message, value) {
    const select = document.getElementById(id);
    const err = document.getElementById(errId);
}

/* ============================================================
   REUSABLE MATCHING LOGIC (Task 1B)
   Accepts an opportunity object and user skills array, returns match data
   ============================================================ */
function calculateOpportunityMatch(opp, userSkills) {
  const requiredSet = new Set(opp.requiredSkills);
  const userSet = new Set(userSkills);
  const matching = opp.requiredSkills.filter((s) => userSet.has(s));
  const missing = opp.requiredSkills.filter((s) => !userSet.has(s));
  const pct = ((matching.length / opp.requiredSkills.length) * 100).toFixed(1);
  return { pct, matching, missing };
}

/* ============================================================
     DASHBOARD PAGE (dashboard.html)
    if (value) {
      select.classList.remove("invalid");
      err.textContent = "";
      err.classList.remove("show");
      return true;
    }
    select.classList.add("invalid");
    err.textContent = message;
    err.classList.remove("show");
    void err.offsetWidth;
    err.classList.add("show");
    return false;
  }

  /* ============================================================
     DASHBOARD PAGE (dashboard.html)
     ============================================================ */
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    // Guard: not logged in? Back to login.
    if (getSession() !== "active") {
      window.location.replace("index.html");
      return;
    }

    // Render profile info
    const profile = getProfile();
    if (profile) {
      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      set("dash-name", profile.fullName);
      set("dash-college", profile.college);
      set("dash-branch", profile.branch);
      set("dash-year", profile.year);

      const skillsBox = document.getElementById("dash-skills");
      if (skillsBox && Array.isArray(profile.skills)) {
        profile.skills.forEach((skill) => {
          const chip = document.createElement("span");
          chip.className = "skill-tag";
          chip.textContent = skill;
          skillsBox.appendChild(chip);
        });
      }

      // Calculate and display opportunity matches
      const userSkills = profile.skills || [];
      const matchedOpportunities = OPPORTUNITIES.map((opp) =>
        calculateOpportunityMatch(opp, userSkills)
      );

      // Sort by highest match percentage (descending)
      matchedOpportunities.sort((a, b) => b.pct - a.pct);

      const matchesSection = document.createElement("div");
      matchesSection.className = "opportunity-matches";
      matchesSection.innerHTML = '<h3>Opportunity Matches</h3>';
      const matchesGrid = document.createElement("div");
      matchesGrid.className = "matches-grid";
      matchedOpportunities.forEach((match, idx) => {
        const opp = OPPORTUNITIES[idx];
        const { pct, matching, missing } = match;
        // Recommended skills are the missing skills from this opportunity's required list
        // (skills the user should learn to improve their match)
        const recommended = missing.slice(0, 2);
        const card = document.createElement("div");
        card.className = "match-card";
        card.innerHTML = `
          <div>
            <strong>${opp.company}: ${opp.role}</strong>
            <br />
            <span>Match: ${pct}%</span>
          </div>
          <div>
            <span>Matching: ${matching.length > 0 ? matching.join(", ") : "None"}</span>
            <br />
            <span>Missing: ${missing.length > 0 ? missing.join(", ") : "None"}</span>
            ${recommended.length > 0
              ? `<br /><span>Recommended: ${recommended.join(", ")}</span>`
              : ""}
            <br />
            <span>Deadline: ${opp.applicationDeadline}</span>
          </div>
        `;
        matchesGrid.appendChild(card);
      });
      matchesSection.appendChild(matchesGrid);
      const skillsBoxParent = document.getElementById("dash-skills").parentNode;
      skillsBoxParent.insertBefore(matchesSection, skillsBox.nextSibling);
    }

    /* ---------- Logout ---------- */
    logoutBtn.addEventListener("click", () => {
      clearSession();
      // Also wipe any saved profile so it can't be viewed without logging in again
      try {
        localStorage.removeItem(PROFILE_KEY);
      } catch (_) { /* storage unavailable — ignore */ }

      showToast("You have been logged out.", "");
      setTimeout(() => { window.location.href = "index.html"; }, 600);
    });
  }

  /* ============================================================
     Toast (works on all pages)
     ============================================================ */
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