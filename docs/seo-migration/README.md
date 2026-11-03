# Selected Screaming Frog findings and migration verification

Source: `issues_overview_report` in the connected Google Drive. The supplied sheet has category counts but no per-URL export; affected URLs below were established from the rendered site and source inspection.

| # | Finding | Assessment after local verification |
|---|---|---|
| 2 | URL parameters | Intentional plan/service selections on `/contact`; checked that four variants return 200 and canonically point to `/contact` while retaining the query. |
| 3 | Canonicalised | The old `/services` index is retired. Each of the nine indexable pages in the sitemap has one matching self-canonical. Contact variants remain deliberately canonicalised. |
| 4 | High external outlinks | The guide has research citations and public site observations. Three public site URLs were verified reachable; one timed out. Retain relevant citations. Remaining external destinations need a fresh crawl to establish reachability. |
| 5, 14 | Nofollow, noindex | Removed the guide's `noindex,nofollow`; guide now in sitemap. All nine indexable pages checked for unwanted directives. |
| 6, 10 | Empty link text, missing image alt | Linked header/footer logos now have `alt="Serpo Rank"`; all rendered image links have a visible or accessible name. Decorative article icon retains empty alt and is hidden from assistive technology. |
| 7 | Difficult readability | Simplified several long service passages without altering technical advice. Per-URL readability scores unavailable in the summary export; a future crawl can compare them. |
| 8, 16 | Missing nosniff and frame protection | Added to Node response wrapper and static-host `.htaccess`; local HTML, asset and redirect responses verified. |
| 11 | Short page | Contact is 157 words of main content. It has contact details, a form and booking option, so adding filler would not improve its purpose. |
| 12 | Missing CSP | Added a CSP in report-only mode covering local assets, Formspree and Calendly. Enforcement waits for live violation and integration checks. |
| 13 | Multiple H2 | Valid section hierarchy retained. Corrected one H2-to-H4 jump in the guide's mobile diagram. |
| 15 | Missing HSTS | Added initial `max-age=300` for HTTPS production responses only. Increase after live HTTPS verification; no subdomain or preload directive. |
| 17 | Large images | Four web assets reduced to 82–97 KB. Founder photograph retained byte-for-byte. |
| 18 | Internal 3xx | Internal links now target the final homepage sections. Eight legacy URL forms return one 301 hop in the local Node worker. |

`local-verification.json` records the 9 indexable page responses, 8 redirect forms, 4 contact variants, and 19 public resources checked. Browser smoke check confirmed the homepage navigation and sections. Live results are recorded after deployment.
