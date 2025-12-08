// YEAR IN FOOTER
document.getElementById("yearSpan").textContent = new Date().getFullYear();

// WAITLIST FORM SUBMIT
const form = document.getElementById("waitlistForm");
const msg = document.getElementById("waitlistMessage");
const btn = document.getElementById("waitlistButton");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const username = document.getElementById("usernameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();

  if (!email && !phone) {
    msg.textContent = "Enter at least an email or phone number.";
    msg.className = "waitlist-message error";
    return;
  }

  btn.disabled = true;

  try {
    const res = await fetch(
      "https://uncensored-app-beta-production.up.railway.app/api/waitlist",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phone, source: "landing-page" }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.error || "Something went wrong.";
      msg.className = "waitlist-message error";
    } else {
      msg.textContent = "You're on the waitlist!";
      msg.className = "waitlist-message success";
      form.reset();
    }
  } catch (err) {
    msg.textContent = "Network error. Try again.";
    msg.className = "waitlist-message error";
  }

  btn.disabled = false;
});

// COUNTDOWN (using Feb 28 internally)
const launchDate = new Date("2026-02-28T00:00:00Z");

function updateCountdown() {
  const now = new Date();
  const diff = launchDate - now;

  if (diff <= 0) return;

  const sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = sec % 60;

  document.getElementById("cdDays").textContent = days;
  document.getElementById("cdHours").textContent = hours.toString().padStart(2, "0");
  document.getElementById("cdMinutes").textContent = mins.toString().padStart(2, "0");
  document.getElementById("cdSeconds").textContent = secs.toString().padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
