import { createFileRoute } from "@tanstack/react-router";
import { TechnicalSeoPage } from "@/components/site/pages";
import { seoHead, seoPages } from "@/data/seo";
export const Route = createFileRoute("/services/technical-seo")({
 component: TechnicalSeoPage,
 head: () => seoHead(seoPages.technicalSeo),
});
