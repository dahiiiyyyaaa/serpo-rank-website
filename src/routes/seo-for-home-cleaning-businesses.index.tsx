import { createFileRoute } from '@tanstack/react-router';
import { Services } from '@/components/site/pages';
import { seoHead, seoPages } from '@/data/seo';

export const Route = createFileRoute('/seo-for-home-cleaning-businesses/')({
  component: Services,
  head: () => seoHead(seoPages.home),
});
