import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/site/pages";
import { seoHead, seoPages } from "@/data/seo";
export const Route = createFileRoute("/")({
 component: Home,
 head: () => seoHead(seoPages.home),
});
