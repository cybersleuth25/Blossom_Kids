document.addEventListener("DOMContentLoaded", function() {

    // --- 1. PRELOADER ---
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // --- 2. INITIALIZE ANIMATIONS (With Safety Check) ---
    // Check if AOS library is loaded to prevent errors
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }

    // --- 3. HAMBURGER MENU & ACCESSIBILITY ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");

    if(hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            const isExpanded = hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            
            // Security/A11y: Update aria state
            hamburger.setAttribute("aria-expanded", isExpanded);
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking ANY link
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        // Close menu when clicking OUTSIDE
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        function closeMenu() {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            document.body.style.overflow = '';
        }
    }

    // --- 4. SECURE FORM SUBMISSION (With Rate Limiting) ---
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const statusMessage = document.getElementById("statusMessage");

    // Helper: Validate Phone Format
    function isValidPhone(phone) {
        const re = /^[0-9]{10,15}$/;
        return re.test(String(phone).trim());
    }

    // Helper: Validate Email Format
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase().trim());
    }

    // Security: Sanitize Input (Remove HTML tags)
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // SECURITY: Client-Side Rate Limit (1 Hour)
    function checkRateLimit() {
        const lastSubmission = localStorage.getItem('lastFormSubmission');
        if (lastSubmission) {
            const timeDiff = Date.now() - parseInt(lastSubmission);
            const oneHour = 60 * 60 * 1000;
            if (timeDiff < oneHour) {
                return false; // Block submission
            }
        }
        return true; // Allow submission
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            // 1. Check Rate Limit
            if (!checkRateLimit()) {
                showMessage("You have already sent a message recently. Please wait a while.", "error");
                return;
            }

            // 2. Check Honeypot (Bot Protection)
            const botCheck = contactForm.querySelector('input[name="botcheck"]');
            if (botCheck && botCheck.checked) {
                console.log("Bot detected. Submission blocked.");
                return; 
            }

            // 3. Get and Sanitize Values
            const name = sanitizeInput(document.getElementById("name").value.trim());
            const phone = sanitizeInput(document.getElementById("phone").value.trim());
            const emailInput = document.getElementById("email");
            const email = emailInput ? sanitizeInput(emailInput.value.trim()) : "";
            const message = sanitizeInput(document.getElementById("message").value.trim());

            // 4. Validation
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

            // 5. Submit
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending... ⏳";
            
            const formData = new FormData(contactForm);
            formData.set('name', name);
            formData.set('message', message);

            fetch("https://api.web3forms.com/submit", { 
                method: "POST",
                body: formData 
            })
            .then(response => response.json()) 
            .then(data => {
                if (data.success) {
                    showMessage("Thank you! We'll call you soon! 🚀", "success");
                    contactForm.reset();
                    
                    // Set Rate Limit Timestamp
                    localStorage.setItem('lastFormSubmission', Date.now().toString());
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submission', {
                            'event_category': 'Contact Form'
                        });
                    }
                } else {
                    showMessage("Oops! Something went wrong. Try again.", "error");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                showMessage("Connection error. Please call us directly.", "error");
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
            
            if (type === 'success') {
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, 5000);
            }
            statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // --- 5. HERO SLIDER ---
    let slideIndex = 0;
    let autoSlideTimer;
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    if (totalSlides > 0) {
        showSlide(slideIndex);
        startAutoSlide();
        
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
        }
    }

    function showSlide(n) {
        if (totalSlides === 0) return;
        
        if (n >= totalSlides) slideIndex = 0;
        else if (n < 0) slideIndex = totalSlides - 1;
        else slideIndex = n;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-pressed', 'false');
        });

        if (slides[slideIndex]) slides[slideIndex].classList.add('active');
        if (dots[slideIndex]) {
            dots[slideIndex].classList.add('active');
            dots[slideIndex].setAttribute('aria-pressed', 'true');
        }
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(() => {
            showSlide(slideIndex + 1);
        }, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
    }

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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
    });

    // --- 6. SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = target.offsetTop - navHeight - 10;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 7. ACTIVE NAVIGATION HIGHLIGHT ---
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active-link'));
                if (navLink) navLink.classList.add('active-link');
            }
        });
    }
    window.addEventListener('scroll', highlightNavigation);

    // --- 8. ACCESSIBILITY: REDUCED MOTION ---
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof AOS !== 'undefined') {
        AOS.init({ disable: true });
    }

    // --- 9. INPUT ENHANCEMENTS ---
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
        input.addEventListener('blur', () => {
            if (input.value === '') input.parentElement.classList.remove('focused');
        });
        
        if (input.tagName === 'TEXTAREA') {
            const maxLength = 500;
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = 'text-align: right; font-size: 0.85rem; color: #888; margin-top: 5px;';
            input.parentElement.appendChild(counter);
            
            const updateCounter = () => {
                counter.textContent = `${input.value.length} / ${maxLength}`;
                counter.style.color = (maxLength - input.value.length < 50) ? '#D81B60' : '#888';
            };
            
            input.addEventListener('input', updateCounter);
            input.setAttribute('maxlength', maxLength);
            updateCounter();
        }
    });

    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px;
        border-radius: 50%; background: var(--c-pink, #D81B60); color: white;
        border: none; font-size: 1.5rem; cursor: pointer; opacity: 0;
        visibility: hidden; transition: all 0.3s ease; z-index: 999;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    console.log('%c🌸 Blossom Kids Loaded 🌸', 'color: #D81B60; font-size: 16px; font-weight: bold;');
});