import { OptimizedImage } from '@/components/site/optimized-image';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { SiteLink as Link, SiteNavLink as NavLink, useSiteLocation as useLocation } from '@/components/site/navigation';
import { Button } from '@/components/ui/button';
import { homeFaqs } from '@/components/site/home-faq';
import { CalendlyBookingOption, ProjectEnquiryCTA } from '@/components/site/project-enquiry-cta';
import * as Accordion from '@radix-ui/react-accordion';
import { ArrowRight, CalendarDays, ChartNoAxesCombined, CheckCircle2, Clock3, Code2, FileText, Gift, Heading2, Image, Link2, Linkedin, Mail, MapPin, Megaphone, Menu, MessageCircle, Monitor, MousePointerClick, PanelTop, SearchCheck, Settings2, ShieldCheck, Star, Target, Users, UsersRound, X, Zap, type LucideIcon } from 'lucide-react';
import { services, type Service } from '@/data/services';
import { seoPages, siteOrigin } from '@/data/seo';
import onPageSeoArticle from '@/content/on-page-seo.md?raw';
import offPageSeoArticle from '@/content/off-page-seo.md?raw';
import technicalSeoArticle from '@/content/technical-seo.md?raw';
import { HomePage } from '@/components/site/home-page';


const imagePaths = {
  logo: "/images/serpo-rank-official-logo.png",
  homeHero: "/images/home-seo-hero.png",
  hero: "/images/cleaning-hero.jpeg",
  howItWorks: "/images/cleaning-process-photo.jpeg",
  whereWeWork: "/images/global-service-area.jpeg",
  servicesHero: "/images/services-hero.png",
  servicesCta: "/images/services-growth.webp",
  onpageHero: "/images/on-page-seo-hero.png",
  offpageHero: "/images/off-page-seo-hero.png",
  onpageWhy: "/images/content-audit.svg",
  localHero: "/images/local-seo-hero.webp",
  localWhy: "/images/cleaning-process.svg",
  localWhyResults: "/images/local-search-results.webp",
  technicalHero: "/images/technical-seo-hero.webp",
  websiteHero: "/images/website-development.svg",
};

const FORM_ENDPOINT = 'https://formspree.io/f/mkjobvrn';
const servicePath = (service: { slug: string; path?: string }) => service.path || `/services/${service.slug}`;

const contactServices = ['Technical SEO', 'SEO Audit', 'Consultation', 'On-Page SEO', 'Local SEO', 'Off-Page SEO', 'SEO Packages'];

const serviceCards = [
  { number: '01', slug: 'technical-seo', title: 'Technical SEO', icon: Settings2, description: 'Identify technical issues affecting crawling, indexing, site structure, and website performance.' },
  { number: '02', slug: 'on-page-seo', title: 'On-Page SEO', icon: FileText, description: 'Align your pages with relevant searches through better content structure, search intent, metadata, and internal linking.' },
  { number: '03', slug: 'local-seo', title: 'Local SEO', icon: MapPin, description: 'Improve your local search foundations through Google Business Profile optimisation, location relevance, and local business information.' },
  { number: '04', slug: 'off-page-seo', title: 'Off-Page SEO', icon: Link2, description: 'Build relevant links, brand mentions, citations, and trust beyond your website.' },
];

const serviceProblems = [
  { title: 'Your website isn’t attracting relevant search traffic.', text: 'We examine keyword targeting, search intent, page relevance, and technical accessibility to identify opportunities to improve organic visibility.', icon: SearchCheck },
  { title: 'Your cleaning services aren’t clearly represented online.', text: 'We review how your services and service areas are organised, how individual pages communicate what you offer, and whether your content addresses the questions potential customers are searching for.', icon: FileText },
  { title: 'Your business has limited local search visibility.', text: 'We assess relevant local SEO factors, including your Google Business Profile, business information, location relevance, and local landing pages where appropriate.', icon: MapPin },
  { title: 'Visitors aren’t taking the next step.', text: 'We review calls to action, mobile usability, quote-request forms, and other elements that influence how easily visitors can contact your business.', icon: MousePointerClick },
];

const serviceProcess = [
  { number: '01', title: 'Understand your business', text: 'We learn about your cleaning services, target customers, service areas, competitors, and business objectives.' },
  { number: '02', title: 'Audit your website', text: 'We review relevant technical SEO, on-page elements, site structure, search visibility, and user experience.' },
  { number: '03', title: 'Prioritise the work', text: 'We organise findings by relevance, impact, and implementation effort, creating a practical plan rather than an undifferentiated list of issues.' },
  { number: '04', title: 'Implement improvements', text: 'Work may include resolving technical problems, improving service pages, strengthening internal links, or addressing local search opportunities.' },
  { number: '05', title: 'Monitor and refine', text: 'We review available performance data, identify changes worth investigating, and use findings to guide subsequent optimisation.' },
];

const serviceFaqs = [
  { question: 'Who are your SEO services for?', answer: 'Our services are designed for home cleaning businesses. We tailor SEO recommendations to the services you offer, the customers you want to reach, and the areas your business serves.' },
  { question: 'Do you work with cleaning businesses in the United States?', answer: 'Yes. Serpo Rank works remotely with cleaning businesses, with a primary focus on the United States. Recommendations are tailored to each business and its market.' },
  { question: 'Which SEO services do you provide?', answer: 'Services include technical SEO, on-page SEO, local SEO, and off-page SEO. The work is scoped around your website, goals, and agreed priorities.' },
  { question: 'How long does SEO take to work?', answer: 'Timing varies with your website, competition, market, and the improvements involved. SEO is an ongoing process, and we do not promise a specific ranking or timeframe.' },
  { question: 'How do you measure SEO progress?', answer: 'We review available search visibility, website performance, and enquiry-related information, then discuss what changed and which next steps make sense.' },
  { question: 'How can I find out what my website needs?', answer: 'Request a free SEO audit. It provides a starting point for identifying possible technical, on-page, and local search opportunities on your website.' },
];

const combinedServicesFaqs = [
  ...homeFaqs,
  ...serviceFaqs.filter(({ question }) => ![
    'Which SEO services do you provide?',
    'How long does SEO take to work?',
  ].includes(question)),
];

const pricingPlans = [
  { slug: 'foundation', name: 'Lite', price: '1,200', badge: '', summary: 'Perfect for getting started.', features: [
    '1–2 service areas targeted', 'Up to 10 core pages optimized', 'Technical and on-page audit',
    'Prioritized monthly technical fixes', 'Keyword research and mapping', '2 blog articles per month',
    'Basic monthly link outreach', 'Initial local citation cleanup and setup',
    'Google Business Profile optimization and updates', 'Review-request guidance', 'Monthly dashboard and summary',
  ] },
  { slug: 'growth', name: 'Plus', price: '1,999', badge: 'Recommended for growing businesses', summary: 'More reach. More bookings.', features: [
    '3–5 service areas targeted', 'Up to 20 core pages optimized', 'Technical and on-page audit',
    'Prioritized monthly technical fixes', 'Keyword research and mapping', '3 blog articles per month',
    'Expanded monthly link outreach', 'Broader local citation cleanup and setup',
    'Google Business Profile optimization and updates', 'Review-request guidance', 'Monthly dashboard and summary',
  ] },
  { slug: 'expansion', name: 'Premium', price: '2,999', badge: '', summary: 'Maximum visibility and growth.', features: [
    '6+ service areas targeted', '20+ core pages optimized', 'Technical and on-page audit',
    'Expanded monthly technical SEO scope', 'Keyword research and mapping', '4 blog articles per month',
    'Highest planned monthly link outreach scope', 'Multi-area citation cleanup and setup',
    'Google Business Profile multi-area strategy where applicable', 'Review-request guidance',
    'Monthly dashboard and recorded walkthrough',
  ] },
] as const;

const pricingRows = [
  { label: 'Service areas targeted', values: ['1–2 cities', '3–5 cities', '6+ cities'] },
  { label: 'Core pages optimized', values: ['Up to 4 pages', 'Up to 8 pages', 'All core pages'] },
  { label: 'Technical & on-page audit', values: ['Included', 'Included', 'Included'] },
  { label: 'Ongoing technical fixes', values: ['Prioritized monthly', 'Prioritized monthly', 'Expanded monthly scope'] },
  { label: 'Keyword research & mapping', values: ['Included', 'Included', 'Included'] },
  { label: 'Blog content', values: ['1 SEO blog post/month', '3 SEO blog posts/month', '5 SEO blog posts/month'] },
  { label: 'Backlinks', values: ['1 backlink/month', '2 backlinks/month', '4 backlinks/month'] },
  { label: 'Local citations', values: ['Initial cleanup & setup', 'Broader cleanup & setup', 'Multi-area cleanup & setup'] },
  { label: 'Google Business Profile', values: ['Optimization & updates', 'Optimization & updates', 'Multi-area strategy where applicable'] },
  { label: 'Review process', values: ['Review-request guidance', 'Review-request guidance', 'Review-request guidance'] },
  { label: 'Lead tracking & reporting', values: ['Monthly dashboard + summary', 'Monthly dashboard + summary', 'Monthly dashboard + recorded walkthrough'] },
] as const;

const certificates = [
  { provider: 'Semrush Academy', title: 'Local SEO Essentials', image: '/images/certificate-local-seo.jpeg' },
  { provider: 'CXL', title: 'Bottom-of-Funnel SEO Strategies', image: '/images/certificate-bottom-funnel.jpeg' },
  { provider: 'Semrush Academy', title: 'On-Page SEO and AI Search Essentials', image: '/images/certificate-on-page-seo.jpeg' },
  { provider: 'Semrush Academy', title: 'Technical SEO and AI Search Essentials', image: '/images/certificate-technical-seo.jpeg' },
  { provider: 'CXL', title: 'Create Research-Backed and Search-Optimized Content', image: '/images/certificate-cxl-content-research.jpeg' },
  { provider: 'Semrush Academy', title: 'Keyword Research Essentials', image: '/images/certificate-semrush-keyword-research.jpeg' },
  { provider: 'CXL', title: 'On-Page, On-Site & Programmatic SEO', image: '/images/certificate-cxl-on-page-programmatic.jpeg' },
  { provider: 'CXL', title: 'SEO Driven Editorial Calendar', image: '/images/certificate-cxl-editorial-calendar.jpeg' },
] as const;

function Logo() {
  return <Link className="logo" to="/" aria-label="Serpo Rank home"><OptimizedImage loading="eager" sizes="(max-width: 700px) 320px, 413px" src={imagePaths.logo} alt="" width="2172" height="724" decoding="async" /></Link>;
}



function SeoMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.append(tag);
    }
    tag.content = description;
    const canonicalPath = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/+$/, '');
    const canonicalUrl = `${siteOrigin}${canonicalPath}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;
    let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.append(ogUrl);
    }
    ogUrl.content = canonicalUrl;
  }, [title, description]);
  return null;
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Logo />
        <Button variant="site" size="site" type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</Button>
        <nav id="primary-navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
          <NavLink to="/packages" onClick={closeMenu}>Pricing</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          <Link className="button button-small nav-cta" to="/contact" onClick={closeMenu}>Get Started <ArrowRight size={15} /></Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return <footer className="footer"><div className="container footer-top"><div><Logo /></div><div className="footer-links"><span className="eyebrow">EXPLORE</span><div className="footer-link-grid"><Link to="/">Home</Link><Link to="/services">Services</Link><Link to="/packages">Pricing &amp; Plans</Link><Link to="/services/local-seo">Local SEO</Link><Link to="/services/on-page-seo">On-Page SEO</Link><Link to="/seo-audit">SEO Audit</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></div></div><div className="footer-links"><span className="eyebrow">CONNECT</span><div className="socials"><a href="https://www.linkedin.com/in/dahya-butt-414521411" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin size={17} /></a></div></div></div></footer>;
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return <Link className="service-card" to={servicePath(service)}><span className="icon-circle"><Icon size={22} strokeWidth={1.8} /></span><span className="service-card-copy"><strong>{service.title}</strong><span>{service.description}</span></span></Link>;
}

export function Home() {
  return <><HomePage /><Footer /></>;
}

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  website: string;
};

export function Contact() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  const query = new URLSearchParams(location.search);
  const requestedPlan = pricingPlans.find((plan) => plan.slug === query.get('plan'));
  const requestedService = query.get('service');
  const [values, setValues] = useState<ContactFormValues>({ name: '', email: '', phone: '', service: requestedPlan || requestedService === 'packages' ? 'SEO Packages' : requestedService === 'consultation' ? 'Consultation' : '', message: requestedPlan ? "I'm interested in the " + requestedPlan.name + " SEO package." : '', website: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof ContactFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError('');
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ContactFormValues, string>> = {};
    if (!values.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!values.email.trim()) nextErrors.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!values.service) nextErrors.service = 'Please select a service.';
    if (!values.message.trim()) nextErrors.message = 'Please tell us a little about your project.';
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    if (values.website) return;

    setIsSubmitting(true);
    setFormError('');
    try {
      const response = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(event.currentTarget), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(response.status === 429 ? 'Too many submissions. Please wait a moment and try again.' : 'Unable to send message');
      setSubmitted(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'We could not send your message. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <><SeoMeta title={seoPages.contact.title} description={seoPages.contact.description} /><main id="contact-top" className="contact-page"><section className="contact-hero container"><div className="contact-intro"><span className="eyebrow">CONTACT US</span><h1>Let's Work<span>Together.</span></h1><p>Have a question, need a custom plan, or just want to say hello? Fill out the form and we'll get back to you as soon as possible.</p><div className="contact-details"><ContactDetail icon={<Mail size={20} />} label="EMAIL US" value={<a href="mailto:dahiyabutt28@gmail.com">dahiyabutt28@gmail.com</a>} /><ContactDetail icon={<MapPin size={20} />} label="OUR LOCATION" value={<><strong>Sialkot, Pakistan</strong><small>Remote and Global Services</small></>} /><ContactDetail icon={<Clock3 size={20} />} label="BUSINESS HOURS" value={<><strong>Mon to Fri, 9:00 AM to 6:00 PM</strong><small>Pacific Time (PT)</small></>} /></div></div><div className="contact-form-card">{submitted ? <div className="contact-success"><CheckCircle2 size={38} /><h2>Thanks for reaching out.</h2><p>We'll reply within 24 hours.</p><Link className="button" to="/">Back to Home <ArrowRight size={16} /></Link></div> : <><h2>Send Us a Message</h2><p className="form-subtext">Tell us about your project and how we can help.</p><form onSubmit={handleSubmit} noValidate><input type="hidden" name="_subject" value="New Serpo Rank contact inquiry" /><div className="form-row"><FormField id="name" label="Full Name *" placeholder="Your name" value={values.name} error={errors.name} onChange={(value) => updateField('name', value)} /><FormField id="email" label="Email Address *" type="email" placeholder="you@example.com" value={values.email} error={errors.email} onChange={(value) => updateField('email', value)} /></div><FormField id="phone" label="Phone Number (Optional)" placeholder="+1 (555) 123-4567" value={values.phone} error={errors.phone} onChange={(value) => updateField('phone', value)} /><div className="field"><label htmlFor="service">Which service are you interested in? *</label><select id="service" name="service" value={values.service} onChange={(event) => updateField('service', event.target.value)} className={errors.service ? 'has-error' : ''} aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? 'service-error' : undefined}><option value="">Select a service</option>{contactServices.map((service) => <option key={service} value={service}>{service}</option>)}</select>{errors.service && <span className="field-error" id="service-error" role="alert">{errors.service}</span>}</div><div className="field"><label htmlFor="message">Message *</label><textarea id="message" name="message" rows={5} placeholder="Tell us more about your project..." value={values.message} onChange={(event) => updateField('message', event.target.value)} className={errors.message ? 'has-error' : ''} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <span className="field-error" id="message-error" role="alert">{errors.message}</span>}</div><div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="_gotcha" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => updateField('website', event.target.value)} /></div>{formError && <p className="form-error" role="alert">{formError}</p>}<Button variant="site" size="site" className="button form-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : <>Send Message <ArrowRight size={16} /></>}</Button></form></>}<CalendlyBookingOption /></div></section><section className="why-contact container"><div className="why-contact-intro"><span className="eyebrow">WHY CHOOSE US</span><h2>Real People. Real Support.</h2><p>We're not just an agency. We're your growth partner. You'll always get clear answers, honest advice, and personalized support.</p></div><div className="support-grid"><SupportPoint icon={<Zap size={19} />} title="Fast Response" text="We reply within 24 hours (usually much sooner)." /><SupportPoint icon={<ShieldCheck size={19} />} title="Tailored Solutions" text="Every business is unique. So are our strategies." /><SupportPoint icon={<UsersRound size={19} />} title="Expert Guidance" text="Get advice from an SEO specialist, not a bot." /><SupportPoint icon={<Target size={19} />} title="Long-Term Growth" text="We focus on sustainable results, not quick fixes." /></div></section></main><Footer /></>;
}

function ContactDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return <div className="contact-detail"><span className="detail-icon">{icon}</span><div><span className="eyebrow">{label}</span><div className="detail-value">{value}</div></div></div>;
}

function FormField({ id, label, type = 'text', placeholder, value, error, onChange }: { id: string; label: string; type?: string; placeholder: string; value: string; error?: string | undefined; onChange: (value: string) => void }) {
  return <div className="field"><label htmlFor={id}>{label}</label><input id={id} name={id} type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className={error ? 'has-error' : ''} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />{error && <span className="field-error" id={`${id}-error`} role="alert">{error}</span>}</div>;
}

function SupportPoint({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="support-point"><span className="detail-icon">{icon}</span><h3>{title}</h3><p>{text}</p></div>;
}

export function Services() {
  return <>
    <SeoMeta
      title={seoPages.services.title}
      description={seoPages.services.description}
    />
    <main className="services-page">
      <section className="services-hero">
        <div className="container services-hero-inner">
          <div className="services-hero-copy">
            <h1>SEO for <span>Home Cleaning Businesses</span></h1>
            <p>We help your business to improve its search visibility, strengthen your website, and make it easier for potential customers to find and enquire about your services.</p>
            <p>From technical SEO and on-page optimisation to local search visibility and website improvements, our work focuses on building a stronger foundation for sustainable organic growth.</p>
            <Link className="button" to="/seo-audit">Get Your Free SEO Audit <ArrowRight size={16} /></Link>
          </div>
          <div className="services-hero-image">
            <OptimizedImage sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 55vw, 720px" src={imagePaths.servicesHero} alt="Illustration of local search visibility, home cleaning services, and nearby customers" width="1774" height="887" fetchPriority="high" decoding="async" />
          </div>
        </div>
      </section>

      <section className="services-problems-section" aria-labelledby="services-problems-title">
        <div className="container services-problems-layout">
          <div className="services-problems-intro">
            <h2 id="services-problems-title">The Problems We Solve</h2>
            <p>Your website can look professional and still struggle to attract relevant organic traffic. If important pages aren’t being discovered, your services aren’t clearly aligned with customer searches, or visitors don’t know how to request a quote, opportunities can be missed.</p>
            <p>Our approach starts by identifying what’s holding your website back and prioritising improvements based on your business goals.</p>
            <Link className="button" to="/contact?service=consultation">Get Free SEO Consultation <ArrowRight size={16} /></Link>
          </div>
          <div className="services-problems-grid">
            {serviceProblems.map(({ title, text, icon: Icon }) => <article className="services-problem" key={title}>
              <span className="services-detail-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="service-cards-section container" id="our-seo-services" aria-labelledby="services-list-title">
        <div className="services-section-heading">
          <h2 id="services-list-title">Our SEO Services</h2>
          <p>Every home cleaning business has different goals, service areas, and website challenges. Our SEO services focus on helping cleaning businesses improve how they appear in search, make their websites easier to understand, and create clearer paths for potential customers to get in touch.</p>
        </div>
        <div className="service-cards-grid">{serviceCards.map((service) => <ServicePageCard key={service.slug} service={service} />)}</div>
      </section>

      <section className="services-process-section container" aria-labelledby="services-process-title">
        <div className="services-section-heading">
          <h2 id="services-process-title">Our Process</h2>
          <p>SEO should be guided by evidence, not guesswork. We use a structured process to understand your website, identify meaningful opportunities, and prioritise improvements based on your business goals.</p>
        </div>
        <ol className="services-process-grid">
          {serviceProcess.map((step) => <li className="services-process-step" key={step.number}>
            <span className="services-process-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>)}
        </ol>
      </section>

      <section className="section container why-section">
        <div className="why-intro-layout">
          <div className="section-intro why-intro">
            <h2>Why Work With Us?</h2>
            <p>Home cleaning businesses face unique challenges when attracting customers online. People search for cleaning services based on their location, specific cleaning needs, and service availability. Simply bringing visitors to your website is not enough; you need to reach people who are genuinely interested in the services you offer and are more likely to enquire or book.</p>
            <p>At Serpo Rank, we specialize in SEO for home cleaning businesses, developing strategies around how potential customers search, the services you provide, and the areas you serve. Through local SEO, targeted content, and website optimization, we aim to improve your Google visibility and connect your business with relevant customers actively looking for cleaning services.</p>
          </div>
        </div>
        <div className="why-grid">
          <WhyCard icon={<Target />} title="SEO That Understands Your Industry" text="We focus on the home cleaning niche, tailoring our SEO approach to your services, target customers, and service areas rather than applying a generic strategy." />
          <WhyCard icon={<ChartNoAxesCombined />} title="Relevant Traffic That Can Convert" text="Rankings matter most when they reach the right audience. We target relevant searches and improve website content to help connect your business with potential customers looking for cleaning services." />
          <WhyCard icon={<MapPin />} title="Local SEO That Reaches Nearby Customers" text="We optimize your local search presence through Google Business Profile improvements, location-focused content, and relevant local signals to help nearby customers discover your services." />
          <WhyCard icon={<FileText />} title="Content Built Around Customer Intent" text="We use keyword research and content strategy to create useful, service-focused pages that answer customer questions, match search intent, and help search engines understand your expertise." />
          <WhyCard icon={<Monitor />} title="Websites Designed to Support Enquiries" text="We improve website structure, mobile usability, loading performance, and calls to action so visitors can understand your services and contact your business more easily." />
          <WhyCard icon={<Settings2 />} title="Strategies Based on Your Business Needs" text="We prioritize SEO improvements according to your website, competition, services, and goals, focusing on the opportunities most relevant to your business." />
        </div>
      </section>

      <section className="section container where-we-work">
        <div className="where-we-work-copy">
          <h2>Where We Work</h2>
          <p>Serpo Rank operates remotely from Pakistan, working with home cleaning businesses worldwide, with a primary focus on the United States. We tailor our SEO strategies to each business's services, target customers, and service areas to improve online visibility and attract relevant enquiries.</p>
          <p>Whether your cleaning business serves one city or multiple locations, we aim to help you get found by potential customers actively searching for your services.</p>
        </div>
      </section>

      <FounderCard hideEyebrow />

      <section className="container services-reviews" aria-labelledby="services-reviews-title">
        <div className="services-reviews-heading">
          <h2 id="services-reviews-title">Client Feedback</h2>
          <p>Real experiences and feedback from businesses we've worked with.</p>
        </div>
        <div className="services-reviews-grid">
          <article className="services-review-card">
            <div className="services-review-stars" role="img" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />)}
            </div>
            <blockquote>"I have to say, I was really surprised by how professional the owner is at just 18 years old. He made everything super easy for us to grasp, and now our Google Business Profile is sitting pretty in the top five in our city! It’s been an awesome experience, and we can’t wait to keep collaborating..."</blockquote>
            <cite>Steve</cite>
          </article>
          <article className="services-review-card">
            <div className="services-review-stars" role="img" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />)}
            </div>
            <blockquote>"I had a fantastic experience! He designed an amazing website for our business and really helped us boost our local rankings. We've definitely noticed a significant uptick in inquiries. All in all, I'm really pleased with the results!"</blockquote>
            <cite>Elizabeth</cite>
          </article>
        </div>
      </section>

      <ServicesPricing />

      <section className="section container home-faq services-page-faq" aria-labelledby="services-faq-heading">
        <div>
          <h2 id="services-faq-heading">FAQs</h2>
        </div>
        <ServicesFaq faqs={combinedServicesFaqs} />
      </section>

      <ProjectEnquiryCTA source="Services" />
    </main>
    <Footer />
  </>;
}

function ServicesPricing({ localPage = false }: { localPage?: boolean }) {
  return <section className="section container home-pricing-section services-pricing-section" aria-labelledby="services-pricing-title">
    <div className="home-pricing-heading">
      <div>
        <h2 id="services-pricing-title">{localPage ? 'Explore Our SEO Packages' : 'SEO Packages'}</h2>
        <p>Choose a monthly plan based on your service area, website, and growth goals.</p>
      </div>
      <Link className="text-link" to="/packages">View All Packages <ArrowRight size={16} /></Link>
    </div>
    <div className="pricing-grid home-pricing-grid">
      {pricingPlans.map((plan) => {
        const PlanIcon = plan.slug === 'foundation' ? MapPin : plan.slug === 'growth' ? ChartNoAxesCombined : Target;
        return <article className={plan.badge ? 'pricing-card pricing-card-popular home-pricing-card' : 'pricing-card home-pricing-card'} key={plan.slug}>
          {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
          <div className="home-pricing-card-heading">
            <div className="home-pricing-icon"><PlanIcon size={20} /></div>
            <div><h3>{plan.name}</h3><p>{plan.summary}</p></div>
          </div>
          <div className="pricing-divider" />
          <h4>What’s included</h4>
          <ul className="pricing-feature-list">{plan.features.slice(0, 6).map((feature) => <li key={feature}><CheckCircle2 size={17} /><span>{feature}</span></li>)}</ul>
          <div className="pricing-price-label">Discounted monthly price</div>
          <div className="pricing-price"><span className="pricing-currency">$</span>{plan.price}<span className="pricing-period">/ month</span></div>
          <Link className="button pricing-button" to={`/contact?service=packages&plan=${plan.slug}`} hash="contact-top">Ask about this plan <ArrowRight size={16} /></Link>
        </article>;
      })}
    </div>
    <p className="home-pricing-note">Prices shown are monthly in USD. A $500 one-time setup fee and a 3-month minimum initial term apply. View all package details for full terms.</p>
  </section>;
}

function ServicesFaq({ faqs }: { faqs: ReadonlyArray<{ question: string; answer: string }> }) {
  return <Accordion.Root type="single" collapsible className="home-faq-list services-faq-list">
      {faqs.map((faq, index) => <Accordion.Item key={faq.question} value={String(index)} className="home-faq-item">
        <Accordion.Header><Accordion.Trigger asChild><Button variant="site" size="site" className="home-faq-question">{faq.question}<span className="services-faq-plus" aria-hidden="true">+</span></Button></Accordion.Trigger></Accordion.Header>
        <Accordion.Content className="home-faq-answer"><p>{faq.answer}</p></Accordion.Content>
      </Accordion.Item>)}
    </Accordion.Root>;
}

function FounderCard({ servicesPage = false, hideEyebrow = false, description, prominent = false }: { servicesPage?: boolean; hideEyebrow?: boolean; description?: string; prominent?: boolean }) {
  if (servicesPage) return <section className={`founder-card services-founder-card${prominent ? ' prominent-founder-card' : ''}`}>
    <div className="founder-photo" aria-label="Dahya, founder of Serpo Rank">
      <img src="/images/dahya-founder.jpeg" alt="Portrait of Dahya, founder of Serpo Rank" width="1179" height="2124" loading="lazy" decoding="async" />
    </div>
    <div className="founder-copy">
      {!hideEyebrow && <span className="eyebrow">ABOUT SERPO RANK</span>}
      <h2 className={prominent ? 'founder-card-title-prominent' : undefined}>Meet the person behind the work</h2>
      <p>{description ? renderServiceInline(description) : 'Learn about our background, SEO training, working approach, and commitment to helping home cleaning businesses improve their search visibility.'}</p>
      <Link className={prominent ? 'button' : 'text-link'} to="/about">Read our story and qualifications <ArrowRight size={15} /></Link>
    </div>
  </section>;

  return <section className={`container founder-card${servicesPage ? ' services-founder-card' : ''}`}>
    <div className="founder-photo" aria-label="Dahya, founder of Serpo Rank">
      <img src="/images/dahya-founder.jpeg" alt="Portrait of Dahya, founder of Serpo Rank" width="1179" height="2124" loading="lazy" decoding="async" />
    </div>
    <div className="founder-copy">
      {!hideEyebrow && <span className="eyebrow">ABOUT SERPO RANK</span>}
      <h2>{servicesPage ? 'Meet Our Founder' : 'Meet The Founder of Serpo Rank'}</h2>
      <p>Hi, I'm Dahya, and I'm the founder of Serpo Rank. I help businesses grow through smart SEO strategies, better visibility, and more qualified leads.</p>
      <Link className="button" to="/about">Learn More About Me <ArrowRight size={16} /></Link>
      <a className="text-link founder-linkedin" href="https://www.linkedin.com/in/dahya-butt-414521411" target="_blank" rel="noopener noreferrer"><Linkedin size={16} /> Connect with Dahya on LinkedIn</a>
    </div>
  </section>;
}

export function Pricing() {
  return <><SeoMeta title={seoPages.pricing.title} description={seoPages.pricing.description} /><main className="pricing-page">
    <section className="pricing-hero container">
      <h1>SEO Packages for <span>Home Cleaning</span> Businesses</h1>
      <div className="pricing-terms"><span><strong>NO SETUP FEE</strong></span><span><strong>3 months</strong> minimum initial term</span><span>Monthly prices shown in USD</span></div>
    </section>
    <section className="pricing-plans container" aria-label="SEO pricing plans">
      <div className="pricing-comparison-desktop">
        <table className="pricing-comparison">
          <caption>Compare SEO package prices and included services</caption>
          <thead><tr>
            <th className="pricing-includes-heading" scope="col"><strong>What’s Included</strong><span>Every package includes a complete SEO strategy — tailored to your business needs.</span></th>
            {pricingPlans.map((plan) => <th className={plan.badge ? 'pricing-plan-heading is-recommended' : 'pricing-plan-heading'} scope="col" key={plan.slug}>
              {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
              <strong>{plan.name}</strong><span>{plan.summary}</span><b>${plan.price}<small>/mo</small></b>
            </th>)}
          </tr></thead>
          <tbody>{pricingRows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{row.values.map((value, index) => <td className={index === 1 ? 'is-recommended' : undefined} key={`${row.label}-${index}`}>{value}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="pricing-comparison-mobile">
        {pricingPlans.map((plan, planIndex) => <article className={plan.badge ? 'pricing-mobile-card is-recommended' : 'pricing-mobile-card'} key={plan.slug}>
          {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
          <header><h2>{plan.name}</h2><p>{plan.summary}</p><strong>${plan.price}<small>/mo</small></strong></header>
          <dl>{pricingRows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.values[planIndex]}</dd></div>)}</dl>
          <Link className="button pricing-button" to={`/contact?service=packages&plan=${plan.slug}`}>Ask about this plan <ArrowRight size={16} /></Link>
        </article>)}
      </div>
      <section className="pricing-quarterly-bonus" aria-labelledby="pricing-bonus-title">
        <div className="pricing-bonus-copy">
          <span className="pricing-bonus-eyebrow">A SPECIAL OFFER</span>
          <h2 id="pricing-bonus-title">Get 2 Complimentary SEO Blog Posts</h2>
          <p>Choose any quarterly subscription and receive two additional SEO blog posts, on us. No extra cost, just a bonus for your commitment.</p>
        </div>
        <div className="pricing-bonus-illustration">
          <OptimizedImage src="/images/pricing-seo-blog-bonus.webp" alt="Sage-green gift box with two SEO article cards and botanical leaves" width="1904" height="826" loading="lazy" decoding="async" />
        </div>
        <ul className="pricing-bonus-benefits" aria-label="Quarterly subscription benefits">
          <li><span className="pricing-bonus-benefit-icon"><FileText size={17} aria-hidden="true" /></span><span><strong>High-quality content</strong><small>SEO-optimised blog posts</small></span></li>
          <li><span className="pricing-bonus-benefit-icon"><ChartNoAxesCombined size={17} aria-hidden="true" /></span><span><strong>More visibility</strong><small>Attract and educate local customers</small></span></li>
          <li><span className="pricing-bonus-benefit-icon"><Gift size={17} aria-hidden="true" /></span><span><strong>No extra cost</strong><small>Included with a 3-month plan</small></span></li>
        </ul>
      </section>
      <div className="pricing-notes">
        <div><strong>Important Note</strong><p>These are general pricing plans, not fixed quotes. Final pricing and package details depend on your location, competition, website condition, current SEO, goals, and agreed scope. Plans can be adjusted to match your business needs.</p></div>
        <div><strong>Clear expectations</strong><p>We’ll review your business and confirm the recommended plan before work begins. SEO outcomes vary; rankings, leads, and backlink quantities are not guaranteed.</p></div>
      </div>
    </section>
  </main><Footer /></>;
}
function ServicePageCard({ service }: { service: (typeof serviceCards)[number] }) {
  const Icon = service.icon;
  return <Link className="service-page-card" to={servicePath(service)}>
    <div className="service-page-card-top"><div className="service-page-icon"><Icon size={22} strokeWidth={1.7} /></div><span className="service-number">{service.number}</span></div>
    <div className="service-page-card-content"><h3>{service.title}</h3><p>{service.description}</p><span className="service-card-link">Explore {service.title.toLowerCase()} <ArrowRight size={15} aria-hidden="true" /></span></div>
  </Link>;
}

export function About() {
  const aboutCertificates = [
    { title: 'Local SEO Essentials with Semrush', alt: 'Local SEO Essentials with Semrush certificate', image: '/images/certificate-local-seo.jpeg', width: 1179, height: 829 },
    { title: 'Bottom-of-funnel SEO strategies in tough niches', alt: 'Bottom-of-funnel SEO strategies in tough niches certificate', image: '/images/certificate-bottom-funnel.jpeg', width: 1179, height: 903 },
    { title: 'On-Page SEO and AI Search Essentials with Semrush', alt: 'On-Page SEO and AI Search Essentials with Semrush certificate', image: '/images/certificate-on-page-seo.jpeg', width: 1179, height: 829 },
    { title: 'Technical SEO and AI Search Essentials with Semrush', alt: 'Technical SEO and AI Search Essentials with Semrush certificate', image: '/images/certificate-technical-seo.jpeg', width: 1179, height: 810 },
    { title: 'Create research-backed and search-optimized content', alt: 'Create research-backed and search-optimized content certificate', image: '/images/certificate-cxl-content-research.jpeg', width: 1135, height: 860 },
    { title: 'Keyword Research Essentials with Semrush', alt: 'Keyword Research Essentials with Semrush certificate', image: '/images/certificate-semrush-keyword-research.jpeg', width: 1179, height: 821 },
    { title: 'On-Page, On-Site & Programmatic SEO', alt: 'On-Page, On-Site & Programmatic SEO certificate', image: '/images/certificate-cxl-on-page-programmatic.jpeg', width: 1179, height: 891 },
    { title: 'SEO Driven Editorial Calendar', alt: 'SEO Driven Editorial Calendar certificate', image: '/images/certificate-cxl-editorial-calendar.jpeg', width: 1134, height: 874 },
  ];
  const [activeCertificate, setActiveCertificate] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const carouselRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  const autoplayRunning = !reducedMotion && !autoplayPaused && !hovered && !focused;
  useEffect(() => {
    if (!autoplayRunning) return;
    const timer = window.setInterval(() => setActiveCertificate((current) => (current + 1) % aboutCertificates.length), 5000);
    return () => window.clearInterval(timer);
  }, [autoplayRunning, aboutCertificates.length]);

  const moveCertificate = (step: number) => {
    setAutoplayPaused(true);
    setActiveCertificate((current) => (current + step + aboutCertificates.length) % aboutCertificates.length);
  };
  const selectCertificate = (index: number) => {
    setAutoplayPaused(true);
    setActiveCertificate(index);
  };
  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveCertificate(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveCertificate(1); }
  };
  const active = aboutCertificates[activeCertificate];

  return <><SeoMeta title={seoPages.about.title} description={seoPages.about.description} /><main className="about-page"><section className="about-hero container"><div className="about-copy"><span className="eyebrow">ABOUT ME</span><h1>Hi, I'm Dahya.<span>Founder of Serpo Rank.</span></h1><p>I’ve been fascinated by search engines since I was a kid: how they find websites, understand them, and decide which ones to show first. After school, I turned that curiosity into a real skill set. I taught myself SEO, website development, and digital marketing, and for the past year I’ve been learning and practicing SEO professionally. That includes technical SEO, on-page optimization, keyword research, local SEO, and content optimization.</p><p>I’m also studying for my bachelor’s degree at Virtual University (VU), and I plan to go on to study marketing sciences at a respected college. Starting this agency is how I put what I learn into practice: working with real businesses, learning from every project, and building experience that my future studies will deepen.</p><p>My goal isn’t just higher rankings. I want to build websites and SEO strategies that make businesses easier to find, easier to trust, and easier to choose.</p><p>I’m early in my journey, and I’d rather be upfront about that than overpromise. What I bring is genuine curiosity, careful work, and clear communication, with no jargon and no guarantees I can’t keep.</p><a className="text-link about-linkedin" href="https://www.linkedin.com/in/dahya-butt-414521411" target="_blank" rel="noopener noreferrer"><Linkedin size={16} /> Connect with Dahya on LinkedIn</a></div><div className="about-founder-photo" aria-label="Dahya, founder of Serpo Rank"><img src="/images/dahya-founder.jpeg" alt="Portrait of Dahya, founder of Serpo Rank" loading="eager" fetchPriority="high" decoding="async" /></div></section><section className="certifications-section container"><div className="certifications-copy"><span className="eyebrow">CERTIFICATES</span><h2>My Certifications</h2><p>SEO changes constantly, so I keep learning through structured courses and practical projects. These certifications have helped me build a stronger understanding of search visibility, keyword research, technical SEO, and useful content.</p></div><section className="certificate-carousel" role="region" aria-roledescription="carousel" aria-label="Certifications" tabIndex={0} ref={carouselRef} onKeyDown={handleCarouselKeyDown} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }} onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const end = event.changedTouches[0]?.clientX; if (touchStartX.current !== null && end !== undefined && Math.abs(end - touchStartX.current) >= 50) moveCertificate(end < touchStartX.current ? 1 : -1); touchStartX.current = null; }}><div className="certificate-slide-stage" aria-live={autoplayRunning ? 'off' : 'polite'}><figure className="certificate-slide" key={activeCertificate} role="group" aria-roledescription="slide" aria-label={`${activeCertificate + 1} of ${aboutCertificates.length}`}><div className="certificate-frame"><OptimizedImage className={activeCertificate === 4 ? 'cert-zoom' : undefined} src={active.image} alt={active.alt} width={active.width} height={active.height} loading="lazy" sizes="(max-width: 700px) calc(100vw - 40px), 700px" decoding="async" /></div><figcaption>{active.alt}</figcaption></figure></div><div className="certificate-carousel-controls"><button className="certificate-arrow" type="button" aria-label="Previous certificate" onClick={() => moveCertificate(-1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button><div className="certificate-dots" aria-label="Choose certificate">{aboutCertificates.map((certificate, index) => <button className="certificate-dot" type="button" key={certificate.image} aria-label={`Go to certificate ${index + 1} of ${aboutCertificates.length}`} aria-current={activeCertificate === index ? 'true' : undefined} onClick={() => selectCertificate(index)}><span /></button>)}</div><button className="certificate-arrow" type="button" aria-label="Next certificate" onClick={() => moveCertificate(1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button><button className="certificate-autoplay" type="button" disabled={reducedMotion} aria-label={reducedMotion ? 'Autoplay disabled because reduced motion is preferred' : autoplayPaused ? 'Play automatic slideshow' : 'Pause automatic slideshow'} onClick={() => setAutoplayPaused((paused) => !paused)}>{reducedMotion ? 'Autoplay off' : autoplayPaused ? 'Play' : 'Pause'}</button></div></section></section></main><Footer /></>;
}

function Step({ number, title, text }: { number: string; title: string; text: string }) { return <div className="step"><div className="step-number">{number}</div><div><strong>{title}</strong><p>{text}</p></div></div>; }
function WhyCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="why-card"><span className="icon-circle">{icon}</span><h3>{title}</h3><p>{text}</p></div>; }

type OnPageFeature = { title: string; text: string; icon: LucideIcon };
type OnPageStep = { number: string; title: string; text: string };
type OnPageSeoContent = {
  hero: { eyebrow: string; title: string; highlight: string; text: string; checks: string[] };
  why: { eyebrow: string; title: string; text: string; cardTitle: string; points: string[] };
  sales: { eyebrow: string; title: string; text: string; features: OnPageFeature[] };
  improve: { eyebrow: string; title: string; features: OnPageFeature[] };
  process: { eyebrow: string; title: string; text: string; steps: OnPageStep[] };
  audience: { eyebrow: string; title: string; intro: string; points: string[] };
};

const onPageSeoContent: OnPageSeoContent = {
  hero: {
    eyebrow: 'ON-PAGE SEO FOR HOME CLEANING BUSINESSES',
    title: 'Better Pages. Higher Rankings.',
    highlight: 'More Bookings.',
    text: 'We improve your website\'s pages so customers can quickly understand what you offer, where you serve, and how to contact you. From page titles and internal links to service content and calls to action, we make each page clearer for both search engines and potential customers.',
    checks: ['Clearer Pages', 'Better Visibility', 'More Enquiries'],
  },
  why: {
    eyebrow: 'WHY ON-PAGE SEO MATTERS',
    title: 'Great Services Need Clear Pages',
    text: 'Your cleaning business may offer excellent services, but potential customers need to understand them quickly. If your pages are unclear, difficult to navigate, or focused on the wrong topics, visitors may leave before contacting you. On-page SEO helps organize your content so search engines can understand your services and customers can find the information they need.',
    cardTitle: 'What Stronger On-Page SEO Can Help With',
    points: ['Make your services easier to understand.', 'Help search engines identify what each page is about.', 'Connect customers with the right service or location page.', 'Create a smoother journey from search to enquiry.', 'Make calls, quote requests, and bookings easier.'],
  },
  sales: {
    eyebrow: 'HOW ON-PAGE SEO SUPPORTS MORE SALES',
    title: 'Turn More Website Visits Into Enquiries',
    text: 'Getting visitors to your website is only part of the job. Your pages also need to answer their questions, build confidence, and make the next step obvious. We improve your content and page structure so potential customers can quickly see why your service is right for them and contact you without unnecessary friction.',
    features: [
      { title: 'Clearer Service Information', text: 'Explain what the service includes, who it is for, and why customers may need it.', icon: FileText },
      { title: 'Stronger Customer Confidence', text: 'Use useful details, genuine reviews, service information, and clear expectations to reduce uncertainty.', icon: ShieldCheck },
      { title: 'Better Calls to Action', text: 'Guide visitors toward calling, requesting a quote, booking, or sending an enquiry.', icon: MousePointerClick },
      { title: 'More Relevant Landing Pages', text: 'Match each important service with the page that best answers the customer\'s search.', icon: Target },
      { title: 'A Smoother Path to Contact', text: 'Keep contact options visible and easy to use across desktop and mobile.', icon: Link2 },
    ],
  },
  improve: {
    eyebrow: 'WHAT WE IMPROVE',
    title: 'The Details That Help Your Pages Perform Better',
    features: [
      { title: 'Page Titles and Headings', text: 'Make each page\'s topic clear to search engines and visitors.', icon: Heading2 },
      { title: 'Service Page Content', text: 'Explain your cleaning services in a way that answers real customer questions.', icon: FileText },
      { title: 'Local Relevance', text: 'Connect your services with the areas you actually serve without forcing location keywords unnaturally.', icon: MapPin },
      { title: 'Internal Linking', text: 'Help visitors and search engines move between related services, locations, and useful information.', icon: Link2 },
      { title: 'Images and Media', text: 'Use helpful, properly sized images with descriptive alternative text where appropriate.', icon: Image },
      { title: 'Calls to Action', text: 'Make it clear how visitors can call, request a quote, or book your service.', icon: MousePointerClick },
      { title: 'Page Structure', text: 'Organize content into sections that are easy to scan on both desktop and mobile.', icon: PanelTop },
    ],
  },
  process: {
    eyebrow: 'OUR ON-PAGE SEO PROCESS',
    title: 'Clear Pages Start With the Right Questions',
    text: 'We begin by understanding your services, customers, locations, and business goals. Then we improve each important page so it answers the right questions and supports the next step in the customer journey.',
    steps: [
      { number: '01', title: 'Understand', text: 'Review your services, audience, and existing pages.' },
      { number: '02', title: 'Plan', text: 'Match pages with customer needs and search intent.' },
      { number: '03', title: 'Improve', text: 'Update content, headings, links, structure, and calls to action.' },
      { number: '04', title: 'Measure', text: 'Review performance and identify further opportunities.' },
    ],
  },
  audience: {
    eyebrow: 'WHO THIS HELPS',
    title: 'For Cleaning Businesses That Want Better Website Results',
    intro: 'This service may be useful if:',
    points: ['Your website has pages with very little useful information.', 'Several services are mixed together on one page.', 'Visitors do not understand what you offer.', 'Your pages receive traffic but few enquiries.', 'Your service areas are unclear.', 'Your website uses the same content on many pages.', 'Your important pages are not appearing for relevant searches.'],
  },
};

function OnPageFeatureCard({ feature }: { feature: OnPageFeature }) {
  const Icon = feature.icon;
  return <article className="onpage-feature-card"><span className="icon-circle"><Icon size={19} strokeWidth={1.8} /></span><h3>{feature.title}</h3><p>{feature.text}</p></article>;
}

function OnPageCheckList({ items }: { items: string[] }) {
  return <ul className="onpage-check-list">{items.map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}</ul>;
}

function LocalImpactList({ features }: { features: OnPageFeature[] }) {
  return <ul className="local-impact-list">{features.map((feature) => <li key={feature.title}><CheckCircle2 size={15} /><span><strong>{feature.title}</strong>{feature.text}</span></li>)}</ul>;
}

type ServiceBrief = {
  service: string;
  definition: string[];
  helpIntro: string;
  help: string[];
  helpNote: string;
  providesIntro: string;
  provides: string[];
  process: OnPageStep[];
  trust: string[];
  faqs: { question: string; answer: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  source: string;
  certificateImage?: string;
  certificateAlt?: string;
  relatedCertificates?: ReadonlyArray<(typeof certificates)[number]>;
  certificateNote?: string;
  pricing?: boolean;
};

function ServiceBriefSections({ content }: { content: ServiceBrief }) {
  const sectionId = content.source.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const founderDescription = "I'm Dahya, founder of Serpo Rank. I help home cleaning businesses build clearer, easier-to-use websites with stronger SEO foundations and a smoother path for customers to enquire.";
  return <>
    <section className="section container service-brief-definition" aria-labelledby={`${sectionId}-definition-title`}>
      <h2 id={`${sectionId}-definition-title`}>What Is {content.service}?</h2>
      {content.definition.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </section>
    <section className="section service-brief-help" aria-labelledby={`${sectionId}-help-title`}>
      <div className="container">
        <h2 id={`${sectionId}-help-title`}>How {content.service} Can Help Your Home Cleaning Business</h2>
        <p>{content.helpIntro}</p>
        <ul className="service-brief-list">{content.help.map((item) => <li key={item}><CheckCircle2 size={17} aria-hidden="true" /><span>{item}</span></li>)}</ul>
        <p className="service-brief-note">{content.helpNote}</p>
      </div>
    </section>
    <section className="section container service-brief-provides" aria-labelledby={`${sectionId}-provides-title`}>
      <h2 id={`${sectionId}-provides-title`}>What We Provide</h2>
      <p>{content.providesIntro}</p>
      <ul className="service-brief-list">{content.provides.map((item) => <li key={item}><CheckCircle2 size={17} aria-hidden="true" /><span>{item}</span></li>)}</ul>
    </section>
    <section className="section container service-brief-process" aria-labelledby={`${sectionId}-process-title`}>
      <h2 id={`${sectionId}-process-title`}>Our Process</h2>
      <ol>{content.process.map((step) => <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
    </section>
    <section className="section service-brief-trust" aria-labelledby={`${sectionId}-trust-title`}>
      <div className="container"><h2 id={`${sectionId}-trust-title`}>Why Trust Us</h2>{content.trust.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>
    <FounderCard servicesPage hideEyebrow prominent description={founderDescription} />
    <section className="section container service-brief-faq" aria-labelledby={`${sectionId}-faq-title`}>
      <h2 id={`${sectionId}-faq-title`}>Frequently Asked Questions</h2>
      <Accordion.Root type="multiple" className="local-faq-grid">{content.faqs.map((faq, index) => <Accordion.Item key={faq.question} value={String(index)} className="local-faq-item"><Accordion.Header><Accordion.Trigger className="local-faq-trigger">{faq.question}<span aria-hidden="true">+</span></Accordion.Trigger></Accordion.Header><Accordion.Content className="local-faq-answer"><p>{faq.answer}</p></Accordion.Content></Accordion.Item>)}</Accordion.Root>
    </section>
  </>;
}

type ServiceArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'cta'; text: string };
type ServiceArticleSection = { title: string; blocks: ServiceArticleBlock[] };
type ServiceArticle = { title: string; heroLead: string; heroBody: string[]; heroCta: string; sections: ServiceArticleSection[] };

function parseServiceArticle(markdown: string): ServiceArticle {
  const sections: ServiceArticleSection[] = [];
  const heroParagraphs: string[] = [];
  let title = '';
  let heroCta = '';
  let currentSection: ServiceArticleSection | undefined;
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flush = () => {
    const paragraph = paragraphLines.join(' ').trim();
    if (paragraph) {
      const block: ServiceArticleBlock = { type: 'paragraph', text: paragraph };
      if (currentSection) currentSection.blocks.push(block);
      else heroParagraphs.push(paragraph);
    }
    paragraphLines = [];
    if (listItems.length) {
      currentSection?.blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('# ')) {
      flush();
      title = line.slice(2).trim();
    } else if (line.startsWith('## ')) {
      flush();
      currentSection = { title: line.slice(3).trim(), blocks: [] };
      sections.push(currentSection);
    } else if (line.startsWith('### ')) {
      flush();
      currentSection?.blocks.push({ type: 'heading', text: line.slice(4).trim() });
    } else {
      const cta = line.match(/^\*\*CTA:\s*(.*?)\*\*$/);
      const listItem = line.match(/^[-*]\s+(.+)$/);
      if (cta) {
        flush();
        if (currentSection) currentSection.blocks.push({ type: 'cta', text: cta[1] ?? '' });
        else heroCta = cta[1] ?? '';
      } else if (listItem) {
        if (paragraphLines.length) flush();
        listItems.push(listItem[1] ?? '');
      } else if (!line) flush();
      else paragraphLines.push(line);
    }
  }
  flush();

  return {
    title,
    heroLead: heroParagraphs[0] ?? '',
    heroBody: heroParagraphs.slice(1),
    heroCta,
    sections,
  };
}

function renderServiceInline(text: string): React.ReactNode {
  return text.split(/(\*\*.+?\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function articleCtaTarget(sectionTitle: string) {
  const section = sectionTitle.toLowerCase();
  return section.includes('trust') || section.includes('certification') ? '/about' : '/contact';
}

function ServiceArticleBlocks({ blocks, sectionTitle }: { blocks: ServiceArticleBlock[]; sectionTitle: string }) {
  return <>{blocks.map((block, index) => {
    if (block.type === 'heading') return <h3 key={index}>{renderServiceInline(block.text)}</h3>;
    if (block.type === 'list') return <ul className="service-article-list" key={index}>{block.items.map((item) => <li key={item}>{renderServiceInline(item)}</li>)}</ul>;
    if (block.type === 'cta') {
      const target = articleCtaTarget(sectionTitle);
      const isButton = target === '/contact';
      return <Link className={isButton ? 'button service-article-cta-link' : 'text-link service-article-cta-link'} to={target} key={index}>{block.text} <ArrowRight size={16} aria-hidden="true" /></Link>;
    }
    return <p key={index}>{renderServiceInline(block.text)}</p>;
  })}</>;
}

function splitArticleSubsections(blocks: ServiceArticleBlock[]) {
  const intro: ServiceArticleBlock[] = [];
  const subsections: { title: string; blocks: ServiceArticleBlock[] }[] = [];
  let current: { title: string; blocks: ServiceArticleBlock[] } | undefined;
  for (const block of blocks) {
    if (block.type === 'heading') {
      current = { title: block.text, blocks: [] };
      subsections.push(current);
    } else if (current) current.blocks.push(block);
    else intro.push(block);
  }
  return { intro, subsections };
}

function ServiceArticleProcess({ section }: { section: ServiceArticleSection }) {
  const { intro, subsections } = splitArticleSubsections(section.blocks);
  return <section className="section service-article-section service-article-process" aria-labelledby="service-article-process-title">
    <div className="container"><h2 id="service-article-process-title">{section.title}</h2><ServiceArticleBlocks blocks={intro} sectionTitle={section.title} />
      <ol>{subsections.map((step, index) => {
        const match = step.title.match(/^(\d{1,2})\.\s*(.*)$/);
        return <li key={step.title}><span>{match?.[1] ?? String(index + 1).padStart(2, '0')}</span><div><h3>{renderServiceInline(match?.[2] ?? step.title)}</h3><ServiceArticleBlocks blocks={step.blocks} sectionTitle={section.title} /></div></li>;
      })}</ol>
    </div>
  </section>;
}

function ServiceArticleFaq({ section }: { section: ServiceArticleSection }) {
  const { subsections } = splitArticleSubsections(section.blocks);
  return <section className="section service-article-section service-article-faq" aria-labelledby="service-article-faq-title">
    <div className="container"><h2 id="service-article-faq-title">{section.title}</h2>
      <Accordion.Root type="multiple" className="local-faq-grid">
        {subsections.map((faq, index) => <Accordion.Item key={faq.title} value={String(index)} className="local-faq-item">
          <Accordion.Header><Accordion.Trigger className="local-faq-trigger">{renderServiceInline(faq.title)}<span aria-hidden="true">+</span></Accordion.Trigger></Accordion.Header>
          <Accordion.Content className="local-faq-answer"><ServiceArticleBlocks blocks={faq.blocks} sectionTitle={section.title} /></Accordion.Content>
        </Accordion.Item>)}
      </Accordion.Root>
    </div>
  </section>;
}

function ServiceArticleSectionView({ section, certificates: relatedCertificates }: { section: ServiceArticleSection; certificates: ReadonlyArray<(typeof certificates)[number]> }) {
  const { title, blocks } = section;
  if (title.toLowerCase() === 'our process') return <ServiceArticleProcess section={section} key={title} />;
  if (title.toLowerCase() === 'meet our founder') {
    const intro = blocks.find((block) => block.type === 'paragraph');
    return <FounderCard servicesPage hideEyebrow prominent description={intro?.type === 'paragraph' ? intro.text : ''} key={title} />;
  }
  if (title.toLowerCase().includes('frequently asked questions')) return <ServiceArticleFaq section={section} key={title} />;
  const isClosing = title.toLowerCase().startsWith('your cleaning') || title.toLowerCase().startsWith('make your cleaning');
  const isCertification = title.toLowerCase().includes('certifications');
  const { intro, subsections } = splitArticleSubsections(blocks);
  const id = `article-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const sectionClass = isClosing ? 'service-article-section service-article-closing' : isCertification ? 'service-article-section service-article-certifications' : 'service-article-section';
  return <section className={`section ${sectionClass}`} aria-labelledby={id} key={title}>
    <div className="container"><h2 id={id}>{title}</h2>
      {isCertification ? <div className="service-article-certification-layout"><div><ServiceArticleBlocks blocks={blocks} sectionTitle={title} /></div>
        {relatedCertificates.length > 0 && <div className="service-article-certificates">{relatedCertificates.map((certificate) => <figure key={certificate.title}><OptimizedImage src={certificate.image} alt={`${certificate.provider} certificate: ${certificate.title}`} loading="lazy" decoding="async" /><figcaption><strong>{certificate.title}</strong><span>{certificate.provider}</span></figcaption></figure>)}</div>}
      </div> : subsections.length > 0 ? <><ServiceArticleBlocks blocks={intro} sectionTitle={title} /><div className="service-article-subsections">{subsections.map((subsection) => <article className="service-article-subsection" key={subsection.title}><h3>{renderServiceInline(subsection.title)}</h3><ServiceArticleBlocks blocks={subsection.blocks} sectionTitle={title} /></article>)}</div></> : <ServiceArticleBlocks blocks={blocks} sectionTitle={title} />}
    </div>
  </section>;
}

