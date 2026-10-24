import type { LucideIcon } from 'lucide-react';
import { ChartNoAxesCombined, FileSearch, Link2, MapPin, Settings2 } from 'lucide-react';

export type Service = {
  slug: string;
  path?: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  { slug: 'local-seo', title: 'Local SEO', description: 'Rank in your area and get more local leads.', icon: MapPin },
  { slug: 'technical-seo', title: 'Technical SEO', description: 'Fix issues, improve speed and make your site search-engine friendly.', icon: Settings2 },
  { slug: 'on-page-seo', title: 'On-Page SEO', description: 'Optimize your website for better visibility and conversions.', icon: FileSearch },
  { slug: 'off-page-seo', title: 'Off-Page SEO', description: 'Build relevant links, brand mentions, citations, and trust beyond your website.', icon: Link2 },
  { slug: 'seo-audits', path: '/seo-audit', title: 'SEO Audits', description: 'Find what is holding you back and get a clear roadmap for improvement.', icon: ChartNoAxesCombined },
];
