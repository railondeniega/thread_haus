"use strict";

/* ===== PRODUCT DATA (single source of truth) ===== */
const PRODUCTS = [
    { id: "dont-be-late", name: "Don't Be Late Tee", price: 499, page: "product-1.html" },
    { id: "everyday-comfort", name: "Everyday Comfort Tee", price: 499, page: "product-2.html" },
    { id: "do-good-work", name: "Do Good Work Tee", price: 499, page: "product-3.html" }
];

/* ===== SEARCH ===== */
function initSearch() {
    const input = document.querySelector(".header-search input");
    const button = document.querySelector(".header-search button");
    if (!input || !button) return;

    const cards = document.querySelectorAll(".product-card");
    const container = document.querySelector(".product-container");

    function filter(query) {
        const q = query.trim().toLowerCase();
        let visible = 0;
        cards.forEach((card) => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            const show = !q || name.includes(q);
            card.hidden = !show;
            if (show) visible++;
        });
        const existing = container && container.querySelector(".no-results");
        if (existing) existing.remove();
        if (container && q && visible === 0) {
            const msg = document.createElement("p");
            msg.className = "no-results";
            msg.textContent = 'No products found for "' + query.trim() + '".';
            container.appendChild(msg);
        }
    }

    function run() {
        if (cards.length) {
            filter(input.value);
            const shop = document.getElementById("shop");
            if (shop && input.value.trim()) shop.scrollIntoView();
        } else if (input.value.trim()) {
            // Not on the home page: send the query to the shop page.
            const home = window.location.pathname.includes("/pages/") ? "../index.html" : "index.html";
            window.location.href = home + "?search=" + encodeURIComponent(input.value.trim()) + "#shop";
        }
    }

    button.addEventListener("click", run);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
    input.addEventListener("input", () => { if (cards.length) filter(input.value); });

    const preset = new URLSearchParams(window.location.search).get("search");
    if (preset && cards.length) {
        input.value = preset;
        filter(preset);
    }
}

/* ===== CONTACT FORM ===== */
const INQUIRIES_EMAIL = "hello@examplewebsite142.com"; // contact form
const ORDERS_EMAIL = "orders@examplewebsite142.com";   // Order Now buttons
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const status = document.createElement("p");
    status.className = "form-status";
    status.setAttribute("role", "status");
    form.appendChild(status);

    function show(message, type) {
        status.textContent = message;
        status.className = "form-status " + type;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = {
            fullName: form.fullName.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim()
        };

        if (!data.fullName || !data.subject || !data.message) {
            return show("Please fill in all fields.", "error");
        }
        if (!EMAIL_PATTERN.test(data.email)) {
            return show("Please enter a valid e-mail address.", "error");
        }

        // Open the visitor's e-mail app with the message ready to send to the store.
        const body =
            "Hi Thread Haus,\n\n" + data.message + "\n\n" +
            "From: " + data.fullName + "\n" +
            "E-mail: " + data.email;
        window.location.href =
            "mailto:" + INQUIRIES_EMAIL +
            "?subject=" + encodeURIComponent(data.subject) +
            "&body=" + encodeURIComponent(body);
        show("Your e-mail app should now open with your message. Press Send there to deliver it to " + INQUIRIES_EMAIL + ".", "success");
    });
}

/* ===== NAV ACTIVE STATE (home page: Home / Shop / About) ===== */
function initNavHighlight() {
    const shop = document.getElementById("shop");
    const about = document.getElementById("about");
    if (!shop || !about) return; // only the home page has these sections

    const links = document.querySelectorAll(".header-navigation a");
    const byKey = {};
    links.forEach((a) => {
        const href = a.getAttribute("href");
        if (href === "#shop") byKey.shop = a;
        else if (href === "#about") byKey.about = a;
        else if (href === "index.html") byKey.home = a;
    });

    function setActive(key) {
        Object.entries(byKey).forEach(([k, a]) => {
            const on = k === key;
            a.classList.toggle("active", on);
            if (on) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
        });
    }

    let lockUntil = 0;

    function update() {
        if (Date.now() < lockUntil) return;
        const line = 140;
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (atBottom || about.getBoundingClientRect().top <= line) setActive("about");
        else if (shop.getBoundingClientRect().top <= line) setActive("shop");
        else setActive("home");
    }

    links.forEach((a) => {
        a.addEventListener("click", (e) => {
            const href = a.getAttribute("href");
            const key = href === "#shop" ? "shop" : href === "#about" ? "about" : href === "index.html" ? "home" : null;
            if (!key) return;
            e.preventDefault();
            setActive(key);
            lockUntil = Date.now() + 900; // ignore scroll updates during the smooth scroll
            if (key === "home") window.scrollTo({ top: 0, behavior: "smooth" });
            else document.getElementById(key).scrollIntoView({ behavior: "smooth" });
            setTimeout(update, 950);
        });
    });

    window.addEventListener("scroll", update, { passive: true });
    update();
}