function ServiceArticlePage({ articleMarkdown, pageTitle, pageDescription, pageClass, heroImage, heroAlt, certificates: relatedCertificates = [] }: {
  articleMarkdown: string; pageTitle: string; pageDescription: string; pageClass: string; heroImage?: string; heroAlt: string; certificates?: ReadonlyArray<(typeof certificates)[number]>;
}) {
  const article = parseServiceArticle(articleMarkdown);
  return <><SeoMeta title={pageTitle} description={pageDescription} /><main className={`service-article-page ${pageClass}`}>
    <section className="local-hero container service-article-hero"><div className="local-hero-copy"><h1>{article.title}</h1>
      {article.heroLead && <p className="service-article-lead">{renderServiceInline(article.heroLead)}</p>}
      {article.heroBody.map((paragraph) => <p key={paragraph}>{renderServiceInline(paragraph)}</p>)}
      {article.heroCta && <Link className="button" to="/contact">{article.heroCta} <ArrowRight size={17} aria-hidden="true" /></Link>}
    </div><div className={`local-hero-image service-article-visual${heroImage ? '' : ' service-article-visual-placeholder'}`}>
      {heroImage ? <OptimizedImage src={heroImage} alt={heroAlt} fetchPriority="high" decoding="async" /> : <div className="detail-visual-placeholder"><Link2 size={32} aria-hidden="true" /><span>{heroAlt}</span></div>}
    </div></section>
    {article.sections.map((section) => <ServiceArticleSectionView key={section.title} section={section} certificates={relatedCertificates} />)}
  </main><Footer /></>;
}

