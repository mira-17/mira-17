# EventHub

A responsive Event Management & Registration website built with **HTML5, CSS3 and vanilla JavaScript**. It uses no frameworks and no build step: open `index.html` in a browser to view it.

## Folder structure

```
.
├── index.html          Home: hero, upcoming events, how it works, call to action
├── about.html          About Us: intro, purpose, key features, stats
├── contact.html        Contact: details and a validated contact form
├── login.html          Login: show/hide password, Remember me, Forgot password
├── signup.html         Sign Up: validation, password strength, confirm password
├── css/
│   └── styles.css      One shared stylesheet, organised into numbered sections
├── js/
│   ├── main.js         Mobile menu, header shadow, scroll reveal, footer year
│   └── forms.js        Validation, password toggles, demo form submissions
└── assets/images/      Placeholder illustrations (SVG) and favicon
```

## Editing content

- **Text:** placeholder copy is marked with `<!-- EDIT: ... -->` comments in the HTML.
- **Images:** every image to replace is marked with `<!-- REPLACE IMAGE: ... -->`. Put your photo in `assets/images/` and update the `src` and `alt`. The CSS crops images with `object-fit: cover`, so any reasonably sized photo will fit.
- **Colors, fonts, spacing and radius:** all are defined as variables at the top of `css/styles.css` (`:root`). Changing a variable there updates every page.
- **Header and footer:** these are repeated on each page. If you change a link, update it in all five HTML files.

## Design rules applied

- 24px fixed page gutter (`--page-gutter`) on every container.
- Navigation items are 32px apart, and the Login and Sign Up buttons are 16px apart, so all are at least 16px.
- Every button uses the same 10px soft rounded rectangle (`--radius-btn`), never a pill shape.
- Two font families: **Manrope** (headings) and **Inter** (body), loaded from Google Fonts.
- Responsive breakpoints at 1100px, 960px (mobile menu) and 640px.

## Front-end demo behaviour

No backend is connected. The forms are validated in the browser, and each page states clearly that no message is sent and no account is created or checked. "Remember me" only saves the email address in the browser's `localStorage`.