/* ===== PRODUCT DETAIL PAGE ===== */
function initProductPage() {
    const page = document.querySelector(".product-page");
    if (!page) return;

    // Gallery
    const mainImg = page.querySelector(".product-main-image img");
    const thumbs = Array.from(page.querySelectorAll(".product-thumbs button"));
    let current = 0;

    function showPhoto(index) {
        if (!thumbs.length) return;
        current = (index + thumbs.length) % thumbs.length;
        const thumb = thumbs[current];
        mainImg.src = thumb.dataset.src;
        mainImg.classList.toggle("zoomed", thumb.dataset.zoom === "true");
        mainImg.classList.toggle("photo", !thumb.dataset.src.includes(mainImg.dataset.base));
        thumbs.forEach((t, i) => t.classList.toggle("active", i === current));
    }

    mainImg.dataset.base = thumbs.length ? thumbs[0].dataset.src : mainImg.src;
    thumbs.forEach((t, i) => t.addEventListener("click", () => showPhoto(i)));
    page.querySelector(".gallery-arrow.prev").addEventListener("click", () => showPhoto(current - 1));
    page.querySelector(".gallery-arrow.next").addEventListener("click", () => showPhoto(current + 1));
    if (thumbs.length < 2) page.querySelectorAll(".gallery-arrow").forEach((b) => (b.hidden = true));

    // Sizes
    const sizeButtons = page.querySelectorAll(".size-options button");
    sizeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            sizeButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
            updateOrderLink();
        });
    });

    // Quantity (1 to 10)
    const qty = page.querySelector(".qty-input");
    const min = Number(qty.min) || 1;
    const max = Number(qty.max) || 10;

    function setQty(value) {
        const n = Math.round(Number(value));
        qty.value = Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
        updateOrderLink();
    }

    page.querySelector(".qty-minus").addEventListener("click", () => setQty(Number(qty.value) - 1));
    page.querySelector(".qty-plus").addEventListener("click", () => setQty(Number(qty.value) + 1));
    qty.addEventListener("change", () => setQty(qty.value));

    // Order Now: pre-filled e-mail with the selected size and quantity
    const orderLink = page.querySelector(".order-now");
    const product = page.dataset.product;
    const price = Number(page.dataset.price);

    function updateOrderLink() {
        const selected = page.querySelector('.size-options button[aria-pressed="true"]');
        const size = selected ? selected.textContent.trim() : "M";
        const count = Number(qty.value);
        const subject = "Order - " + product + " (" + size + " x" + count + ")";
        const body =
            "Hi Thread Haus,\n\nI'd like to order:\n\n" +
            "Product: " + product + "\n" +
            "Size: " + size + "\n" +
            "Quantity: " + count + "\n" +
            "Total: PHP " + (price * count).toLocaleString("en-PH") + "\n\n" +
            "Full name:\nContact number:\nDelivery address:\n\nThank you!";
        orderLink.href = "mailto:" + ORDERS_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }
    updateOrderLink();

    // Size guide
    const dialog = document.querySelector(".size-guide");
    const openGuide = page.querySelector(".size-guide-link");
    if (dialog && openGuide && typeof dialog.showModal === "function") {
        openGuide.addEventListener("click", () => dialog.showModal());
        dialog.querySelector(".size-guide-close").addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initProductPage();
    initNavHighlight();
    initSearch();
    initContactForm();
});

