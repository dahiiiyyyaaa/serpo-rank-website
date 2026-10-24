import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const homeFaqs = [
  { question: 'How can SEO bring me more cleaning customers?', answer: 'SEO helps your business appear when nearby customers search online for cleaning services. We improve your website and Google Business Profile to make it easier for potential customers to find you and get in touch. SEO can improve visibility, but it can’t guarantee a specific ranking or number of bookings.' },
  { question: 'What’s included in your SEO service?', answer: 'We tailor the work to your business, but it can include improving your website pages, local search presence, and Google Business Profile. We’ll first look at what’s working and what needs attention, then agree on priorities with you.' },
  { question: 'How long does SEO take to work?', answer: 'SEO takes time, and the timeline varies depending on your website, competition, location, and the work needed. We focus on building a stronger foundation and improving visibility over time—not promising instant results or a fixed ranking.' },
  { question: 'Can you help me show up on Google Maps?', answer: 'Yes. We can improve your Google Business Profile and the information on your website so they clearly describe your services and service area. Google’s local results also depend on factors such as relevance, distance, and prominence, so no agency can guarantee a particular Maps position.' },
  { question: 'Can you build my website too?', answer: 'Yes. If you don’t have a website, we can build one for your cleaning business with clear service information and simple ways for visitors to call or request a quote. We can then improve it for local search.' },
  { question: 'Can SEO help me reach more service areas?', answer: 'Yes. We can make your service areas clearer on your website and create useful pages for the places you genuinely serve. Local visibility can vary by searcher location, so targeting an area doesn’t guarantee you’ll appear everywhere in it.' },
];

export function HomeFaq() {
  return <section className="section container home-faq" aria-labelledby="home-faq-heading">
    <div><span className="eyebrow">FAQS</span><h2 id="home-faq-heading">Frequently Asked Questions</h2></div>
    <Accordion.Root type="single" collapsible className="home-faq-list">
      {homeFaqs.map((faq, index) => <Accordion.Item key={faq.question} value={String(index)} className="home-faq-item">
        <Accordion.Header><Accordion.Trigger asChild><Button variant="site" size="site" className="home-faq-question">{faq.question}<ChevronDown size={18} aria-hidden="true" /></Button></Accordion.Trigger></Accordion.Header>
        <Accordion.Content className="home-faq-answer"><p>{faq.answer}</p></Accordion.Content>
      </Accordion.Item>)}
    </Accordion.Root>
  </section>;
}
