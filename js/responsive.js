/* ==========================================================================
   MYUNG'S MOMOS - RESPONSIVE NAVIGATION & INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    // 1. Toggle Mobile Menu On Hamburger Click
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('nav-active');

            // Switch Icon between Bars and Times (X)
            const icon = hamburgerBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }

    // 2. Close Menu when clicking any Navigation Link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('nav-active')) {
                navMenu.classList.remove('nav-active');
                const icon = hamburgerBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
        });
    });

    // 3. Close Menu when clicking Outside of Header
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('nav-active')) {
            if (!navbar.contains(e.target)) {
                navMenu.classList.remove('nav-active');
                const icon = hamburgerBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
        }
    });

    // 4. Scroll Effect for Navbar Glassmorphism
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});