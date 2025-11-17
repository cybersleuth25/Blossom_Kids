// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function() {

    // --- CONTACT FORM SCRIPT ---
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const statusMessage = document.getElementById("statusMessage");

    // Add a submit event listener to the form
    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            // Prevent the default form submission (which causes a page reload)
            event.preventDefault();

            // --- 1. CLIENT-SIDE VALIDATION ---
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (name === "" || email === "" || message === "") {
                showMessage("Please fill out all fields.", "error");
                return; // Stop the function
            }

            // --- 2. PREPARE TO SEND DATA ---
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
            const formData = new FormData(contactForm);

            // --- 3. SEND DATA WITH FETCH ---
            fetch("process.php", {
                method: "POST",
                body: formData 
            })
            .then(response => response.json()) // Expect a JSON response from PHP
            .then(data => {
                // --- 4. HANDLE THE RESPONSE FROM PHP ---
                if (data.success) {
                    showMessage(data.message, "success");
                    contactForm.reset(); // Clear the form
                } else {
                    showMessage(data.message, "error");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                showMessage("An unexpected error occurred. Please try again.", "error");
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = "Send Message";
            });
        });
    }

    // Helper function to display status messages
    function showMessage(message, type) {
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = type; // This will be 'success' or 'error'
        }
    }


    // --- HERO SECTION SLIDER SCRIPT ---
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slider-image');
    const totalSlides = slides.length;

    function showSlides() {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Increment slideIndex and loop back if needed
        slideIndex++;
        if (slideIndex > totalSlides) {
            slideIndex = 1;
        }

        // Show the current slide (index is 0-based)
        if (slides[slideIndex - 1]) {
            slides[slideIndex - 1].classList.add('active');
        }

        // Call showSlides again after 3 seconds (3000 milliseconds)
        setTimeout(showSlides, 3000); 
    }

    // Start the slider if there are slides
    if (totalSlides > 0) {
        // Ensure the first slide is active when the page loads
        slides[0].classList.add('active');
        // Start the rotation after an initial delay
        setTimeout(showSlides, 3000); 
    }

});