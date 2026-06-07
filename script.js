document.addEventListener("DOMContentLoaded", function () {

    let currentLang = localStorage.getItem('bk-lang') || 'en';

    // =========================================
    // 0. LANDING PAGE SLIDER
    // =========================================
    (function() {
        const slides    = document.querySelectorAll('.lp-slide');
        const tabs      = document.querySelectorAll('.lp-tab');
        const captionEl = document.getElementById('lp-caption-text');
        if (!slides.length) return;

        const captions = [
            'Every day is a new adventure',
            'Learning through joyful play',
            'Creativity in every corner',
            'Growing together, every step'
        ];

        let current = 0;
        let timer;

        function goTo(n) {
            slides[current].classList.remove('active');
            tabs[current]?.classList.remove('active');
            current = (n + slides.length) % slides.length;
            slides[current].classList.add('active');
            tabs[current]?.classList.add('active');
            if (captionEl) {
                captionEl.style.opacity = '0';
                setTimeout(() => {
                    captionEl.textContent = captions[current];
                    captionEl.style.opacity = '1';
                }, 300);
            }
        }

        function startAuto() {
            timer = setInterval(() => goTo(current + 1), 4200);
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                clearInterval(timer);
                goTo(parseInt(tab.dataset.slide, 10));
                startAuto();
            });
        });

        // caption fade transition
        if (captionEl) captionEl.style.transition = 'opacity 0.35s ease';

        startAuto();
    })();

    // =========================================
    // 0b. LANDING PAGE PARTICLE CANVAS
    // =========================================
    (function() {
        const canvas = document.getElementById('lp-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, particles;
        let mouse = { x: -999, y: -999 };

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }

        function mkParticle() {
            const colors = ['255,107,149', '76,201,240', '157,78,221', '255,217,61'];
            const c = colors[Math.floor(Math.random() * colors.length)];
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 2.5 + 1,
                color: c,
                alpha: Math.random() * 0.5 + 0.2
            };
        }

        function init() {
            resize();
            particles = Array.from({ length: 70 }, mkParticle);
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);

            particles.forEach(p => {
                // gentle mouse pull
                const dx = mouse.x - p.x, dy = mouse.y - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    p.vx += dx / dist * 0.012;
                    p.vy += dy / dist * 0.012;
                }

                // friction
                p.vx *= 0.98; p.vy *= 0.98;
                p.x += p.vx; p.y += p.vy;

                // wrap edges
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

                // draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
                ctx.fill();
            });

            // draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const d = Math.sqrt(dx*dx + dy*dy);
                    if (d < 110) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${a.color},${(1 - d/110) * 0.12})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        canvas.addEventListener('mousemove', e => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

        window.addEventListener('resize', () => { resize(); });
        init();
        draw();
    })();

    // =========================================
    const preloader = document.getElementById('preloader');
    function hidePreloader() {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }
    }

    if (preloader) {
        // Try on window load
        if (document.readyState === 'complete') {
            setTimeout(hidePreloader, 600);
        } else {
            window.addEventListener('load', () => setTimeout(hidePreloader, 400));
        }
        // Guaranteed fallback — max 2.5s
        setTimeout(hidePreloader, 2500);
    }

    // =========================================
    // 2. NAVBAR SCROLL EFFECT (Expanding)
    // =========================================
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // When user scrolls down more than 50px
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    // Back to top click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================
    // 3. ANIMATIONS (AOS)
    // =========================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }

    // =========================================
    // 4. HAMBURGER MENU (Mobile Overlay)
    // =========================================
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", () => {
            const isExpanded = hamburger.classList.toggle("active");
            mobileMenu.classList.toggle("active");
            hamburger.setAttribute("aria-expanded", isExpanded);
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close on any mobile menu link click
        document.querySelectorAll(".mm-link").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                mobileMenu.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
                document.body.style.overflow = '';
            });
        });
    }

    // =========================================
    // 5. HERO SLIDER
    // =========================================
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

        // Remove active class from the current slide and dot
        if (slides[slideIndex]) slides[slideIndex].classList.remove('active');
        if (dots[slideIndex]) dots[slideIndex].classList.remove('active');

        if (n >= totalSlides) slideIndex = 0;
        else if (n < 0) slideIndex = totalSlides - 1;
        else slideIndex = n;

        // Add active class to the new slide and dot
        if (slides[slideIndex]) slides[slideIndex].classList.add('active');
        if (dots[slideIndex]) dots[slideIndex].classList.add('active');
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(() => { showSlide(slideIndex + 1); }, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
    }

    window.changeSlide = function (n) {
        stopAutoSlide();
        showSlide(slideIndex + n);
        startAutoSlide();
    };

    window.currentSlide = function (n) {
        stopAutoSlide();
        showSlide(n - 1);
        startAutoSlide();
    };

    // =========================================
    // 6. CONTACT FORM & VALIDATIONS
    // =========================================
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const statusMessage = document.getElementById("statusMessage");

    const parentNameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const visitDateInput = document.getElementById("visitDate");
    const visitTimeInput = document.getElementById("visitTime");
    const messageInput = document.getElementById("message");

    function showMessage(message, type) {
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = type;
            statusMessage.style.display = 'block';
            setTimeout(() => { statusMessage.style.display = 'none'; }, 5000);
        }
    }

    // Set tomorrow as minimum date for the datepicker
    if (visitDateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        visitDateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    function validateField(input, condition, errorMsgId, errorMsg) {
        if (!input) return true;
        const errorSpan = document.getElementById(errorMsgId);
        if (condition) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if (errorSpan) errorSpan.style.display = 'none';
            return true;
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            if (errorSpan) {
                errorSpan.textContent = errorMsg;
                errorSpan.style.display = 'block';
            }
            return false;
        }
    }

    if (parentNameInput) {
        parentNameInput.addEventListener('input', () => {
            validateField(parentNameInput, parentNameInput.value.trim().length >= 3, 'nameError', translations[currentLang].err_name_length);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            phoneInput.value = phoneInput.value.replace(/\D/g, ''); // numeric only
            validateField(phoneInput, /^\d{10}$/.test(phoneInput.value), 'phoneError', translations[currentLang].err_phone_invalid);
        });
    }

    if (visitDateInput) {
        visitDateInput.addEventListener('change', () => {
            const dateVal = new Date(visitDateInput.value);
            const day = dateVal.getDay();
            const isValid = !isNaN(dateVal.getTime()) && day !== 0; // Not Sunday
            validateField(visitDateInput, isValid, 'dateError', day === 0 ? translations[currentLang].err_date_sunday : translations[currentLang].err_date_invalid);
        });
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const isNameValid = validateField(parentNameInput, parentNameInput.value.trim().length >= 3, 'nameError', translations[currentLang].err_name_length);
            const isPhoneValid = validateField(phoneInput, /^\d{10}$/.test(phoneInput.value.trim()), 'phoneError', translations[currentLang].err_phone_invalid);
            const isMessageValid = validateField(messageInput, messageInput.value.trim().length > 0, 'messageError', translations[currentLang].err_message_empty);
            
            let isDateValid = true;
            if (visitDateInput && visitDateInput.value) {
                const dateVal = new Date(visitDateInput.value);
                const day = dateVal.getDay();
                isDateValid = validateField(visitDateInput, day !== 0, 'dateError', translations[currentLang].err_date_sunday);
            }

            if (!isNameValid || !isPhoneValid || !isMessageValid || !isDateValid) {
                showMessage(translations[currentLang].status_correct_errors, "error");
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = translations[currentLang].status_sending || (currentLang === 'kn' ? "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ... ದಯವಿಟ್ಟು ಕಾಯಿರಿ." : "Sending... please wait.");

            const formData = new FormData(contactForm);

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showMessage(translations[currentLang].status_success || (currentLang === 'kn' ? "ಧನ್ಯವಾದಗಳು! ಶೀಘ್ರದಲ್ಲೇ ಕರೆ ಮಾಡುತ್ತೇವೆ!" : "Thank you! We'll call you soon!"), "success");
                        contactForm.reset();
                        // Reset validation classes
                        [parentNameInput, phoneInput, messageInput, visitDateInput].forEach(el => {
                            if (el) el.classList.remove('is-valid', 'is-invalid');
                        });
                    } else {
                        showMessage("Something went wrong. Try again.", "error");
                    }
                })
                .catch(() => {
                    showMessage("Network error. Please check your connection.", "error");
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = currentLang === 'kn' ? "ಸಂದೇಶ ಕಳುಹಿಸಿ" : "Send Message";
                });
        });
    }

    // =========================================
    // 7. SCHOOL ASSISTANT CHATBOT
    // =========================================
    const sbToggleBtn = document.getElementById('sb-toggle-btn');
    const sbChatWindow = document.getElementById('sb-chat-window');
    const sbCloseBtn = document.getElementById('sb-close-btn');
    const sbSendBtn = document.getElementById('sb-send-btn');
    const sbInput = document.getElementById('sb-input');
    const sbMessages = document.getElementById('sb-messages');
    const sbChips = document.querySelectorAll('.sb-chip');

    if (sbToggleBtn && sbChatWindow) {
        sbChatWindow.classList.add('sb-hidden');

        sbToggleBtn.addEventListener('click', () => sbChatWindow.classList.toggle('sb-hidden'));
        sbCloseBtn.addEventListener('click', () => sbChatWindow.classList.add('sb-hidden'));

        function sbSendMessage(text, isUser = true) {
            if (!text) return;
            const msgDiv = document.createElement('div');
            msgDiv.className = isUser ? 'sb-msg sb-user' : 'sb-msg sb-bot';
            const bubble = document.createElement('div');
            bubble.className = 'sb-bubble';
            bubble.innerHTML = text;
            msgDiv.appendChild(bubble);
            sbMessages.appendChild(msgDiv);
            sbMessages.scrollTop = sbMessages.scrollHeight;

            if (isUser) {
                sbInput.value = '';
                setTimeout(() => sbBotReply(text), 600);
            }
        }

        function sbBotReply(userText) {
            const lowerText = userText.toLowerCase();
            let response = "I'm sorry, I didn't quite catch that. Please contact the school office. 📞";

            if (lowerText.includes('transport') || lowerText.includes('bus')) {
                response = "<b>Transport Update:</b><br>We do not currently provide transport services. Parents are requested to arrange their own commute. 🚗";
            }
            else if (lowerText.includes('admission') || lowerText.includes('admissions') || lowerText.includes('enroll') || lowerText.includes('enrollment') || lowerText.includes('join') || lowerText.includes('apply') || lowerText.includes('admit')) {
                response = "Admissions are currently open! You can download the form from our website or visit the office between 9 AM - 2 PM. 📝";
            }
            else if (lowerText.includes('fee')) {
                response = "Our fees range from <strong>₹20k - ₹40k</strong> depending on the class. Please contact the office for the exact structure. 💰";
            }
            else if (lowerText.includes('contact') || lowerText.includes('phone') || lowerText.includes('email') || lowerText.includes('reach') || lowerText.includes('call') || lowerText.includes('number')) {
                response = "You can reach us at <a href='tel:+918277452777'>+91 8277452777</a> or email us at <a href='mailto:blossomkids.chikmagalur@gmail.com'>blossomkids.chikmagalur@gmail.com</a>";
            }
            else if (lowerText.includes('timing') || lowerText.includes('hours') || lowerText.includes('open') || lowerText.includes('close') || lowerText.includes('time') || lowerText.includes('timings')) {
                response = "Our school timings are from 9:30 AM to 3:30 PM, Monday to Friday. 🕗";
            }
            else if (lowerText.includes('holiday') || lowerText.includes('vacation') || lowerText.includes('break') || lowerText.includes('off')) {
                response = "Our school holidays are on the 1st and 3rd Saturdays of each month, as well as all major public holidays. 🎉";
            }
            else if (lowerText.includes('curriculum') || lowerText.includes('syllabus') || lowerText.includes('program') || lowerText.includes('course')) {
                response = "We focus on holistic development and critical thinking. 📚";
            }
            else if (lowerText.includes('activities') || lowerText.includes('extracurricular') || lowerText.includes('sports') || lowerText.includes('clubs')) {
                response = "We offer a variety of extracurricular activities including art, music, dance, and sports. 🏀🎨🎶";
            }
            else if (lowerText.includes('safety') || lowerText.includes('security') || lowerText.includes('health') || lowerText.includes('wellbeing')) {
                response = "The safety and wellbeing of our students is our top priority. We have strict safety protocols, trained staff, and regular health check-ups. 🛡️";
            }
            else if (lowerText.includes('events') || lowerText.includes('functions') || lowerText.includes('celebrations') || lowerText.includes('fests')) {
                response = "We regularly organize events and celebrations to foster community spirit. Stay tuned to our website and social media for updates! 🎉";
            }
            else if (lowerText.includes('staff') || lowerText.includes('teachers') || lowerText.includes('faculty') || lowerText.includes('principal') || lowerText.includes('director')) {
                response = "Our staff is highly qualified and dedicated to providing the best education and care for our students. 👩‍🏫👨‍🏫";
            }
            else if (lowerText.includes('feedback') || lowerText.includes('complaint') || lowerText.includes('suggestion') || lowerText.includes('review')) {
                response = "We value your feedback! Please contact our office or email us at <a href='mailto:blossomkids.chikmagalur@gmail.com'>blossomkids.chikmagalur@gmail.com</a>";
            }
            else if (lowerText.includes('location') || lowerText.includes('address') || lowerText.includes('where')) {
                response = "We are located at <strong>Pension Mohalla, 3rd Cross, Chikmagalur, Karnataka, India</strong>. You can find us on Google Maps for directions! 📍";
            }
            else if (lowerText.includes('daycare') || lowerText.includes('playgroup') || lowerText.includes('nursery') || lowerText.includes('preschool')) {
                response = "We offer daycare and preschool programs for children aged 1.5 to 5 years. Our curriculum focuses on play-based learning and social development. 🧸";
            }
            else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey') || lowerText.includes('namaste') || lowerText.includes('assa')) {
                response = "Hello! 👋 Welcome to Blossom Kids. How can I help you today?";
            }

            sbSendMessage(response, false);
        }

        sbSendBtn.addEventListener('click', () => sbSendMessage(sbInput.value.trim()));
        sbInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sbSendMessage(sbInput.value.trim()); });

        sbChips.forEach(btn => {
            btn.addEventListener('click', () => {
                const topic = btn.getAttribute('data-ask');
                let messageText = "";
                if (topic === 'admissions') messageText = "Tell me about Admissions";
                if (topic === 'transport') messageText = "Do you have Transport?";
                if (topic === 'fees') messageText = "What are the Fees?";
                sbSendMessage(messageText);
            });
        });
    }

    // =========================================
    // 8. STATS COUNTER ANIMATION
    // =========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateCounters() {
        statNumbers.forEach(num => {
            const target = +num.getAttribute('data-target');
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(counter);
                } else {
                    num.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    const statsSection = document.querySelector('.stats-ribbon');
    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // =========================================
    // 9. TYPING ANIMATION (one-time)
    // =========================================
    const typedTextEl = document.getElementById('typed-text');
    if (typedTextEl) {
        const text = 'Big Dreams!';
        let i = 0;

        function typeOnce() {
            if (i < text.length) {
                typedTextEl.textContent += text.charAt(i);
                i++;
                setTimeout(typeOnce, 100);
            } else {
                // hide cursor after typing is done
                const cursor = document.querySelector('.typing-cursor');
                if (cursor) {
                    setTimeout(() => { cursor.style.opacity = '0'; }, 1000);
                }
            }
        }

        setTimeout(typeOnce, 1200);
    }

    // =========================================
    // 10. FAQ ACCORDION
    // =========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (btn) {
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // close all
                faqItems.forEach(i => i.classList.remove('active'));
                // open clicked (if it wasn't already open)
                if (!isActive) item.classList.add('active');
            });
        }
    });

    // =========================================
    // 11. SCROLL SPY — Active Nav Link
    // =========================================
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    function updateActiveLink() {
        let currentId = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
                currentId = section.id;
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active-link');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // run once on load

    // =========================================
    // 12. SCROLL PROGRESS BAR (Rainbow)
    // =========================================
    const scrollProgressBar = document.getElementById('scroll-progress');
    if (scrollProgressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = scrollPercent + '%';
        });
    }

    // =========================================
    // 13. CURSOR SPARKLE TRAIL
    // =========================================
    const cursorTrail = document.getElementById('cursor-trail');
    if (cursorTrail && window.innerWidth > 768) {
        const sparkleColors = ['#FF6B95', '#4CC9F0', '#FFD93D', '#6BCB77', '#9D4EDD'];
        let sparkleThrottle = 0;

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - sparkleThrottle < 50) return; // throttle to every 50ms
            sparkleThrottle = now;

            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = e.clientX + 'px';
            sparkle.style.top = e.clientY + 'px';
            sparkle.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
            sparkle.style.width = (Math.random() * 6 + 4) + 'px';
            sparkle.style.height = sparkle.style.width;
            cursorTrail.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 800);
        });
    }

    // =========================================
    // 14. 3D TILT EFFECT ON CARDS
    // =========================================
    const tiltCards = document.querySelectorAll('.program-card, .feature-card');
    tiltCards.forEach(card => {
        card.classList.add('tilt-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // =========================================
    // 15. PARALLAX SCROLL ON HERO ELEMENTS
    // =========================================
    const heroCircles = document.querySelectorAll('.hero-circle');
    if (heroCircles.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroCircles.forEach((circle, i) => {
                const speed = (i + 1) * 0.15;
                circle.style.transform = `translate(${scrollY * speed * 0.3}px, ${scrollY * speed}px) scale(${1 + scrollY * 0.0003})`;
            });
        });
    }

    // =========================================
    // 16. GALLERY LIGHTBOX
    // =========================================
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let currentLbIndex = 0;
    const galleryImages = [];

    galleryItems.forEach((img, index) => {
        galleryImages.push({ src: img.src, alt: img.alt });

        img.parentElement.addEventListener('click', () => {
            currentLbIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        if (!lightbox || galleryImages.length === 0) return;
        lbImg.src = galleryImages[currentLbIndex].src;
        lbCaption.textContent = galleryImages[currentLbIndex].alt;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (lightbox) {
        document.querySelector('.lb-close').addEventListener('click', closeLightbox);
        document.querySelector('.lb-prev').addEventListener('click', () => {
            currentLbIndex = (currentLbIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox();
        });
        document.querySelector('.lb-next').addEventListener('click', () => {
            currentLbIndex = (currentLbIndex + 1) % galleryImages.length;
            openLightbox();
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') {
                currentLbIndex = (currentLbIndex - 1 + galleryImages.length) % galleryImages.length;
                openLightbox();
            }
            if (e.key === 'ArrowRight') {
                currentLbIndex = (currentLbIndex + 1) % galleryImages.length;
                openLightbox();
            }
        });
    }

    // =========================================
    // 17. CONFETTI BURST ON FORM SUBMIT
    // =========================================
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (confettiCanvas) {
        const ctx = confettiCanvas.getContext('2d');

        function resizeConfettiCanvas() {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
        resizeConfettiCanvas();
        window.addEventListener('resize', resizeConfettiCanvas);

        function launchConfetti() {
            const confetti = [];
            const colors = ['#FF6B95', '#4CC9F0', '#FFD93D', '#6BCB77', '#9D4EDD', '#FF8FAB', '#7DD3FC'];
            const count = 150;

            for (let i = 0; i < count; i++) {
                confetti.push({
                    x: Math.random() * confettiCanvas.width,
                    y: -10 - Math.random() * 100,
                    w: Math.random() * 8 + 4,
                    h: Math.random() * 6 + 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    vx: (Math.random() - 0.5) * 6,
                    vy: Math.random() * 4 + 2,
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 10,
                    opacity: 1,
                });
            }

            let startTime = Date.now();

            function animate() {
                const elapsed = Date.now() - startTime;
                ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

                let allDone = true;
                confetti.forEach(c => {
                    if (c.opacity <= 0) return;
                    allDone = false;
                    c.x += c.vx;
                    c.y += c.vy;
                    c.vy += 0.05;
                    c.rotation += c.rotationSpeed;
                    if (elapsed > 2000) c.opacity -= 0.02;

                    ctx.save();
                    ctx.translate(c.x, c.y);
                    ctx.rotate((c.rotation * Math.PI) / 180);
                    ctx.globalAlpha = Math.max(0, c.opacity);
                    ctx.fillStyle = c.color;
                    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
                    ctx.restore();
                });

                if (!allDone) requestAnimationFrame(animate);
                else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }

            animate();
        }

        // Hook into existing form submit success
        const originalShowMessage = window.showMessage;
        const contactFormEl = document.getElementById('contactForm');
        if (contactFormEl) {
            const origSubmit = contactFormEl.onsubmit;
            // We'll patch the fetch success to launch confetti
            const origFetch = window.fetch;
            window.fetch = function (...args) {
                return origFetch.apply(this, args).then(response => {
                    // Clone response for checking
                    const clone = response.clone();
                    if (args[0] && args[0].toString().includes('web3forms')) {
                        clone.json().then(data => {
                            if (data.success) {
                                setTimeout(launchConfetti, 100);
                            }
                        }).catch(() => { });
                    }
                    return response;
                });
            };
        }

        // Also make it available globally for testing
        window.launchConfetti = launchConfetti;
    }

    // =========================================
    // 18. LOGO SPIN ON SCROLL TO TOP
    // =========================================
    const navLogoImg = document.querySelector('.nav-logo-img');
    let wasScrolled = false;
    if (navLogoImg) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                wasScrolled = true;
            }
            if (window.scrollY < 10 && wasScrolled) {
                wasScrolled = false;
                navLogoImg.classList.add('spin-home');
                setTimeout(() => navLogoImg.classList.remove('spin-home'), 600);
            }
        });
    }

    // =========================================
    // 19. MILESTONE ICON PULSE ON SCROLL
    // =========================================
    const milestoneItems = document.querySelectorAll('.milestone-item');
    if (milestoneItems.length > 0) {
        const milestoneObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelector('.mi-icon').style.animation = 'miPulse 0.6s ease';
                }
            });
        }, { threshold: 0.5 });
        milestoneItems.forEach(item => milestoneObserver.observe(item));
    }

    // =========================================
    // 20. DARK MODE TOGGLE
    // =========================================
    const darkToggle = document.getElementById('darkToggle');
    const savedTheme = localStorage.getItem('bk-theme');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            document.body.classList.add('theme-transition');
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('bk-theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('bk-theme', 'dark');
            }

            setTimeout(() => document.body.classList.remove('theme-transition'), 500);
        });
    }


    // (Animated counters already handled in Section 8 above)

    // =========================================
    // 22. HERO EMOJI FLOAT ON HOVER
    // =========================================
    const heroEmojiZone = document.getElementById('heroEmojiZone');
    const heroSection = document.querySelector('.hero');
    const heroEmojis = ['🌸', '🎨', '🎵', '⭐', '🦋', '🌈', '📚', '✏️', '🎪', '🏆'];
    let emojiThrottle = 0;

    if (heroSection && heroEmojiZone && window.innerWidth > 768) {
        heroSection.style.position = 'relative';

        heroSection.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - emojiThrottle < 300) return;
            emojiThrottle = now;

            const emoji = document.createElement('span');
            emoji.className = 'hero-emoji';
            emoji.textContent = heroEmojis[Math.floor(Math.random() * heroEmojis.length)];
            const rect = heroSection.getBoundingClientRect();
            emoji.style.left = (e.clientX - rect.left) + 'px';
            emoji.style.top = (e.clientY - rect.top) + 'px';
            heroEmojiZone.appendChild(emoji);

            setTimeout(() => emoji.remove(), 2500);
        });
    }

    // =========================================
    // 23. GALLERY IMAGE BLUR-LOAD
    // =========================================
    const galleryImgs = document.querySelectorAll('.gallery-item img');
    galleryImgs.forEach(img => {
        img.classList.add('lazy-blur');
        if (img.complete) {
            img.classList.remove('lazy-blur');
        } else {
            img.addEventListener('load', () => {
                img.classList.remove('lazy-blur');
            });
        }
    });

    // =========================================
    // 24. STICKY MOBILE CTA BAR
    // =========================================
    const mobileCta = document.getElementById('mobileCta');
    if (mobileCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                mobileCta.classList.add('visible');
            } else {
                mobileCta.classList.remove('visible');
            }
        });
    }

    // =========================================
    // 25. REVIEW CARDS AUTO-HIGHLIGHT
    // =========================================
    const reviewCards = document.querySelectorAll('.review-card');
    if (reviewCards.length > 1) {
        let currentReview = 0;
        setInterval(() => {
            reviewCards.forEach(card => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
            currentReview = (currentReview + 1) % reviewCards.length;
            reviewCards[currentReview].style.transform = 'scale(1.02)';
            reviewCards[currentReview].style.boxShadow = '0 12px 40px rgba(255,107,149,0.15)';
        }, 4000);
    }

    // =========================================
    // 26. KANNADA & ENGLISH TRANSLATION SYSTEM
    // =========================================
    const translations = {
        kn: {
            logo_blossom: "ಬ್ಲಾಸಮ್",
            logo_kids: "ಕಿಡ್ಸ್",
            nav_home: "ಮುಖಪುಟ",
            nav_programs: "ಕಾರ್ಯಕ್ರಮಗಳು",
            nav_daily: "ದಿನಚರಿ",
            nav_admissions: "ಪ್ರವೇಶಾತಿಗೆ",
            nav_gallery: "ಚಿತ್ರಶಾಲೆ",
            nav_cta: "ದಾಖಲಿಸಿ",
            hero_badge: "✦ ಪ್ರವೇಶಾತಿ ಪ್ರಸ್ತುತ ತೆರೆದಿದೆ · 2026-27 · ಚಿಕ್ಕಮಗಳೂರಿನ ನಂ.1 ಪ್ರಿಸ್ಕೂಲ್",
            hero_title: "ಚಿಕ್ಕ ಮಕ್ಕಳ ಮನಸ್ಸು <br><span class='lp-gradient-text'>ಖುಷಿಯಿಂದ ಅರಳಲಿ</span>",
            hero_desc: "ಮಕ್ಕಳು ಆಟವಾಡುತ್ತಾ ಕಲಿಯುವ, ಕಾಳಜಿವಹಿಸುವ ಶಿಕ್ಷಕರು ಮತ್ತು ಪೋಷಕರು ಮೆಚ್ಚುವ ಸುಂದರ ಪರಿಸರ ಹೊಂದಿರುವ ಪ್ರಿಸ್ಕೂಲ್.",
            btn_enroll: "ದಾಖಲಾತಿ ಪಡೆಯಿರಿ",
            btn_explore: "ನಮ್ಮ ಕಾರ್ಯಕ್ರಮಗಳು",
            curr_tag: "ನಮ್ಮ ಪಠ್ಯಕ್ರಮ",
            curr_title: "ಚಿಕ್ಕ ಹೆಜ್ಜೆಯಿಂದ <br><span class='gradient-text'>ದೊಡ್ಡ ಜಿಗಿತ</span>",
            curr_desc: "ಮಕ್ಕಳ ಆಸಕ್ತಿ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸವನ್ನು ಹೆಚ್ಚಿಸಲು ವಯಸ್ಸಿಗೆ ತಕ್ಕಂತೆ ರೂಪಿಸಲಾದ ಕಾರ್ಯಕ್ರಮಗಳು.",
            pre_nursery: "ಪ್ರಿ-ನರ್ಸರಿ",
            pre_nursery_desc: "ಸಂವೇದನಾ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಸಾಮಾಜಿಕ ಸಂವಹನದ ಮೂಲಕ ಆಟವಾಡಿ ಮತ್ತು ಅನ್ವೇಷಿಸಿ.",
            nursery: "ನರ್ಸರಿ",
            nursery_desc: "ಕಲೆ, ಸಂಗೀತ ಮತ್ತು ಕಥೆ ಹೇಳುವಿಕೆಯೊಂದಿಗೆ ಸೃಜಿಸಿ ಮತ್ತು ಕಲ್ಪಿಸಿಕೊಳ್ಳಿ.",
            lkg: "ಎಲ್‌ಕೆಜಿ",
            lkg_desc: "ರಚನಾತ್ಮಕ ಕಲಿಕೆಯ ಪರಿಕಲ್ಪನೆಗಳು ಮತ್ತು ಅಂಕಿಗಳೊಂದಿಗೆ ಕಲಿಯಿರಿ ಮತ್ತು ಬೆಳೆಯಿರಿ.",
            ukg: "ಯುಕೆಜಿ",
            ukg_desc: "ಶಾಲೆಗೆ ಸಿದ್ಧರಾಗಿ! ಓದುವಿಕೆ ಮತ್ತು ಬರವಣಿಗೆಯಲ್ಲಿ ಮುಂದುವರಿದ ಕೌಶಲ್ಯಗಳು.",
            learn_more: "ಹೆಚ್ಚು ತಿಳಿಯಿರಿ",
            why_tag: "ನಮ್ಮನ್ನು ಯಾಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು",
            why_title: "ಮಕ್ಕಳು ನಮ್ಮನ್ನು <span class='text-yellow'>ಯಾಕೆ ಪ್ರೀತಿಸುತ್ತಾರೆ</span>",
            feature_creative: "ಸೃಜನಶೀಲ ಆಟಗಳು",
            feature_creative_desc: "ಬಣ್ಣ ಹಚ್ಚುವುದು ಮತ್ತು ಹೊಸ ಕರಕುಶಲ ಕಲೆಗಳು ಮಕ್ಕಳ ಬುದ್ಧಿಶಕ್ತಿಯನ್ನು ಬೆಳೆಸುತ್ತವೆ.",
            feature_safe: "ಸುರಕ್ಷಿತ ವಾತಾವರಣ",
            feature_safe_desc: "ಸಿಸಿಟಿವಿ ಕಣ್ಗಾವಲು ಮತ್ತು ಮಕ್ಕಳ ಸುರಕ್ಷತೆಯ ಸೌಲಭ್ಯಗಳು.",
            feature_friends: "ಸ್ನೇಹ ಮನೋಭಾವ",
            feature_friends_desc: "ನಾವು ಪ್ರತಿದಿನ ಹಂಚಿಕೊಳ್ಳುವುದನ್ನು, ಪ್ರೀತಿ ತೋರಿಸುವುದನ್ನು ಕಲಿಸುತ್ತೇವೆ.",
            feature_teachers: "ಕಾಳಜಿಯುಳ್ಳ ಶಿಕ್ಷಕರು",
            feature_teachers_desc: "ಮಕ್ಕಳನ್ನು ಪ್ರೀತಿ ಮತ್ತು ತಾಳ್ಮೆಯಿಂದ ನಡೆಸಿಕೊಳ್ಳುವ ಶಿಕ್ಷಕರು.",
            timeline_tag: "ಪ್ರತಿದಿನದ ದಿನಚರಿ",
            timeline_title: "ದಿನದ <span class='gradient-text'>ಚಟುವಟಿಕೆಗಳು</span>",
            timeline_1: "ಪ್ರಾರ್ಥನೆ ಮತ್ತು ಸಭೆ",
            timeline_1_desc: "ಕೃತಜ್ಞತೆ ಮತ್ತು ಧನಾತ್ಮಕ ಶಕ್ತಿಯೊಂದಿಗೆ ದಿನವನ್ನು ಪ್ರಾರಂಭಿಸುವುದು.",
            timeline_2: "ಕಲಿಕೆಯ ಸಮಯ",
            timeline_2_desc: "ಅಕ್ಷರಗಳು, ಅಂಕಿಗಳು ಮತ್ತು ಹೊಸ ವಿಷಯಗಳು.",
            timeline_3: "ಹಾಡು ಮತ್ತು ಸಂಗೀತ",
            timeline_3_desc: "ಸಂಗೀತ ಮತ್ತು ತಾಳಕ್ಕೆ ತಕ್ಕಂತೆ ನೃತ್ಯ!",
            timeline_4: "ಸೃಜನಶೀಲ ಆಟ",
            timeline_4_desc: "ಚಿತ್ರಕಲೆ, ಕರಕುಶಲ ಮತ್ತು ಮುಕ್ತ ಆಟದ ಸಮಯ.",
            timeline_5: "ಮನೆಗೆ ಹೋಗುವ ಸಮಯ",
            timeline_5_desc: "ವಿದಾಯದ ಹಾಡುಗಳು ಮತ್ತು ಸುರಕ್ಷಿತ ಪಿಕ್ಅಪ್.",
            admissions_tag: "ದಾಖಲಾತಿ ಪ್ರಕ್ರಿಯೆ",
            admissions_title: "ನಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಸೇರಿ!",
            admissions_desc: "ದಾಖಲಾತಿಯನ್ನು ನಾವು ಸರಳ ಮತ್ತು ಸುಲಭವಾಗಿಸುತ್ತೇವೆ.",
            step_1: "ಭೇಟಿ ನೀಡಿ",
            step_1_desc: "ನಮ್ಮ ಶಾಲೆಗೆ ಭೇಟಿ ನೀಡಿ ನೋಡಿ.",
            step_2: "ಶಿಕ್ಷಕರನ್ನು ಭೇಟಿ ಮಾಡಿ",
            step_2_desc: "ನಮ್ಮ ಸಿಬ್ಬಂದಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ.",
            step_3: "ಸೇರ್ಪಡೆಗೊಳ್ಳಿ",
            step_3_desc: "ಸರಳ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪ್ರವೇಶ ಪಡೆಯಿರಿ.",
            docs_title: "ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು",
            doc_1: "ಜನನ ಪ್ರಮಾಣಪತ್ರ",
            doc_2: "4 ಪಾಸ್‌ಪೋರ್ಟ್ ಫೋಟೋಗಳು",
            doc_3: "ಪೋಷಕರ ಗುರುತಿನ ಚೀಟಿ",
            fee_title: "ಶುಲ್ಕದ ವಿವರ",
            fee_desc: "ಸಹೋದರ ಸಹೋದರಿಯರಿಗೆ ರಿಯಾಯಿತಿಯೊಂದಿಗೆ ಕೈಗೆಟುಕುವ ಶುಲ್ಕ.",
            fee_amount: "₹೨೦ಸಾವಿರ - ₹೪೦ಸಾವಿರ <span>/ವರ್ಷಕ್ಕೆ</span>",
            btn_details: "ಪೂರ್ಣ ವಿವರ ಪಡೆಯಿರಿ",
            gallery_tag: "ಚಿತ್ರಶಾಲೆ",
            gallery_title: "ಖುಷಿಯ <span class='gradient-text'>ಕ್ಷಣಗಳು</span>",
            gallery_building: "ಕನಸುಗಳ ಕಟ್ಟಡ",
            gallery_classroom: "ತರಗತಿಯ ಮೋಜು",
            gallery_artists: "ಚಿಕ್ಕ ಕಲಾವಿದರು",
            gallery_play: "ಹೊರಾಂಗಣ ಆಟ",
            milestones_tag: "ಮಕ್ಕಳ ಪ್ರಗತಿ",
            milestones_title: "ಮಕ್ಕಳ <span class='gradient-text'>ಕಲಿಕೆಯ ನಕ್ಷೆ</span>",
            milestones_desc: "ನಮ್ಮ ಕಲಿಕೆಯ ಹಂತಗಳ ಮೂಲಕ ನಿಮ್ಮ ಮಗು ಬೆಳೆಯುವುದನ್ನು ನೋಡಿ.",
            milestones_1: "ಮೊದಲ ಭದ್ರತೆ",
            milestones_1_desc: "ಪ್ರೀತಿಯ ವಾತಾವರಣದಲ್ಲಿ ನಂಬಿಕೆ ಬೆಳೆಸುವುದು",
            milestones_2: "ಆಟ ಮತ್ತು ಶೋಧನೆ",
            milestones_2_desc: "ಬಣ್ಣಗಳು, ಆಕಾರಗಳು ಮತ್ತು ಕಲಿಕೆಯ ಆನಂದ",
            milestones_3: "ಅಕ್ಷರ ಮತ್ತು ಅಂಕಿಗಳು",
            milestones_3_desc: "ಅಕ್ಷರಮಾಲೆ, ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಆರಂಭಿಕ ಓದುವಿಕೆ",
            milestones_4: "ಸೃಜನಶೀಲ ಸ್ಫೂರ್ತಿ",
            milestones_4_desc: "ಚಿತ್ರಕಲೆ, ನೃತ್ಯ ಮತ್ತು ಸಂಗೀತದ ಮೂಲಕ ಕಲ್ಪನೆ",
            milestones_5: "ಹಾರಲು ಸಿದ್ಧ!",
            milestones_5_desc: "ಶಾಲೆಗೆ ಹೋಗಲು ಸಂಪೂರ್ಣ ಸಿದ್ಧತೆ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸ",
            faq_tag: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
            faq_title: "ಸಾಮಾನ್ಯ <span class='gradient-text'>ಪ್ರಶ್ನೆಗಳು</span>",
            faq_desc: "ದಾಖಲಾತಿ ಮಾಡುವ ಮುನ್ನ ಪೋಷಕರು ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು.",
            faq_q1: "ಪ್ರವೇಶಾತಿಗೆ ವಯಸ್ಸಿನ ಅರ್ಹತೆ ಏನು?",
            faq_a1: "ನಾವು 1.5 ವರ್ಷದಿಂದ 6 ವರ್ಷದವರೆಗಿನ ಮಕ್ಕಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೇವೆ. ಪ್ರಿ-ನರ್ಸರಿ 2 ವರ್ಷಕ್ಕೆ, ನರ್ಸರಿ 3ಕ್ಕೆ, ಎಲ್‌ಕೆಜಿ 4ಕ್ಕೆ ಮತ್ತು ಯುಕೆಜಿ 5 ವರ್ಷಕ್ಕೆ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.",
            faq_q2: "ಶಾಲೆಯ ಸಮಯ ಯಾವುದು?",
            faq_a2: "ನಮ್ಮ ಶಾಲೆಯು ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗೆ ಬೆಳಿಗ್ಗೆ 9:30 ರಿಂದ ಮಧ್ಯಾಹ್ನ 3:30 ರವರೆಗೆ ನಡೆಯುತ್ತದೆ. ಸಾರ್ವಜನಿಕ ರಜಾದಿನಗಳೊಂದಿಗೆ ನಾವು ಪ್ರಮಾಣಿತ ಶೈಕ್ಷಣಿಕ ಕ್ಯಾಲೆಂಡರ್ ಅನ್ನು ಅನುಸರಿಸುತ್ತೇವೆ.",
            faq_q3: "ನೀವು ಸಾರಿಗೆ ಸೌಲಭ್ಯವನ್ನು ಒದಗಿಸುತ್ತೀರಾ?",
            faq_a3: "ಪ್ರಸ್ತುತ, ನಾವು ಸಾರಿಗೆ ಸೌಲಭ್ಯಗಳನ್ನು ಒದಗಿಸುತ್ತಿಲ್ಲ. ಪೋಷಕರು ತಮ್ಮದೇ ಆದ ಸ್ವಂತ ವಾಹನ ಸೌಲಭ್ಯವನ್ನು ವ್ಯವಸ್ಥೆಗೊಳಿಸಲು ವಿನಂತಿಸಲಾಗಿದೆ.",
            faq_q4: "ನೀವು ಯಾವ ಪಠ್ಯಕ್ರಮವನ್ನು ಅನುಸರಿಸುತ್ತೀರಿ?",
            faq_a4: "ನಾವು ಮಾಂಟೆಸ್ಸರಿ ಮತ್ತು ಚಟುವಟಿಕೆ ಆಧಾರಿತ ಪಠ್ಯಕ್ರಮದ ಸಂಯೋಜನೆಯೊಂದಿಗೆ ಆಟದ ಆಧಾರಿತ ಕಲಿಕೆಯನ್ನು ಅನುಸರಿಸುತ್ತೇವೆ. ಸಾಕ್ಷರತೆ, ಸಂಖ್ಯಾಶಾಸ್ತ್ರ, ಕಲೆ, ಸಂಗೀತ ಮತ್ತು ಸಾಮಾಜಿಕ ಕೌಶಲ್ಯಗಳು ನಮ್ಮ ಮುಖ್ಯ ಗಮನ.",
            faq_q5: "ಸಿಸಿಟಿವಿ ಕಣ್ಗಾವಲು ಇದೆಯೇ?",
            faq_a5: "ಹೌದು! ನಮ್ಮ ಇಡೀ ಆವರಣವು 24/7 ಸಿಸಿಟಿವಿ ಕಣ್ಗಾವಲಿನಲ್ಲಿದೆ. ನಿಮ್ಮ ಮಕ್ಕಳ ಸುರಕ್ಷತೆಯೇ ನಮ್ಮ ಮೊದಲ ಆದ್ಯತೆಯಾಗಿದೆ.",
            faq_q6: "ಶುಲ್ಕದ ವಿವರ ಹೇಗಿದೆ?",
            faq_a6: "ತರಗತಿಯನ್ನು ಆಧರಿಸಿ ನಮ್ಮ ಶುಲ್ಕ ವರ್ಷಕ್ಕೆ ₹೨೦,೦೦೦ ರಿಂದ ₹೪೦,೦೦೦ ವರೆಗೆ ಇರುತ್ತದೆ. ನಾವು ಸಹೋದರ ಸಹೋದರಿಯರಿಗೆ ರಿಯಾಯಿತಿಗಳನ್ನು ನೀಡುತ್ತೇವೆ. ನಿಖರವಾದ ಶುಲ್ಕದ ವಿವರಗಳಿಗಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.",
            contact_tag: "ಸಂಪರ್ಕಿಸಿ",
            contact_title: "ಮಾತನಾಡಿ!",
            contact_desc: "ನಿಮ್ಮನ್ನು ಮತ್ತು ನಿಮ್ಮ ಮಗುವನ್ನು ಭೇಟಿ ಮಾಡಲು ನಾವು ಕಾಯುತ್ತಿದ್ದೇವೆ.",
            visit_title: "ಭೇಟಿ ನೀಡಿ",
            call_title: "ಕರೆ ಮಾಡಿ",
            hours_title: "ಶಾಲೆಯ ಸಮಯ",
            hours_value: "ಸೋಮವಾರ - ಶನಿವಾರ: ೯:೩೦ AM - ೩:೩೦ PM",
            hours_address: "ಪೆನ್ಶನ್ ಮೊಹಲ್ಲಾ, ೩ನೇ ಕ್ರಾಸ್, ಚಿಕ್ಕಮಗಳೂರು",
            form_parent_name: "ಪೋಷಕರ ಹೆಸರು",
            form_phone: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
            form_child_name: "ಮಗುವಿನ ಹೆಸರು",
            form_child_age: "ಮಗುವಿನ ವಯಸ್ಸು",
            form_email: "ಇಮೇಲ್ (ಐಚ್ಛಿಕ)",
            form_message: "ಸಂದೇಶ",
            form_visit_date: "ಭೇಟಿ ನೀಡುವ ದಿನಾಂಕ",
            form_visit_time: "ಭೇಟಿ ನೀಡುವ ಸಮಯ",
            btn_send: "ಸಂದೇಶ ಕಳುಹಿಸಿ",
            chatbot_need_help: "ಸಹಾಯ ಬೇಕೇ?",
            chatbot_assistant: "ಶಾಲೆಯ ಸಹಾಯಕ",
            chatbot_online: "ಆನ್‌ಲೈನ್",
            chatbot_placeholder: "ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
            chatbot_welcome: "ನಮಸ್ತೆ! ಬ್ಲಾಸಮ್ ಕಿಡ್ಸ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
            chatbot_chip_transport: "ಸಾರಿಗೆ",
            parent_name_placeholder: "ಅಮ್ಮ ಅಥವಾ ಅಪ್ಪನ ಹೆಸರು",
            phone_placeholder: "೧೦ ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
            child_name_placeholder: "ಮಗುವಿನ ಹೆಸರು",
            child_age_select: "ವಯಸ್ಸನ್ನು ಆಯ್ಕೆಮಾಡಿ",
            message_placeholder: "ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
            time_select_placeholder: "ಸಮಯವನ್ನು ಆರಿಸಿ",
            email_placeholder: "ನಿಮ್ಮ@ಇಮೇಲ್.ಕಾಮ್",
            footer_tagline: "೨೦೨೧ ರಿಂದ ಚಿಕ್ಕಮಗಳೂರಿನಲ್ಲಿ ಎಳೆಯ ಮನಸ್ಸುಗಳನ್ನು ಸಂತೋಷದಿಂದ ಪೋಷಿಸುತ್ತಿದ್ದೇವೆ.",
            footer_quick_links: "ತ್ವರಿತ ಕೊಂಡಿಗಳು",
            footer_contact_info: "ಸಂಪರ್ಕ ಮಾಹಿತಿ",
            footer_copyright: "&copy; ೨೦೨೬ ಬ್ಲಾಸಮ್ ಕಿಡ್ಸ್ ಪ್ರಿಸ್ಕೂಲ್. ಚಿಕ್ಕಮಗಳೂರಿನಲ್ಲಿ <svg class='footer-heart' width='12' height='12' viewBox='0 0 24 24' fill='currentColor' stroke='none'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg> ನೊಂದಿಗೆ ತಯಾರಿಸಲಾಗಿದೆ.",
            err_name_length: "ಹೆಸರು ಕನಿಷ್ಠ 3 ಅಕ್ಷರಗಳಿರಬೇಕು.",
            err_phone_invalid: "ದಯವಿಟ್ಟು 10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
            err_date_sunday: "ಭಾನುವಾರ ಭೇಟಿ ಮಾಡಲು ಅವಕಾಶವಿರುವುದಿಲ್ಲ.",
            err_date_invalid: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
            err_message_empty: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ.",
            status_correct_errors: "ದಯವಿಟ್ಟು ಹೈಲೈಟ್ ಮಾಡಲಾದ ದೋಷಗಳನ್ನು ಸರಿಪಡಿಸಿ.",
            status_sending: "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ... ದಯವಿಟ್ಟು ಕಾಯಿರಿ.",
            status_success: "ಧನ್ಯವಾದಗಳು! ಶೀಘ್ರದಲ್ಲೇ ಕರೆ ಮಾಡುತ್ತೇವೆ!",
            stat_years: "ವರ್ಷಗಳ ನಂಬಿಕೆ",
            stat_students: "ಸಂತೋಷದ ವಿದ್ಯಾರ್ಥಿಗಳು",
            stat_teachers: "ಅನುಭವಿ ಶಿಕ್ಷಕರು",
            stat_events: "ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಚಟುವಟಿಕೆಗಳು",
            review_parent_1: "ನನ್ನ ಮಗಳು ಪ್ರತಿ ಬೆಳಿಗ್ಗೆ ಬ್ಲಾಸಮ್ ಕಿಡ್ಸ್‌ಗೆ ಹೋಗಲು ತುಂಬಾ ಇಷ್ಟಪಡುತ್ತಾಳೆ. ಶಿಕ್ಷಕರು ತಾಳ್ಮೆ ಮತ್ತು ಕಾಳಜಿ ಇರುವವರು. ಅವಳ ಸಂವಹನ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸ ತುಂಬಾ ಸುಧಾರಿಸಿದೆ.",
            review_parent_2: "ಚಿಕ್ಕಮಗಳೂರಿನ ಅತ್ಯುತ್ತಮ ಪ್ರಿಸ್ಕೂಲ್! ಸ್ವಚ್ಛ ವಾತಾವರಣ, ಸಿಸಿಟಿವಿ ಕಣ್ಗಾವಲು, ಮತ್ತು ಅದ್ಭುತ ಚಟುವಟಿಕೆಗಳು. ನನ್ನ ಮಗ ಮೊದಲ ತಿಂಗಳಲ್ಲೇ ತನ್ನ ಹೆಸರು ಬರೆಯಲು ಕಲಿತನು.",
            review_parent_3: "ನಾವು ಚಿಕ್ಕಮಗಳೂರಿಗೆ ಬಂದೆವು ಮತ್ತು ಬ್ಲಾಸಮ್ ಕಿಡ್ಸ್ ಸಿಕ್ಕಿದ್ದು ನಮಗೆ ವರದಾನ. ಮಾಂಟೆಸ್ಸರಿ ಮತ್ತು ಆಟದ ಆಧಾರಿತ ಕಲಿಕೆಯ ಸಂಯೋಜನೆ ಅತ್ಯಂತ ಪರಿಪೂರ್ಣ.",
            review_parent_label: "ಪೋಷಕ · ಎಲ್‌ಕೆಜಿ",
            review_parent_label_2: "ಪೋಷಕ · ನರ್ಸರಿ",
            review_parent_label_3: "ಪೋಷಕ · ಯುಕೆಜಿ"
        },
        en: {
            logo_blossom: "Blossom",
            logo_kids: "Kids",
            nav_home: "Home",
            nav_programs: "Programs",
            nav_daily: "Daily Life",
            nav_admissions: "Admissions",
            nav_gallery: "Gallery",
            nav_cta: "Enroll Now",
            hero_badge: "✦ Admissions Open &middot; 2026&ndash;27 &middot; Chikmagalur&rsquo;s #1 Preschool",
            hero_title: "Where Little Minds<br><span class='lp-gradient-text'>Blossom &amp; Shine</span>",
            hero_desc: "A nurturing preschool where every child explores, creates, and grows &mdash; through play-based learning, expert teachers, and a warm family environment.",
            btn_enroll: "Enroll Your Child",
            btn_explore: "Explore Programs",
            curr_tag: "Our Curriculum",
            curr_title: "Tiny Steps to <span class='gradient-text'>Big Leaps</span>",
            curr_desc: "Age-appropriate programs designed to nurture curiosity and confidence.",
            pre_nursery: "Pre-Nursery",
            pre_nursery_desc: "Play & Discover through sensory activities and social interaction.",
            nursery: "Nursery",
            nursery_desc: "Create & Imagine with arts, music, and storytelling.",
            lkg: "LKG",
            lkg_desc: "Learn & Grow with structured learning concepts and numbers.",
            ukg: "UKG",
            ukg_desc: "Ready for School! Advanced skills in reading and writing.",
            learn_more: "Learn More",
            why_tag: "Why Choose Us",
            why_title: "Why Kids <span class='text-yellow'>Love Us</span>",
            feature_creative: "Creative Chaos",
            feature_creative_desc: "We believe in getting messy! Painting and crafting helps little brains grow.",
            feature_safe: "Safe Haven",
            feature_safe_desc: "CCTV monitored with childproof facilities. Safe and secure.",
            feature_friends: "Best Friends",
            feature_friends_desc: "We teach kindness, sharing, and teamwork every single day.",
            feature_teachers: "Caring Teachers",
            feature_teachers_desc: "Trained educators who treat every child with love and patience.",
            timeline_tag: "A Typical Day",
            timeline_title: "A Day in the <span class='gradient-text'>Life</span>",
            timeline_1: "Prayer & Assembly",
            timeline_1_desc: "Starting the day with gratitude and positive energy.",
            timeline_2: "Learning Time",
            timeline_2_desc: "Letters, numbers & fun concepts.",
            timeline_3: "Rhymes & Music",
            timeline_3_desc: "Moving and grooving to the beat!",
            timeline_4: "Creative Play",
            timeline_4_desc: "Art, craft and free play time.",
            timeline_5: "Home Time",
            timeline_5_desc: "Goodbye songs and safe pickup.",
            admissions_tag: "Enrollment",
            admissions_title: "Join Our Family!",
            admissions_desc: "We make enrollment easy and stress-free.",
            step_1: "Visit Us",
            step_1_desc: "Come see our School in Pension Mohalla.",
            step_2: "Meet Teachers",
            step_2_desc: "Chat with our caring staff.",
            step_3: "Join In",
            step_3_desc: "Simple paperwork and you're set!",
            docs_title: "Documents Needed",
            doc_1: "Birth Certificate",
            doc_2: "4 Passport Photos",
            doc_3: "Parent's ID Proof",
            fee_title: "Fee Structure",
            fee_desc: "Transparent, affordable pricing with sibling discounts available.",
            fee_amount: "₹20K - ₹40K <span>/year</span>",
            btn_details: "Get Full Details",
            gallery_tag: "Gallery",
            gallery_title: "Happy <span class='gradient-text'>Moments</span>",
            gallery_building: "Building Dreams",
            gallery_classroom: "Classroom Fun",
            gallery_artists: "Little Artists",
            gallery_play: "Outdoor Play",
            milestones_tag: "Growth Journey",
            milestones_title: "Your Child's <span class='gradient-text'>Adventure Map</span>",
            milestones_desc: "Watch your little one blossom through our carefully crafted learning path.",
            milestones_1: "First Hugs",
            milestones_1_desc: "Building trust & comfort in a safe, loving space",
            milestones_2: "Play & Discover",
            milestones_2_desc: "Exploring shapes, colors, and the wonder of learning",
            milestones_3: "ABCs & 123s",
            milestones_3_desc: "Mastering letters, numbers, and early reading skills",
            milestones_4: "Creative Spark",
            milestones_4_desc: "Unleashing imagination through art, music & dance",
            milestones_5: "Ready to Fly!",
            milestones_5_desc: "Confident, curious & school-ready for the big world",
            faq_tag: "FAQ",
            faq_title: "Common Questions",
            faq_desc: "Everything parents ask before enrolling.",
            faq_q1: "What is the age criteria for admission?",
            faq_a1: "We accept children from 1.5 years to 6 years of age. Pre-Nursery starts at 2 years, Nursery at 3, LKG at 4, and UKG at 5 years.",
            faq_q2: "What are the school timings?",
            faq_a2: "Our school operates from Monday to Saturday, 9:30 AM to 3:30 PM. We follow a standard academic calendar with public holidays off.",
            faq_q3: "Do you provide transport facilities?",
            faq_a3: "Currently, we do not provide transport services. Parents are requested to arrange their own drop-off and pick-up.",
            faq_q4: "What curriculum do you follow?",
            faq_a4: "We follow a play-based learning approach with a blend of Montessori and activity-based curriculum. Focus areas include literacy, numeracy, arts, music, and social skills.",
            faq_q5: "Is there CCTV surveillance?",
            faq_a5: "Yes! Our entire campus is under 24/7 CCTV monitoring. The safety and security of your children is our top priority.",
            faq_q6: "What is the fee structure?",
            faq_a6: "Our fees range from ₹20,000 to ₹40,000 per year depending on the class. We offer sibling discounts. Contact us for the exact breakdown.",
            contact_tag: "Get in Touch",
            contact_title: "Say Hello!",
            contact_desc: "We can't wait to meet you and your little one.",
            visit_title: "Visit Us",
            call_title: "Call Us",
            hours_title: "School Hours",
            hours_value: "Mon - Sat: 9:30 AM - 3:30 PM",
            hours_address: "Pension Mohalla, 3rd Cross, Chikmagalur",
            form_parent_name: "Parent's Name",
            form_phone: "Phone",
            form_child_name: "Child's Name",
            form_child_age: "Child's Age",
            form_email: "Email (Optional)",
            form_message: "Message",
            form_visit_date: "Schedule a Visit",
            form_visit_time: "Preferred Time",
            btn_send: "Send Message",
            chatbot_need_help: "Need Help?",
            chatbot_assistant: "School Assistant",
            chatbot_online: "Online",
            chatbot_placeholder: "Type a message...",
            chatbot_welcome: "Hello! Welcome to Blossom Kids. How can I help you?",
            chatbot_chip_transport: "Transport",
            parent_name_placeholder: "Mom or Dad's Name",
            phone_placeholder: "10-digit number",
            child_name_placeholder: "Your Child's Name",
            child_age_select: "Select Age",
            message_placeholder: "How can we help you?",
            time_select_placeholder: "Select Time",
            email_placeholder: "your@email.com",
            footer_tagline: "Nurturing Young Minds with Joy in Chikmagalur since 2021.",
            footer_quick_links: "Quick Links",
            footer_contact_info: "Contact Info",
            footer_copyright: "&copy; 2026 Blossom Kids Preschool. Made with <svg class='footer-heart' width='12' height='12' viewBox='0 0 24 24' fill='currentColor' stroke='none'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg> in Chikmagalur.",
            err_name_length: "Name must be at least 3 characters.",
            err_phone_invalid: "Please enter a valid 10-digit mobile number.",
            err_date_sunday: "Visits are not available on Sundays.",
            err_date_invalid: "Please select a valid date.",
            err_message_empty: "Please enter your message.",
            status_correct_errors: "Please correct the highlighted errors.",
            status_sending: "Sending... please wait.",
            status_success: "Thank you! We'll call you soon!",
            stat_years: "Years of Trust",
            stat_students: "Happy Students",
            stat_teachers: "Expert Teachers",
            stat_events: "Events & Activities",
            review_parent_1: "My daughter absolutely loves going to Blossom Kids every morning. The teachers are patient and caring. She has improved so much in her communication and confidence. Highly recommend!",
            review_parent_2: "Best preschool in Chikmagalur! Clean environment, CCTV security, and wonderful activities. My son learned to write his name within the first month. The annual day celebrations are amazing.",
            review_parent_3: "We moved to Chikmagalur and finding Blossom Kids was a blessing. The Montessori approach combined with play-based learning is perfect. The staff treats every child like their own.",
            review_parent_label: "Parent · LKG",
            review_parent_label_2: "Parent · Nursery",
            review_parent_label_3: "Parent · UKG"
        }
    };

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('bk-lang', lang);
        document.documentElement.setAttribute('lang', lang);
        
        // Update toggle button label (target .lang-label span to preserve globe SVG)
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            const langLabel = langToggle.querySelector('.lang-label');
            if (langLabel) langLabel.textContent = lang === 'en' ? 'KN' : 'EN';
            langToggle.title = lang === 'en' ? 'ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ' : 'Switch to English';
        }
        
        // Update DOM elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                const text = translations[lang][key];
                
                // Form fields specific handling
                if (el.tagName === 'INPUT' && el.type !== 'submit' && el.type !== 'button') {
                    el.placeholder = text;
                } else if (el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else if (el.tagName === 'SELECT') {
                    if (el.options[0]) el.options[0].textContent = text;
                } else {
                    el.innerHTML = text;
                }
            }
        });
    }

    // Toggle button handler
    const langToggleBtn = document.getElementById('langToggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'en' ? 'kn' : 'en');
        });
    }

    // Initialize Language
    setLanguage(currentLang);

});

