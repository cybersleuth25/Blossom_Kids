document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // 1. PRELOADER
    // =========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function () {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });

        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                preloader.style.opacity = '0';
                setTimeout(() => { preloader.style.display = 'none'; }, 500);
            }
        }, 5000);
    }

    // =========================================
    // 2. NAVBAR SCROLL EFFECT (Expanding)
    // =========================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        // When user scrolls down more than 50px
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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
    // 4. HAMBURGER MENU
    // =========================================
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            const isExpanded = hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            hamburger.setAttribute("aria-expanded", isExpanded);
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
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
        if (n >= totalSlides) slideIndex = 0;
        else if (n < 0) slideIndex = totalSlides - 1;
        else slideIndex = n;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

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
                response = "You can reach us at <a href='tel:+91 827745277'>+91 827745277</a> or email us at <a href='mailto:blossomkids.chikmagalur@gmail.com'>blossomkids.chikmagalur@gmail.com</a>";
            }
            else if (lowerText.includes('timing') || lowerText.includes('hours') || lowerText.includes('open') || lowerText.includes('close') || lowerText.includes('time') || lowerText.includes('timings')) {
                response = "Our school timings are from 9:30 AM to 3:30 PM, Monday to Friday. 🕗";
            }
            else if (lowerText.includes('holiday') || lowerText.includes('vacation') || lowerText.includes('break') || lowerText.includes('off')) {
                response = "Our school holidays are on the 1st and 3rd Saturdays of each month, as well as all major public holidays. 🎉";
            }
            else if (lowerText.includes('curriculum') || lowerText.includes('syllabus') || lowerText.includes('program') || lowerText.includes('course')) {
                response = "We focuses on holistic development and critical thinking. 📚";
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
});