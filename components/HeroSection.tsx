'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Star, Truck } from 'lucide-react'

const heroImages = [
  '/images/hero.jpg',
  '/images/hero2.png',
  '/images/hero3.png',
  '/images/hero4.png',
  '/images/hero5.png',
  '/images/hero7.png',
]

export default function HeroSection() {
  const [videoEnded, setVideoEnded] = useState(false)
  const [isCarouselActive, setIsCarouselActive] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (videoEnded) {
      const timer = setTimeout(() => {
        setIsCarouselActive(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [videoEnded])

  useEffect(() => {
    if (isCarouselActive) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isCarouselActive])

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ height: '100vh', minHeight: '100vh' }}
    >
      {/* Carousel background layer */}
      {heroImages.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 z-0 ${
            (isCarouselActive && idx === currentImageIndex) || (!isCarouselActive && idx === 0)
              ? 'opacity-100'
              : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url("${img}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Intro video — overlays carousel until ended */}
      <video
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-10 ${
          videoEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        src="/images/hervid.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => setVideoEnded(true)}
      />

      {/* Soft gradient overlay for readability */}
      <div className="absolute inset-0 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.18) 100%)' }} />

      {/* Inner content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full h-full flex-1 flex flex-col justify-between pt-28 md:pt-36 pb-12 md:pb-16 z-30">
        {/* Top: Premium Collection tag */}
        <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border shadow-md bg-white/95 backdrop-blur-md"
            style={{ color: '#1B8B3B', borderColor: '#B8DFC5' }}
          >
            <Star size={12} fill="#1B8B3B" />
            Premium Collection
          </div>
        </div>

        {/* Center spacer — text is baked into hero image */}
        <div className="flex-1" aria-hidden="true" />

        {/* Bottom: small CTA + delivery */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #1B8B3B, #156B2E)',
                boxShadow: '0 8px 24px rgba(27,139,59,0.4)',
              }}
            >
              <ShoppingBag size={15} />
              Shop Now
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all border border-white/60 text-gray-800 hover:bg-white bg-white/70 backdrop-blur-md shadow-lg hover:scale-105"
            >
              Browse All
            </Link>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/50 bg-white/70 backdrop-blur-md shadow-md">
            <Truck size={14} style={{ color: '#1B8B3B' }} />
            <span className="text-xs md:text-sm text-gray-800 font-semibold">
              Free delivery on orders over <strong style={{ color: '#1B8B3B' }}>Rs. 5,000</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
