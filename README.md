# LPS — Website

A static marketing site for LPS bookkeeping, built as plain HTML/CSS/JS for Hostinger shared hosting. No framework, no build step — just upload the files to `public_html/`.

---

## Quick deploy (Hostinger)

1. Log in to Hostinger.
2. Open **File Manager** → `public_html`.
3. Delete any default `index.html` Hostinger created.
4. Upload the contents of this folder (everything at the root: `index.html`, `services.html`, ..., `assets/`, `.htaccess`, etc.). You can drag/drop or upload a zip and extract in place.
5. Visit the domain. `index.html` should render as the home page.

**Note:** `.htaccess` is a hidden file. If your OS hides it when zipping, make sure it's included, or create it in Hostinger's File Manager afterwards with this one line:

```
ErrorDocument 404 /404.html
```

---

## File map

```
/                           site root
├── index.html                 Home
├── services.html              Services
├── about.html                 About
├── faq.html                   FAQ
├── contact.html               Contact (form)
├── contact.php                Form handler — emails submissions via PHP mail()
├── thank-you.html             Post-submit confirmation
├── 404.html                   Not found
├── robots.txt
├── sitemap.xml
├── .htaccess
├── favicon.svg                (add favicon.ico and apple-touch-icon.png before launch)
└── assets/
    ├── css/styles.css         one stylesheet, shared site-wide
    ├── js/
    │   ├── nav.js             mobile menu
    │   ├── reveal.js          scroll reveals + hero stagger
    │   └── contact.js         form submission (POSTs to contact.php)
    ├── fonts/                 self-hosted variable fonts (see below)
    └── img/                   photography, OG image
```

---

## Before launching — required steps

### 1. Font files

The CSS references self-hosted variable fonts. Download and drop these four files into `assets/fonts/`:

- `Fraunces-Variable.woff2`
- `Fraunces-Variable-Italic.woff2`
- `Inter-Variable.woff2`
- `Inter-Variable-Italic.woff2`

Sources:
- **Fraunces** — https://github.com/undercasetype/Fraunces (download `fonts/variable/Fraunces[SOFT,WONK,opsz,wght].woff2` and the italic equivalent; rename them to the filenames above).
- **Inter** — https://github.com/rsms/inter/releases (download `Inter.var.woff2` and the italic variant; rename).

Until the fonts are added, the site falls back to system serif and system sans — still readable, just not the final look.

### 2. Contact form (PHP)

The contact form posts to `contact.php` at the site root. It uses PHP's built-in `mail()` function, which Hostinger shared hosting supports out of the box.

**To change the delivery email,** edit this line near the top of `contact.php`:

```php
$to = 'lpsservices1llc@gmail.com';
```

**Testing after upload:**
1. Upload everything to Hostinger (including `contact.php`).
2. Open the live site's contact page and submit the form.
3. A message should arrive at `lpsservices1llc@gmail.com` within a minute (check spam the first time — mark "Not spam" once and future ones land in the inbox).
4. The browser should redirect to `thank-you.html`.

**If emails aren't arriving:**
- Check Gmail's spam folder first.
- In Hostinger's control panel, confirm PHP mail is enabled (it is by default).
- Check Hostinger's Error Logs for mail-related errors.
- If deliverability is flaky, upgrade to SMTP via PHPMailer with Gmail app-password credentials — ask and I'll wire it up.

**Spam protection:** The form has a honeypot field (`botcheck`). If a bot fills it, the server silently discards the submission. Simple and effective.

**Local testing note:** `contact.php` only runs on a server with PHP. Opening `contact.html` directly with `file://` will make the form fail. Test on the live host, or run `php -S localhost:8000` in this folder and visit `http://localhost:8000/contact.html`.

### 3. Final domain

Several files still contain the placeholder `https://[final-domain].com`. Once the real domain is known, do a project-wide find/replace:

- Canonical URLs (`<link rel="canonical">`) in every HTML page
- OG URL (`<meta property="og:url">`) in every HTML page
- JSON-LD `url` field in every HTML page
- `sitemap.xml` (every `<loc>`)
- `robots.txt` (the `Sitemap:` line)

### 4. OG image

Drop a 1200×630 JPG at `assets/img/og-image.jpg` for social link previews.

### 5. Favicons

`favicon.svg` is provided. For full browser coverage, also add:
- `favicon.ico` (32×32 or multi-size ICO) at the root
- `apple-touch-icon.png` (180×180) at the root

### 6. Owner portrait (About page)

Drop a 4:5 portrait at `assets/img/owner-portrait.jpg`. The `<img>` tag already targets this path and has a fallback that hides the image if it's missing.

---

## Editing content

Content is hand-written in HTML — no CMS. Find the file for the page you want to edit and open it in any text editor.

| Page | File |
|---|---|
| Home | `index.html` |
| Services | `services.html` |
| About | `about.html` |
| FAQ | `faq.html` |
| Contact | `contact.html` |
| Thank you | `thank-you.html` |
| 404 | `404.html` |

Phone number, email, and address appear in the footer of every page and on the contact page. To change them site-wide, search for `(931) 261-6703` or `lpsservices1llc@gmail.com` and replace across all HTML files.

---

## Current placeholder values (check before launch)

- Canonical URLs / OG URLs: `https://[final-domain].com`
- OG image: `assets/img/og-image.jpg` (not yet added)
- Owner portrait: `assets/img/owner-portrait.jpg` (not yet added)
- Font files: `assets/fonts/*.woff2` (not yet added — falls back to system fonts)
- `favicon.ico` and `apple-touch-icon.png`: not yet added (only `favicon.svg` is present)

---

## Real contact info (live on the site)

- **Phone:** (931) 261-6703
- **Email:** lpsservices1llc@gmail.com
- **Location:** Mt. Juliet, TN
- **Hours:** Mon–Fri, 9am–5pm CT
