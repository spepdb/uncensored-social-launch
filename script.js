// FOOTER YEAR
document.getElementById("yearSpan").textContent = new Date().getFullYear();

// WAITLIST FORM
const form = document.getElementById("waitlistForm");
const messageEl = document.getElementById("waitlistMessage");
const buttonEl = document.getElementById("waitlistButton");
const spinnerEl = document.getElementById("waitlistSpinner");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageEl.textContent = "";
    messageEl.className = "waitlist-message";

    const username = document.getElementById("usernameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();

    if (!email && !phone) {
      messageEl.textContent = "Enter at least an email or a phone number.";
      messageEl.classList.add("error");
      return;
    }

    buttonEl.disabled = true;
    buttonEl.classList.add("loading");

    try {
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
        messageEl.textContent =
          data.error || "Something went wrong. Please try again.";
        messageEl.classList.add("error");
      } else {
        messageEl.textContent = "You're on the waitlist. Thank you.";
        messageEl.classList.add("success");
        form.reset();
      }
    } catch (err) {
      console.error(err);
      messageEl.textContent = "Network error. Please try again.";
      messageEl.classList.add("error");
    }

    buttonEl.disabled = false;
    buttonEl.classList.remove("loading");
  });
}

// COUNTDOWN – last day of February 2026
// (00:00 UTC on 2026-02-28)
const launchDate = new Date(Date.UTC(2026, 1, 28, 0, 0, 0));

const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMinutes = document.getElementById("cdMinutes");
const cdSeconds = document.getElementById("cdSeconds");

function updateCountdown() {
  if (!cdDays) return;

  const now = new Date();
  const diffMs = launchDate - now;

  if (diffMs <= 0) {
    cdDays.textContent = "0";
    cdHours.textContent = "00";
    cdMinutes.textContent = "00";
    cdSeconds.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  cdDays.textContent = String(days);
  cdHours.textContent = String(hours).padStart(2, "0");
  cdMinutes.textContent = String(minutes).padStart(2, "0");
  cdSeconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
