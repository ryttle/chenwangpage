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

## Trilingual (English / 中文 / Español)

Every piece of visible text has an English, Chinese, and Spanish version
living side by side in the HTML. There are three real URL trees — English at
`/` and `/policy.html`, Chinese at `/zh/` and `/zh/policy.html`, Spanish at
`/es/` and `/es/policy.html` — and the `<select id="langSelect">` dropdown in
the nav **navigates** between them (not an in-place content flip). The
dropdown replaced an earlier two-way toggle button once a third language made
a binary button unworkable; a `<select>` scales to any number of languages
without further UI changes.

- Each language's text is wrapped in `<span class="lang-en">`,
  `<span class="lang-zh">`, `<span class="lang-es">` (or a whole
  `<p class="lang-*">` for longer passages). Whichever languages aren't the
  page's active one carry a literal `hidden` attribute in the raw HTML.
  `assets/script.js`'s `applyLang()` sets/clears `hidden` on all three sets on
  initial load and on in-place flips — this works for any element type, so
  it's used uniformly for spans, paragraphs, and list items.
- **The `<select>` navigates, it doesn't just flip text.** Each page declares
  `window.ALT_LANG_URL` before `script.js` loads — a map of the *other* two
  languages to their relative URLs (e.g. `{ zh: 'zh/', es: 'es/' }` on
  `index.html`; `{ en: '../', es: '../es/' }` on `zh/index.html`; `{ en: '../',
  zh: '../zh/' }` on `es/index.html`). Choosing a language in the dropdown
  stores it in `localStorage` and navigates to that URL, preserving any
  `#section` hash so you land on the same section you were viewing. If the
  chosen language is the page's own native language (no `ALT_LANG_URL` entry
  for it), `applyLang()` just flips in place instead of navigating to itself.
- The active language is stored in `localStorage` (`lang` key) **only when
  the visitor explicitly changes the dropdown** — `applyLang()` takes a
  second `persist` argument, and the initial page-load call passes `false`.
  This matters: if every page load wrote to `localStorage`, simply visiting
  `/` would silently set `lang: 'en'`, which would then make `/zh/` or `/es/`
  incorrectly default to English on a later visit in the same browser even
  though the visitor never chose English. Passive-visit behavior is: `/`
  always shows English, `/zh/` always shows Chinese, `/es/` always shows
  Spanish, regardless of the visitor's browser/OS language — none of them
  overwrite a stored preference unless the dropdown is actually used.
- To edit any language's copy, find the matching `lang-en`/`lang-zh`/`lang-es`
  triplet in `index.html` (or `zh/index.html`, `es/index.html`) and edit the
  text directly — keep all three versions in sync when one changes.
- **Dedicated Chinese and Spanish URLs** (`/zh/index.html`, `/zh/policy.html`,
  `/es/index.html`, `/es/policy.html`) exist primarily for SEO/AI-crawler
  discoverability, and also serve as the dropdown's real navigation targets.
  Most crawlers — including AI bots like GPTBot and ClaudeBot — don't execute
  JavaScript, so on the English pages they only ever see the raw HTML, where
  non-English spans carry a literal `hidden` attribute; without dedicated
  URLs, Chinese/Spanish content would be invisible to those crawlers. The
  `/zh/` and `/es/` pages are the same markup with `hidden` flipped onto the
  other two languages' spans instead, an `<html lang="zh">`/`<html lang="es">`
  default, translated meta tags and JSON-LD, and reciprocal `hreflang` tags
  (`en`/`zh`/`es`/`x-default`) linking all three versions in every direction.
  - **Regenerating `/zh/` or `/es/` after editing content**: if you change
    the copy in `index.html` or `policy.html`, the `/zh/` and `/es/` copies
    need the same edit applied (mirrored, not literally copied — see the
    hidden-attribute swap above) plus their translated `<head>` (title, meta
    description, OG/Twitter tags, JSON-LD) kept in sync by hand — there's no
    build step that generates one from the other automatically.
  - **Watch out for compound classes when transforming `hidden` by script.**
    A real bug shipped early on: a transform that matched only the exact
    string `class="lang-en"` silently skipped elements with additional
    classes, like `class="policy-list lang-en"` — those blocks never got
    `hidden` added, so crawlers saw duplicate English+Chinese content in that
    one spot on the live `/zh/policy.html` for a while. If you write a script
    to regenerate a language variant, parse the `class` attribute's token
    list (e.g. `class="([^"]*\blang-(?:en|zh|es)\b[^"]*)"`) rather than
    matching the whole attribute value verbatim, and re-verify by counting
    `lang-en`/`lang-zh`/`lang-es` occurrences (they must match) after
    generating each variant.
- Client's Chinese name is 王晨 (used throughout the `lang-zh` content and
  page title); "Chen Wang" is used in English and Spanish — there's no
  separate Spanish brand name.

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

### Google Ads conversion tracking

Google Ads flagged the account as missing a Google tag; the actual gap was
that its "submit_lead_form" conversion action had no way to know a
submission happened, since the form is a cross-origin iframe (this page
can't observe what happens inside it directly). The fix has two halves:

- **Site side** (`assets/script.js`, `threadClientIdIntoForm`) — reads the
  visitor's GA4 client ID from the `_ga` cookie and appends it to the form
  iframe's `src` as `entry.1605451217` (the form's "Referral Tracking ID"
  field — a real, visible-but-unobtrusive short-answer question on the
  form, not required, labeled to discourage editing).
