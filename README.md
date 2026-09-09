# Luna Liu - Personal Website

## Overview
A modern, responsive personal portfolio website showcasing my professional journey, skills, and projects.

## Features
- Responsive design
- Smooth navigation
- Interactive contact form
- Modern, minimalist UI

## Setup
1. Clone the repository
2. Open `index.html` in your preferred web browser

## Customization
- Update personal information in `index.html`
- Modify styles in `styles.css`
- Replace `profile.jpg` with your own image

### Homepage reading and watching shelf
- Edit the `.currently-card` entries in `index.html` to update the selection. Each card has a cover, reading/watching label, title, creator, short quotation and source link.
- Only `Be Water, My Friend` is in progress (`NOW READING · BOOK`). `The Drama` is `WATCHED · FILM`; `Runnin’ Down a Dream` and `The Remains of the Day` are `FINISHED · BOOK`, as confirmed by the user. The film shows Luna's own Chinese review, labeled `My take`. The Gurley card links to the book and uses a short excerpt from the publisher's description, labeled accordingly.
- SVG covers in `images/currently/` are original illustrations, not official book jackets. Replace an image's `src` and descriptive `alt` to use your own cover; all shelf images fill a 6:7 frame without stretching. `currently-cover--poster` sets the film poster's crop position to keep the faces and title in view.
- `images/currently/the-drama.jpg` is the official A24 poster, © A24, sourced from the [film page](https://a24films.com/films/the-drama) ([original image](https://atwenty-four.transforms.svdcdn.com/production/images/DRAMA_Payoff.jpg?w=1920&auto=compress%2Cformat&fit=crop&dm=1770142990&s=3dcf381d13657a8b3312b946f2ae4d97)). This third-party artwork is not covered by the repository's MIT license.
- Keep the quotation's `cite` URL and visible source link together when editing. Duplicate or remove a full `article` to change the number of cards, and update its unique heading ID and display number.
- `currently.css` contains the section's isolated styles. `currently.js` adds arrows, keyboard navigation and boundary states to native horizontal scrolling. There is no build step or additional dependency.

### Visual system
- `styles.css` defines the shared warm-white palette and two type families: Menlo/monospace for navigation, introductions, body text and metadata; Georgia/serif for section titles, book titles and quotations, with a Chinese serif fallback. The homepage introduction is 18px on desktop and 16px on mobile. These fonts require no external font download.
- The homepage introduction, reading shelf and featured project are separate sections with consistent dividers and heading sizes. Interior pages share the same navigation and type hierarchy.
- `Runnin’ Down a Dream` uses a soft orange/yellow palette; `The Remains of the Day` uses peach, terracotta and dusky rose sunset tones. Both retain the same illustration style and 6:7 proportions.

## Technologies
- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts
- Font Awesome Icons

## License
MIT License
