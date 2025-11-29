// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function() {

    // --- CONTACT FORM SCRIPT ---
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const statusMessage = document.getElementById("statusMessage");

    // Helper function to validate email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Add a submit event listener to the form
    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            // --- 1. CLIENT-SIDE VALIDATION ---
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (name === "" || email === "" || message === "") {
                showMessage("Please fill out all fields.", "error");
                return; 
            }

            if (!isValidEmail(email)) {
                showMessage("Please enter a valid email address.", "error");
                return; 
            }

            // --- 2. PREPARE TO SEND DATA ---
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
            const formData = new FormData(contactForm);

            // --- 3. SEND DATA TO FREE API ---
            // MAKE SURE THIS URL IS CORRECT:
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

    // Helper function to display status messages
    function showMessage(message, type) {
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = type; 
        }
    }


    // --- HERO SECTION SLIDER SCRIPT ---
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