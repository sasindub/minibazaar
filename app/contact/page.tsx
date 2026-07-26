'use client'
import { useState } from 'react'
import { Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const contactInfo = [
  { icon: Phone, title: 'Phone / WhatsApp', value: '+94 77 252 5362', href: 'tel:+94772525362', color: '#1B8B3B' },
  { icon: Mail, title: 'Email', value: 'hello@minibazaar.lk', href: 'mailto:hello@minibazaar.lk', color: '#1B8B3B' },
  { icon: FacebookIcon, title: 'Facebook', value: 'facebook.com/minibazaar.lk', href: 'https://www.facebook.com/minibazaar.lk/', color: '#1877F2' },
  { icon: Clock, title: 'Business Hours', value: 'Mon–Sat: 9AM – 6PM', href: null, color: '#1B8B3B' },
]

const faqs = [
  { q: 'How long does delivery take?', a: 'Colombo area: 1–2 business days. Other areas: 2–4 business days. Same-day delivery available for Colombo orders placed before 12PM.' },
  { q: 'Do you deliver island-wide?', a: 'Yes! We deliver to all parts of Sri Lanka. Shipping fee is Rs. 350 for orders under Rs. 5,000. Free delivery for orders Rs. 5,000 and above.' },
  { q: 'Are your products authentic?', a: 'Absolutely! We source all products directly from authorized distributors. 100% genuine products guaranteed.' },
  { q: 'How do I pay for my order?', a: 'We accept Cash on Delivery (COD) and Bank Transfer. COD is available island-wide. For bank transfers, share your receipt via WhatsApp.' },
  { q: 'Can I return a product?', a: 'Yes, we have a 7-day return policy for unopened items in original condition. Contact us within 7 days of receiving your order.' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const set = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [f]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #E8F5ED 0%, #ffffff 60%, #FDE8EB 100%)' }}>
        <span className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4" style={{ background: '#E8F5ED', color: '#1B8B3B' }}>
          Get in Touch
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          We&apos;re Here to <span style={{ color: '#C8102E' }}>Help</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Have a question about your order or want to know more about our products? We&apos;d love to hear from you!
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900 mb-6">Contact Details</h2>
            {contactInfo.map((c) => (
              <div key={c.title} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}15` }}>
                  <c.icon size={18} style={{ color: c.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">{c.title}</p>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      className="text-sm font-semibold text-gray-900 hover:text-green-700 transition-colors">{c.value}</a>
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{c.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/94772525362?text=Hello%20MiniBazaar!%20I%20have%20a%20question%20about..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg mt-2"
              style={{ background: '#25D366' }}
            >
              <MessageSquare size={18} /> Chat on WhatsApp
            </a>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6">Send us a Message</h2>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#E8F5ED' }}>
                    <CheckCircle2 size={36} style={{ color: '#1B8B3B' }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                  <p className="text-gray-500 max-w-sm">Thank you for reaching out! We&apos;ll get back to you within 24 hours. For urgent matters, please WhatsApp us directly.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                    className="mt-2 px-6 py-3 rounded-xl text-white font-semibold"
                    style={{ background: '#1B8B3B' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Full Name *</label>
                    <input required value={form.name} onChange={set('name')} placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-green-500 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Email *</label>
                    <input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-green-500 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Phone</label>
                    <input value={form.phone} onChange={set('phone')} placeholder="077 XXX XXXX" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-green-500 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Subject *</label>
                    <select required value={form.subject} onChange={set('subject')} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-green-500 focus:outline-none transition-all cursor-pointer">
                      <option value="">Select a topic</option>
                      <option>Order Inquiry</option>
                      <option>Product Question</option>
                      <option>Delivery Issue</option>
                      <option>Return / Refund</option>
                      <option>Wholesale Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Message *</label>
                    <textarea required value={form.message} onChange={set('message')} placeholder="Tell us how we can help you..." rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:border-green-500 focus:outline-none transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold transition-all hover:opacity-90 shadow-lg disabled:opacity-70" style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}>
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Send Message</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">Frequently Asked <span style={{ color: '#1B8B3B' }}>Questions</span></h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <p className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</p>
                  <span className="text-2xl leading-none transition-transform duration-200 shrink-0" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none', color: '#1B8B3B' }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
