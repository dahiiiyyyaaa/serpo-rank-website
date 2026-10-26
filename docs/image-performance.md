# Image optimization

Optimized copies preserve the existing compositions, backgrounds, aspect ratios,
and CSS. Original assets are retained for future editing. The founder JPEG and
every founder image element are unchanged.

| Asset | Original bytes | Largest optimized variant bytes |
| --- | ---: | ---: |
| Official logo | 883,599 | 13,788 |
| Services hero | 1,843,832 | 115,168 |
| On-page SEO hero | 1,612,753 | 67,554 |
| Off-page SEO hero | 1,606,177 | 73,648 |

These are per-file reductions, not a claim that every asset downloads on every
page. The existing homepage hero is already responsive WebP and stays unchanged.
Its page benefits from the shared logo reduction.

`OptimizedImage` serves committed WebP variants using `srcSet` and `sizes`, reserves
intrinsic dimensions, prioritizes hero images, and defaults secondary images to
native lazy loading. Certificates use quality 92 to protect text. Illustrations
use quality 86. Already-small WebP originals remain the full-resolution options;
their smaller variants avoid sending desktop-sized files to mobile devices.

## Regeneration

Install Pillow 12.3.0 in a Python environment, then run:

```sh
python scripts/optimize-images.py
node node_modules/prettier/bin/prettier.cjs --write src/data/optimized-images.ts
```

Python and Pillow are development-only tools. The generated images and manifest
are committed, so normal builds require no new dependency or external image service.

## Validation

- Production Vite build passed.
- Existing routing test passed.
- New component and generated manifest passed ESLint.
- Production HTTP smoke checks passed for `/`, `/services`, the four SEO service
  routes, `/packages`, and `/about`, including every emitted image variant.
- Confirmed high-priority images are not lazy-loaded and optimized images have
  dimensions and responsive sources.
- Visually compared the logo, three large service illustrations, and a sample
  certificate at display size.
- Confirmed founder image bytes and all founder image markup match the base commit.
- TypeScript still reports pre-existing optional `hash` and possibly undefined
  carousel `active` errors. The same diagnostics occur on the base commit.
- The repository's pnpm configuration has an unresolved `core-js` build-script
  setting. Dependencies installed, but pnpm's automatic dependency check fails;
  build/tests were run directly through their installed Node entrypoints.
- Browser rendering and timing checks were unavailable because the Chromium
  download returned an invalid archive. No live load-time result is claimed.

After deployment, run repeated mobile PageSpeed/Lighthouse checks on the homepage
and service pages. Record LCP separately from the load event; use the same device
and network profile when comparing. The requested 3.2–3.5-second load target
requires deployed measurements. Hosting response time, scripts, and fonts also
affect it. Hosting/cache configuration was not changed without a verified target.
