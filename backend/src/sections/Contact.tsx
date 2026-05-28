import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trpc } from '@/providers/trpc';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [partnerData, setPartnerData] = useState({
    organizationName: '', contactName: '', email: '', phone: '', interestType: 'other' as string, notes: '',
  });
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    },
  });

  const partnerMutation = trpc.partner.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setPartnerData({ organizationName: '', contactName: '', email: '', phone: '', interestType: 'other', notes: '' });
      setTimeout(() => setSubmitted(false), 3000);
    },
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.reveal-item');
      if (els) {
        gsap.from(Array.from(els), {
          y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({
      name: formData.name,
      email: formData.email,
      subject: formData.subject || undefined,
      message: formData.message,
    });
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    partnerMutation.mutate({
      organizationName: partnerData.organizationName,
      contactName: partnerData.contactName,
      email: partnerData.email,
      phone: partnerData.phone || undefined,
      interestType: partnerData.interestType as "sponsor" | "university_partner" | "media_partner" | "ecosystem_partner" | "other",
      notes: partnerData.notes || undefined,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#0a0a0a]"
      style={{ padding: 'clamp(60px, 10vw, 120px) 0', borderTop: '1px solid rgba(201,168,76,0.2)' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        {/* Toggle */}
        <div className="reveal-item flex gap-4 mb-12">
          <button
            onClick={() => setShowPartnerForm(false)}
            className={`font-body font-medium text-[0.875rem] uppercase tracking-[0.08em] px-6 py-2.5 transition-all duration-200 ${!showPartnerForm ? 'bg-[#c9a84c] text-[#0a0a0a]' : 'text-[#c9a84c] border border-[#c9a84c]'}`}
          >
            Get in Touch
          </button>
          <button
            onClick={() => setShowPartnerForm(true)}
            className={`font-body font-medium text-[0.875rem] uppercase tracking-[0.08em] px-6 py-2.5 transition-all duration-200 ${showPartnerForm ? 'bg-[#c9a84c] text-[#0a0a0a]' : 'text-[#c9a84c] border border-[#c9a84c]'}`}
          >
            Partner With Us
          </button>
        </div>

        {submitted && (
          <div className="mb-8 p-4 bg-[rgba(201,168,76,0.15)] border border-[#c9a84c]">
            <p className="font-body font-medium text-[#c9a84c] text-center">
              Thank you! Your submission has been received.
            </p>
          </div>
        )}

        {!showPartnerForm ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="reveal-item font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-4">
                GET IN TOUCH
              </div>
              <h2
                className="reveal-item font-display font-medium text-[#faf8f3] mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 0.95, letterSpacing: '-0.01em' }}
              >
                Let's Build Something Extraordinary
              </h2>
              <p className="reveal-item font-body font-light text-[#e0ddd5] mb-8" style={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
                Whether you're a professional seeking growth, a corporation looking to partner, or an institution ready to collaborate — we would love to hear from you.
              </p>
              <div className="reveal-item">
                <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#c9a84c] mb-2">Email</div>
                <a href="mailto:info@bicta.org" className="font-body font-normal text-[1.25rem] text-[#faf8f3] hover:text-[#c9a84c] transition-colors duration-200">info@bicta.org</a>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
              <div className="reveal-item">
                <label className="block font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">Name</label>
                <input
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] text-[#faf8f3] px-4 py-3 font-body text-[0.875rem] focus:outline-none focus:border-[#c9a84c] transition-colors"
                />
              </div>
              <div className="reveal-item">
                <label className="block font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">Email</label>
                <input
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] text-[#faf8f3] px-4 py-3 font-body text-[0.875rem] focus:outline-none focus:border-[#c9a84c] transition-colors"
                />
              </div>
              <div className="reveal-item">
                <label className="block font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">Subject</label>
                <input
                  type="text" value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] text-[#faf8f3] px-4 py-3 font-body text-[0.875rem] focus:outline-none focus:border-[#c9a84c] transition-colors"
                />
              </div>
              <div className="reveal-item">
                <label className="block font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">Message</label>
                <textarea
                  required rows={5} value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] text-[#faf8f3] px-4 py-3 font-body text-[0.875rem] focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="reveal-item font-body font-medium text-[0.875rem] uppercase tracking-[0.08em] bg-[#c9a84c] text-[#0a0a0a] px-8 py-3.5 transition-all duration-250 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] disabled:opacity-50"
              >
                {contactMutation.isPending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="reveal-item font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-4">
                PARTNER WITH US
              </div>
              <h2
                className="reveal-item font-display font-medium text-[#faf8f3] mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 0.95, letterSpacing: '-0.01em' }}
              >
                Join Our Ecosystem
              </h2>
              <p className="reveal-item font-body font-light text-[#e0ddd5] mb-8" style={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
                Partner with BICTA Elite to access top-tier tech talent, co-create cutting-edge programs, and position your organization at the forefront of Bangladesh's digital transformation.
              </p>
            </div>
            <form onSubmit={handlePartnerSubmit} className="flex flex-col gap-6">
              <div className="reveal-item">
                <label className="block font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">Organization Name *</label>
                <input type="text" required value={partnerData.organizationName}
                  onChange={(e) => setPartnerData({ ...partnerData, organizationName: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] text-[#faf8f3] px-4 py-3 font-body text-[0.875rem] focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
              <div className="reveal-item">
                <label className="block font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">Contact Name *</label>
                <input type="text" required value={partnerData.contactName}
                  onChange={(e) => setPartnerData({ ...partnerData, contactName: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] text-[#faf8f3] px-4 py-3 font-body text-[0.875rem] focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
              <div className="reveal-item">
                <label className="block font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">Email *</label>
                <input type="email" required value={partnerData.email}
                  onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] text-[#faf8f3] px-4 py-3 font-body text-[0.875rem] focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
              <div className="reveal-item">
                <label className="block font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">Partnership Type</label>
                <select value={partnerData.interestType}
                  onChange={(e) => setPartnerData({ ...partnerData, interestType: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] text-[#faf8f3] px-4 py-3 font-body text-[0.875rem] focus:outline-none focus:border-[#c9a84c] transition-colors">
                  <option value="sponsor">Event Sponsor</option>
                  <option value="university_partner">University Partner</option>
                  <option value="media_partner">Media Partner</option>
                  <option value="ecosystem_partner">Ecosystem Partner</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="reveal-item">
                <label className="block font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">Notes</label>
                <textarea rows={4} value={partnerData.notes}
                  onChange={(e) => setPartnerData({ ...partnerData, notes: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] text-[#faf8f3] px-4 py-3 font-body text-[0.875rem] focus:outline-none focus:border-[#c9a84c] transition-colors resize-none" />
              </div>
              <button
                type="submit"
                disabled={partnerMutation.isPending}
                className="reveal-item font-body font-medium text-[0.875rem] uppercase tracking-[0.08em] bg-[#c9a84c] text-[#0a0a0a] px-8 py-3.5 transition-all duration-250 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] disabled:opacity-50"
              >
                {partnerMutation.isPending ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