const technicalSeoBrief: ServiceBrief = {
  service: 'Technical SEO', source: 'Technical SEO', pricing: true,
  definition: [
    'Technical SEO focuses on making your website easier for search engines to crawl, understand, and index. It also helps ensure visitors can use your website effectively across different devices.',
    'For home cleaning businesses, a technically sound website provides a stronger foundation for search visibility, service-page discovery, and a smoother customer experience.',
  ],
  helpIntro: 'A technically sound website can help you:',
  help: ['Make important cleaning service pages easier for search engines to discover.', 'Identify crawling and indexing problems that may prevent pages from appearing in search results.', 'Improve mobile usability for customers searching for cleaning services on their phones.', 'Find performance issues that may affect the visitor experience.', 'Strengthen your website structure and internal linking.', 'Reduce technical obstacles between potential customers and your enquiry form.'],
  helpNote: 'Technical improvements support SEO, but they do not guarantee specific rankings or a particular number of leads.',
  providesIntro: "Depending on your website's needs, our technical SEO work may include:",
  provides: ['Technical SEO audit and issue prioritization.', 'Crawlability and indexability checks.', 'XML sitemap and robots.txt review.', 'Canonical tag and redirect checks.', 'Broken-link and error-page investigation.', 'Mobile usability review.', 'Core Web Vitals and page-performance assessment.', 'Internal linking and website-structure review.', 'Relevant structured-data checks.', 'Recommendations for implementing and validating fixes.'],
  process: [
    { number: '01', title: 'Audit', text: 'Review the website to identify technical issues and opportunities.' },
    { number: '02', title: 'Prioritize', text: 'Separate critical issues from improvements that can be addressed later.' },
    { number: '03', title: 'Improve', text: 'Implement agreed fixes where access and scope allow, or provide clear instructions for your developer.' },
    { number: '04', title: 'Validate and Monitor', text: 'Check the implemented changes and review relevant technical SEO indicators over time.' },
  ],
  trust: ['We approach technical SEO through structured analysis, clear explanations, and practical priorities rather than complicated jargon.', 'Our focus is on understanding how your website works, identifying obstacles that matter, and helping you make informed improvements. We explain what needs attention, why it matters, and how the work can support your wider SEO strategy.'],
  relatedCertificates: [certificates[3], certificates[6]],
  faqs: [
    { question: 'What is technical SEO?', answer: 'Technical SEO improves the parts of a website that help search engines crawl, understand, and index its pages.' },
    { question: 'Why does my cleaning business website need technical SEO?', answer: 'Technical issues can make important pages harder to discover or use. An audit helps identify which issues may be affecting your website.' },
    { question: 'Does technical SEO guarantee first-page rankings?', answer: 'No. Technical SEO can improve your website’s foundation, but rankings also depend on competition, relevance, content, authority, and other factors.' },
    { question: 'What are Core Web Vitals?', answer: "Core Web Vitals are Google's metrics for aspects of loading performance, responsiveness, and visual stability." },
    { question: 'Can you fix indexing problems?', answer: 'We can investigate likely causes and implement or recommend appropriate fixes, depending on the issue and the access available.' },
    { question: 'How long does technical SEO take?', answer: "The timeline depends on the website's size, the severity of its issues, and how quickly fixes can be implemented and validated." },
    { question: 'Will technical SEO help my website load faster?', answer: "It can identify and address performance bottlenecks, although the improvements depend on the site's underlying problems and technology." },
  ],
  ctaTitle: 'Give Your Website a Stronger Technical Foundation', ctaText: 'Find out what may be holding your website back. Request a free SEO audit to identify potential technical issues and practical opportunities for improvement.', ctaLabel: 'Get Your Free SEO Audit',
};

