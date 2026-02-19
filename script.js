/* =============================================
   ANAND DEVELOPER PORTFOLIO – script.js
   Fetch + Render + Animations
   ============================================= */

"use strict";

/* ─── STATE ─────────────────────────────────── */
let portfolioData = null;

/* ─── DOM READY ─────────────────────────────── */
document.addEventListener("DOMContentLoaded", init);

async function init() {
  await loadData();        // 1. Fetch JSON
  hideLoader();            // 2. Hide loader
  renderAll();             // 3. Render all sections
  initTyping();            // 4. Start typing animation
  initNavbar();            // 5. Sticky navbar + active link
  initHamburger();         // 6. Mobile menu
  initScrollReveal();      // 7. Scroll animations
  initSkillBars();         // 8. Animated skill bars
  initScrollToTop();       // 9. Scroll-to-top button
  initContactForm();       // 10. Contact form handler
  initCustomCursor();      // 11. Custom cursor
}

/* ─── 1. FETCH DATA.JSON ─────────────────────── */
async function loadData() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    portfolioData = await res.json();
    console.info("✅ Portfolio data loaded");
  } catch (err) {
    console.error("❌ Failed to load data.json:", err);
    // Graceful fallback: keep loader visible briefly then show empty state
    document.getElementById("loader").querySelector(".loader-text").textContent =
      "Error loading data. Check console.";
  }
}

/* ─── 2. HIDE LOADER ─────────────────────────── */
function hideLoader() {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.classList.remove("loading");
  }, 800);
}

/* ─── 3. RENDER ALL ──────────────────────────── */
function renderAll() {
  if (!portfolioData) return;
  renderMeta();
  renderNavbar();
  renderHero();
  renderAbout();
  renderSkills();
  renderProjects();
  renderContact();
  renderFooter();
}

/* Meta / Head ─────────── */
function renderMeta() {
  const { meta } = portfolioData;
  if (!meta) return;
  document.title = meta.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", meta.description);
}

