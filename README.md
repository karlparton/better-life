# Better Life

Mobile typographic art: the words *"Everyone else is having a better life than me"*,
one per full-screen panel. Vertical scroll-snap, tall hand-drawn letters in white with a
black outline, a black rule under each panel, backgrounds alternating pink / red.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000 (toggle a mobile viewport in your browser's devtools).

## Layout

- `server.js` — tiny Express server; serves `public/` and binds to `process.env.PORT`.
- `public/index.html` — nine `<section>`s inside a `<main>` (the scroll container).
  Each word is pre-split into chunks of **max 3 letters per line**.
- `public/styles.css` — all styling. Every adjustable value is a CSS variable in `:root`.
- `public/controls.js` — the in-browser type playground (a dev aid; see below).

## Experimenting with the type

Two ways to tweak the design:

**1. The live control panel.** The panel is hidden by default. Reveal it by adding
`?edit` to the URL — e.g. http://localhost:3000/?edit — then tap the **⚙** gear
(top-right) to open it. Controls: font, weight, size, kerning, leading, outline
thickness, pink color, red color, border color, and border width. Changes apply
instantly and persist in `localStorage` (a refresh keeps them). **Reset** restores
defaults. **Copy CSS** copies a ready-to-paste `:root` block of your current settings.

Without `?edit`, the gear and panel stay hidden and the piece renders straight from the
CSS `:root` values — so the published art is clean, but you can edit anytime by visiting
the `?edit` URL.

**2. Edit the CSS directly.** Change the variables at the top of `public/styles.css`:

```css
:root {
  --font: "Londrina Solid", "Arial Narrow", sans-serif;
  --weight: 400;        /* 400 / 700 / 900 (font-dependent) */
  --fs: 22cqi;          /* word size, relative to panel width */
  --tracking: 0.08em;   /* letter spacing */
  --leading: 1.05;      /* line-height between stacked letters */
  --stroke: 9px;        /* letter outline thickness */
  --pink: #ff2d87;      /* odd panels */
  --red:  #ff1f23;      /* even panels */
  --border-color: #000000;
  --border-w: 9px;      /* bottom rule on each section */
}
```

To finalize a look: dial it in with the panel → **Copy CSS** → paste over the `:root`
block above.

### Available fonts

All loaded via Google Fonts in `index.html`: **Bangers**, **Londrina Solid**,
**Permanent Marker**, **Cabin Sketch**, **Patrick Hand**. To add another, add it to the
`<link>` in `index.html` and to the `FONTS` array in `controls.js`.

## Hiding the controls

The control panel is a development aid and is **hidden by default** — visitors never see
it. It only appears when the URL includes `?edit` (or `#edit`). So you can deploy as-is:
the public URL shows clean art, and you keep the controls for yourself at the `?edit` URL.

If you ever want to remove the dev aid entirely (rather than just hide it), delete these:

1. The file `public/controls.js`.
2. In `public/index.html`: the `<script src="controls.js"></script>` tag, plus the
   `<!-- Type playground (dev aid) -->` block (`<button id="panel-toggle">` and the whole
   `<aside id="panel">…</aside>`).
3. In `public/styles.css`: the `Type playground — live controls` block (from the
   `#panel-toggle` rule down to just above `.line`).

Either way, the art is driven entirely by the `:root` variables, so whatever values are
in the CSS are what ships.

## Deploy to Railway

Railway auto-detects Node from `package.json` and runs `npm start`; the server binds to
the `PORT` Railway injects.

- Push this repo to GitHub, then in Railway: **New Project → Deploy from GitHub repo**, or
- Use the CLI: `railway up`