const onPageSeoBrief: ServiceBrief = {
  service: 'On-Page SEO', source: 'On-Page SEO', pricing: true,
  definition: [
    'On-page SEO improves the content and HTML elements of individual website pages so search engines and visitors can better understand what each page offers.',
    'For a home cleaning business, this means making it clear which services you provide, where you provide them, and how customers can take the next step.',
  ],
  helpIntro: 'Effective on-page SEO can help you:',
  help: ['Make individual cleaning service pages more relevant to their intended searches.', 'Explain residential, commercial, deep-cleaning, and other services clearly where applicable.', 'Improve page titles, headings, and meta descriptions.', 'Organize content so visitors can find important information more easily.', 'Strengthen internal links between related services and useful pages.', 'Answer common customer questions and make enquiry options easier to find.'],
  helpNote: 'The objective is to improve relevance, clarity, and usability—not to repeat keywords unnaturally.',
  providesIntro: 'Our on-page SEO work may include:',
  provides: ['Keyword research and search-intent mapping.', 'Mapping relevant search terms to existing pages.', 'Page-title and meta-description optimization.', 'Heading structure and content improvements.', 'Cleaning service-page content recommendations.', 'Internal linking improvements.', 'Image alt-text and image SEO checks.', 'Content gap and duplication reviews.', 'Calls-to-action and page clarity recommendations.', 'On-page SEO checks for relevant service and location pages.'],
  process: [
    { number: '01', title: 'Research', text: 'Understand your services, target customers, search intent, and existing website content.' },
    { number: '02', title: 'Map', text: 'Identify the most appropriate page for each important topic or search intent.' },
    { number: '03', title: 'Optimize', text: 'Improve page elements, content organization, internal links, and relevant on-page signals.' },
    { number: '04', title: 'Review', text: 'Check the updated pages and monitor relevant search performance indicators where data is available.' },
  ],
  trust: ['We focus on making each page useful to both search engines and potential customers.', 'Our approach combines keyword research, clear content structure, relevant internal linking, and practical recommendations tailored to the services your business actually provides.', 'We do not rely on keyword stuffing, repetitive content, or unsupported claims about ranking results.'],
  relatedCertificates: [certificates[2], certificates[4], certificates[6], certificates[7]],
  faqs: [
    { question: 'What is on-page SEO?', answer: 'On-page SEO improves page content and HTML elements to help search engines and visitors understand the page.' },
    { question: 'Why does each cleaning service need a clear page?', answer: 'A dedicated page can explain a particular service in greater detail and address the questions customers have about it. Separate pages should only be created when they provide genuinely useful, distinct content.' },
    { question: 'Do meta descriptions directly improve rankings?', answer: 'Meta descriptions are not a direct Google ranking factor, but useful descriptions may help searchers understand a page in search results.' },
    { question: 'How many keywords should a page target?', answer: 'There is no fixed ideal number. A page should address its main topic and closely related questions naturally, without forcing keywords into the text.' },
    { question: 'Can you optimize my existing website content?', answer: 'Yes, the work can include reviewing and improving existing page titles, headings, content, internal links, and other relevant on-page elements.' },
    { question: 'How long does on-page SEO take to show results?', answer: 'Results vary based on the website, competition, changes made, and how search engines process those changes.' },
    { question: 'Will on-page SEO bring more customers?', answer: "It can help make your pages more relevant and useful to potential customers, but enquiries also depend on visibility, competition, your offer, and the website's conversion experience." },
  ],
  ctaTitle: 'Make Every Important Page Count', ctaText: 'Help customers understand your cleaning services and make your website easier to navigate. Request a free SEO audit to identify on-page opportunities.', ctaLabel: 'Get Your Free SEO Audit',
};

