"use strict";

const INQUIRIES_EMAIL = "hello@examplewebsite142.com";  // contact form
const ORDERS_EMAIL = "orders@examplewebsite142.com";    // Order Now buttons
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function getHomeUrl() {
    return window.location.pathname.includes("/pages/") ? "../index.html" : "index.html";
}

/* ===== SEARCH (navbar) ===== */
function initSearch() {
    const forms = Array.from(document.querySelectorAll(".site-search"));
    const productList = document.querySelector(".product-list");
    const productColumns = productList ? Array.from(productList.querySelectorAll(".product-card")).map(card => card.closest(".col")) : [];
    const homeUrl = getHomeUrl();

    function filterProducts(rawQuery) {
        if (!productList || !productColumns.length) return;

        const query = rawQuery.trim().toLocaleLowerCase();
        let matches = 0;

        productColumns.forEach(column => {
            const searchableText = column.textContent.toLocaleLowerCase();
            const visible = !query || searchableText.includes(query);
            column.hidden = !visible;
            if (visible) matches++;
        });

        let status = productList.querySelector(".search-results-status");
        if (!status) {
            status = document.createElement("p");
            status.className = "col-12 search-results-status";
            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");
            productList.append(status);
        }

        status.textContent = query && matches === 0
            ? `No products found for "${rawQuery.trim()}".`
            : query
                ? `${matches} product${matches === 1 ? "" : "s"} found.`
                : "";
        status.hidden = !query || matches > 0;
    }

    forms.forEach(form => {
        const input = form.querySelector('input[type="search"]');
        if (!input) return;

        // On the homepage, filter as the visitor types.
        if (productColumns.length) {
            input.addEventListener("input", () => filterProducts(input.value));

            const preset = new URLSearchParams(window.location.search).get("search");
            if (preset) {
                input.value = preset;
                filterProducts(preset);
            }
        }

        form.addEventListener("submit", event => {
            event.preventDefault();
            const query = input.value.trim();

            if (productColumns.length) {
                filterProducts(query);
                if (query) document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
                closeNavigation();
                return;
            }

            if (query) {
                const destination = new URL(homeUrl, window.location.href);
                destination.searchParams.set("search", query);
                destination.hash = "shop";
                window.location.href = destination.href;
            }
        });
    });
}

/* ===== NAVBAR: close the mobile menu after a link is chosen ===== */
function closeNavigation() {
    const menu = document.querySelector("#mainNav");
    if (menu?.open) menu.close();
    const toggler = document.querySelector('.navbar-toggler[aria-controls="mainNav"]');
    toggler?.setAttribute("aria-expanded", "false");
}

function initNavigationDrawer() {
    const menu = document.querySelector("#mainNav");
    const toggler = document.querySelector('.navbar-toggler[aria-controls="mainNav"]');
    if (!menu || !toggler) return;

    toggler.addEventListener("click", () => {
        if (menu.open) {
            menu.close();
        } else if (typeof menu.showModal === "function") {
            menu.showModal();
        }
    });

    menu.addEventListener("close", () => toggler.setAttribute("aria-expanded", "false"));
    menu.addEventListener("cancel", () => toggler.setAttribute("aria-expanded", "false"));
    menu.addEventListener("click", event => {
        if (event.target === menu) menu.close();
    });

    menu.addEventListener("click", event => {
        if (event.target.closest(".nav-link") && window.matchMedia("(max-width: 991.98px)").matches) {
            menu.close();
        }
    });

    toggler.addEventListener("click", () => {
        toggler.setAttribute("aria-expanded", String(menu.open));
    });

    // Native dialog close buttons.
    Array.from(menu.querySelectorAll('[data-bs-dismiss="drawer"]')).forEach(button => {
        button.addEventListener("click", () => menu.close());
    });
}

