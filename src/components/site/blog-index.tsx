import { FeaturedGuide } from '@/components/site/featured-guide';
import { Footer } from '@/components/site/pages';

export function BlogIndex() {
  return <>
    <main className="blog-index-page">
      <div className="container blog-index-intro">
        <h1>SEO Guides for Home Cleaning Businesses</h1>
        <p>Explore practical guidance on getting found in search and making it easier for customers to contact your cleaning business.</p>
      </div>
      <FeaturedGuide />
    </main>
    <Footer />
  </>;
}
