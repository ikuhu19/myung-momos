document.addEventListener("DOMContentLoaded", () => {
    // 1. Dynamic Navbar Effects on Scroll
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Intersection Observer for Scroll-Fade Reveal Animations
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active-reveal");
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    // Apply reveal class to major sections & elements
    const elementsToReveal = document.querySelectorAll(
        ".feature-item, .story-image, .story-content, .menu-card, .gallery-item, .faq-item"
    );

    elementsToReveal.forEach(el => {
        el.classList.add("reveal-on-scroll");
        revealObserver.observe(el);
    });
});