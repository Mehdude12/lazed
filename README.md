# Lazed website

A plain HTML, CSS and JavaScript site. No build step, no frameworks, no cookies, no third-party requests.
Upload the whole folder to any static host (Netlify, Cloudflare Pages, GitHub Pages, cPanel, an nginx folder...).

## Pages
| File | What it is |
|---|---|
| `index.html` | Home: what Lazed does, how it works, the plan, privacy, questions |
| `download.html` | Download page. Shows Windows and Mac (Apple Silicon and Intel downloads), highlights the visitor's own system |
| `terms.html`, `privacy.html`, `refund.html` | Terms of Service, Privacy Policy, Refund & Cancellation Policy |
| `contact.html` | Support at support@lazed.co.in, a helper that opens the visitor's email app, quick fixes |
| `404.html` | "Page not found" (most hosts use it automatically) |

## Before you go live
1. **Add your installers** to `downloads/` as `Lazed-Windows.exe` (Inno Setup installer),
   `Lazed-macOS-silicon.dmg` (Mac, Apple Silicon build) and `Lazed-macOS-intel.dmg` (Mac, Intel build).
   Build each Mac installer on a Mac of that type, then rename the `.dmg`. Names and the system requirements
   shown on the page are in `js/config.js`. Until a file exists, its button says "Coming soon".
2. **Set the version** (and optionally each file's SHA-256) in `js/config.js`.
3. **Check the system requirements** in `js/config.js` (Windows 10+, macOS 11+ are assumed) against your real builds.
4. **Read the legal pages** (`terms.html`, `privacy.html`, `refund.html`). They describe how the app and server
   behave today, but the refund rules, response times and governing law are sensible defaults for you to confirm,
   and a lawyer should review them. If you add your registered business name or address, add it to Terms section 1
   and Privacy section 1. If you later add analytics or cookies, update Privacy section 11.
5. **Domain:** the share image, `sitemap.xml` and `robots.txt` assume the site lives at `https://lazed.co.in`.
   Search and replace that address if it differs.
6. The price is deliberately not on the site: the app shows it at checkout. Add it where you like.

## Changing things
* Colours and fonts: the variables at the top of `css/style.css`.
* Support email: search for `support@lazed.co.in` (and `supportEmail` in `js/config.js`).
* Logo: `assets/logo.jpg` is your original. The round versions (`logo-96.png`, `logo-320.png`, favicons) were cut from it.
