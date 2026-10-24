import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/components/site/pages";
import { seoHead, seoPages } from "@/data/seo";
export const Route = createFileRoute("/packages")({
 component: Pricing,
 head: () => seoHead(seoPages.pricing),
});
