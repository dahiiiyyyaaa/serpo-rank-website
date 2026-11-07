import { createFileRoute } from '@tanstack/react-router';
import { HouseCleaningGuide } from '@/components/site/house-cleaning-guide';
import guideCss from '@/components/site/house-cleaning-guide.css?url';
import { siteOrigin } from '@/data/seo';
import { business } from '@/data/business';
import { buildGuideStructuredData, serializeJsonLd } from '@/data/structured-data';

const guidePage = {
  path: '/blog/house-cleaning-seo-guide',
  title: 'How to Grow Your Home Cleaning Business, With the Help of SEO',
  description: 'Learn how local SEO, Google Business Profile optimization, and on-page SEO strategies can help your home cleaning business rank higher and convert leads into bookings.',
};
const guideUrl = `${siteOrigin}${guidePage.path}`;
const guideHeadline = 'How To Grow Your House Cleaning Business with SEO; A Complete Guide To More Visibility, More Leads, More Bookings.';

export const Route = createFileRoute('/blog/house-cleaning-seo-guide')({
  component: HouseCleaningGuide,
  head: () => ({
    meta: [
      { title: guidePage.title },
      { name: 'description', content: guidePage.description },
      { property: 'og:title', content: guidePage.title },
      { property: 'og:description', content: guidePage.description },
      { property: 'og:type', content: 'article' },
      { property: 'og:site_name', content: business.name },
      { property: 'og:url', content: guideUrl },
      { property: 'og:image', content: `${siteOrigin}${business.logo.path}` },
      { property: 'og:image:alt', content: `${business.name} logo` },
      { name: 'twitter:title', content: guidePage.title },
      { name: 'twitter:description', content: guidePage.description },
      { name: 'twitter:image', content: `${siteOrigin}${business.logo.path}` },
    ],
    links: [
      { rel: 'canonical', href: guideUrl },
      { rel: 'stylesheet', href: guideCss },
    ],
    scripts: [{
      id: 'serpo-rank-structured-data',
      type: 'application/ld+json',
      children: serializeJsonLd(buildGuideStructuredData(guidePage, guideHeadline)),
    }],
  }),
});
