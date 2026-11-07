# Serpo Rank keyword cannibalization audit

**Audit date:** November 6, 2026 (Pacific time)
**Status:** Investigation and recommendations only. No production deployment, redirect, title, H1, content, canonical, or indexability change was made for this audit.

## Scope and evidence

- **Repository:** Inspected the TanStack routes, redirect map, SEO metadata, sitemap, article, shared navigation, and the production-prerendered HTML on the local `codex/brand-seo-favicon` branch. The branch includes a new `/blog` index that is not yet deployed.
- **Independent local crawl:** `node scripts/audit-keyword-cannibalization.mjs` examined all 10 URLs in `public/sitemap.xml`. It compared titles, H1s, canonical declarations, robots directives, main content, internal destinations, and five-word text shingles. `node scripts/verify-brand-seo.mjs` additionally passed canonical, internal-link, and reachability checks for all 10 pages.
- **Screaming Frog:** The [November 2 issues overview](https://docs.google.com/spreadsheets/d/13zNyYC_Z-a6YUj6qa8BAd-e7XHvQXoHqKnJjw6-VMuE/edit) contains 21 issue types, including **4 canonicalised URLs** and **4 parameter URLs**. It contains no URL-level exports of duplicate titles, H1s, exact duplicates, near duplicates, canonicals, indexability, or inlinks. No duplicate-content issue appears in the overview, but absence from this summary is not proof of absence in the old crawl.
- **Live site:** On November 6, `https://serporank.com/` and `http://serporank.com/` returned 301 to `/seo-for-home-cleaning-businesses/`; `/services` returned 301 to that homepage's `#our-seo-services` section. The canonical homepage and [guide](https://serporank.com/blog/house-cleaning-seo-guide) returned 200. **`https://serporank.com/blog` returned 404** because the index exists only on the unpushed local branch. The live sitemap contains nine canonical pages, not `/blog`.
- **Google Search Console:** The [domain property Performance report](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Aserporank.com) was accessible. Its 3-month selection displayed data from October 24 through November 4: **23 property-level clicks and 78 property-level impressions**. This is a very short history. Page-row totals are not additive to property totals because Google aggregates them differently; some queries are omitted from the query table. See [Google's Performance report documentation](https://support.google.com/webmasters/answer/7576553/performance-report-search) and [data limitations](https://support.google.com/webmasters/answer/17011259).

## Page and intent map

All 10 local sitemap pages have one H1, a unique title, a unique H1, a self-referencing canonical, and no `noindex` directive. No Phoenix or other city-specific landing page exists in the repository.

| URL path | Primary target / purpose | Search intent |
| --- | --- | --- |
| `/seo-for-home-cleaning-businesses/` | **SEO for home cleaning businesses**; also broad variants such as “SEO for home cleaning services” and “SEO for cleaning companies” | Broad commercial; preferred landing page |
| `/packages` | SEO packages and pricing for cleaning businesses | Transactional / pricing comparison |
| `/about` | Serpo Rank founder and credentials | Brand / trust |
| `/contact` | Contact Serpo Rank and request an SEO discussion | Navigational / lead action |
| `/blog` **(local only)** | SEO insights and resources for house cleaning businesses | Informational directory |
| `/blog/house-cleaning-seo-guide` | How to grow a house cleaning business with SEO | Informational guide |
| `/services/local-seo` | Local SEO for home cleaning businesses | Specialist commercial: Maps, profile and local visibility |
| `/services/on-page-seo` | On-page SEO for home cleaning businesses | Specialist commercial: page content and structure |
| `/services/technical-seo` | Technical SEO for home cleaning businesses | Specialist commercial: crawlability and site health |
| `/services/off-page-seo` | Off-page SEO for home cleaning businesses | Specialist commercial: links, mentions and authority |

The source also defines `/`, `/services`, `/seo-audit`, `/services/seo-audits`, `/services/website-development`, and `/pricing` as redirects. They are not additional indexable landing pages. The `seoPages.services` metadata repeats the homepage title in source, but `/services` redirects rather than serving an indexable duplicate.

## Duplicate-content and internal-link results

- **Duplicate titles:** none among the 10 local canonical pages.
- **Duplicate H1s:** none among the 10 local canonical pages.
- **Exact duplicate main content:** none.
- **Whole-page near duplicates:** no strong text match. The largest five-word-shingle Jaccard similarity was **1.8%**, between the homepage and planned Blog index. The next highest was **1.2%**, homepage versus Contact. This is a text-only diagnostic, not a semantic or ranking test.
- **Short-page containment:** **52% of the Blog index's five-word shingles also occur on the homepage** because the same featured-guide card is reused. The index has only about 56 words of main text, versus about 1,470 on the homepage. This is a real excerpt reuse, but the pages have different purposes and are not whole-page duplicates.
- **Internal links:** Every local sitemap page is reachable from the homepage; the crawl found no internal anchors to absent or noncanonical sitemap destinations. The homepage links to all four specialist service pages. The guide links to all four services and to the homepage/audit section. Service pages link home in shared navigation, but most lack a contextual, descriptive link to the broad commercial homepage in their main content. This is a possible enhancement, not a broken-link fix.
- **Canonical and indexability:** All 10 local canonical pages self-reference. The old URL variants redirect. The Screaming Frog summary's four canonicalised URLs cannot be attributed to specific pages without its URL-level export; they should not be treated as four confirmed errors.

## Search Console evidence

The following exact-query filters showed **one displayed page each**; no sampled query showed two Serpo Rank URLs competing in the same query's Pages table. All listed query rows had zero clicks.
The exact target phrase “SEO for home cleaning businesses” did not appear among the 13 displayed query rows in this reporting window.

| Exact query | Impressions | Displayed URL | Interpretation |
| --- | ---: | --- | --- |
| [seo for cleaning business](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Aserporank.com&breakdown=page&query=!seo%20for%20cleaning%20business) | 2 | `/blog/house-cleaning-seo-guide` | Broad phrase surfaced the guide, not the homepage, in this tiny sample. |
| [house cleaning seo](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Aserporank.com&breakdown=page&query=!house%20cleaning%20seo) | 2 | `/blog/house-cleaning-seo-guide` | Ambiguous informational/commercial phrase. |
| [seo for cleaners](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Aserporank.com&breakdown=page&query=!seo%20for%20cleaners) | 2 | `/blog/house-cleaning-seo-guide` | Broad phrase surfaced the guide. |
| [seo for cleaning companies](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Aserporank.com&breakdown=page&query=!seo%20for%20cleaning%20companies) | 1 | `/blog/house-cleaning-seo-guide` | Broad phrase surfaced the guide. |
| [on page seo for home services](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Aserporank.com&breakdown=page&query=!on%20page%20seo%20for%20home%20services) | 1 | `/services/on-page-seo` | Specialist query matched the specialist page. |

In the unfiltered Pages table, historical `/` variants still appeared: `https://serporank.com/` had 9 clicks/29 impressions, `http://serporank.com/` had 7/11, and `/services` had 1/12. The new homepage slug had no displayed row in this short Performance window. This does **not** prove the new slug is unindexed. [URL Inspection for the new homepage](https://search.google.com/search-console/inspect?resource_id=sc-domain%3Aserporank.com&id=oZCaBPXNwoFvcR_AklB9lw) reported **“URL is on Google”**, last crawled November 3, with the inspected URL as Google's selected canonical. [URL Inspection for the guide](https://search.google.com/search-console/inspect?resource_id=sc-domain%3Aserporank.com&id=thkZImClAKqQWR6wd2XV2w) reported the same indexed/canonical status, last crawled November 3.

The data does not establish a ranking-URL swap for the **same** query, a decline in clicks or impressions, or durable Google preference for the guide. The sample is too small and too close to the homepage migration. The property-level 23 clicks cannot be assigned to the displayed query rows, which each show zero clicks; Google's anonymization and aggregation rules can explain that discrepancy.

## Suspected clusters and recommended action

| Cluster and URLs | Current targeting / intent | Supporting evidence | Preferred URL | Action | Risk | Expected outcome and limit |
| --- | --- | --- | --- | --- | --- | --- |
| **1. Broad commercial vs guide:** homepage + `/blog/house-cleaning-seo-guide` | Homepage = broad commercial; guide = educational how-to | Four sampled broad phrases produced 7 guide impressions, 0 clicks, with no second URL in those query tables. Distinct title, H1 and content; both indexed separately. Screaming Frog has no URL-level duplicate row. | Homepage for commercial phrases; guide for informational phrases | **A: Keep both.** Monitor exact query→page data. If the pattern persists at meaningful volume, propose an approved content-focus revision and a natural contextual guide→homepage link. No canonical or redirect change. | **Medium** if changing content now; low for monitoring | Preserves the guide's informational value and the homepage's broad commercial role. No guaranteed ranking reassignment. |
| **2. Broad commercial vs specialist services:** homepage + four `/services/*-seo` pages | Broad SEO offer vs Local, On-Page, Technical and Off-Page specialist offers | Distinct H1s and main copy; very low pairwise five-word overlap. On-page-specific GSC query displayed only its service URL. No SF URL-level duplicate evidence. | Homepage for broad queries; each specialist page for its own subservice | **A: Keep all.** **B: Differentiate only if later query/page evidence shows persistent confusion.** | Low | Maintains useful routes for buyers with specific needs; shared “home cleaning businesses” wording is expected. |
| **3. Guide sections vs specialist pages:** guide + four service pages | Educational explanation vs hiring a specialist | Guide contains sections on local/on-page/technical/off-page SEO and already links to those service pages; no exact or near-duplicate main body. No sampled query showed both for one phrase. | Guide for how-to searches; service URL for commercial subservice searches | **A/C: Keep both and retain contextual links.** Do not canonicalize article sections to services. | Low | Readers can move from learning to the relevant service; links alone do not guarantee Google chooses a particular URL. |
| **4. Homepage vs planned Blog index:** homepage + `/blog` | Commercial homepage vs informational directory | The shared featured-guide card accounts for 52% of the short index's five-word shingles; whole-page similarity is only 1.8%. Blog index is currently local-only and live 404. No GSC data for it. | Each page for its own intent | **A now, B later:** Keep the hub separate. Before launch or as more articles arrive, consider unique editorial summary/list copy, subject to approval. Do not canonicalize it to the homepage. | Low to moderate | A more useful hub may improve clarity, but one-article hubs can remain short and there is no demonstrated performance harm. |
| **5. Homepage vs Pricing:** homepage + `/packages` | Broad commercial offer vs plan/pricing comparison | Distinct title/H1/main body; 0.5% five-word-shingle Jaccard. No query-level overlap shown. | Homepage for broad offer; `/packages` for pricing intent | **A: Keep both.** | Low | Preserves clear price evaluation path. |
| **6. Old URL variants:** `/`, `http://serporank.com/`, `/services` vs homepage slug | Historical versions, not separate intents | GSC historical page rows; current live 301 redirects; local sitemap lists only the new canonical homepage; URL Inspection agrees. SF overview says 4 canonicalised URLs but does not identify them. | `/seo-for-home-cleaning-businesses/` | **E: Keep the existing 301s and canonical/sitemap alignment.** Do not add new pages at old paths. | Low | Consolidates URL signals over time; old URLs can remain visible in historical GSC data. [Google treats redirects as a strong canonical signal](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). |

About and Contact were mapped and checked; neither forms a plausible cannibalization cluster in the current repository. No city-specific landing page was found or proposed.

## Prioritized implementation plan

1. **Now — no destructive SEO changes.** Keep the homepage as the preferred broad commercial URL. Do not merge, delete, noindex, or canonicalize the guide or specialist pages. No objectively broken local internal link or incorrect canonical was found, so no website code was changed in this audit.
2. **Before a future release — coordinate the Blog index.** The local branch has a `/blog` page and links to it, while production returns 404. Deploy the route and links together only when the user authorizes a release. This is a release-state issue, not keyword cannibalization.
3. **After several weeks of stable post-migration data — compare exact queries by page.** Track the broad phrases above, the intended “SEO for home cleaning businesses” phrase, specialist phrases, and the new homepage slug in Search Console. Compare weekly date ranges and whether one or multiple URLs appear for each query. Do not infer a trend from the current 1–2-impression samples.
4. **Only if the mismatch persists — draft content/link changes for approval.** A possible low-risk direction is one descriptive contextual link from the guide to the commercial homepage and clearer separation of commercial vs how-to copy. Present exact wording and placement before changing primary content, title, H1, or target keyword.
5. **Request URL-level exports for a stronger technical audit.** Screaming Frog exports for Titles, H1, Canonicals, Indexability, Exact/Near Duplicates, and Inlinks would allow the old crawl's four canonicalized URLs to be identified. Rerun the crawl after any approved release.

**Conclusion:** This is a *potential intent mismatch* for a handful of very low-volume broad queries, not confirmed keyword cannibalization. Google can show different URLs for different search intents even when pages share terms. Canonicalization is for duplicate or very similar URLs, not a way to make a distinct article rank as the homepage; see [Google's canonicalization explanation](https://developers.google.com/search/docs/crawling-indexing/canonicalization).
