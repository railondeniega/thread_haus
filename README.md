[README.md](https://github.com/user-attachments/files/35013485/README.md)
# 👕 THREAD HAUS — Your Daily Thread

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/status-course%20project-2B4CDE)

An online T-shirt store for Gen Z and Millennials, built for **MMS 142 – Internet Technologies and Web Development** (Bachelor of Arts in Multimedia Studies).

Thread Haus sells fashionable, comfortable and affordable shirts. Visitors can browse the collection, see prices and sizes, read product details, and send an order request by e-mail.

---

## 📑 Table of Contents

- [Team](#-team)
- [Design Files](#-design-files)
- [Website Overview](#-website-overview)
- [Target Audience](#-target-audience)
- [Pages](#-pages)
- [Features](#-features)
- [Visual Direction and Brand Kit](#-visual-direction-and-brand-kit)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How to Run](#-how-to-run)

---

## 👥 Team

**MMS 142 Group 2**

| Member | Student No. |
| --- | --- |
| Deniega, Railon | 2023-30720 |
| Gegantoca, Eli | 2025-31096 |
| Gonzales, Ashleigh | 2023-10303 |
| Gutierrez, Lizeth | 2022-05130 |
| Solis, Czyrish | 2024-3048 |

## 🎨 Design Files

- **Figma:** [Thread Haus on Figma](https://www.figma.com/design/acWmd4dIqiIucodVlM9eyZ/MMS-142?nodeid=5-2&t=AvHU8rzPmWI3jzK2-1)
- **Figma PDF export:** [Google Drive folder](https://drive.google.com/drive/folders/1bzOXCVUxj8E69DDXNo_5mxNoVk2810aR?usp=sharing)

## 🌐 Website Overview

- **Type:** E-commerce, online T-shirt store
- **Description:** An online clothing store offering modern shirts for Millennials and Gen Z. It focuses on trendy, casual, affordable and accessible shirts with versatile designs, presented in a clean, minimal layout with bright colors.
- **Purpose:** Give Gen Z and Millennials an easy, convenient way to shop trendy, comfortable and affordable shirts for everyday wear.

### 🎯 Goals

1. **Trendy, affordable shirts** that customers can wear to school, the office and elsewhere.
2. **An easy way to shop:** simple navigation through products, prices, sizes and details.
3. **Brand image and customer trust:** a consistent brand identity, clear product and company information, and easy ways to contact the brand.

## 🧑‍🤝‍🧑 Target Audience

Gen Z and Millennials: students, young adults and young professionals who want shirts that look good, feel comfortable and are easy to style. They need product photos, prices, sizes and descriptions to decide what to buy, on a site that is user-friendly and works well on mobile.

## 📄 Pages

| # | Page | File |
| --- | --- | --- |
| 1 | Home | `index.html` |
| 2 | Shop (section of Home) | `index.html#shop` |
| 3 | About (section of Home) | `index.html#about` |
| 4 | Contact | `pages/contact.html` |
| 5 | Privacy Policy | `pages/privacy.html` |
| 6 | Terms and Conditions | `pages/terms.html` |
| 7 | Don't Be Late Tee | `pages/dont-be-late.html` |
| 8 | Everyday Comfort Tee | `pages/everyday-comfort.html` |
| 9 | Do Good Work Tee | `pages/do-good-work.html` |

### 🛍️ Products (₱499 each)

| Product | Description |
| --- | --- |
| **Don't Be Late Tee** | A timeless staple serving as a reminder to keep showing up, to keep improving, and to lead with integrity. Designed to fit seamlessly in your everyday rotation. |
| **Everyday Comfort Tee** | A timeless staple serving as a reminder to keep showing up, to keep improving, and to lead with integrity. Designed to fit seamlessly in your everyday rotation. |
| **Do Good Work Tee** | A timeless staple serving as a reminder to keep showing up, to keep improving, and to lead with integrity. Designed to fit seamlessly in your everyday rotation. |

## ✨ Features

- **Navigation bar** (Bootstrap navbar) with the logo, page links and a product search bar. It collapses into a menu button on phones, and the current section is highlighted as you scroll.
- **Hero section** with a **Shop Now** button that jumps to the product list.
- **Product cards** (Bootstrap grid and cards) with a **View Details** button that opens each solo product page.
- **Solo product pages** with a photo gallery (Bootstrap carousel) and thumbnails, size selector (XS–XXL), quantity selector, a slide-in **size guide** with measurements and a diagram (Bootstrap offcanvas), and an **Explore more tees** button.
- **Privacy Policy and Terms** shown as tabs above a scrollable document window.
- **Order Now** opens the customer's e-mail app with the product, size, quantity and total already filled in, addressed to the store's orders e-mail.
- **Contact form** opens the customer's e-mail app with their name, e-mail, subject and message, addressed to the store's inquiries e-mail.
- **About section** with brand story and three core-value columns with icons.
- **Footer** with copyright and links to the Privacy Policy and Terms.
- **Responsive layout** for desktop, tablet and mobile.
- **Accessible and inclusive design:** skip-to-content link, alt text on every image, labelled form fields with error messages, ARIA labels on icon buttons, descriptive link text, one h1 per page with headings in order, and visible keyboard focus.

### 📬 Store E-mail Addresses

| Purpose | Address |
| --- | --- |
| Orders | orders@examplewebsite142.com |
| Inquiries | hello@examplewebsite142.com |

## 🖌️ Visual Direction and Brand Kit

Clean, contemporary and youthful: a minimalist layout with bold photography and typography, blue as the brand color, and yellow and orange accents. Inspired by Nike, Uniqlo, H&M and Bench.

### Colors

| Role | Color | Hex |
| --- | --- | --- |
| Primary | Byzantine Blue | `#2B4CDE` |
| Secondary 1 | Azure Orange | `#FFAD05` |
| Secondary 2 | Fresh Yellow | `#F7E38B` |
| Neutral | Charcoal | `#1F2937` |

### Typography

| Use | Font |
| --- | --- |
| H1 | Poppins Bold 64 |
| H2 | Poppins SemiBold 32 |
| H3 | Poppins Regular 24 |
| Body | Inter Regular 18 |
| Small text | Inter Regular 16 |

## 🧰 Tech Stack

- **Bootstrap 5.3.9**, linked from the jsDelivr CDN (CSS and JavaScript bundle)
- **HTML, CSS and JavaScript.** `css/style.css` is linked after Bootstrap and applies the brand kit.
- **Google Fonts:** Poppins and Inter
- **Hosting:** GitHub Pages

## 🗂️ Project Structure

```
thread_haus/
├── index.html                Home page (hero, shop, about)
├── css/style.css             Custom styles, loaded after Bootstrap
├── js/main.js                Search, navbar, contact form, product page
├── images/                   Logo, product photos, icons, size guide diagram
└── pages/
    ├── contact.html
    ├── privacy.html
    ├── terms.html
    ├── dont-be-late.html
    ├── everyday-comfort.html
    └── do-good-work.html
```

## 🚀 How to Run

1. Clone or download this repository.
2. Open `index.html` in any web browser.

An internet connection is needed to load Bootstrap and the fonts from their CDNs.

---

© 2026 Thread Haus · MMS 142 Group 2
