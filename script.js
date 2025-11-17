document.addEventListener("DOMContentLoaded", function() {

    // --- PRELOADER ---
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // --- INITIALIZE ANIMATIONS (SPEED UP) ---
    AOS.init({
        duration: 500,     // Reduced from 800 for snappier load
        once: true,
        offset: 50,        // Reduced from 100 so elements appear sooner
        easing: 'ease-out-cubic' // Slightly snappier easing function
    });

    // --- HAMBURGER MENU ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");

    if(hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            const isExpanded = hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            
            // Update aria-expanded for accessibility
            hamburger.setAttribute("aria-expanded", isExpanded);
            
            // Prevent body scroll when menu is open on mobile
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        document.querySelectorAll(".nav-links li a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                if (hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    hamburger.setAttribute("aria-expanded", "false");
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // --- CONTACT FORM VALIDATION & SUBMISSION ---
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const statusMessage = document.getElementById("statusMessage");

    function isValidPhone(phone) {
        const re = /^[0-9]{10,15}$/;
        return re.test(String(phone).trim());
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase().trim());
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
            const message = document.getElementById("message").value.trim();

            // Validation
            if (name === "" || phone === "" || message === "") {
                showMessage("Please fill out all required fields.", "error");
                return; 
            }

            if (!isValidPhone(phone)) {
                showMessage("Please enter a valid 10-15 digit phone number.", "error");
                return; 
            }

            if (email !== "" && !isValidEmail(email)) {
                showMessage("Please enter a valid email address.", "error");
                return;
            }

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending... ⏳";
            
            const formData = new FormData(contactForm);

            fetch("https://api.web3forms.com/submit", { 
                method: "POST",
                body: formData 
            })
            .then(response => response.json()) 
            .then(data => {
                if (data.success) {
                    showMessage("Thank you! We have received your message. We'll get back to you soon! 🚀", "success");
                    contactForm.reset();
                    
                    // Track form submission (if you add analytics later)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submission', {
                            'event_category': 'Contact Form',
                            'event_label': 'Admission Inquiry'
                        });
                    }
                } else {
                    showMessage("Oops! Something went wrong. Please try again or call us directly.", "error");
                }
            })
            .catch(error => {
                console.error("Form submission error:", error);
                showMessage("An error occurred. Please try again later or contact us by phone.", "error");
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = "Send Message 🚀";
            });
        });
    }

    function showMessage(message, type) {
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = type;
            statusMessage.style.display = 'block';
            
            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, 5000);
            }
            
            // Scroll to message for visibility
            statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // --- HERO SLIDER WITH CONTROLS ---
    let slideIndex = 0;
    let autoSlideTimer;
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    // Initialize slider if slides exist
    if (totalSlides > 0) {
        showSlide(slideIndex);
        startAutoSlide();
        
        // Pause on hover
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
        }
    } else {
        console.warn('No slider images found');
    }

    function showSlide(n) {
        if (totalSlides === 0) return;
        
        // Wrap around
        if (n >= totalSlides) {
            slideIndex = 0;
        } else if (n < 0) {
            slideIndex = totalSlides - 1;
        } else {
            slideIndex = n;
        }

        // Hide all slides and remove active from dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Show current slide and activate dot
        if (slides[slideIndex]) {
            slides[slideIndex].classList.add('active');
        }
        if (dots[slideIndex]) {
            dots[slideIndex].classList.add('active');
        }
    }

    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing timer
        autoSlideTimer = setInterval(() => {
            showSlide(slideIndex + 1);
        }, 4000); // Change slide every 4 seconds
    }

    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
        }
    }

    // Manual slide controls
    window.changeSlide = function(n) {
        stopAutoSlide();
        showSlide(slideIndex + n);
        startAutoSlide();
    };

    window.currentSlide = function(n) {
        stopAutoSlide();
        showSlide(n - 1);
        startAutoSlide();
    };

    // Keyboard navigation for slider
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });

    // --- SMOOTH SCROLL WITH OFFSET FOR FIXED NAVBAR ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for non-section links
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- ACTIVE NAVIGATION HIGHLIGHT ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if (navLink) {
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active-link');
                    });
                    navLink.classList.add('active-link');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // --- LAZY LOADING FOR IMAGES ---
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // --- PERFORMANCE: Reduce animations on low-power devices ---
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        AOS.init({
            disable: true
        });
    }

    // --- FORM INPUT ENHANCEMENTS ---
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Character counter for message textarea
        if (input.tagName === 'TEXTAREA') {
            const maxLength = 500;
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = 'text-align: right; font-size: 0.85rem; color: #888; margin-top: 5px;';
            input.parentElement.appendChild(counter);
            
            function updateCounter() {
                const remaining = maxLength - input.value.length;
                counter.textContent = `${input.value.length} / ${maxLength} characters`;
                
                if (remaining < 50) {
                    counter.style.color = '#D81B60';
                } else {
                    counter.style.color = '#888';
                }
            }
            
            input.addEventListener('input', updateCounter);
            input.setAttribute('maxlength', maxLength);
            updateCounter();
        }
    });

    // --- SCROLL TO TOP BUTTON (Optional Enhancement) ---
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--brand-pink);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 9999;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- CONSOLE MESSAGE ---
    console.log('%c🌸 Welcome to Blossom Kids! 🌸', 'color: #D81B60; font-size: 20px; font-weight: bold;');
    console.log('%cWhere little seeds grow into big dreams!', 'color: #00AEEF; font-size: 14px;');
    
});