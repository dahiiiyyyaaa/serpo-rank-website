# Structured-data verification — 27 October 2026

This is the pre-deployment verification record for the local implementation and generated production HTML, captured before publication.

| Check actually run | Result |
| --- | --- |
| Existing site HTTP audit | Eight canonical pages and `/services` returned 200; zero existing JSON-LD scripts. Canonicals, robots directives, sitemap and rendered text inspected. |
| Public logo HTTP check | 200, `image/jpeg`, 96,752 bytes, no X-Robots-Tag restriction. |
| `node node_modules/vitest/vitest.mjs run` | 2 test files, **18 tests passed**. Includes reference integrity, safe serialization, alias handling and repeated client-route navigation with exactly one graph. |
| `node node_modules/typescript/bin/tsc --noEmit` | Passed. |
| Targeted ESLint for changed TS/TSX and Vite config, with Prettier formatting rule disabled | Passed. This is not a claim that repository-wide formatting/lint passed. |
| `node node_modules/vite/bin/vite.js build` | Passed, including SSR and prerendering. Vite reports a non-fatal >500 kB client-chunk warning; this work does not claim to fix the site's overall JS payload. |
| `node scripts/verify-structured-data.mjs --examples` | **9 pages passed**: all eight sitemap pages plus `/services`. JSON parses, entity references resolve, one script is in each HTML head, metadata matches, and logo file exists. |
| Schema Markup Validator — homepage code | **0 errors, 0 warnings**. [Evidence](validation/schema-homepage.png). |
| Schema Markup Validator — local SEO code | **0 errors, 0 warnings**. [Evidence](validation/schema-local-seo.png). |
| Google Rich Results Test — local SEO code | **2 valid items**: Organization and Breadcrumbs. [Result](https://search.google.com/test/rich-results/result?id=YWrlw0XEZC4D-Ihtraql3Q), [evidence](validation/google-local-seo.png). |

The first build inspection failed because `/contact/index.html` was empty. The prerenderer stripped query strings when choosing output filenames while crawling several plan-query links in parallel. Filtering query/fragment and duplicate trailing-slash variants from prerendering fixed the collision. The second build and nine-page artifact verification passed. No file routes or user-facing contact links were changed.

The JSON-LD examples in `docs/json-ld/` were extracted from that verified build. These external tests used **code input**, not the existing live URLs, because they preceded publication. They validate markup; they do not establish indexing, rich-result display, rankings or AI citations.

## Post-deployment verification

Implementation commit `ff9b8ec46cf601ff72407fd45e75b50b289c2a68` was pushed to `main`. Hosting.com's automatic build succeeded. The existing Node worker continued serving the previous version until its startup command was saved again; after that refresh the new markup was publicly accessible.

- All eight canonical sitemap pages and `/services` returned HTTP 200. Each public graph matched the corresponding verified production graph exactly, with one JSON-LD script, the expected canonical/title, and rendered main heading.
- The public logo returned HTTP 200, `image/jpeg`, 96,752 bytes. One initial socket-close error was resolved on a fresh request.
- Google Rich Results Test, **live homepage URL**: **1 valid Organization item**, crawl successful. [Result](https://search.google.com/test/rich-results/result?id=IBSbolzdE5I1aZInSDiMow), [evidence](validation/google-homepage-live.png).
- Google Rich Results Test, **live local SEO URL**: **2 valid items**, Organization and Breadcrumbs, crawl successful. [Result](https://search.google.com/test/rich-results/result?id=FCisF6bgfONKaSfSy9yGXw), [evidence](validation/google-local-seo-live.png).
- Browser verification: homepage stylesheet loaded, no completed broken images; clicking Contact replaced the homepage graph with exactly one ContactPage graph. Navigation back to Home worked.

Remaining monitoring / account checks: Search Console URL Inspection/rendered HTML and canonical choice, indexing observation, and enquiry/conversion tracking verification. No enquiry was submitted and no Google indexing request was made during this task. Rich-results validation is not an indexing or ranking guarantee.
