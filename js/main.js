/* ==========================================================================
   EventHub — Shared site behaviour (loaded on every page)
   - Mobile navigation toggle
   - Header shadow on scroll
   - Subtle reveal-on-scroll animation
   - Current year in footer
   ========================================================================== */

(function () {
  "use strict";

  // Lets CSS know JavaScript is available (enables reveal animations).
  document.documentElement.classList.add("js");

  /* ---------- Mobile navigation ---------- */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const mobileQuery = window.matchMedia("(max-width: 960px)");

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }

  // Keep hidden mobile-menu links out of the tab order while closed.
  function syncInert() {
    if (!nav) return;
    const closedOnMobile = mobileQuery.matches && !nav.classList.contains("is-open");
    nav.toggleAttribute("inert", closedOnMobile);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setMenu(open);
      syncInert();
      if (open) {
        const firstLink = nav.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });

    // Close with Escape and return focus to the toggle.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        syncInert();
        toggle.focus();
      }
    });

    // Close when clicking outside the header.
    document.addEventListener("click", function (event) {
      if (nav.classList.contains("is-open") && header && !header.contains(event.target)) {
        setMenu(false);
        syncInert();
      }
    });

    // Reset when resizing up to desktop.
    mobileQuery.addEventListener("change", function () {
      setMenu(false);
      syncInert();
    });

    syncInert();
  }

  /* ---------- Header shadow on scroll ---------- */
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