/* ===== NAVBAR: highlight Home / Shop / About while scrolling the home page ===== */
function initNavHighlight() {
    const header = document.querySelector(".site-header");
    const links = Array.from(document.querySelectorAll(".site-header .nav-link"));
    if (!header || !links.length) return;

    const shop = document.querySelector("#shop");
    const about = document.querySelector("#about");
    const isHome = Boolean(shop && about);

    function setActive(link) {
        links.forEach(item => {
            const active = item === link;
            item.classList.toggle("active", active);
            if (active) item.setAttribute("aria-current", "page");
            else item.removeAttribute("aria-current");
        });
    }

    if (!isHome) {
        const currentPath = window.location.pathname.replace(/\\/g, "/");
        const current = links.find(link => {
            const href = link.getAttribute("href");
            if (!href) return false;
            const target = new URL(href, window.location.href);
            return target.pathname === currentPath && !target.hash;
        });
        if (current) setActive(current);
        return;
    }

    const homeLink = links.find(link => {
        const href = link.getAttribute("href") || "";
        return /(?:^|\/)index\.html(?:$|[?#])/.test(href);
    });
    const shopLink = links.find(link => (link.getAttribute("href") || "").endsWith("#shop"));
    const aboutLink = links.find(link => (link.getAttribute("href") || "").endsWith("#about"));

    function updateActive() {
        const marker = header.getBoundingClientRect().bottom + 80;
        const aboutTop = about.getBoundingClientRect().top;
        const shopTop = shop.getBoundingClientRect().top;
        const atPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

        if ((atPageBottom || aboutTop <= marker) && aboutLink) setActive(aboutLink);
        else if (shopTop <= marker && shopLink) setActive(shopLink);
        else if (homeLink) setActive(homeLink);
    }

    links.forEach(link => {
        link.addEventListener("click", () => {
            const href = link.getAttribute("href") || "";
            if (href === "#shop" || href.endsWith("#shop") || href === "#about" || href.endsWith("#about") || href.endsWith("index.html")) {
                setActive(link);
            }
        });
    });

    let frame = 0;
    window.addEventListener("scroll", () => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
            updateActive();
            frame = 0;
        });
    }, { passive: true });
    window.addEventListener("hashchange", updateActive);
    updateActive();
}

/* Product gallery */
function initProductGallery() {
    const gallery = document.querySelector("#productGallery");
    if (!gallery) return;

    const slides = Array.from(gallery.querySelectorAll(".carousel-item"));
    const thumbs = Array.from(document.querySelectorAll(".product-thumbs .thumb"));
    const previous = gallery.querySelector(".gallery-control-prev");
    const next = gallery.querySelector(".gallery-control-next");
    if (!slides.length) return;

    let currentIndex = Math.max(0, slides.findIndex(slide => slide.classList.contains("active")));

    function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const active = i === currentIndex;
            slide.classList.toggle("active", active);
            slide.hidden = !active;
            slide.setAttribute("aria-hidden", String(!active));
        });

        thumbs.forEach((thumb, i) => {
            const active = i === currentIndex;
            thumb.classList.toggle("active", active);
            if (active) {
                thumb.setAttribute("aria-current", "true");
                thumb.setAttribute("aria-pressed", "true");
            } else {
                thumb.removeAttribute("aria-current");
                thumb.setAttribute("aria-pressed", "false");
            }
        });
    }

    previous?.addEventListener("click", () => showSlide(currentIndex - 1));
    next?.addEventListener("click", () => showSlide(currentIndex + 1));

    gallery.addEventListener("keydown", event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            showSlide(currentIndex - 1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            showSlide(currentIndex + 1);
        }
    });

    thumbs.forEach((thumb, index) => {
        thumb.addEventListener("click", () => showSlide(index));
        thumb.addEventListener("keydown", event => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                showSlide(index + 1);
                thumbs[(index + 1) % thumbs.length]?.focus();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                showSlide(index - 1);
                thumbs[(index - 1 + thumbs.length) % thumbs.length]?.focus();
            }
        });
    });

    showSlide(currentIndex);
}

/* Native size-guide dialog. */
function initSizeGuide() {
    const guide = document.querySelector("#sizeGuide");
    if (!guide) return;

    Array.from(document.querySelectorAll('[data-bs-target="#sizeGuide"]')).forEach(trigger => {
        trigger.addEventListener("click", event => {
            event.preventDefault();
            if (!guide.open) guide.showModal();
        });
    });

    Array.from(guide.querySelectorAll('[data-bs-dismiss="drawer"]')).forEach(button => {
        button.addEventListener("click", () => guide.close());
    });

    guide.addEventListener("click", event => {
        if (event.target === guide) guide.close();
    });
}

