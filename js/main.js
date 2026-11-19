"use strict";

/* ===== STORE E-MAIL ADDRESSES ===== */
const INQUIRIES_EMAIL = "hello@examplewebsite142.com"; // contact form
const ORDERS_EMAIL = "orders@examplewebsite142.com";   // Order Now buttons
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ===== SEARCH (navbar) ===== */
function initSearch() {
    const form = document.querySelector(".site-search");
    if (!form) return;
    const input = form.querySelector("input");

    const list = document.querySelector(".product-list");
    const cards = list ? Array.from(list.querySelectorAll(".product-card")) : [];

    function filter(query) {
        const q = query.trim().toLowerCase();
        let visible = 0;
        cards.forEach((card) => {
            const name = card.querySelector(".card-title").textContent.toLowerCase();
            const show = !q || name.includes(q);
            card.closest(".col").hidden = !show;
            if (show) visible++;
        });
        const old = list.querySelector(".no-results");
        if (old) old.remove();
        if (q && visible === 0) {
            const msg = document.createElement("p");
            msg.className = "col-12 no-results";
            msg.setAttribute("role", "status");
            msg.textContent = 'No products found for "' + query.trim() + '".';
            list.appendChild(msg);
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (cards.length) {
            filter(query);
            if (query) document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
        } else if (query) {
            // Not on the home page: open the shop with the search applied.
            const home = window.location.pathname.includes("/pages/") ? "../index.html" : "index.html";
            window.location.href = home + "?search=" + encodeURIComponent(query) + "#shop";
        }
    });

    if (cards.length) {
        input.addEventListener("input", () => filter(input.value));
        const preset = new URLSearchParams(window.location.search).get("search");
        if (preset) {
            input.value = preset;
            filter(preset);
        }
    }
}

/* ===== NAVBAR: close the mobile menu after a link is chosen ===== */
function initNavbarCollapse() {
    const menu = document.getElementById("mainNav");
    if (!menu || typeof bootstrap === "undefined") return;
    menu.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
        });
    });
}

/* ===== NAVBAR: highlight Home / Shop / About while scrolling the home page ===== */
function initNavHighlight() {
    const shop = document.getElementById("shop");
    const about = document.getElementById("about");
    if (!shop || !about) return; // only the home page has these sections

    const byKey = {};
    document.querySelectorAll(".site-header .nav-link").forEach((a) => {
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

    Object.entries(byKey).forEach(([key, a]) => {
        a.addEventListener("click", (e) => {
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

/* ===== CONTACT FORM: open the visitor's e-mail app with the message written ===== */
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const status = form.querySelector(".form-status");

    function show(message, type) {
        status.textContent = message;
        status.className = "form-status mt-3 mb-0 " + type;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Bootstrap validation styles
        const emailField = form.email;
        emailField.setCustomValidity(EMAIL_PATTERN.test(emailField.value.trim()) ? "" : "invalid");
        form.classList.add("was-validated");
        if (!form.checkValidity()) {
            show("Please fill in all fields correctly.", "error");
            const firstInvalid = form.querySelector(":invalid");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const data = {
            fullName: form.fullName.value.trim(),
            email: form.email.value.trim(),
            subject: form.topic.value,
            message: form.message.value.trim()
        };

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

    // Clear the e-mail error as soon as the address becomes valid
    form.email.addEventListener("input", () => {
        form.email.setCustomValidity(EMAIL_PATTERN.test(form.email.value.trim()) ? "" : "invalid");
    });
}

/* ===== SOLO PRODUCT PAGE ===== */
function initProductPage() {
    const page = document.querySelector(".product-page");
    if (!page) return;

    // Gallery thumbnails follow the Bootstrap carousel
    const gallery = document.getElementById("productGallery");
    const thumbs = Array.from(page.querySelectorAll(".product-thumbs .thumb"));
    if (gallery) {
        gallery.addEventListener("slide.bs.carousel", (e) => {
            thumbs.forEach((t, i) => {
                const on = i === e.to;
                t.classList.toggle("active", on);
                if (on) t.setAttribute("aria-current", "true");
                else t.removeAttribute("aria-current");
            });
        });
    }

    // Quantity (1 to 10); the - and + buttons switch off at the limits
    const qty = page.querySelector(".qty-input");
    const minus = page.querySelector(".qty-minus");
    const plus = page.querySelector(".qty-plus");
    const min = Number(qty.min) || 1;
    const max = Number(qty.max) || 10;

    function setQty(value) {
        const n = Number.parseInt(value, 10);
        const count = Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
        qty.value = String(count);
        minus.disabled = count <= min;
        plus.disabled = count >= max;
        updateOrderLink();
    }

    minus.addEventListener("click", () => setQty(Number(qty.value) - 1));
    plus.addEventListener("click", () => setQty(Number(qty.value) + 1));
    qty.addEventListener("change", () => setQty(qty.value));
    qty.addEventListener("blur", () => setQty(qty.value));
    page.querySelectorAll('input[name="size"]').forEach((r) => r.addEventListener("change", updateOrderLink));

    // Order Now: e-mail to the orders address with the tee's details already written
    const orderLink = page.querySelector(".order-now");
    const product = page.dataset.product;
    const price = Number(page.dataset.price);

    function updateOrderLink() {
        const selected = page.querySelector('input[name="size"]:checked');
        const size = selected ? selected.value : "M";
        const count = Number(qty.value);
        const subject = "Order Request - " + product;
        const body = [
            "I would like to place an order for the following item:",
            "",
            "Product: " + product,
            "Size: " + size,
            "Quantity: " + count,
            "Price per shirt: PHP " + price.toFixed(2),
            "Subtotal: PHP " + (price * count).toFixed(2),
            "",
            "Please confirm my order and let me know the next steps for payment and delivery.",
            "",
            "Thank you!"
        ].join("\r\n");
        orderLink.href = "mailto:" + ORDERS_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }
    setQty(qty.value);
}

/* ===== PRIVACY / TERMS: remember the "I have read and agree" checkbox ===== */
function initAgreement() {
    const box = document.querySelector(".agreement input[type='checkbox']");
    if (!box) return;
    const key = "threadhaus_" + box.id;
    const toastEl = document.getElementById("agreementToast");

    try {
        box.checked = localStorage.getItem(key) === "yes";
    } catch (err) {
        // Storage unavailable (e.g. private mode): the checkbox still works for this visit.
    }

    box.addEventListener("change", () => {
        try { localStorage.setItem(key, box.checked ? "yes" : "no"); } catch (err) { /* ignore */ }
        // Pop-up message when the visitor ticks the box
        if (box.checked && toastEl && typeof bootstrap !== "undefined") {
            bootstrap.Toast.getOrCreateInstance(toastEl).show();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initAgreement();
    initNavbarCollapse();
    initNavHighlight();
    initSearch();
    initContactForm();
    initProductPage();
});
