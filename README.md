# Jose Vincent Bibay | Portfolio

Personal portfolio of Jose Vincent Bibay, an Odoo developer building HR, payroll and attendance software.

**Live site:** https://jvbibay.github.io

## Overview

A fast, single-page site written in plain HTML, CSS and JavaScript. There is no framework, no build step and no dependencies, so it loads quickly and can be hosted anywhere static files are served.

## Features

- **Animated hero:** an interactive network background that reacts to the mouse, with a typing headline
- **Module explorer:** tabs for Attendance, Payroll, Leave and Employee, each with a short description and an illustrative Odoo code sample
- **Playground:** a small overtime-pay estimator using standard Philippine premium rates (illustrative only)
- **Skill filters:** filter skills by Odoo, Backend, Front-end or Practice
- **Command menu:** press `Ctrl` + `K` (or `Cmd` + `K`) to jump to a section, switch theme or copy the email address
- **Light and dark themes:** follows the device setting, with a manual toggle that is remembered
- **Polish:** scroll progress bar, scroll-spy navigation, reveal-on-scroll animations, card tilt on hover

## Accessibility and performance

- Skip-to-content link, visible keyboard focus and semantic HTML
- Keyboard-operable tabs, filters and command menu
- Respects `prefers-reduced-motion`; animations and cursor effects are disabled when requested
- Cursor glow and card tilt only run on devices with a mouse
- Animation pauses when the hero is off screen
- Responsive down to phone widths

## Project structure

```
.
├── index.html    # Page content and structure
├── style.css     # Styles, colour tokens and themes
├── script.js     # Interactions (no libraries)
├── .nojekyll     # Tells GitHub Pages to serve files as-is
└── README.md
```

## Run locally

No install is needed. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customize

- **Colours:** edit the CSS variables in the first three lines of `style.css` (light theme, dark theme, and the automatic dark mode)
- **Content:** edit the sections in `index.html`
- **Module explorer text and code samples:** edit the `modules` object in `script.js`
- **Command menu items:** edit the `commands` array in `script.js`

## Deployment

The site is deployed with GitHub Pages from the `main` branch. Pushing to `main` publishes the update within a minute or two.

## Tech

HTML5 · CSS3 (custom properties, grid, flexbox) · Vanilla JavaScript (canvas, IntersectionObserver)

## Contact

Use the contact section on the live site.
