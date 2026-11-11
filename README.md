# IsBusiness · isuniverse.dev/business/

Website of IsBusiness: tailor-made websites for local businesses (design for mobile, WhatsApp bookings, Google).
Static project site on GitHub Pages (branch `main`, folder `/`), published at `/business/` using the owner site’s domain after cutover, Spanish by default and English with `?lang=en`, light and dark.

## Map

| Path | What |
|---|---|
| `index.html`, `legal/index.html`, `404.html` | The pages. Spanish is written in the HTML (`data-i18n` keys) |
| `i18n/es.json` | **Generated** from the HTML: `python3 tools/build_es.py` (also checks that `en.json` has the same keys) |
| `i18n/en.json` | English, written by hand, same keys |
| `assets/ds/` | Copy of the IsUniverse design system (portada `f03a82d`), identity comments removed, own `views.js` (page signal without client cookie/identifier to `stats.isuniverse.dev`; private server log may include IP for 30 days; never the Worker's address) |
| `assets/scene.js` | The intro scene: the official «Is» traced and inked, «Business» decoded; exit to the bar mark |
| `assets/business.js`, `assets/business.css` | Page behaviour and styles on top of the design system |
| `assets/data.js` | Contact details and WhatsApp/mail messages: the only place to change the number |
| `assets/boot.js` | Before first paint: waits for English when it was asked for |
| `assets/brand/` | Favicons (byte copies of the portada), `apple-touch-icon.png`, `og.png` |
| `tools/sync_mark.py` | Writes the official «Is» (path of `favicon-dark.svg`) into every page as `<symbol id="is-glyph">`; `--check` verifies it |
| `tools/og.html`, `tools/og.css` | Source of `assets/brand/og.png` (1200×630) |
| `qa/flows/` | Scripted journeys for `kit/tools/browser_check.mjs` |
| `qa/check_identity.sh` | Fails if the served files name a person, an employer or a personal mailbox |
| `.nojekyll`, `robots.txt`, `sitemap.xml` | Publishing |

## Rules

- **Brand only.** The site never names the person behind IsBusiness (`qa/check_identity.sh`). The legal page keeps the holder's data marked «Pendiente» until the owner fills them in.
- **The «Is» is never redrawn or set in a font**: it is the path of `assets/brand/favicon-dark.svg` (`tools/sync_mark.py --check`).
- **Strict CSP** in `<meta>` (GitHub Pages cannot send headers): only own resources, no inline code (JSON-LD excepted), no third parties, no cookies; the only connection is the page signal to `https://stats.isuniverse.dev` (`assets/ds/views.js`, isa-forms Worker on a neutral domain, F11). It sends no cookie or persistent visitor identifier and respects DNT/GPC. The private server log can include IP and network context for 30 days; aggregated counts omit IP and may remain longer, as explained in the published privacy notice.
- External links use `noopener noreferrer`; scripted openings use both features too. Alan reads only the local `assets/alan.json` and does not contact an AI service.
- **Branch `paused`** (orphan): the «temporalmente desactivada» page that IsPanel switches to (Pages source) to pause the site. Keep it available to IsPanel. It inherits the same domain as `main`.
- Commits without `Co-Authored-By: Claude`. Publish verified bundles through the owner's Chrome and the protected one-shot Actions workflow (see the private `kit`, `docs/03-publicar.md`); Codespaces is an alternative. This Mac cannot push to GitHub.

## Checks (from the parent folder `is-universe/`)

```bash
python3 business/tools/build_es.py && python3 business/tools/sync_mark.py --check && bash business/qa/check_identity.sh
python3 kit/tools/check_site.py business --base /business/
python3 kit/tools/serve_nostore.py /tmp/isuniverse-preview 8803  # mount this repo as business/
node kit/tools/browser_check.mjs http://127.0.0.1:8803/business/ --flow business/qa/flows/intro.js   # also lang.js, theme-faq.js
node kit/tools/browser_check.mjs http://127.0.0.1:8803/business/legal/ --flow business/qa/flows/legal.js
node kit/tools/browser_check.mjs http://127.0.0.1:8803/business/no-existe --expect-status 404
```

## Share image

Serve the folder, then `node kit/tools/browser_check.mjs http://127.0.0.1:8803/business/tools/og.html --widths 1200 --schemes dark --shots DIR`
and crop the top 1200×630 of `DIR/1200-dark.png` into `assets/brand/og.png`.

## Language recovery

The local design-system copy rejects failed HTTP dictionaries, keeps the committed language until its current request succeeds, and permits retry. Both language buttons are busy during a change; the accessible bar status explains a failure without exposing provider errors.
