import { useState, type FormEvent } from 'react';
import { ArrowRight, CalendarDays, FileText, Mail, SearchCheck, Target } from 'lucide-react';

const businessEmail = 'dahiyabutt28@gmail.com';
const enquiryEndpoint = 'https://formspree.io/f/mkjobvrn';
const calendlyUrl = 'https://calendly.com/dahiyabutt28/new-meeting';

type CalendlyWindow = Window & { Calendly?: { initPopupWidget: (options: { url: string }) => void } };

const serviceOptions = [
  'Local SEO',
  'Technical SEO',
  'On-Page SEO',
  'Off-Page SEO',
  'Not sure yet',
];

const benefits = [
  { title: 'In-Depth Analysis', text: 'We review your website and identify relevant SEO opportunities.', icon: SearchCheck },
  { title: 'Actionable Insights', text: 'Receive clear recommendations based on the information available.', icon: FileText },
  { title: 'No Obligation', text: 'Request an audit without committing to an SEO package.', icon: Target },
  { title: 'Personalised Response', text: 'We’ll review your enquiry and respond using the contact details you provide.', icon: Mail },
];

type EnquiryValues = {
  businessName: string;
  email: string;
  website: string;
  timeline: string;
  budget: string;
  details: string;
};

export function CalendlyBookingOption() {
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState(false);

  const openCalendar = () => {
    setCalendarError(false);
    const showPopup = () => {
      setCalendarLoading(false);
      const calendly = (window as CalendlyWindow).Calendly;
      if (calendly) calendly.initPopupWidget({ url: calendlyUrl });
      else setCalendarError(true);
    };
    if ((window as CalendlyWindow).Calendly) { showPopup(); return; }
    setCalendarLoading(true);
    if (!document.getElementById('calendly-widget-styles')) {
      const stylesheet = document.createElement('link');
      stylesheet.id = 'calendly-widget-styles';
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(stylesheet);
    }
    let script = document.getElementById('calendly-widget-script') as HTMLScriptElement | null;
    const handleError = () => { script?.remove(); setCalendarLoading(false); setCalendarError(true); };
    if (!script) {
      script = document.createElement('script');
      script.id = 'calendly-widget-script';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.addEventListener('load', showPopup, { once: true });
      script.addEventListener('error', handleError, { once: true });
      document.body.appendChild(script);
    } else {
      script.addEventListener('load', showPopup, { once: true });
      script.addEventListener('error', handleError, { once: true });
    }
  };

  return <div className="project-enquiry-calendar-option">
    <span className="project-enquiry-calendar-icon"><CalendarDays size={22} strokeWidth={1.8} aria-hidden="true" /></span>
    <div>
      <h3>Prefer to talk it through?</h3>
      <p>Choose a time for a free consultation on our calendar.</p>
    </div>
    <button className="button project-enquiry-calendar-button" type="button" onClick={openCalendar} disabled={calendarLoading}>
      {calendarLoading ? 'Opening calendar…' : <>Book a Consultation <ArrowRight size={17} aria-hidden="true" /></>}
    </button>
    {calendarError && <p className="project-enquiry-calendar-error" role="alert">The calendar could not open here. Use the direct booking link below.</p>}
    <a className="project-enquiry-calendar-fallback" href={calendlyUrl} target="_blank" rel="noopener noreferrer">Open Calendly in a new tab</a>
  </div>;
}

/**
 * Formspree receives and emails each project enquiry using the configured form endpoint.
 */
