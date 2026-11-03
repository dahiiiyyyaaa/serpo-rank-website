import { createFileRoute, redirect } from "@tanstack/react-router";
import { homePath } from "@/data/site-paths";

export const Route = createFileRoute("/services/")({
 beforeLoad: () => {
   throw redirect({ to: homePath, hash: 'our-seo-services', search: true, statusCode: 301 });
 },
});