/* Navbar ──────────────── */
function renderNavbar() {
  const { navbar, social } = portfolioData;
  if (!navbar) return;

  // Logo
  const logoText = document.getElementById("nav-logo-text");
  const logoHL   = document.getElementById("nav-logo-highlight");
  if (logoText) logoText.textContent = navbar.logo;
  if (logoHL)   logoHL.textContent   = navbar.logoHighlight;

  // Desktop nav links
  const navLinks  = document.getElementById("nav-links");
  const mobileNav = document.getElementById("mobile-nav-links");

  if (navLinks && navbar.links) {
    navLinks.innerHTML = navbar.links
      .map(
        (link) =>
          `<li><a href="#${link.toLowerCase()}" data-section="${link.toLowerCase()}">${link}</a></li>`
      )
      .join("");
  }

  // Mobile nav links (duplicate)
  if (mobileNav && navbar.links) {
    mobileNav.innerHTML = navbar.links
      .map(
        (link) =>
          `<li><a href="#${link.toLowerCase()}" class="mobile-nav-link">${link}</a></li>`
      )
      .join("");

    // Close mobile menu on link click
    mobileNav.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  // Navbar social icons
  const navSocial = document.getElementById("nav-social");
  if (navSocial && social) {
    const icons = {
      github:    svgGithub(),
      linkedin:  svgLinkedin(),
      twitter:   svgTwitter(),
      instagram: svgInstagram(),
    };
    navSocial.innerHTML = Object.entries(social)
      .filter(([key]) => icons[key])
      .map(
        ([key, url]) =>
          `<a href="${url}" target="_blank" rel="noopener" aria-label="${key}" title="${key}">${icons[key]}</a>`
      )
      .join("");
  }
}

/* Hero ─────────────────── */
function renderHero() {
  const { hero } = portfolioData;
  if (!hero) return;

  // Greeting + Name
  const greeting = document.getElementById("hero-greeting");
  const name     = document.getElementById("hero-name");
  if (greeting) greeting.textContent = hero.greeting;
  if (name)     name.textContent     = hero.name;

  // Description
  const desc = document.getElementById("hero-description");
  if (desc) desc.textContent = hero.description;

  // Profile image
  const img = document.getElementById("hero-profile-img");
  if (img && hero.profileImage) {
    img.src = hero.profileImage;
    img.alt = `Profile photo of ${hero.name}`;
  }

  // CTA buttons
  const cta = document.getElementById("hero-cta");
  if (cta && hero.cta) {
    const { primary, secondary } = hero.cta;
    cta.innerHTML = `
      <a href="${primary.href}" class="btn btn-primary">${primary.text}</a>
      <a href="${secondary.href}" class="btn btn-outline">${secondary.text}</a>
    `;
  }

  // Availability badge
  const avail = document.getElementById("hero-availability");
  if (avail && portfolioData.contact?.availability) {
    avail.textContent = portfolioData.contact.availability;
  }

  // Worked with logos
  const logos = document.getElementById("worked-logos");
  if (logos && hero.workedWith) {
    logos.innerHTML = hero.workedWith
      .map(
        (item) =>
          `<div class="logo-badge" title="${item.name}">${item.name}</div>`
      )
      .join("");
  }
}

/* About ─────────────────── */
function renderAbout() {
  const { about } = portfolioData;
  if (!about) return;

  // Section header
  setTextContent("about-title",    about.title);
  setTextContent("about-subtitle", about.subtitle);

  // Texts
  setTextContent("about-description", about.description);
  setTextContent("about-details",     about.details);

  // Image
  const img = document.getElementById("about-img");
  if (img && about.image) {
    img.src = about.image;
    img.alt = `About ${portfolioData.hero?.name || "me"}`;
  }

  // Stats
  const statsEl = document.getElementById("about-stats");
  if (statsEl && about.stats) {
    statsEl.innerHTML = about.stats
      .map(
        (s) => `
        <div class="stat-item">
          <div class="stat-number">${s.number}</div>
          <div class="stat-label">${s.label}</div>
        </div>
      `
      )
      .join("");
  }
}

/* Skills ─────────────────── */
function renderSkills() {
  const { skills } = portfolioData;
  if (!skills) return;

  setTextContent("skills-title",    skills.title);
  setTextContent("skills-subtitle", skills.subtitle);

  const grid = document.getElementById("skills-grid");
  if (!grid || !skills.categories) return;

  grid.innerHTML = skills.categories
    .map((cat, idx) => {
      const items = cat.items
        .map(
          (skill) => `
          <div class="skill-item">
            <div class="skill-meta">
              <span class="skill-name">${skill.name}</span>
              <span class="skill-percent">${skill.level}%</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" data-level="${skill.level}" style="width: 0%"></div>
            </div>
          </div>
        `
        )
        .join("");

      return `
        <div class="skill-card reveal-up" style="transition-delay: ${idx * 0.1}s">
          <div class="skill-card-header">
            <div class="skill-card-icon">${cat.icon}</div>
            <div class="skill-card-name">${cat.name}</div>
          </div>
          ${items}
        </div>
      `;
    })
    .join("");
}

/* Projects ──────────────── */
function renderProjects() {
  const { projects } = portfolioData;
  if (!projects) return;

  setTextContent("projects-title",    projects.title);
  setTextContent("projects-subtitle", projects.subtitle);

  const grid = document.getElementById("projects-grid");
  if (!grid || !projects.items) return;

  grid.innerHTML = projects.items
    .map(
      (proj, idx) => `
      <article class="project-card reveal-up" style="transition-delay: ${idx * 0.1}s" aria-label="${proj.title}">
        <div class="project-img-wrap">
          <img
            class="project-img"
            src="${proj.image}"
            alt="${proj.title}"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/600x220/111111/3dd971?text=Project'"
          />
          <div class="project-img-overlay"></div>
          ${proj.featured ? '<span class="project-featured-badge">Featured</span>' : ""}
        </div>
        <div class="project-body">
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-description">${proj.description}</p>
          <div class="project-tags">
            ${proj.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("")}
          </div>
          <div class="project-actions">
            <a href="${proj.github}" target="_blank" rel="noopener" class="project-link github">
              ${svgGithub(13)} GitHub
            </a>
            <a href="${proj.live}" target="_blank" rel="noopener" class="project-link live">
              ${svgExternalLink()} Live Demo
            </a>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

/* Contact ───────────────── */
function renderContact() {
  const { contact, social } = portfolioData;
  if (!contact) return;

  setTextContent("contact-title",       contact.title);
  setTextContent("contact-subtitle",    contact.subtitle);
  setTextContent("contact-description", contact.description);

  // Contact items
  const itemsEl = document.getElementById("contact-items");
  if (itemsEl) {
    const contactRows = [
      { icon: "📧", label: "Email",    value: contact.email,    href: `mailto:${contact.email}` },
      { icon: "📱", label: "Phone",    value: contact.phone,    href: `tel:${contact.phone}` },
      { icon: "📍", label: "Location", value: contact.location, href: null },
    ];

    itemsEl.innerHTML = contactRows
      .map(
        (row) => `
        <div class="contact-item">
          <div class="contact-item-icon">${row.icon}</div>
          <div>
            <div class="contact-item-label">${row.label}</div>
            <div class="contact-item-value">${
              row.href
                ? `<a href="${row.href}" style="color:inherit;text-decoration:none;">${row.value}</a>`
                : row.value
            }</div>
          </div>
        </div>
      `
      )
      .join("");
  }

  // Social links
  const socialEl = document.getElementById("contact-social");
  if (socialEl && social) {
    const icons = {
      github:    { icon: svgGithub(),    label: "GitHub"    },
      linkedin:  { icon: svgLinkedin(),  label: "LinkedIn"  },
      twitter:   { icon: svgTwitter(),   label: "Twitter"   },
      instagram: { icon: svgInstagram(), label: "Instagram" },
    };
    socialEl.innerHTML = Object.entries(social)
      .filter(([key]) => icons[key])
      .map(
        ([key, url]) =>
          `<a href="${url}" target="_blank" rel="noopener" class="social-link" aria-label="${icons[key].label}" title="${icons[key].label}">${icons[key].icon}</a>`
      )
      .join("");
  }
}

/* Footer ────────────────── */
function renderFooter() {
  const { footer } = portfolioData;
  if (!footer) return;
  const el = document.getElementById("footer-text");
  if (el)
    el.innerHTML = `${footer.text} <span class="footer-name">${footer.name}</span>`;
  const yr = document.getElementById("footer-year");
  if (yr) yr.textContent = footer.year || new Date().getFullYear();
}

/* ─── 4. TYPING ANIMATION ─────────────────────── */
function initTyping() {
  const roles = portfolioData?.hero?.roles;
  if (!roles || !roles.length) return;

  const el    = document.getElementById("typing-text");
  if (!el) return;

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  const SPEED_TYPE  = 80;
  const SPEED_DEL   = 40;
  const PAUSE_END   = 1800;
  const PAUSE_START = 300;

  function type() {
    const current = roles[roleIdx];

    if (!deleting) {
      // Typing
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, PAUSE_END);
        return;
      }
    } else {
      // Deleting
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(type, PAUSE_START);
        return;
      }
    }

    setTimeout(type, deleting ? SPEED_DEL : SPEED_TYPE);
  }

  // Start after a short delay (so page loads first)
  setTimeout(type, 1200);
}

/* ─── 5. NAVBAR ──────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const links  = document.querySelectorAll(".nav-links a");

  // Scroll → add .scrolled class
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    updateActiveLink(links);
    triggerHeroAnimations(); // After scroll check
  }, { passive: true });

  // Trigger hero animations immediately on page load
  setTimeout(triggerHeroAnimations, 900);
}

function updateActiveLink(links) {
  const sections = document.querySelectorAll("section[id]");
  let current    = "";
  sections.forEach((sec) => {
    const sectionTop = sec.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = sec.id;
  });
  links.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === current);
  });
}

/* Trigger hero animations once */
let heroAnimated = false;
function triggerHeroAnimations() {
  if (heroAnimated) return;
  heroAnimated = true;
  document.querySelectorAll(".hero-section .animate-fade-up").forEach((el) => {
    el.classList.add("visible");
  });
  document.querySelectorAll(".hero-section .animate-fade-left").forEach((el) => {
    el.classList.add("visible");
  });
}

/* ─── 6. HAMBURGER ───────────────────────────── */
function initHamburger() {
  const btn   = document.getElementById("hamburger");
  const menu  = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

function openMobileMenu() {
  document.getElementById("mobile-menu").classList.add("open");
  document.getElementById("hamburger").classList.add("active");
  document.getElementById("hamburger").setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  document.getElementById("mobile-menu")?.classList.remove("open");
  document.getElementById("hamburger")?.classList.remove("active");
  document.getElementById("hamburger")?.setAttribute("aria-expanded", "false");
}

/* ─── 7. SCROLL REVEAL ───────────────────────── */
function initScrollReveal() {
  const observerOptions = {
    root:       null,
    rootMargin: "0px 0px -80px 0px",
    threshold:  0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Once revealed, no need to unreveal
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements except hero (handled separately)
  const targets = document.querySelectorAll(
    ".reveal-left, .reveal-right, .reveal-up"
  );
  targets.forEach((el) => observer.observe(el));
}

/* ─── 8. SKILL BARS ──────────────────────────── */
function initSkillBars() {
  const barOptions = {
    root:       null,
    rootMargin: "0px",
    threshold:  0.4,
  };

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll(".skill-bar-fill");
        fills.forEach((fill) => {
          const level = fill.dataset.level;
          // Small delay to let CSS transition fire correctly
          setTimeout(() => {
            fill.style.width = level + "%";
          }, 100);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, barOptions);

  document.querySelectorAll(".skill-card").forEach((card) => {
    barObserver.observe(card);
  });
}

/* ─── 9. SCROLL TO TOP ───────────────────────── */
function initScrollToTop() {
  const btn = document.getElementById("scroll-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ─── 10. CONTACT FORM ───────────────────────── */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameVal  = document.getElementById("form-name").value.trim();
    const emailVal = document.getElementById("form-email").value.trim();
    const msgVal   = document.getElementById("form-message").value.trim();

    // Basic validation
    if (!nameVal || !emailVal || !msgVal) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    if (!isValidEmail(emailVal)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    // Simulate sending (frontend only – no backend)
    const btn = form.querySelector(".btn-submit span");
    btn.textContent = "Sending…";

    await delay(1500);

    form.reset();
    btn.textContent = "Send Message";
    showToast("🎉 Message sent! I'll get back to you soon.", "success");
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─── 11. CUSTOM CURSOR ──────────────────────── */
function initCustomCursor() {
  // Only on non-touch devices
  if (window.matchMedia("(hover: none)").matches) {
    document.getElementById("cursor").style.display          = "none";
    document.getElementById("cursor-follower").style.display = "none";
    document.body.style.cursor = "auto";
    return;
  }

  const cursor   = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  // Follower lags slightly
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + "px";
    follower.style.top  = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    "a, button, .btn, .skill-card, .project-card, .logo-badge, .stat-item"
  );
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
      follower.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      follower.classList.remove("hover");
    });
  });
}

/* ─── TOAST HELPER ───────────────────────────── */
function showToast(message, type = "success") {
  // Remove existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✅" : "⚠️"}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ─── UTILITY HELPERS ────────────────────────── */

function setTextContent(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.textContent = value;
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/* ─── SVG ICONS ──────────────────────────────── */

function svgGithub(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>`;
}

function svgLinkedin(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>`;
}

function svgTwitter(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>`;
}

function svgInstagram(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>`;
}

function svgExternalLink() {
  return `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>`;
}