// ============================================================
// MANTRAWEST WEBSITE — MAIN JAVASCRIPT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ========================================================
    // HELPER FUNCTIONS
    // ========================================================

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    // ========================================================
    // MOBILE NAVIGATION
    // ========================================================

    const menuBtn = $("#navToggle");
    const navMenu = $("#mainNav");
    const navBackdrop = $("#navBackdrop");

    function openMenu() {
        if (!navMenu) return;

        navMenu.classList.add("is-open");

        if (menuBtn) {
            menuBtn.classList.add("is-open");
            menuBtn.setAttribute("aria-expanded", "true");
            menuBtn.setAttribute("aria-label", "Close menu");
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
            menuBtn.setAttribute("aria-label", "Open menu");
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

    // Close the mobile menu when the screen becomes desktop-sized.
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 1024) {
            closeMenu();
        }
    });

    // ========================================================
    // NAVIGATION LINKS AND SMOOTH SCROLLING
    // ========================================================

    const navLinks = $$(".nav-link");

    function scrollToTarget(target) {
        if (!target) return;

        const header = $(".site-header");
        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight -
            20;

        window.scrollTo({
            top: Math.max(targetPosition, 0),
            behavior: "smooth"
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#") || href === "#") {
                closeMenu();
                return;
            }

            let target;

            try {
                target = $(href);
            } catch (error) {
                console.warn("Invalid navigation target:", href);
                closeMenu();
                return;
            }

            if (!target) {
                closeMenu();
                return;
            }

            event.preventDefault();

            closeMenu();
            scrollToTarget(target);
        });
    });

    // ========================================================
    // NAVIGATION SECTION TARGETS
    // ========================================================

    // The supplied HTML uses #about for the About section.
    // Keep the existing section ID when it is available.

    const aboutLink = $('[data-nav="about"]');
    const aboutSection = $("#about");

    if (aboutLink && aboutSection) {
        aboutLink.setAttribute("href", "#about");
    }

    // ========================================================
    // SCROLL PROGRESS BAR
    // ========================================================

    const scrollProgress = $("#scrollProgress");

    function updateScrollProgress() {
        if (!scrollProgress) return;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        if (documentHeight <= 0) {
            scrollProgress.style.width = "0%";
            return;
        }

        const scrollPercentage =
            (window.scrollY / documentHeight) * 100;

        scrollProgress.style.width =
            `${Math.min(scrollPercentage, 100)}%`;
    }

    window.addEventListener("scroll", updateScrollProgress, {
        passive: true
    });

    window.addEventListener("resize", updateScrollProgress);

    updateScrollProgress();

    // ========================================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================================

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
                rootMargin: "0px 0px -50px 0px"
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

    // ========================================================
    // ACTIVE NAVIGATION LINK
    // ========================================================

    const sections = $$("main section[id]");

    function updateActiveNavigation() {
        if (!sections.length || !navLinks.length) return;

        const header = $(".site-header");

        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;

        const scrollPosition =
            window.scrollY + headerHeight + 80;

        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop =
                section.getBoundingClientRect().top +
                window.scrollY;

            const sectionBottom =
                sectionTop + section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute("href");

            link.classList.remove("active", "is-active");

            if (href === `#${currentSection}`) {
                link.classList.add("active", "is-active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavigation, {
        passive: true
    });

    window.addEventListener("resize", updateActiveNavigation);

    updateActiveNavigation();

    // ========================================================
    // SERVICE REQUEST BUTTONS
    // ========================================================

    const serviceButtons = $$("[data-service-request]");

    serviceButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const service =
                button.getAttribute("data-service-request");

            const messageField = $("#message");

            if (!messageField || !service) return;

            messageField.value =
                `I would like to enquire about: ${service}`;

            const contactSection =
                $("#quote-form") || $("#contact");

            closeMenu();

            if (contactSection) {
                scrollToTarget(contactSection);

                window.setTimeout(() => {
                    messageField.focus();
                }, 500);
            } else {
                messageField.focus();
            }
        });
    });