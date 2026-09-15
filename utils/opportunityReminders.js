// Opportunity Reminder Feature (Task 2)
// Aligns with existing SkillSync-AI dashboard design using project CSS classes

/**
 * Calculates days remaining until deadline and since start date
 * @param {string|Date} deadlineDate - Application deadline date string
 * @param {string|Date} startDate - Opportunity start date string
 * @returns {Object} - Contains daysRemaining and daysSinceStart
 */
function calculateDays(deadlineDate, startDate) {
  const today = new Date();
  const deadline = new Date(deadlineDate);
  const start = new Date(startDate);
  
  const daysRemaining = Math.max(0, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)));
  const daysSinceStart = Math.max(0, Math.ceil((today - start) / (1000 * 60 * 60 * 24)));
  
  return { daysRemaining, daysSinceStart };
}

/**
 * Gets available reminder timing options based on days remaining
 * @param {number} daysRemaining - Days until application deadline
 * @returns {string[]} - Array of timing option labels
 */
function getTimingOptions(daysRemaining) {
  if (daysRemaining <= 1) {
    return ["deadline day"];
  } else if (daysRemaining <= 3) {
    return ["1 day before", "deadline day"];
  } else if (daysRemaining <= 7) {
    return ["3 days before", "1 day before", "deadline day"];
  } else {
    return ["7 days before", "3 days before", "1 day before", "deadline day"];
  }
}

/**
 * Renders opportunity reminder cards on the dashboard
 * @param {Object[]} opportunities - Array of opportunity objects (must have: id, company, role, requiredSkills, startDate, applicationDeadline)
 * @param {Object[]} matchedOpportunities - Array of match results from calculateOpportunityMatch
 * @param {string[]} userSkills - Array of user's selected skills
 * @returns {void}
 */
function renderOpportunityReminders(opportunities, matchedOpportunities, userSkills) {
  // Create reminder section - matches dashboard design conventions
  // Uses existing dashboard layout pattern: inserted after skillsBox, before/after matchesSection
  const remindersSection = document.createElement("div");
  remindersSection.className = "opportunity-reminders";
  remindersSection.innerHTML = '<h3>Application Reminders</h3>';

  const remindersGrid = document.createElement("div");
  remindersGrid.className = "reminders-grid";

  opportunities.forEach((opp, idx) => {
    const match = matchedOpportunities[idx];
    const pct = match ? match.pct : "0";
    const { daysRemaining } = calculateDays(opp.applicationDeadline, opp.startDate);
    const timingOptions = getTimingOptions(daysRemaining);

    // Check if user already set a reminder for this opportunity
    const savedReminders = JSON.parse(localStorage.getItem("skillsync_reminders") || "{}");
    const oppKey = opp.id;
    const existingReminder = savedReminders[oppKey] || null;

    // Build reminder card - matches dashboard card design
    // Reuses existing dashboard patterns: dash-profile style, skill-tag styling, dash-note dashed border
    const card = document.createElement("div");
    card.className = "reminder-card";
    card.innerHTML = `
      <div style="font-weight: 600; font-size: 14.5px; color: var(--ink); margin-bottom: 8px;">
        ${opp.company}: ${opp.role}
      </div>
      <div style="font-size: 13px; color: var(--muted); margin-bottom: 6px;">
        <span>Starts: ${opp.startDate}</span>
        <br />
        <span>Deadline: ${opp.applicationDeadline} (${daysRemaining}d remaining)</span>
      </div>
      <div style="font-size: 13px; color: var(--muted); margin-bottom: 6px;">
        <span>Matching Skills: ${opp.requiredSkills.filter(s => userSkills.includes(s)).join(", ") || "None"}</span>
      </div>
      <div style="margin-top: 8px;">
        <select class="reminder-timing" data-opp-id="${opp.id}" style="width: 100%; padding: 8px 12px; font-size: 13px; border: 1.5px solid var(--line); border-radius: 12px; background: var(--pink-50); color: var(--ink);">
          ${timingOptions.map(opt => `<option value="${opt}" ${existingReminder === opt ? "selected" : ""}>${opt}</option>`).join("")}
        </select>
        <button class="btn-set-reminder" data-opp-id="${opp.id}" style="margin-left: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: var(--white); background: linear-gradient(135deg, var(--pink-500), var(--pink-600)); border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 10px 24px rgba(236, 72, 153, 0.35);">
          Set Reminder
        </button>
      </div>
    `;

    // Show existing reminder status - matches dashboard status style using .reminder-status pattern
    if (existingReminder) {
      const statusEl = document.createElement("span");
      statusEl.className = "reminder-status";
      statusEl.style = "font-size: 12px; color: var(--success); margin-top: 6px; display: block;";
      statusEl.textContent = `Reminder set for ${existingReminder}`;
      // Insert after the select element - matches dashboard input error show pattern
      const select = card.querySelector(".reminder-timing");
      if (select) {
        select.after(statusEl);
      }
    }

    remindersGrid.appendChild(card);
  });

  remindersSection.appendChild(remindersGrid);

  // Handle setting reminders - uses existing toast pattern from script.js
  // Toast uses: .toast class, .toast.show, .toast.success, .toast.error
  remindersSection.addEventListener("click", (e) => {
    const target = e.target;
    const btn = target.closest(".btn-set-reminder");
    if (btn) {
      const oppId = parseInt(btn.dataset.oppId);
      const timingSelect = btn.previousElementSibling;
      const selectedTiming = timingSelect.value;

      // Save reminder to localStorage
      let savedReminders = JSON.parse(localStorage.getItem("skillsync_reminders") || "{}");
      savedReminders[oppId] = selectedTiming;
      localStorage.setItem("skillsync_reminders", JSON.stringify(savedReminders));

      // Show confirmation using existing toast pattern
      // Existing toast: .toast class, .toast.show, .toast.success for success
      showToast(`Reminder set for ${daysRemaining}d: ${selectedTiming}`, "success");

      // Re-render to show updated status
      renderOpportunityReminders(opportunities, matchedOpportunities, userSkills);
    }
  });

  // Insert into dashboard after matches section - matches dashboard layout
  // The dashboard has: skillsBox > (matchesSection or nothing) pattern
  // Insert logic matches: skillsBoxParent.insertBefore(remindersSection, matchesSection.nextSibling)
  const skillsBoxParent = document.getElementById("dash-skills").parentNode;
  // Insert after the matches section (sibling after skillsBox.nextSibling)
  const matchesSection = skillsBoxParent.querySelector(".opportunity-matches");
  if (matchesSection) {
    skillsBoxParent.insertBefore(remindersSection, matchesSection.nextSibling);
  } else {
    skillsBoxParent.appendChild(remindersSection);
  }
}

/**
 * Shows a toast notification - reuses existing toast implementation from script.js
 * @param {string} message - Toast message text
 * @param {string} type - Toast type/class suffix (success/error)
 * @returns {void}
 */
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

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

export { renderOpportunityReminders, calculateDays, getTimingOptions };