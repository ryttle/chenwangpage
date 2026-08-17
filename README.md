# Chen Wang Sax Studio Website

A single-page site for Chen Wang Sax Studio (王晨萨克斯工作室), the teaching
studio led by saxophonist Chen Wang: hero intro, bio, awards, SoundCloud
recordings, studio policy, and a Google Form contact section. Plain
HTML/CSS/JS — no build step, deploys straight to GitHub Pages.

Content (bio, awards, education, recordings, photos) was migrated from the
client's previous Squarespace site.

## Preview locally

Open `index.html` directly in a browser, or run a local server from this folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Still pending

1. **Location in Contact section** — the studio's location (Bothell, WA) is
   documented in the FAQ and structured data, but the Contact section itself
   still shows only Email; add a location line there too if wanted.
2. **YouTube videos** — there's no dedicated video section on the site right
   now (the old site had none either). If Chen wants to showcase performance
   videos later, a new section can be added — check git history (before the
   "Recent Arrangement" migration commit) for the original `video-grid`
   markup/CSS pattern to reuse.
3. **Chinese translation review** — the Chinese content was AI-translated,
   not by a professional/native translator (this includes the full Studio
   Policy on `policy.html`, which covers real legal/financial terms — a
   native-speaker and/or legal review is worth prioritizing there
   specifically before relying on it).
4. **Google Form ownership** — the form is still owned/editable only by the
   Google account used to build this site (not Chenwangsax@gmail.com). Email
   notifications for new responses now go to Chenwangsax@gmail.com (via an
   Apps Script trigger, see below), but if Chen ever needs to edit the form's
   questions himself, he'd need to be added as an editor or receive an
   ownership transfer — see "Contact form" below.

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

## Contact form (Google Forms)

The form is live: "Book a Free Trial Lesson — Chen Wang", collecting Email,
Name, Level (dropdown), Age (dropdown), and Message. It's embedded directly
in `index.html`'s `contact-form-wrap` section.

- **Edit questions**: open the form at
  `https://docs.google.com/forms/d/142U1ZRLf1AKBAz7YbhLlSYg1rAm0rPwUAaCLtz2Lodg/edit`
  (requires being signed into the Google account that created it, or being
  added as an editor — see below).
- **View responses**: the form's Responses tab, or link it to a Google Sheet
  via "Link to Sheets" there.
- **Email notifications**: every new response emails Chenwangsax@gmail.com
  directly. This runs via a bound Apps Script (Extensions/⋮ menu → Apps
  Script) with an `onFormSubmit(e)` function and an installable "On form
  submit" trigger — not the form's native "Get email notifications" toggle
  (that's also on, but only notifies the form's owner). To change the
  recipient, edit the `to:` address in the Apps Script's `Code.gs`.
- **Form editing access**: still limited to the Google account that created
  the form. If Chen needs to edit questions himself, either:
  1. Click the "add person" icon in the form editor and add
     Chenwangsax@gmail.com as an Editor, or
  2. Transfer ownership entirely (Editor access → change role to Owner).
- **To rebuild from scratch**: create a new form at
  [forms.google.com](https://forms.google.com), then Publish it →
  overflow menu (⋮) → **Embed HTML** → copy the `src="..."` URL → paste it
  into the `contact-form-wrap` iframe's `src` in `index.html`.

## Updating content

- **Bio / awards / education** — edit directly in the `about` and `awards`
  sections of `index.html`.
- **Recordings** — each `audio-card` has a title, meta line, description, and
  a SoundCloud iframe. To add/replace a track, swap the iframe's `url=`
  parameter for the new track's public share URL, URL-encoded (e.g.
  `https%3A//soundcloud.com/artist/track-name`).
- **Photos** — `assets/photos/hero.jpg` is the hero background (single
  image). The About section shows a single-column stack of
  `assets/photos/about-1.jpg` through `about-3.jpg` (top to bottom), each
  shown at its natural, uncropped aspect ratio (`width: 100%; height: auto;`
  — no `object-fit` cropping). Replace any file (same filename) to swap a
  photo, or add/remove `<img>` tags in `.about-photo-grid` to change the
  count — the flex column layout adapts automatically. These are the
  client's original files (about-1.jpg was converted from HEIC to JPG for
  browser compatibility; otherwise unedited). Originally ~4.5MB total; later
  resized to a 1400px long edge and recompressed (same crop, same
  orientation, EXIF orientation tag preserved) for page speed — now ~1MB
  total for the set (`width`/`height` attributes on the `<img>` tags were
  updated to match; keep them in sync if you swap in different files).
