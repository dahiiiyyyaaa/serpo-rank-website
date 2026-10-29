import { ArrowRight } from 'lucide-react';
import { SiteLink as Link } from '@/components/site/navigation';

const guidePath = '/blog/house-cleaning-seo-guide';
const imageBase = '/images/optimized/serpo_rank_featured_blog_photo-';

export function FeaturedGuide() {
  return <section className="container featured-guide" aria-labelledby="featured-guide-title">
    <div className="featured-guide-intro">
      <h2 id="featured-guide-title">Our Guide For Your Cleaning Business with Proven SEO Strategies.</h2>
      <p>Practical SEO strategies, local search insights, and actionable guides for cleaning business owners. Get the knowledge you need to attract more customers, rank higher, and grow your business online.</p>
    </div>
    <article className="featured-guide-card">
      <Link to={guidePath} className="featured-guide-image-link" aria-label="Read The Complete SEO Guide for Home Cleaning Businesses">
        <img
          src={`${imageBase}1200.webp`}
          srcSet={`${imageBase}480.webp 480w, ${imageBase}768.webp 768w, ${imageBase}1200.webp 1200w, /images/serpo_rank_featured_blog_photo.webp 1774w`}
          sizes="(max-width: 700px) calc(100vw - 68px), (max-width: 1100px) 48vw, 500px"
          width="1774"
          height="887"
          alt="Sage cleaning spray, folded towel, notebook and pen on a sunlit counter"
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="featured-guide-copy">
        <span className="eyebrow">FEATURED GUIDE</span>
        <h3><Link to={guidePath}>The Complete SEO Guide for Home Cleaning Businesses</Link></h3>
        <p>This guide explains how cleaning companies can connect Google Business Profile, service pages, customer reviews, and booking follow-up.</p>
        <Link className="featured-guide-read" to={guidePath}>Read the Full Guide <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
    </article>
  </section>;
}
