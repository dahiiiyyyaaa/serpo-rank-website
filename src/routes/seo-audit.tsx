import { createFileRoute, redirect } from '@tanstack/react-router';

// Keep existing audit links working while booking lives on the Services page.
export const Route = createFileRoute('/seo-audit')({
  beforeLoad: () => {
    throw redirect({ to: '/services', hash: 'book-free-audit' });
  },
});
