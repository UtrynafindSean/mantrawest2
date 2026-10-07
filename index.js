/* =========================================================
   MANTRAWEST — MAIN JAVASCRIPT
   Matches the current index.html + style.css
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     ELEMENT HELPERS
     ========================================================= */

  const $ = (selector, parent = document) => parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  const navToggle = $("#navToggle");
  const mainNav = $("#mainNav");
  const navBackdrop = $("#navBackdrop");

  const openNav = () => {
    if (!navToggle || !mainNav) return;

    mainNav.classList.add("is-open");

    if (navBackdrop) {
      navBackdrop.classList.add("is-open");
    }

    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");

    document.body.classList.add("nav-open");
  };

  const closeNav = () => {
    if (!navToggle || !mainNav) return;

    mainNav.classList.remove("is-open");

    if (navBackdrop) {
      navBackdrop.classList.remove("is-open");
    }

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");

    document.body.classList.remove("nav-open");
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeNav);
  }

  // Close mobile menu after clicking a navigation link
  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  // Close menu with Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  // Close menu when screen becomes desktop-sized
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      closeNav();
    }
  });

  /* =========================================================
     HEADER SCROLL STATE
     ========================================================= */

  const siteHeader = $(".site-header");

  const updateHeader = () => {
    if (!siteHeader) return;

    if (window.scrollY > 40) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
  };

  updateHeader();

  /* =========================================================
     SCROLL PROGRESS
     ========================================================= */

  const scrollProgress = $("#scrollProgress");

  const updateScrollProgress = () => {
    if (!scrollProgress) return;

    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (documentHeight <= 0) {
      scrollProgress.style.width = "0%";
      return;
    }

    const progress = (window.scrollY / documentHeight) * 100;

    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
  };

  /* =========================================================
     SCROLL REVEAL
     ========================================================= */

  const revealElements = $$(".reveal");

  if (
    revealElements.length &&
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {
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
        rootMargin: "0px 0px -40px 0px",
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

  /* =========================================================
     DEPTH DIVIDER ANIMATION
     ========================================================= */

  const depthDividers = $$(".depth-divider");

  if (
    depthDividers.length &&
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {
    const depthObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("animate");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
      },
    );

    depthDividers.forEach((divider) => {
      depthObserver.observe(divider);
    });
  } else {
    depthDividers.forEach((divider) => {
      divider.classList.add("animate");
    });
  }

  /* =========================================================
     STAT COUNTERS
     ========================================================= */

  const statElements = $$("[data-count-to]");

  const animateCounter = (element) => {
    const target = Number(element.getAttribute("data-count-to"));

    const valueElement = $(".stat-num-value", element);

    if (!valueElement || Number.isNaN(target)) {
      return;
    }

    if (prefersReducedMotion) {
      valueElement.textContent = target;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.round(target * eased);

      valueElement.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if (statElements.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const statBand = entry.target.closest(".stats-band");

          if (statBand) {
            statBand.classList.add("is-visible");
          }

          animateCounter(entry.target);

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.4,
      },
    );

    statElements.forEach((element) => {
      counterObserver.observe(element);
    });
  } else {
    statElements.forEach(animateCounter);
  }

  /* =========================================================
     SERVICE REQUEST → PREFILL QUOTE FORM
     ========================================================= */

  const quoteForm = $("#quote-form");
  const quotePrefillNote = $("#quotePrefillNote");
  const serviceInterest = $("#serviceInterest");

  const serviceNames = {
    "offshore-onshore-waste-management-solutions":
      "Offshore & Onshore Waste Management",

    "environmental-compliance-consulting":
      "Environmental Compliance Consulting",

    "cargo-carrying-units-rental": "Cargo Carrying Units Rental",

    "ai-powered-solutions": "AI-Powered Solutions",

    other: "Something else",
  };

  $$("[data-service-request]").forEach((button) => {
    button.addEventListener("click", () => {
      const service = button.getAttribute("data-service-request");

      if (!service) return;

      if (serviceInterest) {
        serviceInterest.value = service;
      }

      if (quotePrefillNote) {
        const readableName = serviceNames[service] || service;

        quotePrefillNote.textContent = `You're enquiring about: ${readableName}`;

        quotePrefillNote.hidden = false;
      }
    });
  });

  /* =========================================================
     QUOTE FORM VALIDATION + MAILTO
     ========================================================= */

  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");
  const contactSubmit = $("#contactSubmit");

  const nameInput = $("#name");
  const emailInput = $("#email");
  const phoneInput = $("#phone");
  const companyInput = $("#company");
  const messageInput = $("#message");
  const consentInput = $("#consent");

  const setFormStatus = (message, type = "error") => {
    if (!formStatus) return;

    formStatus.className = `form-status is-visible ${type}`;

    formStatus.innerHTML = `
      <span>${message}</span>
    `;
  };

  const clearFormStatus = () => {
    if (!formStatus) return;

    formStatus.textContent = "";
    formStatus.className = "form-status";
  };

  const clearFieldError = (field) => {
    if (!field) return;

    const wrapper = field.closest(".field, .checkbox-field");

    if (wrapper) {
      wrapper.classList.remove("has-error");
    }
  };

  const setFieldError = (field) => {
    if (!field) return;

    const wrapper = field.closest(".field, .checkbox-field");

    if (wrapper) {
      wrapper.classList.add("has-error");
    }
  };

  const validateForm = () => {
    let valid = true;

    // Clear existing errors
    $$(".field, .checkbox-field").forEach((field) => {
      field.classList.remove("has-error");
    });

    clearFormStatus();

    const name = nameInput?.value.trim() || "";

    const email = emailInput?.value.trim() || "";

    const phone = phoneInput?.value.trim() || "";

    const service = serviceInterest?.value || "";

    const message = messageInput?.value.trim() || "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phonePattern = /^[0-9+\-\s().]{7,}$/;

    if (!name) {
      setFieldError(nameInput);
      valid = false;
    }

    if (!email || !emailPattern.test(email)) {
      setFieldError(emailInput);
      valid = false;
    }

    if (phone && !phonePattern.test(phone)) {
      setFieldError(phoneInput);
      valid = false;
    }

    if (!service) {
      setFieldError(serviceInterest);
      valid = false;
    }

    if (message.length < 12) {
      setFieldError(messageInput);
      valid = false;
    }

    if (!consentInput?.checked) {
      setFieldError(consentInput);
      valid = false;
    }

    if (!valid) {
      setFormStatus(
        "Please check the highlighted fields and complete the required information.",
        "error",
      );
    }

    return valid;
  };

  // Remove error styling while the user corrects fields
  [
    nameInput,
    emailInput,
    phoneInput,
    companyInput,
    serviceInterest,
    messageInput,
    consentInput,
  ].forEach((field) => {
    if (!field) return;

    const eventName =
      field.type === "checkbox" || field.tagName === "SELECT"
        ? "change"
        : "input";

    field.addEventListener(eventName, () => {
      clearFieldError(field);

      if (formStatus?.classList.contains("error")) {
        clearFormStatus();
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validateForm()) {
        return;
      }

      const name = nameInput.value.trim();

      const email = emailInput.value.trim();

      const phone = phoneInput?.value.trim() || "Not provided";

      const company = companyInput?.value.trim() || "Not provided";

      const service =
        serviceInterest.options[serviceInterest.selectedIndex]?.text ||
        "Not specified";

      const message = messageInput.value.trim();

      const subject = `Mantrawest enquiry — ${service}`;

      const body = [
        "Hello Mantrawest,",
        "",
        "I would like to make an enquiry.",
        "",
        `Full name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Company: ${company}`,
        `Service: ${service}`,
        "",
        "Message:",
        message,
        "",
        "Sent from the Mantrawest website.",
      ].join("\n");

      const mailto = `mailto:info@mantrawest.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      setFormStatus(
        "Your email is ready. Your email application will open with the enquiry pre-filled.",
        "success",
      );

      if (contactSubmit) {
        contactSubmit.disabled = true;
        contactSubmit.setAttribute("aria-disabled", "true");
      }

      // Open the user's email application
      window.location.href = mailto;

      // Re-enable after a short delay
      window.setTimeout(() => {
        if (contactSubmit) {
          contactSubmit.disabled = false;
          contactSubmit.removeAttribute("aria-disabled");
        }
      }, 1800);
    });
  }

  /* =========================================================
     ORGANISATIONAL CHART
     ========================================================= */

  const orgBranches = $$(".org-branch");

  const orgExpandAll = $("#orgExpandAll");

  const setOrgBranchState = (branch, open) => {
    if (!branch) return;

    branch.setAttribute("data-open", String(open));

    const toggle = $(".org-branch-toggle", branch);

    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
    }
  };

  orgBranches.forEach((branch) => {
    const toggle = $(".org-branch-toggle", branch);

    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const isOpen = branch.getAttribute("data-open") === "true";

      setOrgBranchState(branch, !isOpen);

      if (orgExpandAll) {
        const allOpen = orgBranches.every(
          (item) => item.getAttribute("data-open") === "true",
        );

        orgExpandAll.setAttribute("data-state", allOpen ? "open" : "closed");

        orgExpandAll.textContent = allOpen ? "Collapse all" : "Expand all";
      }
    });
  });

  if (orgExpandAll) {
    orgExpandAll.addEventListener("click", () => {
      const shouldOpen = orgExpandAll.getAttribute("data-state") !== "open";

      orgBranches.forEach((branch) => {
        setOrgBranchState(branch, shouldOpen);
      });

      orgExpandAll.setAttribute("data-state", shouldOpen ? "open" : "closed");

      orgExpandAll.textContent = shouldOpen ? "Collapse all" : "Expand all";
    });
  }

  /* =========================================================
     CLIENT PORTAL MODAL
     ========================================================= */

  const portalModal = $("#portalModal");

  const portalModalBackdrop = $("#portalModalBackdrop");

  const portalModalClose = $("#portalModalClose");

  const openModalButtons = $$("[data-open-modal]");

  let lastFocusedElement = null;

  const openPortalModal = () => {
    if (!portalModal) return;

    lastFocusedElement = document.activeElement;

    portalModal.hidden = false;

    // Allow CSS transitions/animations to start
    requestAnimationFrame(() => {
      portalModal.classList.add("is-open");
    });

    document.body.classList.add("modal-open");

    if (portalModalClose) {
      portalModalClose.focus();
    }
  };

  const closePortalModal = () => {
    if (!portalModal) return;

    portalModal.classList.remove("is-open");

    document.body.classList.remove("modal-open");

    // Keep it visible briefly for the CSS animation
    window.setTimeout(() => {
      if (!portalModal.classList.contains("is-open")) {
        portalModal.hidden = true;
      }
    }, 250);

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  openModalButtons.forEach((button) => {
    button.addEventListener("click", openPortalModal);
  });

  if (portalModalClose) {
    portalModalClose.addEventListener("click", closePortalModal);
  }

  if (portalModalBackdrop) {
    portalModalBackdrop.addEventListener("click", closePortalModal);
  }

  /* =========================================================
     KEYBOARD MODAL CLOSE
     ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && portalModal && !portalModal.hidden) {
      closePortalModal();
    }
  });

  /* =========================================================
     SMOOTH ANCHOR SCROLLING
     ========================================================= */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#" || href === "#top") {
        return;
      }

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      closeNav();
      closePortalModal();

      const headerHeight = siteHeader?.offsetHeight || 0;

      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      // Keep URL hash updated without jumping
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", href);
      }
    });
  });

  /* =========================================================
     ACTIVE NAVIGATION
     ========================================================= */

  const navLinks = $$(".nav-link[data-nav]");

  const navTargets = [];

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) {
      return;
    }

    const target = document.querySelector(href);

    if (target) {
      navTargets.push({
        link,
        target,
      });
    }
  });

  if (navTargets.length && "IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navTargets.forEach(({ link }) => {
            link.removeAttribute("aria-current");
          });

          const matching = navTargets.find(
            ({ target }) => target === entry.target,
          );

          if (matching) {
            matching.link.setAttribute("aria-current", "page");
          }
        });
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0,
      },
    );

    navTargets.forEach(({ target }) => {
      activeObserver.observe(target);
    });
  }

  /* =========================================================
     GLASS SHINE — CURSOR REACTIVE
     ========================================================= */

  if (!prefersReducedMotion) {
    $$(".glass-shine").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();

        const x = ((event.clientX - rect.left) / rect.width) * 100;

        const y = ((event.clientY - rect.top) / rect.height) * 100;

        element.style.setProperty("--mx", `${x}%`);

        element.style.setProperty("--my", `${y}%`);
      });
    });
  }

  /* =========================================================
     HERO PARALLAX
     ========================================================= */

  const heroImage = $(".hero-media-frame img");

  if (heroImage && !prefersReducedMotion) {
    let ticking = false;

    const updateHeroParallax = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition < 700) {
        const movement = scrollPosition * 0.035;

        heroImage.style.transform = `scale(1.04) translateY(${movement}px)`;
      } else {
        heroImage.style.transform = "scale(1.04) translateY(24px)";
      }

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateHeroParallax);

          ticking = true;
        }
      },
      { passive: true },
    );
  }

  /* =========================================================
     BUTTON MAGNETIC EFFECT
     ========================================================= */

  if (!prefersReducedMotion) {
    $$(".btn").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        if (window.innerWidth < 768) {
          return;
        }

        const rect = button.getBoundingClientRect();

        const x = event.clientX - rect.left - rect.width / 2;

        const y = event.clientY - rect.top - rect.height / 2;

        button.style.setProperty("--mag-x", `${x * 0.05}px`);

        button.style.setProperty("--mag-y", `${y * 0.05}px`);
      });

      button.addEventListener("pointerleave", () => {
        button.style.removeProperty("--mag-x");

        button.style.removeProperty("--mag-y");
      });
    });
  }

  /* =========================================================
     TOOLTIP / "COMING SOON" SOCIAL BUTTONS
     ========================================================= */

  $$(".tt").forEach((tooltip) => {
    const trigger = $("a", tooltip);

    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      const href = trigger.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();

        tooltip.classList.toggle("show-tip");
      }
    });
  });

  /* =========================================================
     FOOTER YEAR
     ========================================================= */

  $$("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* =========================================================
     TOAST HELPER
     ========================================================= */

  const toast = $("#toast");

  let toastTimer = null;

  const showToast = (message, duration = 3000) => {
    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("is-visible");

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, duration);
  };

  // Expose a small helper if needed elsewhere
  window.mantrawestToast = showToast;

  /* =========================================================
     GLOBAL SCROLL HANDLER
     ========================================================= */

  let scrollTicking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;

      window.requestAnimationFrame(() => {
        updateHeader();
        updateScrollProgress();

        scrollTicking = false;
      });

      scrollTicking = true;
    },
    { passive: true },
  );

  /* =========================================================
     INITIAL STATE
     ========================================================= */

  updateHeader();
  updateScrollProgress();

  // Make sure the portal starts closed
  if (portalModal) {
    portalModal.hidden = true;
    portalModal.classList.remove("is-open");
  }

  // Make sure all org branches start according
  // to their HTML data-open state
  orgBranches.forEach((branch) => {
    const isOpen = branch.getAttribute("data-open") === "true";

    const toggle = $(".org-branch-toggle", branch);

    if (toggle) {
      toggle.setAttribute("aria-expanded", String(isOpen));
    }
  });

  console.log("Mantrawest JavaScript loaded successfully.");
});
