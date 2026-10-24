import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/pages";
import { seoHead, seoPages } from "@/data/seo";
export const Route = createFileRoute("/contact")({
 component: Contact,
 head: () => seoHead(seoPages.contact),
});
