import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/pages";
import { seoHead, seoPages } from "@/data/seo";
export const Route = createFileRoute("/about")({
 component: About,
 head: () => seoHead(seoPages.about),
});
