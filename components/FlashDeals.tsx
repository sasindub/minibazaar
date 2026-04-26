'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Zap } from 'lucide-react'

const deals = [
  { id: 1, src: '/images/i1.jpg' },
  { id: 2, src: '/images/ii2.jpg' },
  { id: 3, src: '/images/ii3.jpg' },
  { id: 4, src: '/images/ii2.jpg' },
  { id: 5, src: '/images/ii5.jpg' },
  { id: 6, src: '/images/ii7.jpg' },
  { id: 7, src: '/images/ii8.jpg' },
  { id: 8, src: '/images/ii9.jpg' },
  { id: 9, src: '/images/ii10.jpg' },
  { id: 10, src: '/images/ii12.jpg' },
]

function Countdown() {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 })

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev
        if (s > 0) return { h, m, s: s - 1 }
        if (m > 0) return { h, m: m - 1, s: 59 }
        if (h > 0) return { h: h - 1, m: 59, s: 59 }
        return { h: 5, m: 59, s: 59 }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-1.5">
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-white font-black text-lg tabular-nums bg-black/40 rounded-lg px-2.5 py-1 min-w-[2.4rem] text-center backdrop-blur-sm">
            {val}
          </span>
          {i < 2 && <span className="text-white/80 font-black text-lg">:</span>}
        </span>
      ))}
    </div>
  )
}

export default function FlashDeals() {
  return (
    <section
      className="py-14 px-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/images/middleban.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative max-w-7xl mx-auto" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 reveal">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl shadow-lg"
              style={{ background: '#C8102E' }}
            >
              <Zap size={22} className="fill-white text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-400">Limited Time</p>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                Flash <span style={{ color: '#C8102E' }}>Deals</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm font-medium">Ends in</span>
            <Countdown />
          </div>
        </div>

        {/* Cards row — horizontal scroll */}
        <div
          className="flex gap-4 overflow-x-auto pb-2 reveal reveal-d1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {deals.map((deal, i) => (
            <div
              key={deal.id}
              className="relative shrink-0 rounded-2xl overflow-hidden cursor-pointer group border border-white/10"
              style={{
                width: '200px',
                height: '260px',
                transitionDelay: `${i * 0.06}s`,
              }}
            >
              <Image
                src={deal.src}
                alt={`Flash deal ${deal.id}`}
                fill
                style={{ objectFit: 'cover', objectPosition: 'top' }}
                className="transition-transform duration-500 group-hover:scale-107"
              />
              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Flash badge */}
              <div
                className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-bold shadow-lg"
                style={{ background: '#C8102E' }}
              >
                <Zap size={10} className="fill-white" /> FLASH
              </div>
              {/* Hover glow border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-500/60 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