export function ProjectEnquiryCTA({ source }: { source: string }) {
  const idPrefix = source.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const [values, setValues] = useState<EnquiryValues>({ businessName: '', email: '', website: '', timeline: '', budget: '', details: '' });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState('');
  const [formError, setFormError] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const updateValue = (field: keyof EnquiryValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFormError('');
    setFormStatus('');
  };

  const toggleService = (service: string) => {
    setSelectedServices((current) => current.includes(service)
      ? current.filter((item) => item !== service)
      : [...current, service]);
    setFormError('');
    setFormStatus('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setAttemptedSubmit(true);
    setFormError('');
    setFormStatus('');

    if (honeypot) return;
    if (!values.businessName.trim()) {
      setFormError('Enter your business name to continue.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      setFormError('Enter a valid work email address.');
      return;
    }
    if (selectedServices.length === 0) {
      setFormError('Choose at least one service you’re interested in.');
      return;
    }
    if (values.website.trim()) {
      try {
        const url = new URL(values.website.trim());
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol');
      } catch {
        setFormError('Enter a valid website URL, including https://.');
        return;
      }
    }

    const payload = {
      ...values,
      businessName: values.businessName.trim(),
      email: values.email.trim(),
      website: values.website.trim(),
      details: values.details.trim(),
      services: selectedServices,
      source,
    };

    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      formData.set('businessName', payload.businessName);
      formData.set('email', payload.email);
      formData.set('website', payload.website);
      formData.set('timeline', payload.timeline);
      formData.set('budget', payload.budget);
      formData.set('details', payload.details);
      formData.set('services', payload.services.join(', '));
      formData.set('_subject', `Project enquiry: ${payload.businessName}`);
      const response = await fetch(enquiryEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      if (!response.ok) throw new Error(response.status === 429 ? 'Too many submissions. Please wait a moment and try again.' : 'We couldn’t send your enquiry. Please check your details and try again.');
      setFormStatus('Your enquiry has been sent. We’ll review the details and respond using the contact information you provided.');
      setValues({ businessName: '', email: '', website: '', timeline: '', budget: '', details: '' });
      setSelectedServices([]);
      setAttemptedSubmit(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : `We couldn’t send your enquiry. Please try again or email us directly at ${businessEmail}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="project-enquiry-section" id="book-free-audit" aria-labelledby={`project-enquiry-title-${idPrefix}`}>
      <div className="project-enquiry-panel">
        <div className="project-enquiry-form-column">
          <h2 className="project-enquiry-title" id={`project-enquiry-title-${idPrefix}`}>
            Ready to Improve Your <span>Cleaning Business’s Search Visibility?</span>
          </h2>
          <p className="project-enquiry-intro">Share a few details about your business and goals. We’ll review your enquiry and outline the next steps for improving your website and local search visibility.</p>

          <form className="project-enquiry-form" onSubmit={handleSubmit} noValidate>
            <input type="hidden" name="source" value={source} />
            <div className="project-enquiry-honeypot" aria-hidden="true">
              <label htmlFor={`company-website-${idPrefix}`}>Leave this field empty</label>
              <input id={`company-website-${idPrefix}`} name="_gotcha" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
            </div>
            <div className="project-enquiry-fields">
              <div className="project-enquiry-field">
                <label htmlFor={`business-name-${idPrefix}`}>Business name <span aria-hidden="true">*</span></label>
                <input id={`business-name-${idPrefix}`} name="businessName" autoComplete="organization" placeholder="e.g. Sparkle Cleaners" value={values.businessName} onChange={(event) => updateValue('businessName', event.target.value)} required aria-invalid={attemptedSubmit && !values.businessName.trim()} />
              </div>
              <div className="project-enquiry-field">
                <label htmlFor={`work-email-${idPrefix}`}>Work email <span aria-hidden="true">*</span></label>
                <input id={`work-email-${idPrefix}`} name="email" type="email" autoComplete="email" placeholder="you@yourbusiness.com" value={values.email} onChange={(event) => updateValue('email', event.target.value)} required aria-invalid={attemptedSubmit && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())} />
              </div>
              <div className="project-enquiry-field">
                <label htmlFor={`website-url-${idPrefix}`}>Website URL <span className="project-enquiry-optional">(optional)</span></label>
                <input id={`website-url-${idPrefix}`} name="website" type="url" inputMode="url" placeholder="https://yourwebsite.com" value={values.website} onChange={(event) => updateValue('website', event.target.value)} aria-invalid={attemptedSubmit && Boolean(values.website) && !/^https?:\/\//i.test(values.website.trim())} />
              </div>
              <div className="project-enquiry-field">
                <label htmlFor={`target-timeline-${idPrefix}`}>Target timeline <span className="project-enquiry-optional">(optional)</span></label>
                <select id={`target-timeline-${idPrefix}`} name="timeline" value={values.timeline} onChange={(event) => updateValue('timeline', event.target.value)}>
                  <option value="">Choose a timeline</option>
                  <option>As soon as possible</option>
                  <option>Within one month</option>
                  <option>Within 1–3 months</option>
                  <option>Just exploring</option>
                </select>
              </div>
              <fieldset className={`project-enquiry-services${attemptedSubmit && selectedServices.length === 0 ? ' has-error' : ''}`} aria-required="true" aria-invalid={attemptedSubmit && selectedServices.length === 0}>
                <legend>Services interested in <span aria-hidden="true">*</span><span className="project-enquiry-optional"> (choose all that apply)</span></legend>
                <div className="project-enquiry-service-options">
                  {serviceOptions.map((service) => (
                    <label className="project-enquiry-checkbox" key={service}>
                      <input type="checkbox" name="services" value={service} checked={selectedServices.includes(service)} onChange={() => toggleService(service)} />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="project-enquiry-field">
                <label htmlFor={`monthly-budget-${idPrefix}`}>Monthly budget <span className="project-enquiry-optional">(optional, USD)</span></label>
                <select id={`monthly-budget-${idPrefix}`} name="budget" value={values.budget} onChange={(event) => updateValue('budget', event.target.value)}>
                  <option value="">Choose a budget</option>
                  <option>Under $500</option>
                  <option>$500–$999</option>
                  <option>$1,000–$1,499</option>
                  <option>$1,500–$2,499</option>
                  <option>$2,500+</option>
                  <option>Not decided yet</option>
                </select>
              </div>
              <div className="project-enquiry-field project-enquiry-details">
                <label htmlFor={`project-details-${idPrefix}`}>Additional project details <span className="project-enquiry-optional">(optional)</span></label>
                <textarea id={`project-details-${idPrefix}`} name="details" rows={4} placeholder="Tell us about your goals, challenges, location, or services you’re interested in." value={values.details} onChange={(event) => updateValue('details', event.target.value)} />
              </div>
            </div>
            {formError && <p className="project-enquiry-message is-error" role="alert">{formError}</p>}
            {formStatus && <p className="project-enquiry-message is-status" role="status">{formStatus}</p>}
            <button className="project-enquiry-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending enquiry…' : <>Get Your Free SEO Audit <ArrowRight size={19} aria-hidden="true" /></>}
            </button>
            <p className="project-enquiry-privacy">Your information will only be used to respond to your enquiry.</p>
          </form>
        </div>

        <aside className="project-enquiry-aside" aria-label="What to expect from your SEO audit enquiry">
          <div className="project-enquiry-benefits">
            {benefits.map(({ title, text, icon: Icon }) => (
              <div className="project-enquiry-benefit" key={title}>
                <span className="project-enquiry-benefit-icon"><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </div>
            ))}
          </div>
          <CalendlyBookingOption />
        </aside>
      </div>
    </section>
  );
}
