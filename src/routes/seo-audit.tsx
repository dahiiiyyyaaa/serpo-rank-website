import { createFileRoute, redirect } from '@tanstack/react-router';
import { homePath } from "@/data/site-paths";

// Keep existing audit links working while booking lives on the homepage.
export const Route = createFileRoute('/seo-audit')({
  beforeLoad: () => {
    throw redirect({ to: homePath, hash: 'book-free-audit', search: true, statusCode: 301 });
  },
});
