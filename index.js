// =========================================
// MOBILE MENU
// =========================================

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (navMenu.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


// Close menu when link is clicked

document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


// =========================================
// BUTTON RIPPLE EFFECT
// =========================================

document.querySelectorAll(".ripple").forEach(button => {

    button.addEventListener("click", function(event) {

        const ripple = document.createElement("span");

        ripple.classList.add("ripple-effect");

        const rect = this.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 700);

    });

});


// =========================================
// SCROLL REVEAL
// =========================================

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.15
        }

    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


// =========================================
// NAVBAR SHADOW
// =========================================

window.addEventListener("scroll", () => {

    const navbar =
        document.querySelector(".navbar");

    if (window.scrollY > 60) {

        navbar.style.boxShadow =
            "0 10px 35px rgba(0,0,0,.08)";

    } else {

        navbar.style.boxShadow = "none";

    }

});


// =========================================
// FORM
// =========================================

const contactForm =
    document.getElementById("contactForm");

contactForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const message =
            document.getElementById("formMessage");

        message.textContent =
            `Thanks ${name}. Your request has been received.`;

        contactForm.reset();

    }
);


// =========================================
// IMAGE PARALLAX
// =========================================

const heroImage =
    document.querySelector(".hero-image");

window.addEventListener("scroll", () => {

    const scrollPosition =
        window.scrollY;

    if (scrollPosition < 800) {

        heroImage.style.transform =
            `scale(1.08) translateY(${scrollPosition * 0.12}px)`;

    }

});


// =========================================
// MAGNETIC BUTTON EFFECT
// =========================================

document.querySelectorAll(".btn").forEach(button => {

    button.addEventListener("mousemove", event => {

        const rect =
            button.getBoundingClientRect();

        const x =
            event.clientX - rect.left - rect.width / 2;

        const y =
            event.clientY - rect.top - rect.height / 2;

        button.style.transform =
            `translate(${x * 0.08}px, ${y * 0.08}px)`;

    });


    button.addEventListener("mouseleave", () => {

        button.style.transform = "";

    });

});