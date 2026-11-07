import { FeaturedGuide } from '@/components/site/featured-guide';
import { Footer } from '@/components/site/pages';

export function BlogIndex() {
  return <>
    <main className="blog-index-page">
      <div className="container blog-index-intro">
        <h1>SEO Insights and Resources for House Cleaning Businesses</h1>
        <p>Explore practical SEO strategies, expert guides, and actionable insights to help your cleaning business rank higher on Google.</p>
      </div>
      <FeaturedGuide showIntro={false} />
    </main>
    <Footer />
  </>;
}
