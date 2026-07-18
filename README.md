# QuickUPI: Frictionless MSME Payments

QuickUPI is an offline-first, mobile-first payment utility designed specifically for local Indian freelancers and MSMEs. It allows business owners to input customer details and transaction amounts to generate pre-filled UPI payment links and share them instantly via WhatsApp.

## Key Features

* **Instant UPI Links:** Generates `upi://pay` deep links, enabling one-tap payments.
* **WhatsApp Integration:** Automatically packages payment details into a pre-filled WhatsApp message for easy customer communication.
* **Stealth Ledger:** Automatically saves transaction history (Date, Name, Item, Amount) locally in the browser using `localStorage`—no backend database is required.
* **Fintech-Inspired UI:** Features a hyper-minimalist, deep dark-mode design with premium neon-mint green accents (#00FFA3).
* **PWA Enabled:** Configured as a Progressive Web App (PWA), allowing users to install it on their home screen for a native-app experience.

## Tech Stack

* **Frontend:** Pure HTML5, CSS3, and Vanilla JavaScript.
* **Backend:** Zero-backend architecture; designed to be entirely offline-first.

## Deployment

This project is optimized for static hosting and can be deployed instantly:

1. **Netlify/Vercel:** Drag and drop the project folder into their dashboard to generate a live, secure HTTPS link.
2. **GitHub Pages:** Push the code to a GitHub repository and enable GitHub Pages in the repository settings.

---

> *QuickUPI is built to be a lightweight, friction-free tool for modern businesses.*
