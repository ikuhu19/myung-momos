// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Sticky navigation highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Ensure external links open in new tabs
document.querySelectorAll('a[href^="https"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});

// All functionality (carousel and cart) inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Carousel functionality
    const images = document.querySelectorAll('.carousel-image');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentImageIndex = 0;
    let interval;

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
        });
        currentImageIndex = index;
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImage(currentImageIndex);
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage(currentImageIndex);
    }

    function startCarousel() {
        interval = setInterval(nextImage, 5000);
    }

    function stopCarousel() {
        clearInterval(interval);
    }

    // Event listeners for carousel controls
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopCarousel();
            nextImage();
            startCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopCarousel();
            prevImage();
            startCarousel();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopCarousel();
            showImage(index);
            startCarousel();
        });
    });

    // Start carousel
    if (images.length > 0) {
        showImage(currentImageIndex);
        startCarousel();
    }

    // Cart functionality
    const cart = [];
    const cartItemsList = document.getElementById('cart-items');
    const cartEmptyMessage = document.getElementById('cart-empty');
    const orderCartBtn = document.getElementById('order-cart-btn');

    function updateCartDisplay() {
        if (!cartItemsList) return;
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartEmptyMessage.classList.remove('d-none');
            orderCartBtn.classList.add('d-none');
        } else {
            cartEmptyMessage.classList.add('d-none');
            orderCartBtn.classList.remove('d-none');
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.innerHTML = `
                    <span>${item}</span>
                    <button class="remove-item-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                `;
                cartItemsList.appendChild(li);
            });
        }
    }

    // Add to cart
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.getAttribute('data-item');
            if (itemName) {
                cart.push(itemName);
                updateCartDisplay();
            }
        });
    });

    // Remove from cart
    if (cartItemsList) {
        cartItemsList.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-item-btn');
            if (removeBtn) {
                const index = parseInt(removeBtn.getAttribute('data-index'), 10);
                if (!isNaN(index)) {
                    cart.splice(index, 1);
                    updateCartDisplay();
                }
            }
        });
    }

    // Order cart
    if (orderCartBtn) {
        orderCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cart.length > 0) {
                const orderText = `I want to order ${cart.join(', ')}`;
                const encodedOrder = encodeURIComponent(orderText);
                const whatsappUrl = `https://wa.me/7999921743?text=${encodedOrder}`;
                window.location.href = whatsappUrl;
            }
        });
    }

    // Initial cart display
    updateCartDisplay();
});