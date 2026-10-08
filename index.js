// ============================================================
// MANTRAWEST WEBSITE - MAIN JAVASCRIPT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ========================================================
    // HELPER FUNCTIONS
    // ========================================================

    const $ = (selector, parent = document) => {
        return parent.querySelector(selector);
    };

    const $$ = (selector, parent = document) => {
        return Array.from(parent.querySelectorAll(selector));
    };


    // ========================================================
    // MOBILE NAVIGATION MENU
    // ========================================================

    const menuBtn = document.getElementById("navToggle");
    const navMenu = document.getElementById("mainNav");
    const navBackdrop = document.getElementById("navBackdrop");

    function openMenu() {
        if (!menuBtn || !navMenu) return;

        navMenu.classList.add("is-open");

        if (navBackdrop) {
            navBackdrop.classList.add("is-open");
        }

        menuBtn.setAttribute("aria-expanded", "true");

        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        if (!menuBtn || !navMenu) return;

        navMenu.classList.remove("is-open");

        if (navBackdrop) {
            navBackdrop.classList.remove("is-open");
        }

        menuBtn.setAttribute("aria-expanded", "false");

        document.body.classList.remove("menu-open");
    }

    if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");

        menuBtn.addEventListener("click", () => {
            const menuIsOpen = navMenu?.classList.contains("is-open");

            if (menuIsOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener("click", closeMenu);
    }


    // ========================================================
    // NAVIGATION LINKS / SMOOTH SCROLL
    // ========================================================

    const navLinks = $$(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            // Ignore links that are not internal anchors
            if (!href || !href.startsWith("#")) {
                return;
            }

            const target = document.querySelector(href);

            if (!target) {
                return;
            }

            event.preventDefault();

            const header = document.querySelector(".site-header");
            const headerHeight = header ? header.offsetHeight : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                10;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: "smooth"
            });

            closeMenu();
        });
    });


    // ========================================================
    // ABOUT NAVIGATION
    // ========================================================

    const aboutLink = document.querySelector('[data-nav="about"]');
    const aboutSection = document.getElementById("about-preview");

    if (aboutLink && aboutSection) {
        const currentHref = aboutLink.getAttribute("href");

        // Only change the link if it is currently empty
        // or already intended to point to an internal section.
        if (!currentHref || currentHref === "#") {
            aboutLink.setAttribute("href", "#about-preview");
        }
    }


    // ========================================================
    // SCROLL PROGRESS BAR
    // ========================================================

    const scrollProgress = document.getElementById("scrollProgress");

    function updateScrollProgress() {
        if (!scrollProgress) return;

        const scrollTop = window.scrollY;

        const totalHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        if (totalHeight <= 0) {
            scrollProgress.style.width = "0%";
            return;
        }

        const percentage = (scrollTop / totalHeight) * 100;

        scrollProgress.style.width =
            `${Math.min(100, percentage)}%`;
    }

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    updateScrollProgress();


    // ========================================================
    // SCROLL REVEAL ANIMATION
    // ========================================================

    const revealElements = $$(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);
                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        // Fallback for older browsers
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }


    // ========================================================
    // ACTIVE NAVIGATION ON SCROLL
    // ========================================================

    const sections = $$("main section[id]");

    function updateActiveNavigation() {
        if (!sections.length) return;

        const scrollPosition =
            window.scrollY +
            window.innerHeight * 0.3;

        let currentSectionId = "";

        sections.forEach((section) => {

            if (scrollPosition >= section.offsetTop) {
                currentSectionId = section.id;
            }

        });

        navLinks.forEach((link) => {

            const href = link.getAttribute("href");

            link.classList.remove("is-active");

            if (href === `#${currentSectionId}`) {
                link.classList.add("is-active");
            }

        });
    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    updateActiveNavigation();


    // ========================================================
    // SERVICE REQUEST BUTTONS
    // ========================================================

    const serviceButtons = $$("[data-service-request]");
    const messageField = document.getElementById("message");

    serviceButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const service =
                button.getAttribute("data-service-request");

            if (!service || !messageField) {
                return;
            }

            const readableService = service
                .replace(/-/g, " ")
                .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                );

            messageField.value =
                `I would like to enquire about: ${readableService}.`;

            // Scroll to contact form
            const contactSection =
                document.getElementById("contact");

            if (contactSection) {

                const header =
                    document.querySelector(".site-header");

                const headerHeight =
                    header ? header.offsetHeight : 0;

                const position =
                    contactSection.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    10;

                window.scrollTo({
                    top: Math.max(0, position),
                    behavior: "smooth"
                });
            }

            closeMenu();
        });
    });


    // ========================================================
    // CONTACT FORM
    // ========================================================

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

        formStatus.removeAttribute("hidden");
    }


    if (contactForm) {

        contactForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const formData =
                new FormData(contactForm);

            const name =
                String(formData.get("name") || "")
                    .trim();

            const email =
                String(formData.get("email") || "")
                    .trim();

            const message =
                String(formData.get("message") || "")
                    .trim();


            // --------------------------------------------
            // VALIDATE NAME
            // --------------------------------------------

            if (!name) {

                showFormStatus(
                    "Please enter your name.",
                    "error"
                );

                return;
            }


            // --------------------------------------------
            // VALIDATE EMAIL
            // --------------------------------------------

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


            // --------------------------------------------
            // VALIDATE MESSAGE
            // --------------------------------------------

            if (!message) {

                showFormStatus(
                    "Please enter your enquiry.",
                    "error"
                );

                return;
            }


            // --------------------------------------------
            // TEMPORARY SUBMISSION STATE
            // --------------------------------------------

            if (contactSubmit) {

                contactSubmit.disabled = true;
                contactSubmit.textContent = "Sending...";
            }


            /*
             * IMPORTANT:
             *
             * This currently simulates a successful submission.
             *
             * For the live website, we will connect this
             * form to a real email/form backend.
             */


            setTimeout(() => {

                showFormStatus(
                    "Thank you. Your enquiry has been received. Our team will be in touch.",
                    "success"
                );

                contactForm.reset();

                if (contactSubmit) {

                    contactSubmit.disabled = false;
                    contactSubmit.textContent = "Send enquiry";
                }

            }, 600);
        });
    }


    // ========================================================
    // CLIENT PORTAL / LOGIN MODAL
    // ========================================================

    const portalModal =
        document.getElementById("portalModal");

    const portalClose =
        document.getElementById("portalModalClose");

    const portalBackdrop =
        document.getElementById("portalModalBackdrop");

    const portalButtons =
        $$("[data-open-modal]");


    function openPortalModal() {

        if (!portalModal) return;

        portalModal.hidden = false;

        requestAnimationFrame(() => {
            portalModal.classList.add("is-open");
        });

        document.body.classList.add("modal-open");
    }


    function closePortalModal() {

        if (!portalModal) return;

        portalModal.classList.remove("is-open");

        document.body.classList.remove("modal-open");

        setTimeout(() => {

            portalModal.hidden = true;

        }, 250);
    }


    portalButtons.forEach((button) => {

        button.addEventListener(
            "click",
            openPortalModal
        );

    });


    if (portalClose) {

        portalClose.addEventListener(
            "click",
            closePortalModal
        );

    }


    if (portalBackdrop) {

        portalBackdrop.addEventListener(
            "click",
            closePortalModal
        );

    }


    // ========================================================
    // ESCAPE KEY
    // ========================================================

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") {
            return;
        }

        closeMenu();
        closePortalModal();

    });


    // ========================================================
    // CLOSE MOBILE MENU WHEN WINDOW EXPANDS
    // ========================================================

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeMenu();
        }

    });


    // ========================================================
    // FOOTER YEAR
    // ========================================================

    $$("[data-year]").forEach((element) => {

        element.textContent =
            new Date().getFullYear();

    });


    // ========================================================
    // 3D GLASS CARD EFFECT
    // ========================================================

    $$(".glass-shine").forEach((card) => {

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


            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        });


        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });


    // ========================================================
    // IMAGE ERROR DETECTION
    // ========================================================

    $$("img").forEach((image) => {

        image.addEventListener("error", () => {

            console.warn(
                "Mantrawest image could not be loaded:",
                image.src
            );

            image.classList.add("image-error");

        });

    });


    // ========================================================
    // INITIALIZATION MESSAGE
    // ========================================================

    console.log(
        "Mantrawest website loaded successfully."
    );

});