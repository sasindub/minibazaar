import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, CreditCard, Truck, Shield, RefreshCw } from 'lucide-react'

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const features = [
  { icon: Truck, title: 'Island-Wide Delivery', desc: 'Delivery across all Sri Lanka' },
  { icon: CreditCard, title: 'Secure Payments', desc: 'Bank transfer & Cash on delivery' },
  { icon: Shield, title: '100% Authentic', desc: 'Genuine branded products only' },
  { icon: RefreshCw, title: 'Easy Returns', desc: 'Hassle-free return policy' },
]

export default function Footer() {
  return (
    <footer>
      {/* Feature strip */}
      <div className="border-t border-b border-gray-100" style={{ background: '#F9FBF9' }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#E8F5ED' }}>
                  <f.icon size={22} style={{ color: '#1B8B3B' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{f.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="text-white" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="relative w-40 h-14 mb-4 bg-white rounded-2xl p-2">
                <Image src="/logo.png" alt="MiniBazaar" fill style={{ objectFit: 'contain', padding: '4px' }} />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Where variety meets value. Your one-stop shop for premium chocolates, branded perfumes, snacks, and more — delivered to your door across Sri Lanka.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/minibazaar.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: '#1877F2' }}
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://instagram.com/minibazaar.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Shop All', href: '/shop' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Track Order', href: '/contact' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Categories</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Chocolates', href: '/shop?category=chocolates' },
                  { label: 'Perfumes', href: '/shop?category=perfumes' },
                  { label: 'Snacks & Nuts', href: '/shop?category=snacks' },
                  { label: 'Beauty & Care', href: '/shop?category=beauty' },
                  { label: 'Beverages', href: '/shop?category=beverages' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Contact Us</h3>
              <div className="space-y-4">
                <a href="tel:+94XXXXXXXXX" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(27,139,59,0.2)' }}>
                    <Phone size={14} style={{ color: '#4ade80' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                    <p className="text-gray-300 text-sm group-hover:text-white transition-colors">+94 77 XXX XXXX</p>
                  </div>
                </a>
                <a href="mailto:hello@minibazaar.lk" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(27,139,59,0.2)' }}>
                    <Mail size={14} style={{ color: '#4ade80' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-gray-300 text-sm group-hover:text-white transition-colors">hello@minibazaar.lk</p>
                  </div>
                </a>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(27,139,59,0.2)' }}>
                    <Clock size={14} style={{ color: '#4ade80' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Working Hours</p>
                    <p className="text-gray-300 text-sm">Mon–Sat: 9AM – 6PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(27,139,59,0.2)' }}>
                    <MapPin size={14} style={{ color: '#4ade80' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Location</p>
                    <p className="text-gray-300 text-sm">Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-xs">© {new Date().getFullYear()} MiniBazaar. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
