# Alex Rivers — Saxophonist Website

A single-page site for a saxophone player: hero intro, bio, YouTube performance
embeds, SoundCloud recordings, and a Google Form contact section. Plain
HTML/CSS/JS — no build step, deploys straight to GitHub Pages.

## Preview locally

Open `index.html` directly in a browser, or run a local server from this folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Customize the content

All placeholders are marked with `[brackets]` or `YOUR_..._HERE` and are easy
to find with a search for "YOUR_" or "[" in `index.html`.

1. **Name & bio** — edit the hero (`<h1>`) and About section text directly in `index.html`.
2. **Photo** — replace the `.photo-placeholder` div with
   `<img src="assets/photo.jpg" alt="...">` and drop a photo in `assets/`.
3. **YouTube videos** — for each `video-embed` iframe, replace
   `YOUR_YOUTUBE_VIDEO_ID` with the ID from the video's URL
   (`youtube.com/watch?v=THIS_PART`). Update the caption text below each.
4. **SoundCloud tracks** — for each `audio-card` iframe, replace
   `YOUR_SOUNDCLOUD_TRACK_URL` with the track's public share URL,
   URL-encoded (e.g. `https%3A//soundcloud.com/artist/track-name`).
5. **Contact email / location** — edit the list in the Contact section.
6. **Social links** — update the footer `<a href="#">` links.

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

## Deploying to GitHub Pages

From this folder:

```
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then in the GitHub repo: **Settings → Pages → Source → Deploy from branch →
main / (root)**. The site will be live at
`https://<your-username>.github.io/<repo-name>/` within a few minutes.

## File structure

```
index.html          Page content and structure
assets/style.css     All styling
assets/script.js      Mobile nav toggle + footer year
```
