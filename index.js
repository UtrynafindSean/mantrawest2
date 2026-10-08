// ============================================================
// MANTRAWEST WEBSITE — MAIN JAVASCRIPT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================================
  // HELPER FUNCTIONS
  // ==========================================================

  const $ = (selector, parent = document) => {
    return parent.querySelector(selector);
  };

  const $$ = (selector, parent = document) => {
    return Array.from(parent.querySelectorAll(selector));
  };

  // ==========================================================
  // MOBILE NAVIGATION
  // ==========================================================

  const menuBtn = $("#navToggle");
  const navMenu = $("#mainNav");
  const navBackdrop = $("#navBackdrop");

  function openMenu() {
    if (!navMenu) return;

    navMenu.classList.add("is-open");

    if (menuBtn) {
      menuBtn.classList.add("is-open");
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "Close navigation");
    }

    if (navBackdrop) {
      navBackdrop.classList.add("is-open");
    }

    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!navMenu) return;

    navMenu.classList.remove("is-open");

    if (menuBtn) {
      menuBtn.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open navigation");
    }

    if (navBackdrop) {
      navBackdrop.classList.remove("is-open");
    }

    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (!navMenu) return;

    if (navMenu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", toggleMenu);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeMenu);
  }

  // ==========================================================
  // CLOSE MOBILE MENU WHEN RESIZING TO DESKTOP
  // ==========================================================

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      closeMenu();
    }
  });

  // ==========================================================
  // NAVIGATION LINKS / SMOOTH SCROLL
  // ==========================================================

  const navLinks = $$(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#") || href === "#") {
        closeMenu();
        return;
      }

      const target = $(href);

      if (!target) {
        closeMenu();
        return;
      }

      event.preventDefault();

      const header = $(".site-header") || $("header");
      const headerHeight = header ? header.offsetHeight : 0;

      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: "smooth",
      });

      closeMenu();
    });
  });

  // ==========================================================
  // ABOUT NAVIGATION
  // ==========================================================

  const aboutLink = $('[data-nav="about"]');
  const aboutSection = $("#about-preview");

  if (aboutLink && aboutSection) {
    aboutLink.setAttribute("href", "#about-preview");
  }

  // ==========================================================
  // SCROLL PROGRESS BAR
  // ==========================================================

  const scrollProgress = $("#scrollProgress");

  function updateScrollProgress() {
    if (!scrollProgress) return;

    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (documentHeight <= 0) {
      scrollProgress.style.width = "0%";
      return;
    }

    const scrollPercentage = (window.scrollY / documentHeight) * 100;

    scrollProgress.style.width = `${Math.min(Math.max(scrollPercentage, 0), 100)}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true,
  });

  window.addEventListener("resize", updateScrollProgress);

  updateScrollProgress();

  // ==========================================================
  // SCROLL REVEAL ANIMATION
  // ==========================================================

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // ==========================================================
  // ACTIVE NAVIGATION LINK
  // ==========================================================

  const sections = $$("main section[id]");

  function updateActiveNavigation() {
    if (!sections.length || !navLinks.length) return;

    const scrollPosition = window.scrollY + 180;

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      link.classList.remove("active");
      link.classList.remove("is-active");

      if (currentSection && href === `#${currentSection}`) {
        link.classList.add("active");
        link.classList.add("is-active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavigation, {
    passive: true,
  });

  window.addEventListener("resize", updateActiveNavigation);

  updateActiveNavigation();

  // ==========================================================
  // SERVICE REQUEST BUTTONS
  // ==========================================================

  const serviceButtons = $$("[data-service-request]");
  const globalMessageField = $("#message");

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const service = button.getAttribute("data-service-request");

      if (!globalMessageField || !service) return;

      globalMessageField.value = `I would like to enquire about: ${service}`;

      const contactSection = $("#contact");

      if (contactSection) {
        const header = $(".site-header") || $("header");
        const headerHeight = header ? header.offsetHeight : 0;

        const position =
          contactSection.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          20;

        window.scrollTo({
          top: Math.max(position, 0),
          behavior: "smooth",
        });

        setTimeout(() => {
          globalMessageField.focus();
        }, 500);
      } else {
        globalMessageField.focus();
      }
    });
  });

  // ==========================================================
  // CONTACT FORM
  // ==========================================================

  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");
  const contactSubmit = $("#contactSubmit");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameField = $("#name", contactForm);
      const emailField = $("#email", contactForm);
      const messageField = $("#message", contactForm);

      const name = nameField ? nameField.value.trim() : "";

      const email = emailField ? emailField.value.trim() : "";

      const message = messageField ? messageField.value.trim() : "";

      // --------------------------------------------------------
      // VALIDATION
      // --------------------------------------------------------

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent = "Please complete all required fields.";

          formStatus.className = "form-status error";
        }

        return;
      }

      // Proper email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!emailPattern.test(email)) {
        if (formStatus) {
          formStatus.textContent = "Please enter a valid email address.";

          formStatus.className = "form-status error";
        }

        if (emailField) {
          emailField.focus();
        }

        return;
      }

      // --------------------------------------------------------
      // SUBMIT BUTTON
      // --------------------------------------------------------

      if (contactSubmit) {
        contactSubmit.disabled = true;
        contactSubmit.textContent = "Sending...";
      }

      if (formStatus) {
        formStatus.textContent = "";
        formStatus.className = "form-status";
      }

      // --------------------------------------------------------
      // TEMPORARY FRONTEND SUBMISSION
      // --------------------------------------------------------

      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = "Thank you. Your enquiry has been received.";

          formStatus.className = "form-status success";
        }

        contactForm.reset();

        if (contactSubmit) {
          contactSubmit.disabled = false;
          contactSubmit.textContent = "Send Message";
        }
      }, 1000);
    });
  }

  // ==========================================================
  // CLIENT PORTAL MODAL
  // ==========================================================

  const portalModal = $("#portalModal");
  const portalModalClose = $("#portalModalClose");
  const portalModalBackdrop = $("#portalModalBackdrop");

  const openModalButtons = $$("[data-open-modal]");

  function openPortalModal() {
    if (!portalModal) return;

    portalModal.classList.add("is-open");
    portalModal.removeAttribute("hidden");

    document.body.classList.add("modal-open");

    if (portalModalClose) {
      setTimeout(() => {
        portalModalClose.focus();
      }, 50);
    }
  }

  function closePortalModal() {
    if (!portalModal) return;

    portalModal.classList.remove("is-open");
    portalModal.setAttribute("hidden", "");

    document.body.classList.remove("modal-open");
  }

  openModalButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openPortalModal();
    });
  });

  if (portalModalClose) {
    portalModalClose.addEventListener("click", closePortalModal);
  }

  if (portalModalBackdrop) {
    portalModalBackdrop.addEventListener("click", closePortalModal);
  }

  // ==========================================================
  // ESCAPE KEY
  // ==========================================================

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeMenu();
    closePortalModal();
  });

  // ==========================================================
  // FOOTER YEAR
  // ==========================================================

  const yearElements = $$("[data-year]");
  const currentYear = new Date().getFullYear();

  yearElements.forEach((element) => {
    element.textContent = currentYear;
  });

  // ==========================================================
  // GLASS / 3D CARD EFFECT
  // ==========================================================

  const glassCards = $$(".glass-shine");

  glassCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;

      const y = ((event.clientY - rect.top) / rect.height) * 100;

      // These names match the CSS:
      // --mx and --my
      card.style.setProperty("--mx", `${x}%`);

      card.style.setProperty("--my", `${y}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });
  });

  // ==========================================================
  // BUTTON RIPPLE EFFECT
  // ==========================================================

  const rippleButtons = $$(".btn");

  rippleButtons.forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      const rect = button.getBoundingClientRect();

      const size = Math.max(rect.width, rect.height) * 1.5;

      const ripple = document.createElement("span");

      ripple.className = "btn-ripple";

      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;

      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;

      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      button.appendChild(ripple);

      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });
    });
  });

  // ==========================================================
  // IMAGE ERROR HANDLING
  // ==========================================================

  const images = $$("img");

  images.forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");

      console.warn(`MantraWest image could not be loaded: ${image.src}`);
    });
  });

  // ==========================================================
  // INITIAL PAGE STATE
  // ==========================================================

  if (portalModal) {
    portalModal.setAttribute("hidden", "");
  }

  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation");
  }

  // ==========================================================
  // PAGE READY
  // ==========================================================

  console.log("MantraWest website JavaScript loaded successfully.");
});