// ==============================================
// THREE.JS — 3D FLOATING PARTICLES BACKGROUND
// ==============================================
(function initThreeJS() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 30;

    // ── PREMIUM AMBIENT PARTICLES ──
    const particleCount = 45; // Reduced count for subtlety
    const particles = [];
    const colors = [0xffffff, 0xffeef2, 0xeef8ff, 0xffd1dc]; // Soft, elegant colors

    for (let i = 0; i < particleCount; i++) {
        // Only use small spheres for a premium "dust" look
        const radius = Math.random() * 0.1 + 0.05;
        const geo = new THREE.SphereGeometry(radius, 16, 16);
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Very subtle opacity
        const mat = new THREE.MeshBasicMaterial({ 
            color, 
            transparent: true, 
            opacity: Math.random() * 0.25 + 0.1 
        });
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.set(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 50
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        // Much slower, gentler movement
        const speed = { 
            x: (Math.random() - 0.5) * 0.0015, 
            y: (Math.random() - 0.5) * 0.001, 
            z: (Math.random() - 0.5) * 0.0005 
        };
        const rotSpeed = { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005, z: 0 };
        const floatAmp = Math.random() * 0.004 + 0.002;
        const floatFreq = Math.random() * 0.3 + 0.1;
        const phase = Math.random() * Math.PI * 2;

        particles.push({ mesh, speed, rotSpeed, floatAmp, floatFreq, phase });
        scene.add(mesh);
    }

    // ── MOUSE PARALLAX ──
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ── RESIZE ──
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // ── ANIMATE ──
    let t = 0;
    function animate() {
        requestAnimationFrame(animate);
        t += 0.01;

        particles.forEach(p => {
            p.mesh.position.x += p.speed.x;
            p.mesh.position.y += p.speed.y + Math.sin(t * p.floatFreq + p.phase) * p.floatAmp;
            p.mesh.position.z += p.speed.z;
            p.mesh.rotation.x += p.rotSpeed.x;
            p.mesh.rotation.y += p.rotSpeed.y;

            // Wrap around
            if (p.mesh.position.x > 42) p.mesh.position.x = -42;
            if (p.mesh.position.x < -42) p.mesh.position.x = 42;
            if (p.mesh.position.y > 32) p.mesh.position.y = -32;
            if (p.mesh.position.y < -32) p.mesh.position.y = 32;
        });

        // Gentle camera parallax from mouse
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();
})();