const offPageSeoBrief: ServiceBrief = {
  service: 'Off-Page SEO', source: 'Off-Page SEO', pricing: true,
  definition: [
    'Off-page SEO covers activities outside your website that can contribute to its reputation, authority, and visibility.',
    'These activities may include earning relevant backlinks, building legitimate business mentions, and supporting your online reputation. Quality and relevance matter more than simply collecting large numbers of links.',
  ],
  helpIntro: 'A thoughtful off-page SEO strategy can help you:',
  help: ['Identify opportunities to earn relevant links from legitimate websites.', "Strengthen your website's wider online presence.", 'Discover where competitors receive relevant links and mentions.', "Support your brand's credibility through genuine business relationships.", 'Identify potentially harmful or unnatural backlink patterns.', 'Build a more sustainable approach to website authority over time.'],
  helpNote: 'Off-page SEO cannot guarantee rankings, and buying large quantities of low-quality links is not a reliable shortcut.',
  providesIntro: "Depending on your website's needs, off-page SEO work may include:",
  provides: ['Backlink profile analysis.', 'Competitor backlink research.', 'Identification of relevant link opportunities.', 'Linkable content and resource recommendations.', 'Legitimate outreach planning.', 'Relevant business and industry mention opportunities.', 'Review of suspicious or potentially harmful backlink patterns.', 'Ongoing monitoring and reporting where appropriate.'],
  process: [
    { number: '01', title: 'Analyze', text: 'Review your current backlink profile and relevant competitor activity.' },
    { number: '02', title: 'Identify Opportunities', text: 'Find relevant websites, resources, and legitimate relationship-building opportunities.' },
    { number: '03', title: 'Execute the Strategy', text: 'Carry out agreed outreach and authority-building activities without spam or deceptive link schemes.' },
    { number: '04', title: 'Monitor', text: 'Review acquired links, referral opportunities, and relevant SEO indicators over time.' },
  ],
  trust: ['We believe off-page SEO should prioritize relevance, transparency, and sustainable practices.', 'We focus on understanding the quality and context of link opportunities rather than chasing arbitrary backlink totals. We explain the work being proposed and avoid promising rankings or guaranteed results.'],
  faqs: [
    { question: 'What is off-page SEO?', answer: 'Off-page SEO includes activities outside your website that can help build its reputation, authority, and visibility.' },
    { question: 'Are backlinks still relevant to SEO?', answer: 'Relevant, naturally earned backlinks can contribute to how search engines assess a website, but not every link provides value.' },
    { question: 'Can you guarantee backlinks?', answer: 'Specific placements cannot be guaranteed because independent publishers control whether they link to a website. Any placement targets should be clearly scoped and ethically deliverable.' },
    { question: 'Is buying backlinks a good strategy?', answer: 'Buying links intended to manipulate search rankings can create risks. Our approach should prioritize legitimate opportunities and follow applicable search-engine guidelines.' },
    { question: 'How do you identify good link opportunities?', answer: 'We consider relevance, website quality, context, legitimacy, and whether the link makes sense for the audience.' },
    { question: 'How long does off-page SEO take to work?', answer: "It varies according to competition, the website's current authority, the quality of opportunities, and the time required to earn links and for search engines to process changes." },
    { question: 'Can off-page SEO help a new cleaning business?', answer: 'It can be part of a wider SEO strategy, but a new business should also establish useful website content, accurate business information, and a strong technical foundation.' },
  ],
  ctaTitle: "Build Your Website's Credibility", ctaText: 'Discover opportunities to strengthen your website’s authority through relevant, transparent off-page SEO. Request a free audit to discuss your current position and next steps.', ctaLabel: 'Get Your Free SEO Audit',
};

const websiteBrief: ServiceBrief = {
  service: 'Web Design & Optimization', source: 'Website Development & Optimisation',
  definition: [
    'Web design and optimization focus on how your website looks, works, and guides visitors toward useful actions.',
    'For a home cleaning business, your website should explain your services clearly, work well on mobile devices, build trust, and make it straightforward for potential customers to request a quote.',
  ],
  helpIntro: 'A well-structured website can help you:',
  help: ['Present your cleaning services in a clear and professional way.', 'Make important information easy to find on mobile and desktop.', 'Help visitors understand your service areas and available options.', 'Make quote requests and contact details easier to access.', 'Improve page structure and support SEO.', 'Identify avoidable usability and performance problems.', 'Create a clearer path from visiting a page to enquiring about a service.'],
  helpNote: 'A website redesign does not automatically increase rankings or enquiries. The outcome depends on the implementation, offer, audience, competition, and user experience.',
  providesIntro: 'Depending on your website and project scope, services may include:',
  provides: ['Website layout and design improvements.', 'Responsive mobile and desktop layouts.', 'Navigation and information-architecture improvements.', 'Service-page structure and content presentation.', 'Calls-to-action and enquiry-form usability.', 'Page-speed and performance improvements.', 'SEO-friendly headings, internal links, and page structure.', 'Image optimization and appropriate image sizing.', 'Basic technical checks before launch.', 'Analytics or conversion-tracking setup where agreed and supported.'],
  process: [
    { number: '01', title: 'Understand', text: 'Review your business, customers, website, services, and project goals.' },
    { number: '02', title: 'Plan', text: 'Establish the page structure, user journey, priorities, and agreed scope.' },
    { number: '03', title: 'Design and Improve', text: 'Implement the agreed design, usability, responsiveness, and optimization improvements.' },
    { number: '04', title: 'Test and Review', text: 'Check important pages and interactions across screen sizes, verify links and forms, and address identified issues before handover.' },
  ],
  trust: ['We approach website improvements with an emphasis on clarity, usability, mobile responsiveness, and SEO fundamentals.', 'Our goal is to help cleaning businesses present their services clearly and make it easier for visitors to find relevant information and contact the business.', 'We will explain the proposed scope and avoid promising specific ranking, traffic, or conversion outcomes.'],
  certificateImage: '/images/certificate-technical-seo.jpeg', certificateAlt: 'Semrush Academy certificate for Technical SEO and AI Search Essentials',
  certificateNote: 'These are SEO certifications, not web-design or UX certifications. No additional web-design credential is claimed.',
  faqs: [
    { question: 'Why does a cleaning business need a professional website?', answer: 'A clear, usable website helps potential customers understand your services, service areas, and how to contact you.' },
    { question: 'Will a new website automatically rank higher on Google?', answer: 'No. Rankings depend on several factors, including relevance, competition, technical quality, content, and authority. A redesign should preserve and improve important SEO elements rather than assume design alone will improve rankings.' },
    { question: 'Will my website work on mobile phones?', answer: 'Mobile responsiveness should be included in the agreed scope and checked across appropriate screen sizes before completion.' },
    { question: 'Can you improve my existing website instead of rebuilding it?', answer: "Where the current platform and code allow, targeted improvements may be more appropriate than a complete rebuild. The best option depends on the website's condition and requirements." },
    { question: 'Can you make my website load faster?', answer: "We can investigate performance issues and implement suitable improvements within the project's technical scope. The achievable results depend on the site's existing code, hosting, media, and third-party tools." },
    { question: 'Can you add quote-request forms?', answer: "Forms can be added or improved where the website's technology and the agreed project scope support them. Submission handling and delivery should be tested before launch." },
    { question: 'Will a redesigned website increase enquiries?', answer: 'Better usability and clearer calls-to-action may help visitors take the next step, but enquiries cannot be guaranteed.' },
    { question: 'How long does a website project take?', answer: 'The timeline depends on the number of pages, complexity, required features, revisions, and how quickly the necessary content and feedback are provided.' },
  ],
  ctaTitle: 'Build a Website That Makes Enquiries Easier', ctaText: 'Make your cleaning services easier to understand and your website easier to use. Let’s discuss improvements that fit your business goals.', ctaLabel: 'Discuss Your Website',
};

export function OnPageSeoPage() {
  return <ServiceArticlePage articleMarkdown={onPageSeoArticle} pageTitle={seoPages.onPageSeo.title} pageDescription={seoPages.onPageSeo.description} pageClass="onpage-page" heroImage={imagePaths.onpageHero} heroAlt="Illustration of a home cleaning website with search and page optimization elements" certificates={[certificates[2], certificates[4], certificates[5], certificates[6]]} />;
}
const localSeoContent = {
  hero: {
    title: 'Local SEO for Home Cleaning',
    highlight: 'Businesses',
    text: 'We help home cleaning businesses get found by nearby homeowners on Google Maps and local search. Serpo Rank sets up and manages your Google Business Profile, local website pages, and review process, so more of the right customers can find, trust, and contact you. Plain-English updates, no ranking guarantees.',
    cta: 'Book A Free SEO Audit',
    checks: [
      { text: 'Built specifically for home cleaning businesses', icon: MapPin },
      { text: 'Your Google Business Profile, website, and reviews working together', icon: Link2 },
      { text: "Honest expectations: we don't guarantee rankings or results", icon: ShieldCheck },
    ],
  },
  why: {
    title: 'Why Local SEO Matters',
    text: 'Most cleaning company owners we talk to don\'t need more jargon. They want a steadier flow of the right inquiries, and fewer "can you do this?" calls from people outside their area or services. Local SEO can support that in a few practical ways.',
    benefits: [
      { title: 'You show up in the searches that matter nearby.', text: 'A clear profile and relevant pages help Google understand which services you offer and where, so you\'re a stronger match for the searches you actually want.', icon: MapPin },
      { title: 'You make a better first impression.', text: 'Letting someone into their home is a big decision, and homeowners check reviews first. In BrightLocal\'s 2026 survey of US adults, 41% said they always read reviews when browsing for a business, and 31% said they would only use businesses rated 4.5 stars or higher. A steady stream of recent, real reviews matters, and we help you build that honestly.', icon: Star },
      { title: 'You attract inquiries that fit.', text: 'When your profile and site clearly list what you do (recurring cleans, deep cleans, move-outs) and where you work, you spend less time on mismatched requests.', icon: Target },
      { title: 'You make it easy to reach you.', text: 'A visitor who can call, text, or request a quote in one tap is more likely to do it than one who has to hunt for a form.', icon: MousePointerClick },
      { title: 'You build something you own.', text: 'Reviews, accurate listings, and helpful website pages keep working over time rather than disappearing when a budget stops.', icon: ShieldCheck },
    ] as OnPageFeature[],
    example: 'Picture a family-run cleaning company serving three nearby suburbs. Its Google profile has a vague description and a handful of reviews from two years ago. Its website has one "Services" page covering everything in a single paragraph. A homeowner searching for a move-out clean before a lease ends finds a competitor whose profile lists move-out cleaning, shows recent photos, and links to a page that answers common questions. Local SEO works on exactly these gaps, so the business is clearer, more complete, and easier to choose.',
    expectation: "A realistic expectation: local SEO builds over time, and results depend on your starting point, your competition, your area, and your reviews. We won't promise a specific ranking or number of leads. We'll also ask about your capacity, because more inquiries only help if your schedule can take them.",
  },
  work: {
    title: 'What We Do',
    features: [
      { title: 'Google Business Profile Optimization', text: 'Setting up or cleaning up your Google Business Profile (categories, services, service areas, hours, photos).', icon: MapPin },
      { title: 'Local Website Optimization', text: 'Service and service-area pages on your website that answer real homeowner questions.', icon: PanelTop },
      { title: 'Service and Location Pages', text: 'Making sure your business details are consistent across major listings.', icon: FileText },
      { title: 'Local Keyword Strategy', text: 'Tracking calls, form submissions, and other signals so you can see what is happening.', icon: SearchCheck },
      { title: 'Reviews and Trust Signals', text: 'A simple, policy-friendly way to ask real customers for reviews.', icon: ShieldCheck },
      { title: 'Local Listings and Consistency', text: 'Keep your business name, contact details, and other information accurate across important platforms.', icon: Link2 },
    ] as OnPageFeature[],
    prominence: [
      { title: 'Relevance', text: 'How clearly your profile and website say what you do, such as recurring cleaning, deep cleaning, or move-out cleaning.' },
      { title: 'Distance', text: "How close you are to the person searching, or to the area they typed in. This is the one thing we can't change, and we'll be upfront about how it affects you." },
      { title: 'Prominence', text: 'How well known and trusted you are, including your reviews and how you appear around the web.' },
    ],
    exclusions: [
      'Paid ads (Google Ads or Local Services Ads), which are a separate thing.',
      'Guaranteed rankings, since no one can promise that.',
      'Buying, faking, or rewarding reviews.',
      "Making you appear everywhere in a big metro area if you're based in one corner of it.",
    ],
    trustIntro: "Choosing an SEO agency is a lot like choosing a cleaner: you're handing over something important and hoping for honesty. Here's how we approach it.",
    trust: [
      'We focus on home cleaning businesses. We\'re not trying to be everything to everyone, so our attention is on how cleaning companies are found and chosen.',
      "We tell you what we can't do. Google states that rankings can't be requested or purchased, so anyone who guarantees you a top spot is promising something they don't control.",
      "We play by the rules. Google's policies prohibit incentivized reviews and asking only your happiest customers for feedback. We won't put your profile at risk with shortcuts.",
      "We explain what we're doing and why. You should understand the work you're paying for.",
    ],
  },
};

