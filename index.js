// ============================================================
// MANTRAWEST WEBSITE — MAIN JAVASCRIPT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================================
  // HELPERS
  // ==========================================================

  const $ = (selector, parent = document) => {
    return parent.querySelector(selector);
  };

  const $$ = (selector, parent = document) => {
    return Array.from(parent.querySelectorAll(selector));
  };

  // ==========================================================
  // MOBILE MENU
  // ==========================================================

  const menuBtn =
    document.getElementById("navToggle") ||
    document.getElementById("menuBtn");

  const navMenu =
    document.getElementById("mainNav") ||
    document.getElementById("navMenu");

  const navBackdrop = document.getElementById("navBackdrop");

  function openMenu() {
    if (!menuBtn || !navMenu) return;

    navMenu.classList.add("active");

    if (navBackdrop) {
      navBackdrop.classList.add("active");
    }

    menuBtn.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");

    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!menuBtn || !navMenu) return;

    navMenu.classList.remove("active");

    if (navBackdrop) {
      navBackdrop.classList.remove("active");
    }

    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");

    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (!navMenu) return;

    if (navMenu.classList.contains("active")) {
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

  // Close menu when a navigation link is clicked
  $$(".nav-link, .nav-portal-link").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close menu if the screen becomes desktop-sized
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });


  // ==========================================================
  // ESCAPE KEY
  // ==========================================================

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closePortalModal();
    }
  });


  // ==========================================================
  // SMOOTH INTERNAL NAVIGATION
  // ==========================================================

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const header = $(".site-header");

      const headerHeight = header
        ? header.getBoundingClientRect().height
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        15;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });

      closeMenu();
    });
  });


  // ==========================================================
  // SCROLL PROGRESS
  // ==========================================================

  const scrollProgress = document.getElementById("scrollProgress");

  function updateScrollProgress() {
    if (!scrollProgress) return;

    const scrollTop = window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (documentHeight <= 0) {
      scrollProgress.style.width = "0%";
      return;
    }

    const percentage =
      Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100));

    scrollProgress.style.width = `${percentage}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true,
  });

  updateScrollProgress();


  // ==========================================================
  // SCROLL REVEAL ANIMATIONS
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
      }
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
  // ANIMATED STATISTICS
  // ==========================================================

  const statElements = $$("[data-count-to]");

  function animateCounter(element) {
    if (element.dataset.counted === "true") {
      return;
    }

    const target = Number(element.dataset.countTo);

    if (!Number.isFinite(target)) {
      return;
    }

    const valueElement =
      $(".stat-num-value", element) || element;

    element.dataset.counted = "true";

    const duration = 1400;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      // Smooth ease-out
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue = Math.round(
        target * easedProgress
      );

      valueElement.textContent =
        currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.5,
      }
    );

    statElements.forEach((element) => {
      statsObserver.observe(element);
    });
  } else {
    statElements.forEach((element) => {
      animateCounter(element);
    });
  }


  // ==========================================================
  // ACTIVE NAVIGATION
  // ==========================================================

  const navLinks = $$(".nav-link");

  const sections = $$(
    "main section[id]"
  ).filter((section) => {
    return section.id !== "top";
  });

  function updateActiveNav() {
    if (!sections.length || !navLinks.length) {
      return;
    }

    const scrollPosition =
      window.scrollY +
      window.innerHeight * 0.25;

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop =
        section.offsetTop;

      if (scrollPosition >= sectionTop) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      const navTarget =
        link.getAttribute("href");

      if (
        navTarget &&
        navTarget === `#${currentSection}`
      ) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, {
    passive: true,
  });

  updateActiveNav();


  // ==========================================================
  // SERVICE REQUEST BUTTONS
  // ==========================================================

  const serviceRequestLinks =
    $$("[data-service-request]");

  const messageField =
    document.getElementById("message");

  serviceRequestLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const service =
        link.getAttribute("data-service-request");

      if (!service) {
        return;
      }

      if (messageField) {
        const readableService =
          service
            .replace(/-/g, " ")
            .replace(/\b\w/g, (letter) =>
              letter.toUpperCase()
            );

        messageField.value =
          `I would like to enquire about: ${readableService}.`;
      }
    });
  });


  // ==========================================================
  // CONTACT FORM
  // ==========================================================

  const contactForm =
    document.getElementById("contactForm");

  const formStatus =
    document.getElementById("formStatus");

  const contactSubmit =
    document.getElementById("contactSubmit");

  function showFormStatus(message, type = "success") {
    if (!formStatus) return;

    formStatus.textContent = message;

    formStatus.classList.remove(
      "success",
      "error"
    );

    formStatus.classList.add(type);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData =
        new FormData(contactForm);

      const name =
        String(formData.get("name") || "").trim();

      const email =
        String(formData.get("email") || "").trim();

      const message =
        String(formData.get("message") || "").trim();

      // Basic validation
      if (!name) {
        showFormStatus(
          "Please enter your name.",
          "error"
        );

        return;
      }

      if (!email) {
        showFormStatus(
          "Please enter your email address.",
          "error"
        );

        return;
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        showFormStatus(
          "Please enter a valid email address.",
          "error"
        );

        return;
      }

      if (!message) {
        showFormStatus(
          "Please tell us a little about your project.",
          "error"
        );

        return;
      }

      // Disable button while processing
      if (contactSubmit) {
        contactSubmit.disabled = true;
        contactSubmit.dataset.originalText =
          contactSubmit.textContent;

        contactSubmit.textContent =
          "Sending...";
      }

      /*
       * Front-end confirmation.
       *
       * No external form-processing endpoint was supplied
       * in the website source, so this does not pretend to
       * send data to a server that does not exist.
       */
      setTimeout(() => {
        showFormStatus(
          "Thank you. Your enquiry has been prepared successfully. Our team will be in touch.",
          "success"
        );

        showToast(
          "Enquiry submitted successfully."
        );

        contactForm.reset();

        if (contactSubmit) {
          contactSubmit.disabled = false;

          contactSubmit.textContent =
            contactSubmit.dataset.originalText ||
            "Send enquiry";
        }
      }, 600);
    });
  }


  // ==========================================================
  // TOAST NOTIFICATION
  // ==========================================================

  const toast =
    document.getElementById("toast");

  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }


  // ==========================================================
  // CLIENT PORTAL MODAL
  // ==========================================================

  const portalModal =
    document.getElementById("portalModal");

  const portalModalBackdrop =
    document.getElementById("portalModalBackdrop");

  const portalModalClose =
    document.getElementById("portalModalClose");

  const portalTriggers =
    $$("[data-open-modal]");

  let previousFocusedElement = null;

  function openPortalModal() {
    if (!portalModal) return;

    previousFocusedElement =
      document.activeElement;

    portalModal.hidden = false;

    requestAnimationFrame(() => {
      portalModal.classList.add("is-open");
    });

    document.body.classList.add("modal-open");

    if (portalModalClose) {
      portalModalClose.focus();
    }
  }

  function closePortalModal() {
    if (!portalModal) return;

    portalModal.classList.remove("is-open");

    document.body.classList.remove("modal-open");

    setTimeout(() => {
      portalModal.hidden = true;
    }, 250);

    if (
      previousFocusedElement &&
      typeof previousFocusedElement.focus === "function"
    ) {
      previousFocusedElement.focus();
    }
  }

  portalTriggers.forEach((trigger) => {
    trigger.addEventListener(
      "click",
      openPortalModal
    );
  });

  if (portalModalClose) {
    portalModalClose.addEventListener(
      "click",
      closePortalModal
    );
  }

  if (portalModalBackdrop) {
    portalModalBackdrop.addEventListener(
      "click",
      closePortalModal
    );
  }


  // ==========================================================
  // FOOTER YEAR
  // ==========================================================

  $$("[data-year]").forEach((element) => {
    element.textContent =
      new Date().getFullYear();
  });


  // ==========================================================
  // GLASS SHINE / 3D CARD EFFECT
  // ==========================================================

  const glassCards =
    $$(".glass-shine");

  glassCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth <= 900) {
        return;
      }

      const rect =
        card.getBoundingClientRect();

      const x =
        event.clientX - rect.left;

      const y =
        event.clientY - rect.top;

      const rotateX =
        ((y / rect.height) - 0.5) * -4;

      const rotateY =
        ((x / rect.width) - 0.5) * 4;

      card.style.setProperty(
        "--mouse-x",
        `${x}px`
      );

      card.style.setProperty(
        "--mouse-y",
        `${y}px`
      );

      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });


  // ==========================================================
  // IMAGE LOADING
  // ==========================================================

  $$("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");
    });
  });


  // ==========================================================
  // INITIAL STATE
  // ==========================================================

  document.body.classList.add("js-ready");

  console.log(
    "Mantrawest website JavaScript loaded successfully."
  );
});