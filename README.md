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

## AI / Human entry
- `/` is the two-choice entry page, styled by `entry.css` using the existing palette and fonts. Both options are ordinary links and work without JavaScript. The header shows only Luna Liu, with no crescent or horizontal rule. A waving-hand greeting sits above solid deeper Tiffany-inspired teal and pale mint panels. The AI label uses upright Menlo/monospace at 18px on desktop and 16px on mobile. The Human label uses the existing Chaparral Pro regular font at 20px on desktop and 18px on mobile. AI uses soft square brackets enclosing three token dots and a text cursor: a generative-text metaphor, drawn with CSS geometry. Hover or keyboard focus briefly moves the dots in sequence and pulses the cursor. Human keeps three uneven organic loops. Both panels stay side by side on mobile; reduced-motion preferences disable transitions and animations.
- **I’m Human** opens `home.html`, the original homepage. Interior navigation returns there so browsing the site does not repeatedly show the entry page.
- **I’m AI** opens `llms-full.txt`, an inline plain-text document written in Markdown. `/llms.txt` indexes the complete document and a `.md` counterpart for every content page. HTML `alternate` and `describedby` links make these files discoverable without clicking the entry screen.
- `.nojekyll` keeps Markdown files as raw static assets on GitHub Pages.
- HTML is the source of truth. After changing content, regenerate the text edition and commit it with the HTML:

  ```sh
  python3 scripts/generate-ai-content.py
  python3 scripts/generate-ai-content.py --check
  ```

- The generator uses only Python's standard library, discovers local HTML content pages, keeps original wording, image descriptions, and absolute source links, and omits navigation and decorative controls. External writing hosted on Notion is linked, not copied or summarized.
- The **Check AI content** workflow reports stale generated content on pull requests and pushes to `main`; it does not publish, write commits, or change the existing hosting configuration. Run the generator when editing HTML; the check itself does not refresh files. Enforce this check in branch rules if stale content must block merges.

## Customization
- Update personal information in `home.html`
- Modify styles in `styles.css`
- Replace `profile.jpg` with your own image

### Homepage reading and watching shelf
- Edit the `.currently-card` entries in `home.html` to update the selection. Each card has a cover, reading/watching label, title, creator, short quotation and source link.
- Only `Be Water, My Friend` is in progress (`NOW READING · BOOK`). `The Drama` is `WATCHED · FILM`; `Runnin’ Down a Dream` and `The Remains of the Day` are `FINISHED · BOOK`, as confirmed by the user. The film shows Luna's own Chinese review, labeled `My take`. The Gurley card links to the book and uses a short excerpt from the publisher's description, labeled accordingly.
- SVG covers in `images/currently/` are original illustrations, not official book jackets. Replace an image's `src` and descriptive `alt` to use your own cover; all shelf images use a 6:7 frame without stretching. `currently-cover--poster` sets the film poster's crop position to keep the faces and title in view.
- `images/currently/the-drama.jpg` is the official A24 poster, © A24, sourced from the [film page](https://a24films.com/films/the-drama) ([original image](https://atwenty-four.transforms.svdcdn.com/production/images/DRAMA_Payoff.jpg?w=1920&auto=compress%2Cformat&fit=crop&dm=1770142990&s=3dcf381d13657a8b3312b946f2ae4d97)). This third-party artwork is not covered by the repository's MIT license.
- `images/currently/remains-of-the-day.png` is the original yellow book jacket supplied by Luna. `currently-cover--book-jacket` displays it fully within the card against a matching yellow background. This third-party artwork is not covered by the repository's MIT license.
- Keep the quotation's `cite` URL and visible source link together when editing. Duplicate or remove a full `article` to change the number of cards, and update its unique heading ID and display number.
- `currently.css` contains the section's isolated styles. `currently.js` adds arrows, keyboard navigation and boundary states to native horizontal scrolling. There is no build step or additional dependency.

### Visual system
- `styles.css` defines the shared warm-white and Tiffany-inspired teal palette (deep teal links and focus states, muted teal illustrations, pale mint surfaces and borders) used by both the entry and content pages, and two type families: Menlo/monospace for navigation, introductions, body text and metadata; Chaparral Pro for section titles, book titles and quotations, with Georgia and Chinese serif fallbacks. Homepage introductions, project descriptions and About copy are 18px on desktop and 17px on mobile. Navigation, captions and metadata are 14px. Chaparral regular, italic and bold are loaded from the owner-supplied files in `fonts/`; they are third-party font assets, not covered by the repository's MIT license. No third-party font hosting is required.
- The homepage uses whitespace and static line illustrations (an open book and a sprout) between sections. A crescent sits beside the name in the shared navigation. Interior pages share the same navigation and type hierarchy. The cat animation and prototype controls are not included.
- `Runnin’ Down a Dream` uses a honey-gold/yellow palette. `Be Water, My Friend` retains its blue illustrated cover; `The Remains of the Day` uses the supplied book jacket.

### Native writings
- The writings index is `writings/index.html`. Each article lives in its own folder with an `index.html`; Tree Magic is served at `/writings/tree-magic/`.
- Articles share the homepage’s horizontal margins. Body text is 20px on desktop and 17px on mobile; captions, bylines and return links are 14px.
- Edit the article directly in `writings/tree-magic/index.html`. It uses the shared `styles.css` and isolated long-form styles in `writings/article.css`, with no build step or JavaScript dependency.
- Tree Magic's text was migrated from the [original Notion diary](https://jingyiliu.notion.site/My-First-Developer-Diary-Building-Tree-Magic-13f247bd179e80e29372c69d231cc7f8), verified on September 15, 2026. The full text and five existing local images are retained; the duplicated “and and” was corrected, the team credit is an image caption, and em dashes were replaced with commas at the author’s request. No publication date has been inferred.
- To add another article, copy the article page, update its title, description, canonical URL and Open Graph metadata, then add a link in `writings/index.html`. Keep local image paths, descriptive alt text, and image dimensions together.
- Preview through a local HTTP server at the repository root (for example, `python3 -m http.server 8000`) so site-root links work, then open `http://localhost:8000/writings/tree-magic/`.

## Technologies
- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts
- Font Awesome Icons

## License
MIT License
