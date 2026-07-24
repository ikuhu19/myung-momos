/**
 * MYUNG'S MOMOS - Responsive Navigation & Touch Handlers
 * Dedicated script for mobile menu toggles, drawer state, and screen event listeners.
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navLinks = document.getElementById("navLinks");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const navItems = document.querySelectorAll(".nav-item");

    // Toggle Mobile Drawer Menu
    function toggleMobileMenu() {
        if (!navLinks || !mobileOverlay || !hamburgerBtn) return;

        const isOpen = navLinks.classList.toggle("active");
        mobileOverlay.classList.toggle("active", isOpen);

        // Toggle icon between hamburger bars and close icon (X)
        const icon = hamburgerBtn.querySelector("i");
        if (icon) {
            if (isOpen) {
                icon.classList.remove("fa-bars-staggered");
                icon.classList.add("fa-xmark");
                document.body.style.overflow = "hidden"; // Prevent background page scrolling when menu is open
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars-staggered");
                document.body.style.overflow = ""; // Re-enable background scrolling
            }
        }
    }

    // Event Listeners
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", toggleMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener("click", toggleMobileMenu);
    }

    // Auto-close drawer when a menu link is tapped
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            if (navLinks && navLinks.classList.contains("active")) {
                toggleMobileMenu();
            }
        });
    });

    // Handle screen resize: reset drawer state if resized back to desktop (width > 992px)
    window.addEventListener("resize", () => {
        if (window.innerWidth > 992 && navLinks && navLinks.classList.contains("active")) {
            toggleMobileMenu();
        }
    });
});