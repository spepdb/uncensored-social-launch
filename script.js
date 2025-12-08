/* ============================================================
   UTIL: SAFE SELECT
============================================================ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);


/* ============================================================
   MOBILE NAV: BURGER MENU
============================================================ */
const burger = $("#navBurger");
const navLinks = $("#navLinks");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    navLinks.classList.toggle("open");

    // Animate burger lines
    burger.classList.toggle("open");
  });
}


/* ============================================================
   SMART SCROLL WITH NAV OFFSET
============================================================ */
function smoothScrollTo(elementId) {
  const navHeight = document.querySelector(".top-nav").offsetHeight;
  const element = document.querySelector(elementId);
  if (!element) return;

  const yOffset = element.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: yOffset - navHeight - 10,
    behavior: "smooth",
  });
}

// Intercept all anchor clicks
$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href === "#" || !href.startsWith("#")) return;
    e.preventDefault();

    smoothScrollTo(href);

    // Close mobile menu
    navLinks.classList.remove("open");
  });
});


/* ============================================================
   WAITLIST FORM
============================================================ */
const form = $("#waitlistForm");
const btn = $("#waitlistButton");
const msg = $("#waitlistMessage");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = $("#usernameInput").value.trim();
    const email = $("#emailInput").value.trim();
    const phone = $("#phoneInput").value.trim();

    if (!email && !phone) {
      msg.textContent = "Please enter at least an email or phone.";
      msg.classList.add("error");
      return;
    }

    msg.textContent = "";
    msg.className = "waitlist-message";
    btn.classList.add("loading");
    btn.disabled = true;

    try {
      const res = await fetch(
        "https://uncensored-app-beta-production.up.railway.app/api/waitlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, phone }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        msg.textContent = data.error || "Something went wrong.";
        msg.classList.add("error");
      } else {
        msg.textContent = "You're on the waitlist. Thank you!";
        msg.classList.add("success");
        form.reset();
      }
    } catch (err) {
      msg.textContent = "Network error. Try again.";
      msg.classList.add("error");
    }

    btn.classList.remove("loading");
    btn.disabled = false;
  });
}


/* ============================================================
   COUNTDOWN TIMER
============================================================ */
const cdDays = $("#cdDays");
const cdHours = $("#cdHours");
const cdMinutes = $("#cdMinutes");
const cdSeconds = $("#cdSeconds");

// Feb 28, 2026
const launchDate = new Date(Date.UTC(2026, 1, 28, 0, 0, 0));

function updateCountdown() {
  const now = new Date();
  const diff = launchDate - now;

  if (diff <= 0) return;

  let sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / 86400);
  sec %= 86400;
  const hours = Math.floor(sec / 3600);
  sec %= 3600;
  const minutes = Math.floor(sec / 60);
  sec %= 60;
  const seconds = sec;

  cdDays.textContent = days;
  cdHours.textContent = String(hours).padStart(2, "0");
  cdMinutes.textContent = String(minutes).padStart(2, "0");
  cdSeconds.textContent = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();


/* ============================================================
   SCROLL-REVEAL OBSERVER FOR SECTIONS, CARDS, ROADMAP
============================================================ */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.22 }
);

[
  ...$$(".animate"),
  ...$$(".section"),
  ...$$(".feature-card"),
  ...$$(".roadmap-item"),
].forEach((el) => observer.observe(el));


/* ============================================================
   FAQ ACCORDION
============================================================ */
const faqItems = $$(".faq-item");

faqItems.forEach((item) => {
  item.addEventListener("click", () => {
    const open = item.classList.contains("open");

    faqItems.forEach((i) => i.classList.remove("open"));

    if (!open) item.classList.add("open");
  });
});


/* ============================================================
   FOOTER YEAR
============================================================ */
const yearSpan = $("#yearSpan");
yearSpan.textContent = new Date().getFullYear();


/* ============================================================
   BUTTON RIPPLES (Micro Interaction)
============================================================ */
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const circle = document.createElement("span");
    circle.classList.add("ripple");
    const rect = this.getBoundingClientRect();
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;
    this.appendChild(circle);
    setTimeout(() => circle.remove(), 500);
  });
});
