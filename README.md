# Chen Wang — Saxophonist Website

A single-page site for saxophonist Chen Wang: hero intro, bio, awards,
SoundCloud recordings, and a Google Form contact section. Plain HTML/CSS/JS —
no build step, deploys straight to GitHub Pages.

Content (bio, awards, education, recordings, photos) was migrated from the
client's previous Squarespace site.

## Preview locally

Open `index.html` directly in a browser, or run a local server from this folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Still pending

1. **Contact form** — still points at a placeholder Google Form embed URL (see below).
2. **Location** — the old site never listed an explicit city/address, so the
   Contact section shows "Affiliation: University of Washington School of
   Music" instead. Swap in a real location if wanted.
3. **YouTube videos** — there's no dedicated video section on the site right
   now (the old site had none either). If Chen wants to showcase performance
   videos later, a new section can be added — check git history (before the
   "Recent Arrangement" migration commit) for the original `video-grid`
   markup/CSS pattern to reuse.
4. **Chinese translation review** — the Chinese content was AI-translated,
   not by a professional/native translator. It should read naturally, but a
   native-speaker pass (especially on the musical/academic terminology) is
   worth doing before this is considered final.

## Bilingual (English / 中文)

Every piece of visible text has an English and a Chinese version living side
by side in the HTML, toggled with a "中文" / "EN" button in the nav.

- English text is wrapped in `<span class="lang-en">` (or a whole `<p class="lang-en">`
  for longer passages); the Chinese counterpart uses `class="lang-zh" hidden`.
  `assets/script.js` flips the `hidden` attribute on whichever set doesn't
  match the active language — this works for any element type, so it's used
  uniformly for spans, paragraphs, and list items.
- The active language is stored in `localStorage` (`lang` key) and restored
  on future visits; first-time visitors get English unless their browser is
  set to Chinese.
- To edit either language's copy, find the matching `lang-en`/`lang-zh` pair
  in `index.html` and edit the text directly — just keep both versions in
  sync when one changes.
- Client's Chinese name is 王晨 (used throughout the `lang-zh` content and
  page title); "Chen Wang" is used in English.

## Setting up the contact form (Google Forms)

1. Go to [forms.google.com](https://forms.google.com) and create a new form
   with the fields you want (Name, Email, Message, etc.).
2. Click **Send** (top right) → choose the **embed `<>`** icon.
3. Copy the `src="..."` URL from the embed code shown.
4. In `index.html`, find the `contact-form-wrap` section and replace
   `https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_EMBED_URL/viewform?embedded=true`
   with that URL.
5. Form responses land in a Google Sheet (Responses tab → the sheet icon) —
   turn on email notifications for new responses via the Sheet's
   Tools → Notification rules, or the Forms "Get email notifications for new responses" toggle.

## Updating content

- **Bio / awards / education** — edit directly in the `about` and `awards`
  sections of `index.html`.
- **Recordings** — each `audio-card` has a title, meta line, description, and
  a SoundCloud iframe. To add/replace a track, swap the iframe's `url=`
  parameter for the new track's public share URL, URL-encoded (e.g.
  `https%3A//soundcloud.com/artist/track-name`).
- **Photos** — `assets/photos/hero.jpg` (hero background) and
  `assets/photos/about.jpg` (About section) were pulled from the old site.
  Replace either file (same filename) to swap photos.
- **Social links** — footer links to the real SoundCloud and Instagram profiles.

## Deploying to GitHub Pages

This repo is already connected to GitHub Pages. To publish changes:

```
git add -A
git commit -m "Update content"
git push
```

The live site updates at `https://ryttle.github.io/chenwangpage/` within a
minute or two.

## File structure

```
index.html            Page content and structure
assets/style.css       All styling
assets/script.js        Scroll reveal, sticky header, mobile nav, back-to-top
assets/photos/          Hero and About photos
```
