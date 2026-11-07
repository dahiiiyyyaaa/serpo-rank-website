import { createFileRoute } from "@tanstack/react-router";
import { SeoVsMetaAds } from "@/components/site/seo-vs-meta-ads";
import guideCss from "@/components/site/house-cleaning-guide.css?url";
import articleCss from "@/components/site/seo-vs-meta-ads.css?url";
import { siteOrigin } from "@/data/seo";
import { business } from "@/data/business";
import { buildEditorialArticleStructuredData, serializeJsonLd } from "@/data/structured-data";

const article = {
  path: "/blog/seo-vs-meta-ads",
  title: "SEO vs Meta Ads: Which Is Better for Your Local Business?",
  description:
    "Compare SEO and Meta ads for local service businesses using published 2025–2026 advertising benchmarks, customer intent, booking costs, and a practical 90-day plan.",
};
const articleUrl = `${siteOrigin}${article.path}`;
const articleImage = { path: "/images/blog/seo-vs-meta-ads-hero.jpg", width: 1280, height: 720 };

export const Route = createFileRoute("/blog/seo-vs-meta-ads")({
  component: SeoVsMetaAds,
  head: () => ({
    meta: [
      { title: article.title },
      { name: "description", content: article.description },
      { property: "og:title", content: article.title },
      { property: "og:description", content: article.description },
      { property: "og:type", content: "article" },
      { property: "og:site_name", content: business.name },
      { property: "og:url", content: articleUrl },
      { property: "og:image", content: `${siteOrigin}${articleImage.path}` },
      {
        property: "og:image:alt",
        content: "Cleaning supplies beside search and social media promotion illustrations",
      },
      { name: "twitter:title", content: article.title },
      { name: "twitter:description", content: article.description },
      { name: "twitter:image", content: `${siteOrigin}${articleImage.path}` },
    ],
    links: [
      { rel: "canonical", href: articleUrl },
      { rel: "stylesheet", href: guideCss },
      { rel: "stylesheet", href: articleCss },
    ],
    scripts: [
      {
        id: "serpo-rank-structured-data",
        type: "application/ld+json",
        children: serializeJsonLd(buildEditorialArticleStructuredData(article, articleImage)),
      },
    ],
  }),
});
