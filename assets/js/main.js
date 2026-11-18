(() => {
  const doc = document.documentElement;
  doc.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header shadow on scroll ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  // while the full-screen menu is open, everything behind it is inert so Tab stays in the menu
  const behindNav = [document.getElementById("main"), document.querySelector(".site-footer"), document.querySelector(".skip-link")];

  const setNav = (open) => {
    nav.classList.toggle("open", open);
    doc.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    behindNav.forEach((el) => { if (el) el.inert = open; });
    updateActive(); // defined below; setNav only runs from user events, after init
  };

  // menu is mobile-only; close it if the viewport grows past the breakpoint
  window.matchMedia("(min-width: 821px)").addEventListener("change", (e) => { if (e.matches) setNav(false); });

  toggle.addEventListener("click", () => setNav(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) { setNav(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("open") && !nav.contains(e.target) && !toggle.contains(e.target)) setNav(false);
  });

  /* ---------- active nav link ---------- */
  const links = [...document.querySelectorAll('.site-nav ul a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  // case-study chips follow the same "current" logic within the case section
  const chipNav = document.querySelector(".case-index");
  const chips = [...document.querySelectorAll('.case-index a[href^="#"]')];
  const blocks = chips.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  // floating action bar (mobile): visible after the hero, hidden at contact
  const bar = document.querySelector(".action-bar");
  const hero = document.querySelector(".hero");
  const contact = document.getElementById("kontak");

  // the last section whose top has passed 40% of the viewport is "current"
  const currentOf = (list) => {
    const mark = window.innerHeight * 0.4;
    let current = null;
    list.forEach((s) => { if (s.getBoundingClientRect().top <= mark) current = s; });
    return current;
  };

  let ticking = false;
  let lastChip = null;
  const updateActive = () => {
    ticking = false;

    const current = currentOf(sections);
    links.forEach((a) => {
      const on = current !== null && a.getAttribute("href") === "#" + current.id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });

    const block = currentOf(blocks);
    chips.forEach((a) => a.classList.toggle("active", block !== null && a.getAttribute("href") === "#" + block.id));
    const activeChip = chips.find((a) => a.classList.contains("active"));
    if (activeChip && activeChip !== lastChip && chipNav.scrollWidth > chipNav.clientWidth) {
      chipNav.scrollTo({ left: activeChip.offsetLeft - 16, behavior: reduceMotion ? "auto" : "smooth" });
    }
    lastChip = activeChip || null;

    if (bar) {
      const pastHero = hero.getBoundingClientRect().bottom < 80;
      const atContact = contact.getBoundingClientRect().top < window.innerHeight * 0.85;
      const show = pastHero && !atContact;
      bar.classList.toggle("show", show);
      bar.inert = !show || nav.classList.contains("open");
    }
  };
  updateActive();
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateActive); }
  }, { passive: true });

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    // stagger siblings inside the same parent
    revealEls.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      const i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i * 60, 300) + "ms";
      io.observe(el);
    });
  }

  /* ---------- swipe galleries: focusable only when they actually scroll ---------- */
  const syncRail = (rail) => {
    const scrolls = rail.scrollWidth > rail.clientWidth + 1;
    if (scrolls) {
      rail.tabIndex = 0;
      rail.setAttribute("role", "region");
      rail.setAttribute("aria-label", rail.dataset.label + ", geser untuk melihat yang lain");
    } else {
      rail.removeAttribute("tabindex");
      rail.removeAttribute("role");
      rail.removeAttribute("aria-label");
    }
  };
  const rails = document.querySelectorAll(".rail");
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver((entries) => entries.forEach((e) => syncRail(e.target)));
    rails.forEach((r) => ro.observe(r));
  } else {
    rails.forEach(syncRail);
  }

  /* ---------- lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  let lastTrigger = null;

  document.querySelectorAll(".shot[data-full]").forEach((btn) => {
    btn.setAttribute("aria-label", "Perbesar: " + btn.dataset.caption);
    btn.addEventListener("click", () => {
      lastTrigger = btn;
      const thumb = btn.querySelector("img");
      lbImg.src = btn.dataset.full;
      lbImg.alt = thumb ? thumb.alt : "";
      lbCap.textContent = btn.dataset.caption || "";
      if (typeof lb.showModal === "function") lb.showModal();
      else window.open(btn.dataset.full, "_blank", "noopener");
    });
  });

  const closeLb = () => lb.close();
  lb.querySelector(".lb-close").addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "FIGURE") closeLb(); });
  lb.addEventListener("close", () => {
    lbImg.removeAttribute("src");
    if (lastTrigger) lastTrigger.focus();
  });

  /* ---------- year ---------- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
