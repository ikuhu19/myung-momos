/**
 * Myung's Momos - Interactive Client Script
 * Handles:
 * 1. Sticky Frosted Header on Scroll
 * 2. Mobile Slide-out Drawer Navigation (with backdrop, focus trap, ESC handling)
 * 3. Editorial Lightbox for Gallery (with keyboard & touch navigation)
 * 4. IntersectionObserver for Soft Fade/Slide Reveals
 * 5. Video Autoplay / Low-Power Fallback handling
 * 6. Smooth Scrolling with Nav Offset
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sticky Header ---
    const header = document.querySelector('.site-header');
    const scrollThreshold = 30;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header?.classList.add('is-scrolled');
        } else {
            header?.classList.remove('is-scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- 2. Mobile Slide-out Drawer Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openDrawer = () => {
        if (!mobileDrawer || !drawerBackdrop) return;
        mobileDrawer.classList.add('is-open');
        drawerBackdrop.classList.add('is-visible');
        menuToggle?.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        if (!mobileDrawer || !drawerBackdrop) return;
        mobileDrawer.classList.remove('is-open');
        drawerBackdrop.classList.remove('is-visible');
        menuToggle?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    menuToggle?.addEventListener('click', openDrawer);
    drawerCloseBtn?.addEventListener('click', closeDrawer);
    drawerBackdrop?.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    // --- 3. Lightbox Functionality ---
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-trigger'));

    let currentIndex = 0;

    const showLightboxImage = (index) => {
        if (galleryItems.length === 0) return;
        currentIndex = (index + galleryItems.length) % galleryItems.length;
        const currentItem = galleryItems[currentIndex];
        const fullSrc = currentItem.getAttribute('data-full') || currentItem.querySelector('img')?.getAttribute('src');
        const title = currentItem.getAttribute('data-title') || currentItem.querySelector('img')?.getAttribute('alt') || "Fresh at Myung's Momos";
        const desc = currentItem.getAttribute('data-desc') || '';

        if (lightboxImg) {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.setAttribute('src', fullSrc);
                lightboxImg.setAttribute('alt', title);
                lightboxImg.onload = () => {
                    lightboxImg.style.opacity = '1';
                };
            }, 100);
        }

        if (lightboxCaption) {
            lightboxCaption.innerHTML = `<h4>${title}</h4>${desc ? `<p>${desc}</p>` : ''}`;
        }

        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
        }
    };

    const openLightbox = (index) => {
        if (!lightbox) return;
        lightbox.classList.add('is-active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        showLightboxImage(index);
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('is-active');
        lightbox.setAttribute('aria-hidden', 'true');
        if (!mobileDrawer?.classList.contains('is-open')) {
            document.body.style.overflow = '';
        }
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', (e) => {
        e.stopPropagation();
        showLightboxImage(currentIndex - 1);
    });
    lightboxNext?.addEventListener('click', (e) => {
        e.stopPropagation();
        showLightboxImage(currentIndex + 1);
    });

    // Close when clicking outside modal image
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (mobileDrawer?.classList.contains('is-open')) {
                closeDrawer();
            }
            if (lightbox?.classList.contains('is-active')) {
                closeLightbox();
            }
        } else if (lightbox?.classList.contains('is-active')) {
            if (e.key === 'ArrowLeft') {
                showLightboxImage(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showLightboxImage(currentIndex + 1);
            }
        }
    });

    // --- 4. Soft Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.fade-in-up, .craft-card, .review-card, .gallery-item');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('in-view'));
    }

    // --- 5. Video Fallback & Play/Pause Controller ---
    const kitchenVideo = document.getElementById('kitchen-bg-video');
    const videoContainer = document.querySelector('.video-section-wrapper');
    const videoToggleBtn = document.getElementById('video-playback-toggle');

    if (kitchenVideo) {
        const playPromise = kitchenVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // If autoplay is prevented (e.g. data saver or iOS low power mode)
                videoContainer?.classList.add('show-fallback');
            });
        }

        if (videoToggleBtn) {
            videoToggleBtn.addEventListener('click', () => {
                if (kitchenVideo.paused) {
                    kitchenVideo.play();
                    videoToggleBtn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i><span>Pause</span>';
                } else {
                    kitchenVideo.pause();
                    videoToggleBtn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i><span>Play</span>';
                }
            });
        }
    }
});
