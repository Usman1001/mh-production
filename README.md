# MH Production & Entertainment — Website

A static, production-ready marketing website for **MH Production & Entertainment**, a Sri Lanka based film production support and logistics company. Built with plain HTML5, CSS3 and JavaScript on Bootstrap 5 — no build step, no framework, ready to upload to any shared hosting account.

---

## 1. File Structure

```
MH-Production/
│
├── index.html              Home
├── about.html               About / mission / vision / why us
├── services.html            8 detailed services + process
├── portfolio.html           Bollywood / Hollywood / Arabic productions (filterable)
├── gallery.html             Categorised photo gallery
├── awards.html               Festival & awards timeline
├── contact.html              Contact form + business info
│
├── assets/
│   ├── css/
│   │   └── style.css        Full design system (tokens, components, responsive)
│   ├── js/
│   │   └── script.js        Navbar, menu, reveal animation, counters, filters, form
│   ├── images/
│   │   ├── brand/            favicon.svg, og-cover.svg (logo mark, social share image)
│   │   ├── portfolio/         (empty — add real movie stills here)
│   │   └── gallery/            (empty — add real photography here)
│   ├── videos/                (empty — add an optional hero background video here)
│   └── fonts/                  (empty — only needed if you stop using Google Fonts CDN)
│
└── README.md
```

Every page shares the same navbar and footer markup, the same `assets/css/style.css` and `assets/js/script.js`, and carries its own `<title>`, meta description and keywords for SEO.

---

## 2. Running It Locally

No build tools are required.

- **Quickest:** double-click any `.html` file to open it in a browser.
- **Recommended:** serve the folder so relative asset paths and the smooth-scroll/anchor links behave exactly as they will in production:
  ```bash
  cd MH-Production
  python3 -m http.server 8000
  # then open http://localhost:8000
  ```

## 3. Deploying To Shared Hosting

1. Zip the contents of `MH-Production/` (not the folder itself).
2. Upload and extract into your host's public web root (commonly `public_html/`).
3. Confirm `index.html` sits directly inside that root so `https://yourdomain.com/` loads the home page.
4. No server-side configuration, database, or `.htaccess` rules are required for the site to function as-is.

The site currently loads Bootstrap 5, Bootstrap Icons and Google Fonts from CDNs, so the hosting account needs standard outbound access — true of virtually all shared hosting.

---

## 4. Replacing Placeholder Visuals

No stock photography is bundled with this project — every poster, gallery tile and the hero background use styled CSS placeholders (gradient panels + Bootstrap Icons) so the site never ships with broken image links. Swap in real photography by adding files at the paths below; each `<img>`/placeholder location is also flagged with an HTML comment in the relevant page.

| Location | Suggested path | Notes |
|---|---|---|
| Hero background | `assets/videos/hero-reel.mp4` | Uncomment the `<video>` block in `index.html`'s hero section and add a `poster` image |
| Portfolio posters | `assets/images/portfolio/<movie-slug>.jpg` | Recommended ratio 2:3, one per `.manifest-card .poster` |
| Gallery — Behind The Scenes | `assets/images/gallery/behind-the-scenes-01.jpg` … | See comments in `gallery.html` |
| Gallery — Film Sets | `assets/images/gallery/film-sets-01.jpg` … | |
| Gallery — Production Logistics | `assets/images/gallery/logistics-01.jpg` … | |
| Gallery — Events | `assets/images/gallery/events-01.jpg` … | |
| Gallery — Travel Operations | `assets/images/gallery/travel-01.jpg` … | |
| Social share image | `assets/images/brand/og-cover.jpg` | Replace the SVG placeholder and update the `og:image` meta tag on every page (1200×630px) |
| Favicon | `assets/images/brand/favicon.svg` | An "MH" monogram is included; replace with a real logo mark if preferred, or export a `.ico`/`.png` and update the `<link rel="icon">` tag on every page |

To swap a CSS placeholder for a real photo, replace the placeholder `<div>` markup, e.g.:

```html
<!-- before -->
<div class="poster"><i class="bi bi-film"></i><span class="stamp">Cleared</span></div>

<!-- after -->
<div class="poster">
  <img src="assets/images/portfolio/bang-bang.jpg" alt="Bang Bang" loading="lazy">
  <span class="stamp">Cleared</span>
</div>
```
(Add `.manifest-card .poster img{ width:100%; height:100%; object-fit:cover; }` to `style.css` once real images are in place.)

## 5. Embedding A Real Google Map

`contact.html` includes a `.map-frame` placeholder. Replace it with a real embed:

```html
<div class="map-frame" style="aspect-ratio:16/8;">
  <iframe src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
          width="100%" height="100%" style="border:0;" allowfullscreen=""
          loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>
```
Get the embed code from Google Maps → Share → Embed a map, using the office address.

---

## 6. Customisation

All design tokens live at the top of `assets/css/style.css` under `:root`:

- **Colour** — `--void`, `--charcoal`, `--gold`, `--ivory`, etc.
- **Type** — `--font-display` (Fraunces), `--font-body` (Inter), `--font-mono` (Space Mono)
- **Spacing/radius** — `--section-y`, `--radius`

Changing a token updates it site-wide. Fonts are loaded via Google Fonts `<link>` tags in each page `<head>`; swap the `href` and the `--font-*` variables together if you change typefaces.

---

## 7. Contact Form → Future PHP/MySQL Backend

The form in `contact.html` (`#contactForm`) currently validates client-side only (see `initContactForm()` in `assets/js/script.js`) and shows a confirmation message without sending data anywhere, so the site works immediately on static hosting.

To wire it up to a backend once one is available:

1. Create a PHP endpoint, e.g. `contact-handler.php`, that reads `$_POST['name']`, `$_POST['email']`, `$_POST['phone']`, `$_POST['message']`, validates/sanitises them, and inserts into a MySQL table (or sends an email via `mail()`/SMTP).
2. In `initContactForm()`, replace the placeholder success block with a `fetch('contact-handler.php', { method: 'POST', body: new FormData(form) })` call, and branch the status message on the response.
3. Because field `name`/`id` attributes (`name`, `email`, `phone`, `message`) already match common PHP `$_POST` conventions, no markup changes are required — only the JavaScript submit handler.

---

## 8. Credits

- [Bootstrap 5](https://getbootstrap.com/) — layout grid & components
- [Bootstrap Icons](https://icons.getbootstrap.com/) — iconography
- [Google Fonts](https://fonts.google.com/) — Fraunces, Inter, Space Mono

---

© MH Production & Entertainment. All rights reserved.
