'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  const [videoEnded, setVideoEnded] = useState(false)
  const [isCarouselActive, setIsCarouselActive] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (videoEnded) {
      const timer = setTimeout(() => setIsCarouselActive(true), 3000)
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
      className="relative w-full overflow-hidden flex flex-col cursor-pointer"
      style={{ height: '100vh', minHeight: '100vh' }}
      onClick={() => router.push('/shop')}
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
            backgroundPosition: 'top center',
          }}
        />
      ))}

      {/* Intro video — anchored to top so bottom is cropped */}
      <video
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-10 ${
          videoEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ objectPosition: 'top' }}
        src="/images/hervid.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => setVideoEnded(true)}
      />

      {/* Soft gradient overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.18) 100%)' }}
      />

    </section>
  )
}
