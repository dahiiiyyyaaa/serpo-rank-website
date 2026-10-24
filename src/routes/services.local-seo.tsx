import { createFileRoute } from "@tanstack/react-router";
import { LocalSeoPage } from "@/components/site/pages";
import { seoHead, seoPages } from "@/data/seo";
export const Route = createFileRoute("/services/local-seo")({
 component: LocalSeoPage,
 head: () => seoHead(seoPages.localSeo),
});
