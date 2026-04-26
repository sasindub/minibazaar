import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function LuxuryBanner() {
  return (
    <section className="py-20 px-4" style={{ background: '#F8F9FA' }}>
      <div className="max-w-7xl mx-auto">
        {/* Wide dark banner */}
        <div
          className="relative overflow-hidden rounded-3xl reveal"
          style={{
            background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2744 50%, #0d1b2a 100%)',
            minHeight: '340px',
          }}
        >
          {/* Gold orbs */}
          <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.18), transparent 70%)', transform: 'translateY(-40%)' }} />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.15), transparent 70%)', transform: 'translateY(40%)' }} />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-10 md:p-16">
            {/* Left image */}
            <div className="relative w-56 h-56 lg:w-72 lg:h-72 shrink-0 reveal-left">
              <Image
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80"
                alt="Luxury Perfumes"
                fill
                style={{ objectFit: 'cover', borderRadius: '1.5rem' }}
                className="shadow-2xl"
              />
              <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), transparent)' }} />
            </div>

            {/* Text */}
            <div className="flex-1 text-center lg:text-left reveal">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-5"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                <Sparkles size={12} />
                Exclusive Collection
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                Premium Fragrances<br />
                <span style={{ color: '#D4AF37' }}>at Unbeatable Prices</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
                Authentic luxury perfumes from the world&apos;s top houses — Dior, Chanel, Versace, YSL and more. 100% genuine, island-wide delivery.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link
                  href="/shop?category=perfumes"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 group"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0d1b2a' }}
                >
                  Shop Perfumes
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold border-2 text-white transition-all hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Browse All
                </Link>
              </div>
            </div>

            {/* Right image */}
            <div className="relative w-48 h-48 lg:w-64 lg:h-64 shrink-0 hidden md:block reveal-right">
              <Image
                src="https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=600&q=80"
                alt="Chanel Perfume"
                fill
                style={{ objectFit: 'cover', borderRadius: '1.5rem' }}
                className="shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Two side-by-side mini banners */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Chocolates mini banner */}
          <div
            className="relative overflow-hidden rounded-3xl p-8 flex items-center gap-6 reveal reveal-d1"
            style={{ background: 'linear-gradient(135deg, #3E1C00 0%, #6B3A2A 100%)', minHeight: '180px' }}
          >
            <div className="absolute right-0 top-0 w-40 h-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 80% 50%, #fff, transparent)' }} />
            <div className="relative w-24 h-24 shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300&q=80"
                alt="Chocolates"
                fill
                style={{ objectFit: 'cover', borderRadius: '1rem' }}
              />
            </div>
            <div className="text-white">
              <span className="text-xs font-bold uppercase tracking-widest opacity-70 block mb-1">Sweet Picks</span>
              <h3 className="text-2xl font-black mb-2 leading-tight">Premium<br />Chocolates</h3>
              <Link
                href="/shop?category=chocolates"
                className="inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-3"
                style={{ color: '#F59E0B' }}
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Beauty mini banner */}
          <div
            className="relative overflow-hidden rounded-3xl p-8 flex items-center gap-6 reveal reveal-d2"
            style={{ background: 'linear-gradient(135deg, #4A0E3A 0%, #7B2D6B 100%)', minHeight: '180px' }}
          >
            <div className="absolute right-0 top-0 w-40 h-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 80% 50%, #fff, transparent)' }} />
            <div className="relative w-24 h-24 shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80"
                alt="Beauty"
                fill
                style={{ objectFit: 'cover', borderRadius: '1rem' }}
              />
            </div>
            <div className="text-white">
              <span className="text-xs font-bold uppercase tracking-widest opacity-70 block mb-1">Glow Up</span>
              <h3 className="text-2xl font-black mb-2 leading-tight">Beauty &amp;<br />Skincare</h3>
              <Link
                href="/shop?category=beauty"
                className="inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-3"
                style={{ color: '#F9A8D4' }}
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
