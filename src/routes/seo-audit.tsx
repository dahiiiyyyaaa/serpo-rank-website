import { createFileRoute, redirect } from '@tanstack/react-router';

// Keep existing audit links working while booking lives on the homepage.
export const Route = createFileRoute('/seo-audit')({
  beforeLoad: () => {
    throw redirect({ to: '/', hash: 'book-free-audit' });
  },
});
