'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'

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
          <span className="text-black font-black text-lg tabular-nums rounded-lg px-2.5 py-1 min-w-[2.4rem] text-center" style={{ background: '#D4AF37' }}>
            {val}
          </span>
          {i < 2 && <span className="text-white/80 font-black text-lg">:</span>}
        </span>
      ))}
    </div>
  )
}

export default function FlashDeals({ products }: { products?: Product[] }) {
  const addItem = useCartStore((s) => s.addItem)
  const hotProducts = products ?? []

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
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.80)' }} />

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
              <p className="text-xs font-bold uppercase tracking-widest text-white">Limited Time</p>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                Flash <span style={{ color: '#C8102E' }}>Deals</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-medium">Ends in</span>
            <Countdown />
          </div>
        </div>

        {/* Cards row — horizontal scroll */}
        <div
          className="flex gap-4 overflow-x-auto pb-2 reveal reveal-d1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {hotProducts.length > 0 ? (
            hotProducts.map((p, i) => {
              const discount = p.compare_price
                ? Math.round(((p.compare_price - p.price) / p.compare_price) * 100)
                : 0
              return (
                <div
                  key={p.id}
                  className="relative shrink-0 rounded-2xl overflow-hidden group border border-white/10 bg-white flex flex-col"
                  style={{ width: '200px', transitionDelay: `${i * 0.06}s` }}
                >
                  <Link href={`/product/${p.id}`} className="relative block" style={{ height: '190px' }}>
                    <Image
                      src={p.images?.[0] || `https://picsum.photos/seed/${p.id}/400/380`}
                      alt={p.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-bold shadow-lg" style={{ background: '#C8102E' }}>
                      <Zap size={10} className="fill-white" /> {discount > 0 ? `-${discount}%` : 'HOT'}
                    </div>
                  </Link>
                  <div className="p-3 flex flex-col flex-1">
                    <Link href={`/product/${p.id}`} className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-2 flex-1 hover:text-green-700">{p.name}</Link>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-black text-gray-900 text-sm">Rs. {p.price.toLocaleString()}</span>
                        {p.compare_price && p.compare_price > p.price && (
                          <span className="block text-[11px] text-gray-400 line-through">Rs. {p.compare_price.toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        onClick={() => { addItem(p, 1); toast.success('Added to cart!') }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 hover:scale-110 transition-all"
                        style={{ background: '#C8102E' }}
                        aria-label="Add to cart"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            deals.map((deal, i) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div
                  className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-bold shadow-lg"
                  style={{ background: '#C8102E' }}
                >
                  <Zap size={10} className="fill-white" /> FLASH
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-500/60 transition-all duration-300" />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
