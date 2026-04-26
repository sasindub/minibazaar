'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Star, Truck } from 'lucide-react'

const slides = [
  {
    id: 1,
    tag: 'Premium Collection',
    title: 'Where Variety',
    titleColored: 'Meets Value',
    subtitle: 'Discover premium chocolates, branded perfumes, exotic snacks and beauty products — all in one place.',
    cta: 'Shop Now',
    ctaHref: '/shop',
    image: '/banner.jpg',
    imageFallback: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=1200&q=80',
    bg: 'linear-gradient(135deg, #E8F5ED 0%, #ffffff 60%, #FDE8EB 100%)',
  },
  {
    id: 2,
    tag: 'New Arrivals',
    title: 'Luxury Perfumes',
    titleColored: 'Just Arrived',
    subtitle: 'Explore our exclusive collection of branded fragrances from Dior, Chanel, Versace and more.',
    cta: 'Explore Perfumes',
    ctaHref: '/shop?category=perfumes',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&q=80',
    bg: 'linear-gradient(135deg, #FFF8E7 0%, #ffffff 60%, #F0F8FF 100%)',
  },
  {
    id: 3,
    tag: 'Best Sellers',
    title: 'Premium Chocolates',
    titleColored: "You'll Love",
    subtitle: 'Ferrero Rocher, Godiva, Lindt, Cadbury and more — hand-picked for the finest chocolate experience.',
    cta: 'Shop Chocolates',
    ctaHref: '/shop?category=chocolates',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=1200&q=80',
    bg: 'linear-gradient(135deg, #FFF3E0 0%, #ffffff 60%, #FCE4EC 100%)',
  },
]

const stats = [
  { value: '500+', label: 'Products' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '50+', label: 'Brands' },
  { value: '4.9★', label: 'Rating' },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goTo = (idx: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent(idx)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = () => goTo((current + 1) % slides.length)

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [current])

  const slide = slides[current]

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '85vh', background: slide.bg, transition: 'background 0.5s ease' }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1B8B3B, transparent)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C8102E, transparent)', transform: 'translate(-30%, 30%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12 min-h-[85vh]">
        {/* Text content */}
        <div className="flex-1 z-10" key={current} style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
          <style>{`
            @keyframes fadeSlideIn {
              from { opacity: 0; transform: translateX(-30px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}</style>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 border"
            style={{ background: '#E8F5ED', color: '#1B8B3B', borderColor: '#B8DFC5' }}>
            <Star size={12} fill="#1B8B3B" />
            {slide.tag}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-4 tracking-tight">
            <span className="text-gray-900">{slide.title}</span>
            <br />
            <span style={{ color: '#C8102E' }}>{slide.titleColored}</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={slide.ctaHref}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)', boxShadow: '0 8px 30px rgba(27,139,59,0.4)' }}
            >
              <ShoppingBag size={18} />
              {slide.cta}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:bg-gray-100 border-2 border-gray-200 text-gray-700 hover:scale-105"
            >
              Browse All
            </Link>
          </div>

          <div className="flex items-center gap-3 mt-8 p-4 rounded-2xl w-fit border border-gray-100 bg-white/80">
            <Truck size={18} style={{ color: '#1B8B3B' }} />
            <span className="text-sm text-gray-600 font-medium">Free delivery on orders over <strong style={{ color: '#1B8B3B' }}>Rs. 5,000</strong></span>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative" key={`img-${current}`} style={{ animation: 'fadeSlideInRight 0.5s ease-out' }}>
          <style>{`
            @keyframes fadeSlideInRight {
              from { opacity: 0; transform: translateX(30px) scale(0.95); }
              to { opacity: 1; transform: translateX(0) scale(1); }
            }
          `}</style>

          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px]">
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: 'cover' }}
                priority={current === 0}
                onError={(e) => {
                  if (slide.imageFallback) {
                    (e.target as HTMLImageElement).src = slide.imageFallback
                  }
                }}
              />
              <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(27,139,59,0.1) 0%, transparent 60%)' }} />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1548907040-4baa42d10919?w=100&q=80" alt="" fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Just Ordered</p>
                  <p className="text-sm font-bold text-gray-900">Ferrero Rocher Box</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-5 py-3 shadow-2xl border border-gray-100 hidden md:block">
              <p className="text-2xl font-black" style={{ color: '#1B8B3B' }}>10K+</p>
              <p className="text-xs text-gray-500 font-medium">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slider controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <button onClick={prev} className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center shadow-md hover:bg-white transition-colors">
          <ChevronLeft size={18} className="text-gray-700" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                background: i === current ? '#1B8B3B' : '#CBD5E0',
              }}
            />
          ))}
        </div>
        <button onClick={next} className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center shadow-md hover:bg-white transition-colors">
          <ChevronRight size={18} className="text-gray-700" />
        </button>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-gray-100 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-black" style={{ color: '#1B8B3B' }}>{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
