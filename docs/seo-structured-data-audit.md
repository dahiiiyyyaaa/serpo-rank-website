# Serpo Rank structured-data audit and implementation

Checked: **27 October 2026**. Scope: existing TanStack Start/React site at https://serporank.com, plus its source and production build. This document records the pre-change public-site audit and the local implementation; it does not itself confirm a production deployment.

## Refined implementation brief

The supplied prompt already sets an appropriate evidence standard. These project-specific additions make it actionable:

1. Keep the existing routes, visible copy, design, and integrations. Use the current Services content at `/` as the homepage; treat `/services` as its canonical alias.
2. Maintain shared public business facts in `src/data/business.ts` and page metadata in `src/data/seo.ts`. Generate one connected graph per route through the existing `seoHead()` function.
3. Render the graph in server/prerendered HTML and replace it on client navigation. Escape JSON before embedding it in HTML. Test both paths.
4. Model only the four live SEO services and the overall homepage service. Google Business Profile management belongs to the local SEO service. Do not revive removed pages or misclassify the agency as a cleaning company.
5. Prefer the visible brand spelling “Serpo Rank”; retain the owner's supplied “SerpoRank” as an alternative name. Keep the founder's identity distinct from the organization.
6. Omit disputed offer details and unverified properties. Document content work separately. Separate schema validity from Google feature eligibility, and label checks actually run versus checks pending.

## A. Evidence and missing facts

