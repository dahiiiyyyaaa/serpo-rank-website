import { createFileRoute } from "@tanstack/react-router";
import { OffPageSeoPage } from "@/components/site/pages";
import { seoHead, seoPages } from "@/data/seo";

export const Route = createFileRoute("/services/off-page-seo")({
  component: OffPageSeoPage,
  head: () => seoHead(seoPages.offPageSeo),
});
