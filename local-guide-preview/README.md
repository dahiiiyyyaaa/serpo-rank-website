# Standalone editorial design preview

Open **http://127.0.0.1:8092/** while the local server is running.

Restart from the project directory with `node local-guide-preview/server.mjs`.
Regenerate the HTML with `node local-guide-preview/build-preview.mjs`.

## Files

- `index.html`: complete, server-delivered article, generated from the supplied original HTML.
- `editorial.css`: original responsive editorial layout.
- `brand-tokens.css`: generated palette copied from the main site's existing CSS variables.
- `brand-theme.css`: Serpo Rank system fonts, green typography, rounded CTAs, white/mint surfaces and footer treatment.
- `assets/serpo-rank-logo.webp` and `assets/serpo-rank-icon.png`: copies of the existing website logo and icon.
- `editorial.js`: active contents highlighting and responsive contents behavior. FAQs use native HTML details/summary.
- `build-preview.mjs`: content-preserving layout transformation and integrity checks.
- `server.mjs`: loopback-only local preview server with correct content types and noindex headers.
- `assets/`: the seven supplied original SVG diagrams. The funnel and review workflow also have responsive HTML presentations; their original graphics and alt text remain accessible.
- `design-validation.json`: original-content inventory results.
- `desktop-preview.png`: browser screenshot of the desktop preview.
- `brand-preview.png`: screenshot of the latest Serpo Rank theme. Browser checks confirmed the actual site heading/button colors, matching system font, working logo, and no overflow at 360px.
- `integrate-graphics.mjs` and `graphics.css`: placement, captions, responsive HTML equivalents and the corrected review workflow / original-observation audit matrix.
- `optimize-graphics.py`: repeatable WebP conversion using Pillow, with the supplied PNGs preserved.
- `graphics-manifest.json`: mappings from all eight supplied filenames to their placement names, source dimensions, original file sizes and delivery sizes.

## Completed checks

All 224 original content items retained; 35 original citation/contents links retained; seven original diagrams and alt texts retained; one H1; twelve article sections including the closing invitation; seven complete FAQs retained in HTML. All diagram URLs returned HTTP 200. Stylesheet and script have correct MIME types. Browser checks at 360px, 390px, 768px and 1440px found no horizontal page overflow. Tables scroll within their containers. Desktop contents is sticky and highlights the active section; mobile contents opens, follows its link, then closes. The FAQ opens using Enter. Browser console had no errors.

Live service routes verified: Local SEO, Technical SEO, On-Page SEO and Off-Page SEO returned HTTP 200 with the expected page headings. The website-development route redirects to the homepage, so no development-service link was added. The free-audit CTA targets the homepage's existing `#book-free-audit` section; no form was submitted.

## Before any publication

- The supplied hero and four informational graphics are integrated. The supplied revenue graphic has been removed; its hypothetical figures remain in readable HTML. The remaining responsive WebP variants are each below 200,000 bytes, including the full-width versions. At 1448px: hero 155,106 B; intent 127,454 B; profile 175,614 B; structure 102,764 B; vitals 128,956 B. Smaller 480px, 768px and 1200px variants are available. The supplied PNG originals are untouched.
- The supplied review graphic was rebuilt in HTML to include completion verification, communication eligibility, opt-outs, duplicate prevention, frequency limits and human approval, without promises about review ratings. The audit graphic was rebuilt as a semantic table using the article's original five business paragraphs and links, not the image's different findings. No new research findings are asserted.
- Mobile uses accessible HTML equivalents for dense infographics and the funnel. The desktop intent and technical graphics are framed around their three cards, removing their oversized image headings while retaining the text in the cards. The illustrative profile caption labels its rating/count/business details as fictional. Vitals caption preserves the article's inclusive CLS ≤0.1 threshold and avoids ranking promises.
- Graphics QA: six delivery images returned HTTP 200 with `image/webp`; the hero rendered from its responsive source. Browser checks at 360px, 768px and 1440px found no page overflow. The five audit rows stack with full-width business headings on phones. All TOC targets resolve, mobile navigation closes after following the selected link, the corrected workflow has five stages, and the browser console showed no errors. `graphics-preview.png` records the final hero.
- Confirm the accountable author and attribution. The preview has no claimed author or publication date.
- Confirm the actual release date, final canonical and article URL before adding publication-specific BlogPosting/BreadcrumbList markup or changing preview noindex directives.
- The five independent website reviews and citations retain the supplied wording and limitations. This design task did not re-research those findings; recheck them at publication.

No main-site route, navigation, homepage, service page, pricing page, form, deployment configuration or live file was modified. Nothing was committed, pushed or published.
