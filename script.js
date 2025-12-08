/* ============================================================
   DOM HELPERS
============================================================ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ============================================================
   NAV BURGER & MOBILE MENU
============================================================ */
const burger = $("#navBurger");
const navLinks = $("#navLinks");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    burger.classList.toggle("open");
  });
}

/* ============================================================
   SMART SCROLL WITH NAV OFFSET
============================================================ */
function smoothScrollTo(targetSelector) {
  const nav = document.querySelector(".top-nav");
  const navHeight = nav ? nav.offsetHeight : 0;
  const el = document.querySelector(targetSelector);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: y - navHeight - 10,
    behavior: "smooth",
  });
}

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    e.preventDefault();
    smoothScrollTo(href);
    if (navLinks) navLinks.classList.remove("open");
    if (burger) burger.classList.remove("open");
  });
});

/* ============================================================
   WAITLIST FORM
============================================================ */
const form = $("#waitlistForm");
const btn = $("#waitlistButton");
const msg = $("#waitlistMessage");

if (form && btn && msg) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = $("#usernameInput").value.trim();
    const email = $("#emailInput").value.trim();
    const phone = $("#phoneInput").value.trim();

    if (!email && !phone) {
      msg.textContent = "Please enter at least an email or phone.";
      msg.className = "waitlist-message error";
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

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        msg.textContent = data.error || "Something went wrong.";
        msg.className = "waitlist-message error";
      } else {
        msg.textContent = "You're on the waitlist. Thank you!";
        msg.className = "waitlist-message success";
        form.reset();
      }
    } catch (err) {
      msg.textContent = "Network error. Try again.";
      msg.className = "waitlist-message error";
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

// Feb 28, 2026 (UTC)
const launchDate = new Date(Date.UTC(2026, 1, 28, 0, 0, 0));

function updateCountdown() {
  if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

  const now = new Date();
  const diff = launchDate - now;
  if (diff <= 0) return;

  let seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  cdDays.textContent = days;
  cdHours.textContent = String(hours).padStart(2, "0");
  cdMinutes.textContent = String(minutes).padStart(2, "0");
  cdSeconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ============================================================
   SCROLL-REVEAL OBSERVER
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
  { threshold: 0.2 }
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
$$(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    $$(".faq-item").forEach((i) => i.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

/* ============================================================
   FOOTER YEAR
============================================================ */
const yearSpan = $("#yearSpan");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* ============================================================
   BUTTON RIPPLES
============================================================ */
$$(".btn").forEach((btn) => {
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

/* ============================================================
   FEATURE CARDS — HOVER HIGHLIGHT (MORE JS SPICE)
============================================================ */
const featureCards = $$(".feature-card");

featureCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    featureCards.forEach((c) => {
      if (c !== card) c.classList.add("dimmed");
    });
  });

  card.addEventListener("mouseleave", () => {
    featureCards.forEach((c) => c.classList.remove("dimmed"));
  });
});