/* ===== CONTACT FORM: open the visitor's e-mail app with the message written ===== */
function initContactForm() {
    const form = document.querySelector("#contactForm");
    if (!form) return;

    const status = form.querySelector(".form-status");
    const email = form.querySelector('input[name="email"]');

    function showStatus(message, type) {
        if (!status) return;
        status.textContent = message;
        status.className = `form-status mt-3 mb-0 ${type}`;
        status.setAttribute("role", "status");
    }

    function validateEmail() {
        if (!email) return true;
        const valid = EMAIL_PATTERN.test(email.value.trim());
        email.setCustomValidity(valid ? "" : "Please enter a valid e-mail address.");
        email.classList.toggle("is-invalid", !valid);
        return valid;
    }

    email?.addEventListener("input", validateEmail);

    form.addEventListener("submit", event => {
        event.preventDefault();
        validateEmail();

        const requiredFields = Array.from(form.querySelectorAll("input[required], select[required], textarea[required]"));
        requiredFields.forEach(field => field.classList.toggle("is-invalid", !field.checkValidity()));

        if (!form.checkValidity()) {
            showStatus("Please complete all required fields correctly.", "error");
            requiredFields.find(field => !field.checkValidity())?.focus();
            return;
        }

        const fullName = form.querySelector('[name="fullName"]')?.value.trim() || "";
        const subject = form.querySelector('[name="topic"]')?.value || "Website inquiry";
        const message = form.querySelector('[name="message"]')?.value.trim() || "";
        const emailAddress = email?.value.trim() || "";
        const body = `Hi Thread Haus,\n\n${message}\n\nFrom: ${fullName}\nE-mail: ${emailAddress}`;

        showStatus("Your email app should open with your message. Press Send there to deliver it.", "success");
        window.location.href = `mailto:${INQUIRIES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    Array.from(form.querySelectorAll("input[required], select[required], textarea[required]")).forEach(field => {
        field.addEventListener("input", () => field.classList.toggle("is-invalid", !field.checkValidity()));
        field.addEventListener("change", () => field.classList.toggle("is-invalid", !field.checkValidity()));
    });
}

/* ===== SOLO PRODUCT PAGE ===== */
function initProductOrder() {
    const page = document.querySelector(".product-page");
    if (!page) return;

    const quantity = page.querySelector(".qty-input");
    const minus = page.querySelector(".qty-minus");
    const plus = page.querySelector(".qty-plus");
    const orderLink = page.querySelector(".order-now");
    if (!quantity || !minus || !plus || !orderLink) return;

    const minimum = Number(quantity.min) || 1;
    const maximum = Number(quantity.max) || 10;
    const product = page.dataset.product || "Thread Haus Tee";
    const price = Number(page.dataset.price) || 0;

    function updateOrderLink() {
        const selectedSize = page.querySelector('input[name="size"]:checked')?.value || "M";
        const count = Number(quantity.value) || minimum;
        const subtotal = price * count;
        const subject = `Order Request - ${product}`;
        const body = [
            "I would like to place an order for the following item:",
            "",
            `Product: ${product}`,
            `Size: ${selectedSize}`,
            `Quantity: ${count}`,
            `Price per shirt: PHP ${price.toFixed(2)}`,
            `Subtotal: PHP ${subtotal.toFixed(2)}`,
            "",
            "Please confirm my order and let me know the next steps for payment and delivery.",
            "",
            "Thank you!"
        ].join("\r\n");

        orderLink.href = `mailto:${ORDERS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    function setQuantity(value) {
        const parsed = Number.parseInt(value, 10);
        const safeValue = Number.isFinite(parsed)
            ? Math.min(maximum, Math.max(minimum, parsed))
            : minimum;

        quantity.value = String(safeValue);
        minus.disabled = safeValue <= minimum;
        plus.disabled = safeValue >= maximum;
        updateOrderLink();
    }

    minus.addEventListener("click", () => setQuantity(Number(quantity.value) - 1));
    plus.addEventListener("click", () => setQuantity(Number(quantity.value) + 1));
    quantity.addEventListener("change", () => setQuantity(quantity.value));
    quantity.addEventListener("blur", () => setQuantity(quantity.value));
    Array.from(page.querySelectorAll('input[name="size"]')).forEach(radio => radio.addEventListener("change", updateOrderLink));

    setQuantity(quantity.value);
}

/* ===== PRIVACY / TERMS: remember the "I have read and agree" checkbox ===== */
function initAgreement() {
    const checkbox = document.querySelector(".agreement input[type='checkbox']");
    if (!checkbox) return;

    const storageKey = `threadhaus_${checkbox.id}`;
    const toast = document.querySelector("#agreementToast");
    const closeToast = (toast || document).querySelector(".btn-close");

    try {
        checkbox.checked = localStorage.getItem(storageKey) === "yes";
    } catch (_) {
        // The checkbox remains usable when browser storage is unavailable.
    }

    function hideToast() {
        if (!toast) return;
        toast.classList.remove("show");
        toast.setAttribute("aria-hidden", "true");
    }

    checkbox.addEventListener("change", () => {
        try {
            localStorage.setItem(storageKey, checkbox.checked ? "yes" : "no");
        } catch (_) {
            // Ignore storage restrictions.
        }

        if (checkbox.checked && toast) {
            toast.classList.add("show");
            toast.setAttribute("aria-hidden", "false");
        } else {
            hideToast();
        }
    });

    closeToast?.addEventListener("click", hideToast);
}

document.addEventListener("DOMContentLoaded", () => {
    initNavigationDrawer();
    initNavHighlight();
    initSearch();
    initProductGallery();
    initSizeGuide();
    initContactForm();
    initProductOrder();
    initAgreement();
});
