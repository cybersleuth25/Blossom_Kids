# Blossom Kids School Website 🌸

This is a fully responsive, professional website designed for **Blossom Kids**, a preschool in Chikmagalur. It features a playful design, parents' information sections, and a working contact form.

## 🚀 Live Demo
*(https://blossomkids.netlify.app/)*

## ✨ Features

* **📱 Fully Responsive:** Looks great on mobile (with a custom Hamburger Menu), tablets, and desktops.
* **💌 Working Contact Form:** Sends emails directly to the school using the free Web3Forms API (No PHP backend required).
* **📍 Google Map Integration:** Shows the exact location of the school in Pension Mohalla.
* **💬 Floating WhatsApp Button:** Allows parents to chat with one click.
* **⏰ Daily Routine Timeline:** visually displays the school schedule (10:00 AM - 2:00 PM).
* **❓ FAQ Section:** Answers common questions about age, food, and transport.
* **🎨 Playful Design:** Uses 'Fredoka' Google Font and bright, child-friendly colors.

## 📂 File Structure

* `Index.html` - The main structure and content of the website.
* `style.css` - All styling, colors, animations, and mobile responsiveness logic.
* `script.js` - Handles the contact form submission, slider animation, and mobile menu toggle.
* `images/` - Folder containing the logo and slider photos.

## 🛠️ How to Set Up (For Free Hosting)

This site is designed to be hosted on **Netlify** or **GitHub Pages** for free.

### 1. Configure the Contact Form
1.  Go to [Web3Forms](https://web3forms.com/) and enter your email address.
2.  Copy the **Access Key** they send to your email.
3.  Open `Index.html` and find this line inside the `<form>` tag:
    ```html
    <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
    ```
4.  Replace `YOUR_ACCESS_KEY_HERE` with your actual key.

### 2. Upload to Netlify
1.  Go to [Netlify Drop](https://app.netlify.com/drop).
2.  Drag and drop the entire project folder into the upload box.
3.  Your site will be live instantly!

## 📝 Customization

* **To change colors:** Edit the `:root` variables at the top of `style.css`.
* **To update the map:** Replace the `iframe` `src` link in `Index.html` with a new embed link from Google Maps.
* **To change images:** Replace the files in the `images/` folder (keep the filenames the same or update them in the HTML).

## 📄 Credits

* **Icons:** [FontAwesome](https://fontawesome.com/)
* **Fonts:** [Google Fonts](https://fonts.google.com/)
* **Forms:** [Web3Forms](https://web3forms.com/)

---
*© 2024 Blossom Kids. Made with ❤️ and 🍪.*