const localSeoProcess = [
  { number: '01', title: 'Discovery call', text: 'We learn about your business: where you\'re based, which areas you want to serve, which services you want more of (recurring, deep clean, move-out, turnover), and how much work you can take on.', icon: MessageCircle },
  { number: '02', title: 'Local visibility review', text: 'We look at how you appear today: your Google profile, website, listings, reviews, and the businesses competing in your area. You get a plain-English summary of what\'s working and what\'s holding you back.', icon: SearchCheck },
  { number: '03', title: 'Fix the foundations', text: "We clean up your profile and listings so everything is accurate and consistent. If you don't have a storefront, we set your profile up the way Google requires for service-area businesses.", icon: Settings2 },
  { number: '04', title: 'Build helpful local pages', text: 'We create or improve service and service-area pages with real, useful information, not copy-and-paste pages with a different city name on each one.', icon: PanelTop },
  { number: '05', title: 'Set up your review process', text: "We help you ask real customers for feedback in a way that follows Google's rules, and we advise on how to reply to reviews, good and bad.", icon: Star },
  { number: '06', title: 'Track, report, and adjust', text: 'We track the signals that matter (calls, form submissions, direction requests, local visibility) and share regular updates you can actually understand. Then we adjust the plan based on what we see.', icon: ChartNoAxesCombined },
];

const localSeoFaqs = [
  { question: "What's the difference between local SEO and regular SEO?", answer: 'Regular SEO helps your website show up in search results generally. Local SEO focuses on showing up when people search for a service in a specific area, including the map results on Google. For a cleaning business, local SEO usually matters most, because your customers are nearby homeowners.' },
  { question: 'I work from home or visit clients\' homes. Can I still do local SEO?', answer: "Yes. Google asks businesses without a storefront to hide their address and show a service area instead. You can list up to 20 service areas, Google suggests keeping the area within about two hours' drive of your base, and you should have only one profile per metro area. We'll set this up correctly for you. Note that a bigger service area on your profile doesn't by itself mean you'll appear everywhere inside it, since distance still plays a role." },
  { question: 'How long does it take to see results?', answer: "It depends on your starting point, your competition, and how much you have to fix. Some profile and website improvements can be made quickly, while reviews and visibility usually build gradually. We'll give you an honest picture after the review, and we won't promise a fixed timeline." },
  { question: 'Can you guarantee I\'ll rank #1 on Google Maps?', answer: "No, and be cautious of anyone who does. Google is clear that rankings can't be bought or requested. What we can do is make sure your profile, website, and reputation give you the best fair chance." },
  { question: 'Can you get me more reviews?', answer: "We'll help you build a simple way to ask real customers for honest feedback, and advise on replying to reviews. We won't buy reviews, fake them, offer rewards for them, or only ask happy customers, because Google's policies prohibit those practices and they can hurt your profile." },
  { question: 'What do you need from me?', answer: "Usually: access to (or help creating) your Google Business Profile, a list of your services and service areas, access to your website, and photos of your team and work (with the right permissions). We'll also ask about your capacity and the jobs you most want to win." },
  { question: 'Do I need a website?', answer: "A good website is a big part of local SEO. We'll review what you have and tell you honestly what's worth improving." },
  { question: "How will I know if it's working?", answer: "We'll agree up front on the numbers that matter, such as calls, form submissions, direction requests, and local visibility, and report on them in plain English. Numbers can go up and down, and we'll explain why." },
  { question: 'Is local SEO the same as running Google ads?', answer: 'No. Ads are paid placements. Local SEO is the ongoing work of improving how your business appears in unpaid local results. Some businesses use both, but they\'re separate services.' },
  { question: 'What does it cost?', answer: <>It depends on your area and goals. You can see our packages on our <Link to="/packages">pricing page</Link>, or get in touch and we&apos;ll point you to the right fit.</> },
];

export function LocalSeoPage() {
  const content = localSeoContent;
  return <><SeoMeta title={seoPages.localSeo.title} description={seoPages.localSeo.description} /><main className="local-page">
    <section className="local-hero container"><div className="local-hero-copy"><h1>{content.hero.title}<span>{content.hero.highlight}</span></h1><p>{content.hero.text}</p><Link className="button" to="/seo-audit">{content.hero.cta} <ArrowRight size={17} /></Link><ul className="onpage-check-list local-hero-points">{content.hero.checks.map(({ text, icon: Icon }) => <li key={text}><Icon size={15} aria-hidden="true" />{text}</li>)}</ul></div><div className="local-hero-image"><OptimizedImage sizes="(max-width: 700px) 100vw, (max-width: 1200px) 60vw, 720px" src={imagePaths.localHero} alt="Local search results and map pins helping customers find a home cleaning business" fetchPriority="high" decoding="async" /></div></section>
    <section className="section container local-definition" aria-labelledby="local-definition-title">
      <div className="onpage-copy">
        <h2 id="local-definition-title">What Is Local SEO?</h2>
        <p>Local SEO is the work of helping your business show up when people near you search for what you offer. For a cleaning company, that might be "house cleaning near me," "maid service in your city," or "move-out cleaning." Those are the searches where Google shows a small map and a few nearby businesses above the regular results.</p>
        <p>Google explains that local results rest mainly on three things: relevance, distance, and prominence. In everyday terms:</p>
        <ul className="local-definition-points">{content.work.prominence.map((point) => <li key={point.title}><strong>{point.title}:</strong> {point.text}</li>)}</ul>
      </div>
    </section>
    <section className="section container local-why"><div className="onpage-copy"><h2>{content.why.title}</h2><p>{content.why.text}</p><div className="local-example"><strong>Example:</strong><p>{content.why.example}</p></div><p>{content.why.expectation}</p></div><div className="local-why-image local-benefit-grid">{content.why.benefits.map(({ title, text, icon: Icon }) => <article className="local-benefit-card" key={title}><Icon size={19} aria-hidden="true" /><p><strong>{title}</strong>{text}</p></article>)}</div></section>
    <section className="section container local-work"><div className="onpage-copy"><h2>{content.work.title}</h2><p><strong>What local SEO typically includes:</strong></p><ul className="local-content-list">{content.work.features.slice(0, 5).map((feature) => <li key={feature.title}><CheckCircle2 size={16} aria-hidden="true" />{feature.text}</li>)}</ul><p><strong>What it doesn't include:</strong></p><ul className="local-content-list local-excluded-list">{content.work.exclusions.map((item) => <li key={item}><X size={16} aria-hidden="true" />{item}</li>)}</ul></div><div className="local-work-details"><div className="local-feature-grid">{content.work.features.map((feature) => <OnPageFeatureCard feature={feature} key={feature.title} />)}</div><div className="local-trust-copy"><p>{content.work.trustIntro}</p><ul className="local-content-list">{content.work.trust.map((item) => <li key={item}><ShieldCheck size={16} aria-hidden="true" />{item}</li>)}</ul></div></div></section>
    <LocalSeoProcess />
    <LocalSeoCertifications />
    <LocalSeoFaq />
  </main><Footer /></>;
}

function LocalSeoCertifications() {
  return <FounderCard servicesPage hideEyebrow prominent description="I'm Dahya, founder of Serpo Rank. I help home cleaning businesses improve local search visibility through relevant Google Business Profile, service-area page, and review-process improvements." />;
}

function LocalSeoProcess() {
  return <section className="section container local-process" aria-labelledby="local-process-title">
    <div className="onpage-copy local-process-intro"><h2 id="local-process-title">Our Process</h2></div>
    <ol className="services-process-grid local-process-grid">{localSeoProcess.map(({ number, title, text, icon: Icon }) => <li className="services-process-step" key={number}><span className="services-process-number">{number}</span><Icon className="local-process-icon" size={17} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>)}</ol>
  </section>;
}

function LocalSeoFaq() {
  return <section className="section container local-faq-section" aria-labelledby="local-faq-title">
    <div className="local-faq-heading"><h2 id="local-faq-title">Frequently Asked Questions About Local SEO</h2></div>
    <Accordion.Root type="multiple" className="local-faq-grid">
      {localSeoFaqs.map((faq, index) => <Accordion.Item key={faq.question} value={String(index)} className="local-faq-item">
        <Accordion.Header><Accordion.Trigger className="local-faq-trigger">{faq.question}<span aria-hidden="true">+</span></Accordion.Trigger></Accordion.Header>
        <Accordion.Content className="local-faq-answer"><p>{faq.answer}</p></Accordion.Content>
      </Accordion.Item>)}
    </Accordion.Root>
  </section>;
}

const technicalSeoContent = {
  why: {
    title: 'Why Technical SEO Matters',
    text: 'Even great content can go unnoticed when a website is slow, difficult to crawl, or confusing to use. Technical SEO helps search engines find and understand your important pages while giving visitors a faster, smoother path toward contacting your business.',
    callout: 'A technically sound website helps your best content get found, not get lost.',
  },
  improves: [
    { title: 'Easier discovery of important pages.', text: 'Help search engines find the pages that matter most.', icon: SearchCheck },
    { title: 'Faster and smoother browsing.', text: 'Reduce friction for visitors across the site.', icon: Zap },
    { title: 'Better mobile usability.', text: 'Make important journeys work well on smaller screens.', icon: Monitor },
    { title: 'Clearer website structure.', text: 'Organize content so visitors and search engines can follow it.', icon: PanelTop },
    { title: 'A simpler path to enquiries and bookings.', text: 'Remove technical barriers between interest and action.', icon: MousePointerClick },
  ] as OnPageFeature[],
  fixes: [
    { title: 'Better Crawlability', text: 'We help search engines efficiently discover and crawl the important pages on your website.', icon: Code2 },
    { title: 'Indexing Problems', text: "We identify pages that aren't being properly indexed and address the technical issues preventing them from appearing in search.", icon: SearchCheck },
    { title: 'Website Speed', text: 'We identify performance issues that can make your website slow and improve the technical factors affecting loading speed.', icon: ChartNoAxesCombined },
    { title: 'Mobile Usability', text: 'We make sure your website works properly across mobile devices and provides a smooth experience for visitors.', icon: Monitor },
    { title: 'Broken Links and Redirects', text: 'We find broken links, incorrect redirects, and outdated URLs that can create poor user experiences and technical problems.', icon: Link2 },
    { title: 'Website Structure', text: 'We improve the organization of your website so search engines and visitors can understand how your pages relate to each other.', icon: PanelTop },
    { title: 'Page Titles and Headings', text: 'We review titles and headings to make sure pages have a clear structure and communicate their purpose effectively.', icon: Heading2 },
    { title: 'Structured Data', text: 'We implement relevant structured data where appropriate to help search engines better understand the content and entities on your pages.', icon: FileText },
    { title: 'Conversion Barriers', text: 'We identify technical or usability issues that make it harder for visitors to call, request a quote, or submit an enquiry.', icon: MousePointerClick },
  ] as OnPageFeature[],
  process: [
    { number: '01', title: 'Audit', text: 'We inspect your website and identify technical problems.' },
    { number: '02', title: 'Plan', text: 'We prioritize issues according to impact and business goals.' },
    { number: '03', title: 'Develop', text: 'We implement or guide the necessary improvements.' },
    { number: '04', title: 'Grow', text: 'We monitor the website and continue improving its foundation.' },
  ] as OnPageStep[],
  helps: ['Your important pages are not appearing in Google.', 'Your website is slow on mobile.', 'Your traffic has dropped without a clear reason.', 'Google Search Console shows indexing issues.', 'Your website has recently been redesigned.', 'Your content is strong but receives little visibility.', 'Visitors leave without calling or submitting a form.', 'Your site has grown but its structure has become confusing.'],
};

