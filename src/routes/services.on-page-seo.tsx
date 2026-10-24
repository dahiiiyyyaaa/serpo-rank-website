import { createFileRoute } from "@tanstack/react-router";
import { OnPageSeoPage } from "@/components/site/pages";
import { seoHead, seoPages } from "@/data/seo";
export const Route = createFileRoute("/services/on-page-seo")({
 component: OnPageSeoPage,
 head: () => seoHead(seoPages.onPageSeo),
});
