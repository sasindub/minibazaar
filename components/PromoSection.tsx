import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Gift, Truck, Clock } from 'lucide-react'

export default function PromoSection() {
  return (
    <section className="py-20 px-4" style={{ background: '#FAFBFA' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main promo banner */}
        <div className="relative overflow-hidden rounded-3xl reveal" style={{ background: 'linear-gradient(135deg, #1B8B3B 0%, #156B2E 100%)', minHeight: '280px' }}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 rounded-full opacity-10" style={{ background: 'white', transform: 'translateY(40%)' }} />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-10 md:p-14">
            <div className="flex-1 text-white">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4 bg-white/20 backdrop-blur-sm">
                🎁 Special Offer
              </span>
              <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4">
                Free Delivery on<br />
                Orders Over <span className="text-yellow-300">Rs. 5,000</span>
              </h2>
              <p className="text-green-100 text-lg mb-6 max-w-md">
                Shop your favorite chocolates, perfumes and more with island-wide delivery — completely free!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:scale-105 hover:shadow-xl"
                style={{ color: '#1B8B3B' }}
              >
                Shop Now <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative w-64 h-48 lg:w-72 lg:h-56 shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1561677978-583a6c4fef23?w=600&q=80"
                alt="Free delivery"
                fill
                style={{ objectFit: 'contain' }}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Two smaller banners */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-3xl p-8 reveal reveal-d1" style={{ background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', minHeight: '200px' }}>
            <div className="absolute right-4 bottom-4 opacity-20">
              <Gift size={100} style={{ color: '#E65100' }} />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: '#E65100', color: 'white' }}>
              Gift Ready
            </span>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Premium Gift<br />Packaging</h3>
            <p className="text-gray-600 text-sm mb-4">Every order gift-wrapped with love — perfect for any occasion.</p>
            <Link href="/shop" className="inline-flex items-center gap-1 font-semibold text-sm" style={{ color: '#E65100' }}>
              Shop Gifts <ArrowRight size={14} />
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-3xl p-8 reveal reveal-d2" style={{ background: 'linear-gradient(135deg, #E8F5FD, #B3E0F5)', minHeight: '200px' }}>
            <div className="absolute right-4 bottom-4 opacity-20">
              <Clock size={100} style={{ color: '#0277BD' }} />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: '#0277BD', color: 'white' }}>
              Express Delivery
            </span>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Same-Day<br />Delivery*</h3>
            <p className="text-gray-600 text-sm mb-4">Order before 12PM for same-day delivery in Colombo area.</p>
            <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-sm" style={{ color: '#0277BD' }}>
              Learn More <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
