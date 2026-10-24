import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/services/seo-audits")({ beforeLoad: () => { throw redirect({ to: "/seo-audit" }); } });
