import { createFileRoute } from '@tanstack/react-router';
import { BlogIndex } from '@/components/site/blog-index';
import { seoHead, seoPages } from '@/data/seo';

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
  head: () => seoHead(seoPages.blog),
});
