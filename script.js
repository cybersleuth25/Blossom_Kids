document.addEventListener("DOMContentLoaded", function() {

    // --- HAMBURGER MENU SCRIPT (NEW!) ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");

    if(hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu when a link is clicked
        document.querySelectorAll(".nav-links li a").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }));
    }

    // --- CONTACT FORM SCRIPT ---
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const statusMessage = document.getElementById("statusMessage");

    function isValidPhone(phone) {
        const re = /^[0-9]{10,15}$/;
        return re.test(String(phone).trim());
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const message = document.getElementById("message").value.trim();

            if (name === "" || phone === "" || message === "") {
                showMessage("Please fill out all fields.", "error");
                return; 
            }

            if (!isValidPhone(phone)) {
                showMessage("Please enter a valid phone number.", "error");
                return; 
            }

            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
            const formData = new FormData(contactForm);

            fetch("https://api.web3forms.com/submit", { 
                method: "POST",
                body: formData 
            })
            .then(response => response.json()) 
            .then(data => {
                if (data.success) {
                    showMessage("Thank you! We have received your message. 🚀", "success");
                    contactForm.reset(); 
                } else {
                    showMessage("Oops! Something went wrong. Please try again.", "error");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                showMessage("An error occurred. Please try again later.", "error");
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
        }
    }

    // --- HERO SLIDER ---
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slider-image');
    const totalSlides = slides.length;

    function showSlides() {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        slideIndex++;
        if (slideIndex > totalSlides) {
            slideIndex = 1;
        }

        if (slides[slideIndex - 1]) {
            slides[slideIndex - 1].classList.add('active');
        }

        setTimeout(showSlides, 3000); 
    }

    if (totalSlides > 0) {
        slides[0].classList.add('active');
        setTimeout(showSlides, 3000); 
    }
});