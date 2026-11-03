import { createFileRoute, redirect } from "@tanstack/react-router";
import { homePath } from "@/data/site-paths";

export const Route = createFileRoute("/services/website-development")({
  beforeLoad: () => { throw redirect({ to: homePath, hash: '', search: true, statusCode: 301 }); },
});
