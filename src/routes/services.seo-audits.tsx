import { createFileRoute, redirect } from "@tanstack/react-router";
import { homePath } from "@/data/site-paths";
export const Route = createFileRoute("/services/seo-audits")({ beforeLoad: () => { throw redirect({ to: homePath, hash: 'book-free-audit', search: true, statusCode: 301 }); } });
