import { FeaturedGuide } from '@/components/site/featured-guide';
import { Footer } from '@/components/site/pages';
import { SiteLink as Link } from '@/components/site/navigation';
import { ArrowRight } from 'lucide-react';

export function BlogIndex() {
  return <>
    <main className="blog-index-page">
      <div className="container blog-index-intro">
        <h1>SEO Insights and Resources for House Cleaning Businesses</h1>
        <p>Explore practical SEO strategies, expert guides, and actionable insights to help your cleaning business rank higher on Google.</p>
      </div>
      <FeaturedGuide showIntro={false} />
      <section className="container featured-guide blog-article-list" aria-label="More SEO guides">
        <article className="featured-guide-card">
          <Link to="/blog/seo-vs-meta-ads" className="featured-guide-image-link" aria-label="Read SEO vs Meta Ads: Which Is Better for Your Local Business?">
            <img src="/images/blog/seo-vs-meta-ads-hero.jpg" width="1280" height="720" alt="Cleaning supplies beside search and social media promotion illustrations" loading="lazy" decoding="async" />
          </Link>
          <div className="featured-guide-copy">
            <span className="eyebrow">MARKETING GUIDE</span>
            <h2 className="featured-guide-heading"><Link to="/blog/seo-vs-meta-ads">SEO vs Meta Ads: Which Is Better for Your Local Business?</Link></h2>
            <p>An in-depth comparison of costs, conversions, customer acquisition, and long-term growth for local service businesses.</p>
            <Link className="featured-guide-read" to="/blog/seo-vs-meta-ads">Read the Full Guide <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </article>
      </section>
    </main>
    <Footer />
  </>;
}
