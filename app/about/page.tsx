import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, Users, Package, ShieldCheck, ArrowRight } from 'lucide-react'

const values = [
  { icon: ShieldCheck, title: '100% Authentic', desc: 'We source all products directly from authorized distributors. Every item is genuine and quality-checked.' },
  { icon: Heart, title: 'Customer First', desc: 'Your satisfaction is our priority. From browsing to delivery, we make every step seamless and enjoyable.' },
  { icon: Star, title: 'Premium Quality', desc: 'We handpick only the best — from luxury chocolates to branded fragrances — ensuring top-tier quality every time.' },
  { icon: Package, title: 'Careful Packaging', desc: 'Every order is packed with love and care. Gift-ready packaging at no extra cost.' },
]

const team = [
  { name: 'MiniBazaar Team', role: 'The MiniBazaar Family', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-24 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #E8F5ED 0%, #ffffff 60%, #FDE8EB 100%)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #1B8B3B, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6" style={{ background: '#E8F5ED', color: '#1B8B3B' }}>
            🌿 Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Where Variety<br /><span style={{ color: '#C8102E' }}>Meets Value</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            MiniBazaar was born from a simple passion — bringing premium international products to Sri Lankan homes at fair prices, with genuine quality you can trust.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>MiniBazaar started as a passion project — bringing genuine, premium products from around the world to Sri Lankan customers. What began as a small Facebook page grew into one of the most trusted online stores for chocolates, perfumes, and specialty products in Sri Lanka.</p>
              <p>We believe everyone deserves access to authentic branded products at fair prices. Whether it&apos;s a box of Ferrero Rocher for a loved one, a bottle of Dior Sauvage for yourself, or a premium snack selection — we make it possible.</p>
              <p>Every product in our store is carefully sourced, quality-checked, and packed with care. We&apos;re not just a shop — we&apos;re your trusted partner for the finer things in life.</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80"
                alt="Our products"
                width={600}
                height={600}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#E8F5ED' }}>
                  <Users size={22} style={{ color: '#1B8B3B' }} />
                </div>
                <div>
                  <p className="text-2xl font-black" style={{ color: '#1B8B3B' }}>10,000+</p>
                  <p className="text-sm text-gray-500 font-medium">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '10K+', label: 'Customers Served' },
            { value: '500+', label: 'Products Available' },
            { value: '50+', label: 'Premium Brands' },
            { value: '4.9★', label: 'Average Rating' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black mb-2">{s.value}</p>
              <p className="text-green-200 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Our <span style={{ color: '#1B8B3B' }}>Values</span></h2>
            <p className="text-gray-500 max-w-xl mx-auto">What drives us every day to serve you better</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-3xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: '#E8F5ED' }}>
                  <v.icon size={22} style={{ color: '#1B8B3B' }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" style={{ background: '#FAFBFA' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to Experience MiniBazaar?</h2>
          <p className="text-gray-500 mb-8">Join thousands of happy customers who trust us for premium products.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:scale-105" style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}>
              Shop All Products <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-100 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