export function TechnicalSeoPage() {
  return <ServiceArticlePage articleMarkdown={technicalSeoArticle} pageTitle={seoPages.technicalSeo.title} pageDescription={seoPages.technicalSeo.description} pageClass="technical-page" heroImage={imagePaths.technicalHero} heroAlt="Technical SEO illustration showing website crawling, indexing, performance, and structure" certificates={[certificates[3], certificates[2]]} />;
}
const websiteDevelopmentContent = {
  whatWeDo: [
    { title: 'Website Redesign', text: 'We refresh outdated websites with a modern look, clearer layout, better navigation, and a design that fits your brand.', icon: Monitor },
    { title: 'New Website Development', text: 'When an existing site cannot support your goals, we build a new one from the ground up with a clear structure and user-friendly experience.', icon: Code2 },
    { title: 'Mobile-Friendly Design', text: 'We make sure your website looks and works properly on phones, tablets, and desktops.', icon: Monitor },
    { title: 'Speed and Performance', text: 'We reduce unnecessary delays and improve the elements that make your pages slow or difficult to use.', icon: Zap },
    { title: 'SEO-Ready Structure', text: 'We organize your pages, content, headings, links, and technical foundations so search engines can understand your website more easily.', icon: SearchCheck },
    { title: 'Conversion-Focused Improvements', text: 'We create clear paths that encourage visitors to call, request a quote, book a service, or contact your business.', icon: MousePointerClick },
  ] as OnPageFeature[],
  impact: [
    { title: 'Build Trust Faster', text: 'Create a clear and professional first impression that helps visitors understand who you are and what you offer.', icon: ShieldCheck },
    { title: 'Make Contact Easier', text: 'Use visible buttons, forms, and booking options to make the next step clear.', icon: MousePointerClick },
    { title: 'Explain Your Services Better', text: 'Use simple content and organized pages to make your services easier to understand.', icon: FileText },
    { title: 'Support Future SEO', text: 'Build a cleaner structure and stronger technical foundation that can support future search optimization.', icon: SearchCheck },
    { title: 'Keep Visitors Engaged', text: 'Create a smoother, more comfortable experience that makes it easier for visitors to explore your website.', icon: Target },
  ] as OnPageFeature[],
  process: [
    { number: '01', title: 'Understand', text: 'We learn about your business, customers, services, brand, and goals.' },
    { number: '02', title: 'Plan', text: 'We create the site structure, page priorities, content direction, and user journey.' },
    { number: '03', title: 'Build', text: 'We design and develop a website that is clear, responsive, fast, and easy to use.' },
    { number: '04', title: 'Review', text: 'We check the experience across devices and resolve usability or performance issues.' },
    { number: '05', title: 'Improve', text: 'We refine the site’s performance, usability, SEO, and conversion paths over time.' },
  ] as OnPageStep[],
};

type DetailLandingContent = {
  metaTitle: string; metaDescription: string; eyebrow: string; title: string; heroText: string; heroFollowUp: string;
  heroImage?: string; heroAlt: string; introEyebrow: string; introTitle: string; introText: string; introFollowUp: string;
  features: OnPageFeature[]; benefitsTitle: string; benefitsText: string; benefits: OnPageFeature[];
  processText: string; process: OnPageStep[]; examplesTitle: string; examplesText: string;
  examples: { title: string; text: string }[]; faqs: { question: string; answer: string }[];
  ctaTitle: string; ctaText: string;
};

const offPageSeoContent: DetailLandingContent = {
  metaTitle: seoPages.offPageSeo.title,
  metaDescription: seoPages.offPageSeo.description,
  eyebrow: 'OFF-PAGE SEO', title: 'Off-Page SEO for Home Cleaning Businesses',
  heroText: "Build your website's authority, earn relevant backlinks, and increase your brand's visibility across the web. Our off-page SEO services help home cleaning businesses gain trust, improve domain authority, and strengthen their position in search results.",
  heroFollowUp: 'We focus on safe, white-hat strategies that bring long-term value and support your overall SEO growth.',
  heroAlt: 'Off-page SEO graphic will be added here', introEyebrow: 'WHAT IS OFF-PAGE SEO?',
  introTitle: 'What Is Off-Page SEO',
  introText: 'Off-page SEO refers to the work done outside your website to improve your authority and reputation. It includes building quality backlinks, getting mentioned on relevant websites, and ensuring your business information is consistent across the web.',
  introFollowUp: 'For home cleaning businesses, this means more trust in the eyes of search engines and potential customers — and a stronger foundation for long-term growth.',
  features: [
    { title: 'Link Building', text: 'Earn relevant, high-quality backlinks from trusted websites in your industry.', icon: Link2 },
    { title: 'Brand Mentions', text: 'Increase mentions of your business across relevant websites and online publications.', icon: Megaphone },
    { title: 'Citations', text: 'Keep your business information consistent across directories and local listings.', icon: MapPin },
    { title: 'Digital PR', text: 'Get featured in relevant media and industry platforms to build credibility and reach.', icon: ShieldCheck },
  ],
  benefitsTitle: 'Why It Matters',
  benefitsText: 'Off-page SEO helps your business get noticed, builds trust with search engines, and brings more qualified visitors to your website. It supports your local presence, strengthens your brand, and makes it easier for customers to choose your services.',
  benefits: [
    { title: 'Higher domain authority', text: 'Signals to search engines that your website is trustworthy and relevant.', icon: Settings2 },
    { title: 'More referral traffic', text: 'Brings visitors from other websites, blogs, and industry platforms.', icon: UsersRound },
    { title: 'Stronger local presence', text: 'Improves your visibility in local searches and directories.', icon: MapPin },
    { title: 'Increased brand credibility', text: 'Builds trust with both search engines and potential customers.', icon: ShieldCheck },
  ],
  processText: "We use proven, white-hat strategies to build your website's authority and reputation. Our process focuses on quality, relevance, and long-term results — not shortcuts.",
  process: [
    { number: '01', title: 'Research & Analysis', text: 'We analyse your niche, competitors, and backlink opportunities.' },
    { number: '02', title: 'Build Quality Backlinks', text: 'We earn links from relevant, high-authority websites and industry blogs.' },
    { number: '03', title: 'Improve Local Listings', text: 'We optimise your business citations and local directory profiles.' },
    { number: '04', title: 'Strengthen Brand Presence', text: 'We get your business mentioned on trusted platforms and media where relevant.' },
    { number: '05', title: 'Monitor & Report', text: 'We track progress, analyse results, and refine the strategy for continued growth.' },
  ],
  examplesTitle: 'Real Examples',
  examplesText: '',
  examples: [
    { title: 'Backlink example', text: 'A relevant blog post on a home services website linking to your site from a contextual article.' },
    { title: 'Citation example', text: 'Consistent business information added to key directories and local listings (e.g. Google Business Profile, Yelp, Bing).' },
  ],
  faqs: [
    { question: 'What is off-page SEO and why is it important?', answer: 'Off-page SEO includes actions outside your website that can support its authority and reputation, such as relevant backlinks, citations, and brand mentions.' },
    { question: 'How long does it take to see results from off-page SEO?', answer: 'Timing varies with your website, competition, market, and the work involved. We monitor progress and make adjustments over time; we do not guarantee specific rankings.' },
    { question: 'What kind of backlinks do you build?', answer: 'We focus on relevant, quality links from appropriate websites and avoid manipulative link schemes or shortcuts.' },
    { question: 'Do you handle business citations and local listings?', answer: 'Yes. Citation work can include reviewing key directories and helping keep your business information consistent.' },
    { question: 'Is off-page SEO safe for my website?', answer: 'Our approach focuses on relevant, white-hat practices and avoids tactics designed to manipulate search rankings.' },
    { question: 'Will you guarantee specific rankings or positions?', answer: 'No. Search rankings depend on many factors, so no specific position or outcome can be guaranteed.' },
  ],
  ctaTitle: "Ready to Build Your Website's Authority?",
  ctaText: "Let's create a plan to earn quality backlinks, improve your online presence, and help more customers find your cleaning business.",
};

const websiteOptimisationContent: DetailLandingContent = {
  metaTitle: seoPages.websiteDevelopment.title,
  metaDescription: seoPages.websiteDevelopment.description,
  eyebrow: 'WEBSITE OPTIMISATION', title: 'A Better Website for Your Cleaning Business',
  heroText: 'We improve website speed, usability, mobile experience, and page structure so visitors can understand your services and contact your business more easily.',
  heroFollowUp: 'Whether you need focused improvements or a wider redesign, we build a clear, responsive experience around your business goals.',
  heroImage: imagePaths.websiteHero, heroAlt: 'Responsive website design displayed on a laptop and phone',
  introEyebrow: 'WHAT IS WEBSITE OPTIMISATION?', introTitle: 'From First Impression to Final Click',
  introText: 'Your website should make a strong first impression and guide visitors naturally toward the information and action they need. We improve the design, structure, content, and performance of your site so it feels better to use and works harder for your business.',
  introFollowUp: 'Every recommendation is shaped around your customers, the services you provide, and the next step you want visitors to take.',
  features: websiteDevelopmentContent.whatWeDo.slice(0, 4),
  benefitsTitle: 'The Real Benefits for Your Cleaning Business',
  benefitsText: 'A clear, well-performing website helps visitors understand your services, trust your business, and take the next step. We focus on practical improvements that support a smoother customer journey.',
  benefits: websiteDevelopmentContent.impact.slice(0, 4),
  processText: 'We start by understanding where you are and where you want to go. Then we plan, improve, and review the experience across devices.',
  process: websiteDevelopmentContent.process,
  examplesTitle: 'Website Optimisation in Practice',
  examplesText: 'Here are examples of the kinds of improvements we review. We can add your supplied graphics to these spaces later.',
  examples: [
    { title: 'Mobile experience review', text: 'Check that service information, navigation, and contact actions are easy to use on a phone.' },
    { title: 'Service page improvement', text: 'Organise page content and calls to action so customers can understand an offer and what to do next.' },
  ],
  faqs: [
    { question: 'What does website optimisation include?', answer: 'It can include improvements to mobile usability, page speed, navigation, content structure, and enquiry paths, based on your website and goals.' },
    { question: 'Can you improve my existing website?', answer: 'Yes. We can review an existing website and recommend focused improvements or a broader redesign, depending on its condition and your needs.' },
    { question: 'Will my website work on mobile devices?', answer: 'Mobile usability is part of the review. We check how key content, navigation, and contact actions work on smaller screens.' },
    { question: 'Can website changes help me get more enquiries?', answer: 'A clearer user experience can make it easier for visitors to contact you. Enquiry volume still depends on your offer, traffic, market, and other factors.' },
    { question: 'Do you include SEO in website optimisation?', answer: 'We consider SEO foundations such as page structure, headings, performance, and internal links. Larger SEO needs can be scoped separately.' },
    { question: 'How do we get started?', answer: 'Request a free SEO audit or consultation. We will discuss your website, priorities, and possible next steps.' },
  ],
  ctaTitle: 'Ready to Improve Your Website?',
  ctaText: 'Let’s review your website and identify practical ways to make it clearer, faster, and easier for customers to use.',
};

function DetailLandingPage({ content, pageClass }: { content: DetailLandingContent; pageClass: string }) {
  const isOffPage = pageClass === 'offpage-seo-page';
  return <><SeoMeta title={content.metaTitle} description={content.metaDescription} /><main className={`detail-landing ${pageClass}`}>
    <section className="detail-hero container"><div className="detail-hero-copy">{!isOffPage && <span className="eyebrow">{content.eyebrow}</span>}<h1>{content.title}</h1><p>{content.heroText}</p><p>{content.heroFollowUp}</p><div className="detail-hero-actions"><Link className="button" to="/seo-audit">Get Your Free SEO Audit <ArrowRight size={17} /></Link><Link className="button button-secondary" to="/services">{isOffPage ? 'Explore Our Other Services' : 'Explore Our Services'} <ArrowRight size={16} /></Link></div></div><div className={`detail-hero-visual${content.heroImage ? '' : ' detail-placeholder'}`}>{content.heroImage ? <OptimizedImage src={content.heroImage} alt={content.heroAlt} fetchPriority="high" decoding="async" /> : <div className="detail-visual-placeholder"><Image size={32} /><span>Hero graphic coming soon</span></div>}</div></section>
    <ServiceBriefSections content={isOffPage ? offPageSeoBrief : websiteBrief} />
  </main><Footer /></>;
}

export function OffPageSeoPage() {
  return <ServiceArticlePage articleMarkdown={offPageSeoArticle} pageTitle={seoPages.offPageSeo.title} pageDescription={seoPages.offPageSeo.description} pageClass="offpage-seo-page" heroImage={imagePaths.offpageHero} heroAlt="Illustration of backlinks, local business listings, and online mentions for a home cleaning business" certificates={[certificates[1], certificates[5]]} />;
}
export function WebsiteDevelopmentPage() { return <DetailLandingPage content={websiteOptimisationContent} pageClass="website-optimisation-page" />; }
function Placeholder({ title }: { title: string }) {
  return <><SeoMeta title={`${title} | Serpo Rank`} description={`${title} from Serpo Rank. More visibility, more growth.`} /><main className="placeholder container"><span className="eyebrow">SERPO RANK</span><h1>{title}</h1><p>Coming soon. This page will be built next and connected to the rest of your SEO growth journey.</p><Link className="button" to="/contact">Get Started <ArrowRight size={16} /></Link></main><Footer /></>;
}

