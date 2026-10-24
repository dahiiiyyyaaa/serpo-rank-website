import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/services/website-development")({
  beforeLoad: () => { throw redirect({ to: "/services" }); },
});