| Finding | Evidence/source | Implementation consequence |
| --- | --- | --- |
| Serpo Rank supplies SEO to home cleaning businesses. | [Homepage](https://serporank.com/), hero, service cards, Why Work With Us | `Organization` is the provider; `BusinessAudience` represents cleaning-business owners. No cleaning-business or LocalBusiness classification. |
| Technical, on-page, local and off-page SEO are genuine service pages. | [Technical](https://serporank.com/services/technical-seo), [on-page](https://serporank.com/services/on-page-seo), [local](https://serporank.com/services/local-seo), [off-page](https://serporank.com/services/off-page-seo) | One distinct `Service` per page, each linked to the same organization. |
| GBP setup/management, local pages and review guidance are part of local SEO. | [Local SEO](https://serporank.com/services/local-seo), hero and scope | Describe within Local SEO; do not invent another page. |
| The agency works remotely from Pakistan, worldwide, primarily targeting the United States. | [Homepage](https://serporank.com/), Where We Work; [Contact](https://serporank.com/contact) | `areaServed: "Worldwide"` describes service coverage, not office locations. No invented US address, coordinates or branches. |
| The public founder name is Dahya. | [About](https://serporank.com/about); homepage founder section | `Person` uses Dahya, founder role and the existing portrait. No inferred legal name, age, completed degree, credential issuer or employment history. |
| Public enquiry email is dahiyabutt28@gmail.com. | [Contact](https://serporank.com/contact), email link; homepage audit section | Use in `Organization` and `ContactPoint`; no phone number inferred from a form placeholder or private account details. |
| The linked LinkedIn page identifies the founder, not an agency profile. | [About](https://serporank.com/about), “Connect with Dahya”; footer | No organization `sameAs`. External profile contents/ownership were not independently authenticated; no `sameAs` is emitted. |
| The existing public logo is an accessible 2172 × 724 image. | [Logo](https://serporank.com/images/serpo-rank-official-logo.jpg); checked local image | Shared `ImageObject`, referenced by the organization; same asset as existing social metadata. |
| Homepage and service-page titles/canonicals match the intended HTTPS domain. | All eight sitemap pages and `/services` fetched directly | Reuse metadata; `/services` keeps the homepage graph and canonical. |
| No JSON-LD, microdata, or RDFa was found in the sampled live pages/source. | Direct HTML inspection of the homepage, all four service pages, About, Contact, Pricing, and `/services`; source search | No previous schema to remove. Inject only via route heads, never a second component/plugin. |
| The site has FAQs and testimonials, but no published, evidence-backed case-study or blog/article routes were found. | Homepage, routes and [sitemap](https://serporank.com/sitemap.xml) | No Article, BlogPosting, Review, AggregateRating or invented author/date markup. Long service copy remains a `Service` page. Testimonials are not independently verified results. |
| Package prices are public, but deliverable counts conflict. | [Homepage](https://serporank.com/) cards versus [Pricing](https://serporank.com/packages) table | Defer `Offer`/`OfferCatalog` until content agrees. Do not silently choose a version. |
| Robots allows crawling; sitemap lists eight canonical pages. | [robots.txt](https://serporank.com/robots.txt), [sitemap.xml](https://serporank.com/sitemap.xml) | Retain existing rules and sitemap. No crawler-policy changes needed for this implementation. |

The public HTML fetches returned HTTP 200 for the eight canonical pages and `/services`, with primary text present in the initial response. No `noindex`/`nosnippet` robots meta or `X-Robots-Tag` restrictions were observed on those pages. These are fetch observations, not proof of indexing or crawler-specific firewall access. The web-research fetcher could not retrieve the homepage, but direct HTTPS retrieval from this workspace succeeded; the audit uses that HTML and the source, not a claimed visual/public-tool crawl.

Important unknowns: legal business name/registration, street address, business telephone, verified organization profiles, independently verified client outcomes, and authors/dates for future articles. None is required for the implemented semantic graph. No search volumes, ranking potential, conversion estimates, founding dates or guarantees have been inferred.

The visible package discrepancy is specific: homepage core-page counts are **10 / 20 / 20+**, whereas the comparison table says **4 / 8 / all core pages**; monthly blog counts are **2 / 3 / 4** versus **1 / 3 / 5**. Prices are $1,200 / $1,999 / $2,999; `/packages` states USD, no setup fee and a three-month initial term. Those prices and terms are recorded here as observed, not changed or marked up as offers.

## B. Page plan

Every implemented page includes the shared Organization, WebSite, logo ImageObject and ContactPoint nodes. Keyword clusters below are relevance candidates, not measured demand.

| Existing page | Search intent / candidate cluster | Page-specific schema | Relationships | Google feature position | Missing evidence |
| --- | --- | --- | --- | --- | --- |
| [Home](https://serporank.com/) | Choose an agency; SEO for home cleaning businesses, house-cleaning SEO, maid-service SEO | WebPage, overall Service, BusinessAudience, Person | Page → main Service → provider Organization and audience; Organization → founder | Organization identity/logo and WebSite site-name guidance apply; Service is semantic | Detailed offer consistency; independent results |
| [Local SEO](https://serporank.com/services/local-seo) — priority service | Local SEO for cleaning companies; GBP optimization | WebPage, Service, BusinessAudience, BreadcrumbList | Page ↔ Service; Service → agency/audience; Page → breadcrumb | Breadcrumb feature; no dedicated Service rich result | No blocker for present scope |
| [Technical SEO](https://serporank.com/services/technical-seo) | Technical SEO for cleaning websites | Same service-page types | Same service relationship, unique service ID | Breadcrumb feature; Service is semantic | No blocker |
| [On-page SEO](https://serporank.com/services/on-page-seo) | Cleaning-company page/content optimization | Same service-page types | Same service relationship, unique service ID | Breadcrumb feature; Service is semantic | No blocker |
| [Off-page SEO](https://serporank.com/services/off-page-seo) | Relevant links/citations for cleaning companies | Same service-page types | Same service relationship, unique service ID | Breadcrumb feature; Service is semantic | No blocker; no invented backlink outcomes |
| [About](https://serporank.com/about) | Evaluate founder and agency | AboutPage, Person, BreadcrumbList | Page → founder → worksFor Organization; Organization → founder | Breadcrumb feature; AboutPage/Person here are semantic | External credential/profile verification; no fabricated qualifications |
| [Contact](https://serporank.com/contact) | Discuss a project | ContactPage, BreadcrumbList | Page → Organization → ContactPoint | Breadcrumb feature; ContactPage is semantic | No unverified phone or address added |
| [Pricing](https://serporank.com/packages) | Compare cleaning-company SEO costs | WebPage, BreadcrumbList | Page → about Organization and website | Breadcrumb feature; no Product/review-star targeting | Reconcile deliverables before offers/catalog |
| [Services alias](https://serporank.com/services) | Same content as home | Identical homepage graph | Uses `/` canonical IDs throughout | Same as home; no extra identity or artificial Services breadcrumb | None |

`/pricing`, `/seo-audit`, `/services/seo-audits` and `/services/website-development` retain their existing redirect behavior. They do not receive independent service identities. The homepage audit is an enquiry path, not a separately invented service page or guaranteed instant audit result.

Proposed future content, **not created**: one original cleaning-industry case study with customer consent, dated baseline/follow-up measurements, exact work and attribution limits; useful educational pages answering buyer questions. Consider Article/BlogPosting only after real content, bylines and dates exist. No new URLs are assigned speculatively.

## C–D. Implementation and JSON-LD

- `src/data/business.ts`: shared public identity, language, contact email, logo, audience, service coverage and founder name.
- `src/data/structured-data.ts`: service descriptions, stable identifiers, page graph generator and safe serialization.
- `src/data/seo.ts`: existing route head helper now emits exactly one `application/ld+json` script, plus `og:site_name`. Existing titles/descriptions/canonicals remain the source for page nodes.
- `src/test/structured-data.test.tsx`: reference integrity, canonical alias, provider/audience distinction, safe script embedding and route-navigation tests.
- `scripts/verify-structured-data.mjs`: inspects built HTML for every sitemap page and the Services alias; checks head injection, canonical/title/description parity, logo asset and connected references.
- `vite.config.ts`: excludes query/fragment and duplicate trailing-slash variants from prerendering. The first verification run found an empty `/contact/index.html`: concurrently crawled plan-query links shared and overwrote that output file. The clean URL now renders once. Runtime links, query parameters and file routes are unchanged. [TanStack prerender filter](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering).

Stable IDs include `https://serporank.com/#organization`, `/#website`, `/#logo`, `/#contact`, `/#cleaning-business-audience`, `/about#founder`, and `[canonical URL]#webpage`, `#service`, `#breadcrumb`. Organization identity is reused across pages; there is no Organization `sameAs` pointing to a personal profile.

The separate, generated script blocks are in [homepage.html](json-ld/homepage.html) and [local-seo.html](json-ld/local-seo.html). They are reference exports of the production build, not extra scripts to paste into the application. They contain actual data rather than placeholders. Refresh them after changing metadata:

```sh
npm run test
npm run build
node scripts/verify-structured-data.mjs --examples
```

Existing TanStack routes call `seoHead()` and `HeadContent` renders the scripts. This works in prerendering/SSR and on client navigation. Do not add a competing global schema plugin or a second component injection. No new runtime dependency, external asset registry, UI, form behavior, content section or layout is introduced.

## E. Validation and feature limits

Validation performed and pending is recorded in [seo-validation.md](seo-validation.md). JSON syntax/reference checks are not a substitute for external vocabulary validation or Google's feature checks.

Pre-release/release checklist:

- [x] Run [Schema Markup Validator](https://validator.schema.org/) on the generated homepage and local SEO blocks. Both returned **0 errors and 0 warnings** on 27 October 2026. This was a code-snippet test, not a crawl of newly deployed markup.
- [x] Run [Rich Results Test](https://search.google.com/test/rich-results) on the homepage and a service page for features that Google actually supports. Live homepage: 1 valid Organization item. Live local SEO page: 2 valid items, Organization and Breadcrumbs. Service/BusinessAudience/AboutPage/ContactPage need not appear as separate supported results. Result links and evidence are in the validation record.
- [x] After deployment, fetch the public HTML and confirm one graph, correct canonical, working logo URL, and current title/description. All nine public pages matched the verified production graphs. Browser navigation to Contact replaced the homepage graph correctly.
- [ ] In Search Console URL Inspection, test the home and local SEO URLs live, inspect Google's rendered HTML and canonical choice, then request indexing when appropriate. Monitor the sitemap and indexing/enhancement reports available for the property.
- [ ] Keep every structured claim consistent with the corresponding public content. Recheck shared facts and pricing when packages change.

Eligibility distinctions (official guidance checked 27 October 2026):

- Organization markup helps disambiguate the agency and may influence its logo or search presentation; Google specifies no universally required Organization properties. It does not guarantee a knowledge panel. [Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization).
- WebSite name/url on the homepage support the site-name preference. No SearchAction is supplied because this site has no search function. [Site names](https://developers.google.com/search/docs/appearance/site-names).
- BreadcrumbList uses two ordered ListItems with name, position and canonical item URLs. Home → current page reflects the real navigation journey, rather than inventing a separate Services level. [Breadcrumb requirements](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).
- Service, BusinessAudience, WebPage, AboutPage, ContactPage, Person and ContactPoint provide semantic description here; their validity alone does not produce a standalone Google rich result. The logo ImageObject supports the Organization's logo property, not a new promised image result.
- Google stopped showing FAQ rich results on **7 May 2026**, and removed the feature documentation subsequently. Do not repeat the older “health/government only” eligibility rule as the current position. [Google documentation updates](https://developers.google.com/search/updates).
- HowTo rich results were deprecated in September 2023. [Google announcement](https://developers.google.com/search/blog/2023/08/howto-faq-changes).
- Self-serving Organization/LocalBusiness review markup is ineligible for review stars. No ratings, reviews, Product relabeling or invented offers are used here. [Review snippets](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).
- Accurate JSON-LD, representative content and crawl access are necessary considerations; valid markup does not guarantee a rich result. [General policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

Vocabulary references checked: [Organization](https://schema.org/Organization), [WebSite](https://schema.org/WebSite), [WebPage](https://schema.org/WebPage), [Service](https://schema.org/Service), [BusinessAudience](https://schema.org/BusinessAudience), [BreadcrumbList](https://schema.org/BreadcrumbList), [AboutPage](https://schema.org/AboutPage), [ContactPage](https://schema.org/ContactPage), [ContactPoint](https://schema.org/ContactPoint), [Person](https://schema.org/Person), [ImageObject](https://schema.org/ImageObject). Properties such as audience, areaServed and founder are useful optional semantic properties, not universal Google requirements.

## F. Prioritized next actions

| Priority / category | Action | Customer benefit | Effort |
| --- | --- | --- | --- |
| 1 — Content | Reconcile the actual package deliverables and minimum term across home, local SEO and Pricing. | Buyers know exactly what each package includes. | Low after owner confirms scope |
| 1 — Technical/schema | Review the local result, run external validators, deploy and inspect home/local SEO in Search Console. | Makes verified business/service information available to crawlers consistently. | Low |
| 2 — Content | Publish a genuine case study with permission, baseline, dates, work performed and limitations. | Owners can judge relevance and evidence instead of relying on vague testimonials. | Medium/high; requires evidence |
| 2 — Content | Explain what reports cover, how qualified enquiries are counted, likely dependencies/timing and factors affecting scope/cost. | Helps prospects compare the service and set realistic expectations. | Medium |
| 2 — Technical | Verify successful contact/audit delivery and consent-appropriate conversion measurement. Current Formspree/Calendly endpoints exist; no test enquiry was sent during this audit. | Interested customers can reach the agency and qualified leads can be measured. | Low/medium |
| 3 — Content | Link the relevant service page from future case studies and educational answers; publish accurate author bios and dates. | Helps a buyer follow evidence to the service they need. | Medium |
| 3 — Schema | Add verified organization profiles or offers when supporting facts/content are ready. | Makes identity and commercial terms less ambiguous. | Low once verified |

Google's AI experiences follow core search requirements; no special schema or AI file guarantees inclusion or citations. Keep content accessible, descriptive and useful. [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features).

For other platforms, current `User-agent: * / Allow: /` rules do not disallow their search crawlers. OpenAI distinguishes **OAI-SearchBot** (search) from **GPTBot** (potential model training); these controls are independent. PerplexityBot is for search discovery, not foundation-model training. Public fetch success does not establish that hosting/firewall rules allow their verified IP ranges. No training preference or firewall policy was changed. [OpenAI crawler guidance](https://developers.openai.com/api/docs/bots), [Perplexity crawler guidance](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

Measure relevant queries/pages in Search Console, then qualified enquiries and booked consultations from those landing pages. Use observable referral/UTM data and manually recorded citations where available. Search demand, content, competitors and indexing can all affect performance; schema alone cannot explain a traffic change. AI referrals can be missing/referrer-stripped, and no-click citations are not reliably counted by site analytics. No ranking, lead or AI-citation increase is promised.