- **Apps Script side** (`Code.gs`, bound to the form — Extensions/⋮ menu →
  Apps Script) — `onFormSubmit(e)` reads that field back out (and excludes
  it from the notification email body), then calls `reportConversion()`,
  which POSTs a `submit_lead_form` event to the GA4 Measurement Protocol
  (`https://www.google-analytics.com/mp/collect`) using that client ID.
  GA4's own ad-click attribution (linked to the visitor via auto-tagging)
  then credits the right campaign automatically — no gclid handling needed.
- The Measurement Protocol API secret lives in the Apps Script project's
  **Script Properties** (`GA_MP_SECRET`, Project Settings → Script
  Properties) — not in the source — created under Analytics Admin → the
  `chenwangsaxstudio.com` property → Data streams → the web stream →
  Measurement Protocol API secrets.
- **One remaining manual step**: `submit_lead_form` needs to be marked as a
  **Key event** in GA4 (Admin → search "Key events") before Ads will treat
  it as a conversion — GA4 only offers that toggle once the event has
  appeared at least once in Realtime/Events. Validated the exact payload as
  correctly formed via Google's `/debug/mp/collect` endpoint and confirmed
  `onFormSubmit` runs without error on a real test submission, but hadn't
  seen `submit_lead_form` actually land in GA4's reports yet as of this
  writing (worth checking after a real visitor converts, since the test
  used a synthetic client ID with no prior browsing history, which GA4
  sometimes doesn't surface promptly).
- If the form's field structure ever changes, the `entry.1605451217` ID
  will break — regenerate it via the form editor's ⋮ menu → **Pre-fill
  form**, fill in the "Referral Tracking ID" field, click **Get link**,
  then read the new `entry.NNNNNN` param off the generated URL.

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
- **Testimonials** (`#testimonials`, between FAQ and Contact) — real reviews
  only, sourced from the Google Business Profile / Google Maps listing; never
  invent or paraphrase a quote. Each testimonial is credited as "Google Maps
  review", and the Chinese/Spanish versions note it's a translation (in both
  the visible copy and the JSON-LD `reviewBody`, since the original review is
  in English). Adding a new one: append another `.testimonial-card` block
  (see the existing one for structure) to `index.html`, `zh/index.html`, and
  `es/index.html`, and add a matching entry to the `review` array in all
  three files' JSON-LD — update `aggregateRating.reviewCount` (and
  `ratingValue` if the average changes) to match reality, since this must
  reflect the actual Business Profile rating.
- **Studio Policy** — the homepage `#policy` section holds a short trilingual
  summary plus a "View Entire Policy" button; edit its `lang-en`/`lang-zh`/
  `lang-es` paragraphs directly in `index.html`. The full 8-section policy
  (trial lesson/enrollment, payment, cancellations, refunds, holidays,
  parent-teacher communication, minor-student supervision, written notices)
  lives on its own page, `policy.html`, sourced from the client's Google Doc
  and translated into Chinese and Spanish. Edit the matching
  `lang-en`/`lang-zh`/`lang-es` blocks there to update it.
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
- **FAQ section** (`#faq`) — trilingual `<details>` accordion answering the
  most likely search/AI-answer queries (trial lesson, location, pricing,
  cancellation policy, ages/levels, qualifications, judging). This is the
  highest-leverage section for AI answer engines (ChatGPT, Perplexity,
  Google AI Overviews) that lift direct Q&A content — keep answers factual
  and in sync with the Studio Policy section if pricing/policy changes.
- **`robots.txt`** — explicitly allows major AI crawlers (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, etc.) in addition to standard search bots,
  since the goal is to be discoverable by AI answer engines, not just Google.
- **`sitemap.xml`** — lists all six pages (`index.html`, `policy.html`,
  `zh/index.html`, `zh/policy.html`, `es/index.html`, `es/policy.html`) with
  `xhtml:link` hreflang annotations on each; referenced from `robots.txt`.
  Add new pages here if any are created.
- **Favicon / logo mark** — `assets/logo-mark.png` (256×256), cropped from
  the client's logo artwork (`~/Desktop/icon logo chen wang.jpeg` — the
  circular CW/saxophone icon only, not the full lockup with "CHEN WANG SAX
  STUDIO" text below it, which doesn't fit a square icon or a horizontal nav
  bar). Used as both the favicon/`apple-touch-icon` and inline in the nav
  logo (`.logo-mark`, 28px, `border-radius: 50%` — the source has a cream
  background, not transparency, so the border-radius makes it read as an
  intentional circular badge rather than a mismatched square patch on the
  dark header). Quantized to a 16-color palette to keep the file small
  (~22KB) since it's essentially two-tone line art. To swap in a new logo,
  re-crop from source and overwrite this file — same filename, so no other
  changes needed unless the aspect ratio changes.
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
zh/index.html           Chinese-default mirror of index.html (SEO/AI-crawler entry point)
zh/policy.html          Chinese-default mirror of policy.html
es/index.html           Spanish-default mirror of index.html (SEO/AI-crawler entry point)
es/policy.html          Spanish-default mirror of policy.html
assets/style.css       All styling
assets/script.js        Scroll reveal, sticky header, mobile nav, back-to-top
assets/photos/          Hero and About photos
assets/logo-mark.png    Favicon + nav logo icon
robots.txt              Crawler rules (search + AI bots) + sitemap reference
sitemap.xml             URL list for search engines
llms.txt                Curated summary of the site for AI models/crawlers
```
