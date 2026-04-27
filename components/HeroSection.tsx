'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const heroImages = [
  '/images/hero.jpg',
  '/images/hero2.png',
  '/images/hero3.png',
  '/images/hero4.png',
  '/images/hero5.png',
  '/images/hero7.png',
]

export default function HeroSection() {
  const router = useRouter()
  const [revealed, setRevealed] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (isMobile) {
    return (
      <section
        className="relative w-full overflow-hidden cursor-pointer"
        style={{ height: '100vw', minHeight: '320px', maxHeight: '520px', background: '#0d1b0d' }}
        onClick={() => router.push('/shop')}
      >
        <Image
          src="/images/middleban.png"
          alt="MiniBazaar"
          fill
          style={{ objectFit: 'cover', objectPosition: 'top center' }}
          priority
        />
      </section>
    )
  }

  return (
    /* ── Desktop hero — carousel with Ken Burns ─────── */
    <section
        className="relative w-full overflow-hidden cursor-pointer"
        style={{ height: '100vh', minHeight: '100vh', background: '#0d1b0d' }}
        onClick={() => router.push('/shop')}
      >
        {heroImages.map((img, idx) => (
          <div
            key={img}
            className="absolute inset-0 z-0"
            style={{
              opacity: idx === currentImageIndex ? 1 : 0,
              transition: 'opacity 2.2s ease-in-out',
              backgroundImage: `url("${img}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
              animation: 'kenBurns 14s ease-in-out infinite alternate',
              willChange: 'opacity, transform',
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.25) 100%)',
          }}
        />

        {/* ── Branded intro curtain ─────────────────────── */}
        <div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #061506 0%, #0d1b2a 55%, #150615 100%)',
            transform: revealed ? 'translateY(-100%)' : 'translateY(0)',
            transition: 'transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)',
            pointerEvents: revealed ? 'none' : 'auto',
          }}
        >
          <div className="flex flex-col items-center gap-7 select-none">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute w-40 h-40 rounded-3xl border border-green-400/25 animate-ping"
                style={{ animationDuration: '1.6s' }}
              />
              <div
                className="absolute w-36 h-36 rounded-3xl border border-green-400/15 animate-ping"
                style={{ animationDuration: '1.6s', animationDelay: '0.3s' }}
              />
              <div
                className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                style={{ animation: 'float 2.5s ease-in-out infinite' }}
              >
                <Image
                  src="/miniBazaarlogo.jpg"
                  alt="MiniBazaar"
                  fill
                  style={{ objectFit: 'contain', background: 'white' }}
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase">
                Welcome to MiniBazaar
              </p>
              <div className="w-44 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #1B8B3B, #4ade80, #C8102E)',
                    animation: 'heroLoadBar 1.6s ease-in-out forwards',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
