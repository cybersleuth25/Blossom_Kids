# Blossom Kids Website

This is a simple, responsive, one-page website for "Blossom Kids," a preschool in Chikmagalur, built with HTML, CSS, and vanilla JavaScript.

## Project Overview

The website serves as a clean and welcoming landing page for parents interested in enrolling their children. It highlights the school's programs, features, and provides contact information.

## Features

* **Fully Responsive:** Adapts to mobile phones, tablets, and desktops.
* **Smooth Scrolling:** Easy one-page navigation.
* **Hero Image Slider:** An automatic, fading image slider in the hero section.
* **Contact Form:** A client-side validated contact form.
* **CSS Custom Variables:** Uses a color theme for easy branding and maintenance.

## File Structure

* `Index.html`: The main HTML file containing all content and structure.
* `style.css`: All custom styles for layout, typography, colors, and responsiveness.
* `script.js`: Handles the contact form validation/submission and the hero image slider.
* `images/`: (Folder) Contains all images used on the site (like `logo.png`, slider images, etc.)

## Backend Note

The contact form in `script.js` is set up to send its data to a file named `process.php`. This file is **not** included in this repository as it is a backend script. To make the contact form fully functional, you will need to create `process.php` on your server to receive the form data and send it as an email.