- **Social links** — footer links to the real SoundCloud profile (Instagram link was removed by request).
- **Studio Policy** — the homepage `#policy` section holds a short bilingual
  summary plus a "View Entire Policy" button; edit its `lang-en`/`lang-zh`
  paragraphs directly in `index.html`. The full 8-section policy (trial
  lesson/enrollment, payment, cancellations, refunds, holidays,
  parent-teacher communication, minor-student supervision, written notices)
  lives on its own page, `policy.html`, sourced from the client's Google Doc
  and translated into Chinese. Edit the matching `lang-en`/`lang-zh` blocks
  there to update it.
- **Studio/brand name** — "Chen Wang Sax Studio" / "王晨萨克斯工作室" appears in
  the nav logo, hero heading, `<title>`, and footer. Chen's personal name
  ("Chen Wang" / "王晨") is kept in the About bio and elsewhere it refers to
  him specifically.

## Deploying to GitHub Pages

This repo is already connected to GitHub Pages. To publish changes:

```
git add -A
git commit -m "Update content"
git push
```

The live site updates at `https://ryttle.github.io/chenwangpage/` within a
minute or two.

## Analytics

Google Analytics (GA4) is installed on both pages via the standard `gtag.js`
snippet in `<head>`, measurement ID `G-YXYPZM3SN1`. View traffic at
[analytics.google.com](https://analytics.google.com/).

## SEO / AI answer optimization

- **Meta tags** — `index.html` and `policy.html` each have a unique `<title>`,
  meta description, canonical URL (pointed at `https://chenwangsaxstudio.com/`),
  and Open Graph / Twitter Card tags (using `hero.jpg` as the share image).
- **Structured data** — `index.html` has a JSON-LD `@graph` in the `<head>`
  with four entities: a `Person` (Chen Wang — bio, awards, alma maters), a
  `LocalBusiness`/`EducationalOrganization` (the studio — Bothell, WA;
  update the `address`/`areaServed` fields if the service area changes), a
  `Course` (private lessons — pricing, instructor, in-person location), and
  a `FAQPage` mirroring the on-page FAQ section word-for-word (Google
  requires this match — if you edit the FAQ section, edit the JSON-LD too).
- **FAQ section** (`#faq`) — bilingual `<details>` accordion answering the
  most likely search/AI-answer queries (trial lesson, location, pricing,
  cancellation policy, ages/levels, qualifications, judging). This is the
  highest-leverage section for AI answer engines (ChatGPT, Perplexity,
  Google AI Overviews) that lift direct Q&A content — keep answers factual
  and in sync with the Studio Policy section if pricing/policy changes.
- **`robots.txt`** — explicitly allows major AI crawlers (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, etc.) in addition to standard search bots,
  since the goal is to be discoverable by AI answer engines, not just Google.
- **`sitemap.xml`** — lists `index.html` and `policy.html`; referenced from
  `robots.txt`. Add new pages here if any are created.
- **Favicon** — `assets/favicon.svg`, a simple "CW" monogram in the site's
  brass color on a dark background.
- **`llms.txt`** — a curated markdown summary of the studio and Chen's bio
  for AI models/crawlers to consume directly, without parsing full HTML.
  Same idea as `robots.txt` but content-focused; keep it in sync with the
  FAQ/bio if either changes.
- **Image performance** — About/hero photos have explicit `width`/`height`
  attributes (prevents layout shift) and the hero image uses
  `fetchpriority="high"`; About photos use `loading="lazy"`. The About
  photos were also resized/recompressed (same crop, same orientation, EXIF
  orientation tag preserved) to cut load time — see "Photos" below for the
  size history.
- If the studio's location, hours, phone, or pricing change, update: the
  Contact section, Studio Policy section/page, the FAQ section, and the
  `LocalBusiness`/`Course` JSON-LD blocks — these can drift out of sync
  otherwise.

## File structure

```
index.html            Homepage content and structure
policy.html            Full Studio Policy (linked from the homepage's Studio Policy section)
assets/style.css       All styling
assets/script.js        Scroll reveal, sticky header, mobile nav, back-to-top
assets/photos/          Hero and About photos
assets/favicon.svg      Browser tab icon
robots.txt              Crawler rules (search + AI bots) + sitemap reference
sitemap.xml             URL list for search engines
llms.txt                Curated summary of the site for AI models/crawlers
```
