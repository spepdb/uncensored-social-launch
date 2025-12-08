// ========== FOOTER YEAR ==========
const yearSpan = document.getElementById("yearSpan");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ========== MOBILE NAV ==========
const navBurger = document.getElementById("navBurger");
const navLinks = document.querySelector(".nav-links");

if (navBurger && navLinks) {
  navBurger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.matches(".nav-link")) {
      navLinks.classList.remove("open");
    }
  });
}

// ========== WAITLIST FORM ==========
const waitlistForm = document.getElementById("waitlistForm");
const waitlistMsg = document.getElementById("waitlistMessage");
const waitlistBtn = document.getElementById("waitlistButton");
const waitlistSpinner = document.getElementById("waitlistSpinner");

if (waitlistForm) {
  waitlistForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!waitlistMsg || !waitlistBtn) return;

    const username = document.getElementById("usernameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();

    waitlistMsg.textContent = "";
    waitlistMsg.className = "waitlist-message";

    if (!email && !phone) {
      waitlistMsg.textContent =
        "Please enter at least an email or a phone number.";
      waitlistMsg.classList.add("error");
      return;
    }

    waitlistBtn.disabled = true;
    waitlistBtn.classList.add("loading");

    try {
      // TODO: change this endpoint if/when you set up a different backend
      const res = await fetch(
        "https://uncensored-app-beta-production.up.railway.app/api/waitlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            phone,
            source: "landing-page",
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        waitlistMsg.textContent =
          data.error || "Something went wrong. Please try again.";
        waitlistMsg.classList.add("error");
      } else {
        waitlistMsg.textContent =
          "You’re on the waitlist. Thank you for backing this.";
        waitlistMsg.classList.add("success");
        waitlistForm.reset();
      }
    } catch (err) {
      console.error("waitlist error", err);
      waitlistMsg.textContent = "Network error. Please try again.";
      waitlistMsg.classList.add("error");
    }

    waitlistBtn.disabled = false;
    waitlistBtn.classList.remove("loading");
  });
}

// ========== COUNTDOWN ==========
const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMinutes = document.getElementById("cdMinutes");
const cdSeconds = document.getElementById("cdSeconds");

// Last day of February 2026 (UTC)
const launchDate = new Date(Date.UTC(2026, 1, 28, 0, 0, 0));

function updateCountdown() {
  if (!cdDays) return;

  const now = new Date();
  const diff = launchDate - now;

  if (diff <= 0) {
    cdDays.textContent = "0";
    cdHours.textContent = "00";
    cdMinutes.textContent = "00";
    cdSeconds.textContent = "00";
    return;
  }

  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  cdDays.textContent = String(days);
  cdHours.textContent = String(hours).padStart(2, "0");
  cdMinutes.textContent = String(minutes).padStart(2, "0");
  cdSeconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
