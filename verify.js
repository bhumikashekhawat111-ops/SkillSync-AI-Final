const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const profile = fs.readFileSync("profile.html", "utf8");
const dash = fs.readFileSync("dashboard.html", "utf8");
const js = fs.readFileSync("script.js", "utf8");
const css = fs.readFileSync("styles.css", "utf8");

let ok = true;
function check(name, cond) {
  console.log((cond ? "  ✓ " : "  ✗ ") + name);
  if (!cond) ok = false;
}

console.log("LOGIN PAGE:");
check("no signup option", !html.includes("signup-link") && !html.includes("Create account"));
check("redirect to profile.html", js.includes('window.location.href = "profile.html"'));

console.log("PROFILE PAGE:");
check("full name field", /id="full-name"/.test(profile));
check("college field", /id="college"/.test(profile));
check("branch field", /id="branch"/.test(profile));
check("year select", /id="year"/.test(profile));
check("skill checkboxes", (profile.match(/name="skills"/g) || []).length >= 15);
check("page guard -> index.html", js.includes('window.location.replace("index.html")'));
check("continue -> dashboard.html", js.includes('window.location.href = "dashboard.html"'));

console.log("DASHBOARD:");
check("logout button", /id="logout-btn"/.test(dash));
check("profile render ids", ["dash-name","dash-college","dash-branch","dash-year"].every(id => dash.includes(id)));
check("skills container", /id="dash-skills"/.test(dash));
check("logout clears session", js.includes("clearSession();"));

console.log("SCRIPT LOGIC:");
check("session guard on profile", js.includes('if (getSession() !== "active")'));
check("session guard on dashboard", /getSession\(\) !== "active"/g.test(js));
check("session guard in login", js.includes('if (getSession() === "active")'));

console.log("CSS:");
let bal = 0;
for (const c of css) { if (c === "{") bal++; if (c === "}") bal--; }
check("brace balance", bal === 0);
check("skills-grid styled", /\.skills-grid/.test(css));
check("skill-chip styled", /\.skill-chip/.test(css));
check("grid-2 styled", /\.grid-2/.test(css));
check("skill-tag styled", /\.skill-tag/.test(css));
check("pink-300 defined", css.includes("--pink-300: #f9a8d4"));

console.log(ok ? "\nALL CHECKS PASSED" : "\nSOME CHECKS FAILED");
process.exit(ok ? 0 : 1);