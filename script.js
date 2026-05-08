document.addEventListener("DOMContentLoaded", function () {

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
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }
    }

    if (preloader) {
        // Try on window load
        if (document.readyState === 'complete') {
            setTimeout(hidePreloader, 800);
        } else {
            window.addEventListener('load', () => setTimeout(hidePreloader, 800));
        }
        // Guaranteed fallback — max 3s
        setTimeout(hidePreloader, 3000);
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
    // 6. CONTACT FORM
    // =========================================
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const statusMessage = document.getElementById("statusMessage");

    function showMessage(message, type) {
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = type;
            statusMessage.style.display = 'block';
            setTimeout(() => { statusMessage.style.display = 'none'; }, 5000);
        }
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !phone || !message) {
                showMessage("Please fill out all fields.", "error");
                return;
            }

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
                        showMessage("Thank you! We'll call you soon! 🚀", "success");
                        contactForm.reset();
                    } else {
                        showMessage("Something went wrong. Try again.", "error");
                    }
                })
                .catch(() => {
                    showMessage("Network error. Please check your connection.", "error");
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Send Message 🚀";
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
    const darkIcon = document.getElementById('darkIcon');
    const savedTheme = localStorage.getItem('bk-theme');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (darkIcon) { darkIcon.className = 'fa-solid fa-sun'; }
    }

    if (darkToggle && darkIcon) {
        darkToggle.addEventListener('click', () => {
            document.body.classList.add('theme-transition');
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                darkIcon.className = 'fa-solid fa-moon';
                localStorage.setItem('bk-theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                darkIcon.className = 'fa-solid fa-sun';
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
