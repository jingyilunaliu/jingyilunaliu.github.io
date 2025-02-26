document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade in elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach((element) => {
        observer.observe(element);
    });

    // Handle email click
    document.querySelector('.social-links a[href^="mailto"]').addEventListener('click', function(e) {
        e.preventDefault();
        const email = 'jingyilunaliu@hotmail.com';
        
        // Try to open email client
        window.location.href = `mailto:${email}`;
        
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(email).then(() => {
            alert('Email address copied to clipboard: ' + email);
        }).catch(() => {
            // If clipboard fails, create a temporary input element
            const tempInput = document.createElement('input');
            tempInput.value = email;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('Email address copied to clipboard: ' + email);
        });
    });

    // Gallery scroll functionality
    function scrollGallery(direction) {
        const gallery = document.querySelector('.gallery-container');
        const scrollAmount = 320; // Width of image + gap
        
        if (direction === 'left') {
            gallery.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else {
            gallery.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    // Add touch scrolling for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.querySelector('.photo-gallery').addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.querySelector('.photo-gallery').addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeLength = touchEndX - touchStartX;
        
        if (Math.abs(swipeLength) > swipeThreshold) {
            if (swipeLength > 0) {
                scrollGallery('left');
            } else {
                scrollGallery('right');
            }
        }
    }

    // Gallery navigation functionality
    const gallery = document.querySelector('.gallery-container');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');
    
    if (gallery && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const scrollAmount = gallery.clientWidth;
            gallery.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            const scrollAmount = gallery.clientWidth;
            gallery.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Touch swipe support
        let galleryTouchStartX = 0;
        let galleryTouchEndX = 0;
        
        gallery.addEventListener('touchstart', (e) => {
            galleryTouchStartX = e.changedTouches[0].screenX;
        }, false);
        
        gallery.addEventListener('touchend', (e) => {
            galleryTouchEndX = e.changedTouches[0].screenX;
            handleGallerySwipe();
        }, false);
        
        function handleGallerySwipe() {
            const scrollAmount = gallery.clientWidth;
            if (galleryTouchStartX - galleryTouchEndX > 50) {
                // Swipe left
                gallery.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
            if (galleryTouchEndX - galleryTouchStartX > 50) {
                // Swipe right
                gallery.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Form submission handling
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    contactForm.reset();
                    submitButton.textContent = 'Message Sent!';
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                submitButton.textContent = 'Error! Try Again';
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 3000);
            }
        });
    }
});
