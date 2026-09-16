/* ============================================================
   SkillSync-AI — Login, Profile & Dashboard
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const SESSION_KEY = "skillsync_session";
  const PROFILE_KEY = "skillsync_profile";

  /* ============================================================
     SESSION
     ============================================================ */

  function getSession() {
    return localStorage.getItem(SESSION_KEY);
  }

  function setSession() {
    localStorage.setItem(SESSION_KEY, "active");
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY));
    } catch (e) {
      return null;
    }
  }


  /* ============================================================
     LOGIN PAGE
     ============================================================ */

  const loginForm = document.getElementById("login-form");

  if (loginForm) {

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!email.value.trim()) {
        alert("Please enter your email.");
        return;
      }

      if (!email.value.includes("@")) {
        alert("Please enter a valid email.");
        return;
      }

      if (password.value.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      setSession();

      // Move to profile page
      window.location.href = "profile.html";
    });
  }


  /* ============================================================
     PROFILE PAGE
     ============================================================ */

  const profileForm = document.getElementById("profile-form");

  if (profileForm) {

    // User must login first
    if (getSession() !== "active") {
      window.location.href = "index.html";
      return;
    }

    profileForm.addEventListener("submit", function (e) {

      e.preventDefault();

      const fullName =
        document.getElementById("full-name").value.trim();

      const college =
        document.getElementById("college").value.trim();

      const branch =
        document.getElementById("branch").value.trim();

      const year =
        document.getElementById("year").value;

      const skills =
        Array.from(
          document.querySelectorAll('input[name="skills"]:checked')
        ).map(skill => skill.value);


      /* ---------- Validation ---------- */

      if (!fullName) {
        alert("Please enter your full name.");
        return;
      }

      if (!college) {
        alert("Please enter your college name.");
        return;
      }

      if (!branch) {
        alert("Please enter your branch.");
        return;
      }

      if (!year) {
        alert("Please select your year.");
        return;
      }

      if (skills.length === 0) {
        alert("Please select at least one skill.");
        return;
      }


      /* ---------- Save Profile ---------- */

      const profile = {
        fullName: fullName,
        college: college,
        branch: branch,
        year: year,
        skills: skills
      };

      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(profile)
      );


      /* ---------- Open Dashboard ---------- */

      window.location.href = "dashboard.html";

    });
  }


  /* ============================================================
     OPPORTUNITY DATA
     ============================================================ */

  const OPPORTUNITIES = [

    {
      id: 1,
      company: "TechNova Solutions",
      role: "Software Engineering Intern",
      requiredSkills: ["JavaScript", "HTML & CSS"],
      applicationDeadline: "2026-10-15"
    },

    {
      id: 2,
      company: "DataFlow Analytics",
      role: "Data Science Intern",
      requiredSkills: ["Python", "Data Analysis", "SQL"],
      applicationDeadline: "2026-10-20"
    },

    {
      id: 3,
      company: "CloudScale Corp",
      role: "Cloud Infrastructure Intern",
      requiredSkills: ["AWS Cloud", "Docker"],
      applicationDeadline: "2026-10-25"
    },

    {
      id: 4,
      company: "WebDev Studios",
      role: "Frontend Developer Intern",
      requiredSkills: ["React", "JavaScript", "HTML & CSS"],
      applicationDeadline: "2026-11-01"
    },

    {
      id: 5,
      company: "AI Innovations Inc.",
      role: "Machine Learning Intern",
      requiredSkills: ["Python", "Machine Learning", "Data Analysis"],
      applicationDeadline: "2026-11-05"
    },

    {
      id: 6,
      company: "FullStack Labs",
      role: "Full Stack Developer Intern",
      requiredSkills: ["JavaScript", "React", "Node.js"],
      applicationDeadline: "2026-11-10"
    },

    {
      id: 7,
      company: "CyberSecure Ltd.",
      role: "Security Operations Intern",
      requiredSkills: ["Python", "Problem Solving"],
      applicationDeadline: "2026-11-15"
    },

    {
      id: 8,
      company: "DesignCo",
      role: "UI/UX Design Intern",
      requiredSkills: ["UI/UX Design", "Figma"],
      applicationDeadline: "2026-11-20"
    },

    {
      id: 9,
      company: "GitHub Enterprise",
      role: "Developer Experience Intern",
      requiredSkills: ["Git & GitHub", "JavaScript"],
      applicationDeadline: "2026-11-25"
    },

    {
      id: 10,
      company: "ExcelPro Systems",
      role: "Data Analysis Intern",
      requiredSkills: ["Data Analysis", "Excel", "SQL"],
      applicationDeadline: "2026-12-01"
    },

    {
      id: 11,
      company: "Accenture",
      role: "Data Analysis Engineer",
      requiredSkills: ["Data Analysis", "Excel", "SQL"],
      applicationDeadline: "2026-12-05"
    },

    {
      id: 12,
      company: "TCS",
      role: "Associate Data Analysis Intern",
      requiredSkills: ["Data Analysis", "C++", "SQL"],
      applicationDeadline: "2026-12-10"
    }

  ];


  /* ============================================================
     MATCHING FUNCTION
     ============================================================ */

  function calculateMatch(requiredSkills, userSkills) {

    const matchingSkills = requiredSkills.filter(skill =>
      userSkills.includes(skill)
    );

    const missingSkills = requiredSkills.filter(skill =>
      !userSkills.includes(skill)
    );

    const percentage =
      (matchingSkills.length / requiredSkills.length) * 100;

    return {
      matchingSkills: matchingSkills,
      missingSkills: missingSkills,
      percentage: percentage
    };
  }


  /* ============================================================
     DASHBOARD PAGE
     ============================================================ */

  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {

    // User must login
    if (getSession() !== "active") {
      window.location.href = "index.html";
      return;
    }

    const profile = getProfile();

    if (!profile) {
      window.location.href = "profile.html";
      return;
    }


    /* ---------- Show Profile Details ---------- */

    document.getElementById("dash-name").textContent =
      profile.fullName;

    document.getElementById("dash-college").textContent =
      profile.college;

    document.getElementById("dash-branch").textContent =
      profile.branch;

    document.getElementById("dash-year").textContent =
      profile.year;


    /* ---------- Show Selected Skills ---------- */

    const skillsBox =
      document.getElementById("dash-skills");

    skillsBox.innerHTML = "";

    profile.skills.forEach(skill => {

      const skillElement =
        document.createElement("span");

      skillElement.className = "skill-tag";

      skillElement.textContent = skill;

      skillsBox.appendChild(skillElement);

    });


    /* ============================================================
       OPPORTUNITY MATCHES
       ============================================================ */

    const matchesSection =
      document.createElement("div");

    matchesSection.className =
      "opportunity-matches";


    const heading =
      document.createElement("h3");

    heading.textContent =
      "Opportunity Matches";

    matchesSection.appendChild(heading);


    const matchesGrid =
      document.createElement("div");

    matchesGrid.className =
      "matches-grid";


    /* ---------- Calculate every opportunity ---------- */

    const results = OPPORTUNITIES.map(opportunity => {

      const match =
        calculateMatch(
          opportunity.requiredSkills,
          profile.skills
        );

      return {
        opportunity: opportunity,
        ...match
      };

    });


    /* ---------- Sort highest percentage first ---------- */

    results.sort(
      (a, b) =>
        b.percentage - a.percentage
    );


    /* ---------- Create Match Cards ---------- */

    results.forEach(result => {

      const opportunity =
        result.opportunity;

      const card =
        document.createElement("div");

      card.className =
        "match-card";


      card.innerHTML = `

        <h4>
          ${opportunity.company}
        </h4>

        <p>
          <strong>
            ${opportunity.role}
          </strong>
        </p>

        <p>
          <strong>
            Match: ${result.percentage.toFixed(0)}%
          </strong>
        </p>

        <p>
          <strong>
            Matching Skills:
          </strong>
          ${result.matchingSkills.length
            ? result.matchingSkills.join(", ")
            : "None"}
        </p>

        <p>
          <strong>
            Missing Skills:
          </strong>
          ${result.missingSkills.length
            ? result.missingSkills.join(", ")
            : "None"}
        </p>

        <p>
          <strong>
            Required Skills:
          </strong>
          ${opportunity.requiredSkills.join(", ")}
        </p>

        <p>
          <strong>
            Deadline:
          </strong>
          ${opportunity.applicationDeadline}
        </p>

      `;

      matchesGrid.appendChild(card);

    });


    matchesSection.appendChild(matchesGrid);


    /* ---------- Put matches below skills ---------- */

    skillsBox.parentNode.insertBefore(
      matchesSection,
      skillsBox.nextSibling
    );


    /* ============================================================
       LOGOUT
       ============================================================ */

    logoutBtn.addEventListener("click", function () {

      clearSession();

      localStorage.removeItem(PROFILE_KEY);

      window.location.href =
        "index.html";

    });

  }

});