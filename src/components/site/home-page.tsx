import { ArrowRight } from 'lucide-react';
import { SiteLink } from '@/components/site/navigation';
import { homeContent } from '@/data/home';
import './home-page.css';

export function HomePage() {
  return <main className="home-page sr-home">
    <section className="sr-home__hero" aria-labelledby="sr-home-title">
      <div className="sr-home__container sr-home__hero-layout">
        <div className="sr-home__hero-copy">
          <span className="sr-home__eyebrow">{homeContent.hero.eyebrow}</span>
          <h1 id="sr-home-title">{homeContent.hero.title} <span>{homeContent.hero.highlight}</span></h1>
          <p>{homeContent.hero.description}</p>
          <div className="sr-home__actions">
            <SiteLink className="sr-home__button" to="/seo-audit">Book a Free SEO Audit <ArrowRight size={17} aria-hidden="true" /></SiteLink>
            <SiteLink className="sr-home__button sr-home__button--secondary" to="/services">Explore Our Services <ArrowRight size={17} aria-hidden="true" /></SiteLink>
          </div>
        </div>
        <figure className="sr-home__hero-art">
          <img src={homeContent.hero.image} srcSet={`${homeContent.hero.imageSmall} 768w, ${homeContent.hero.image} 1536w`} sizes="(max-width: 850px) calc(100vw - 40px), (max-width: 1100px) 52vw, 720px" alt={homeContent.hero.imageAlt} width={1536} height={1024} fetchPriority="high" decoding="async" />
        </figure>
      </div>
    </section>
  </main>;
}
