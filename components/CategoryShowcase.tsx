'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingCart, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import type { Product, Category } from '@/lib/types'

// Per-category visual styling (design metadata only). Products come from the DB.
// Unknown slugs fall back to the default style.
type CategoryStyle = {
  emoji: string
  color: string
  accentColor: string
  headline: string
  sub: string
  badge: string
}

const defaultStyle: CategoryStyle = {
  emoji: '🛍️', color: '#1B4D1A', accentColor: '#1B8B3B',
  headline: 'Featured Picks', sub: 'Explore our handpicked selection in this category.', badge: 'Popular',
}

const styleMap: Record<string, CategoryStyle> = {
  chocolates: { emoji: '🍫', color: '#3E1C00', accentColor: '#C8102E', headline: 'Sweet Indulgence', sub: 'Premium chocolates from world-renowned brands.', badge: 'Trending' },
  perfumes: { emoji: '🌸', color: '#0D1B2A', accentColor: '#1B8B3B', headline: 'Luxury Fragrances', sub: 'Authentic branded perfumes at unbeatable prices.', badge: 'Authentic' },
  snacks: { emoji: '🥜', color: '#1B4D1A', accentColor: '#1B8B3B', headline: 'Premium Snacks', sub: 'Exotic nuts, gourmet cookies and crackers.', badge: 'Best Value' },
  beauty: { emoji: '💄', color: '#4A0E3A', accentColor: '#C8102E', headline: 'Glow Up', sub: 'Skincare and beauty essentials for radiant skin.', badge: 'New In' },
  beverages: { emoji: '🍹', color: '#0D3B4A', accentColor: '#1B8B3B', headline: 'Sip & Savour', sub: 'Specialty drinks and beverages for every mood.', badge: 'Fresh' },
}

export type ShowcaseGroup = { category: Category; products: Product[] }

function ShowcaseCard({ product, accentColor }: { product: Product; accentColor: string }) {
  const addItem = useCartStore((s) => s.addItem)
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  const handleAdd = () => {
    addItem(product, 1)
    toast.success('Added to cart!')
  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col">
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-gray-50 block">
        <Image
          src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/500/375`}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 group-hover:scale-110"
        />
        {discount > 0 && (
          <span
            className="absolute top-3 left-3 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md"
            style={{ background: accentColor }}
          >
            -{discount}%
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.id}`} className="font-bold text-gray-900 text-sm leading-snug mb-3 line-clamp-2 flex-1 hover:text-green-700 transition-colors">
          {product.name}
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="font-black text-gray-900 text-base leading-none">
              Rs. {product.price.toLocaleString()}
            </p>
            {product.compare_price && product.compare_price > product.price && (
              <p className="text-[11px] text-gray-400 line-through mt-0.5">
                Rs. {product.compare_price.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 transition-all hover:scale-110 active:scale-95 shadow-md"
            style={{ background: accentColor }}
            aria-label="Add to cart"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CategoryShowcase({ groups }: { groups: ShowcaseGroup[] }) {
  const [activeIdx, setActiveIdx] = useState(0)

  // Only categories that actually have products
  const panels = groups
    .filter((g) => g.products.length > 0)
    .map((g) => ({
      category: g.category,
      products: g.products.slice(0, 4),
      style: styleMap[g.category.slug] || defaultStyle,
    }))

  if (panels.length === 0) return null
  const idx = Math.min(activeIdx, panels.length - 1)
  const panel = panels[idx]
  const cat = {
    slug: panel.category.slug,
    label: panel.category.name,
    image: panel.category.image_url || `https://picsum.photos/seed/${panel.category.slug}/900/1200`,
    products: panel.products,
    ...panel.style,
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: '#FAFBFA' }}>
      {/* Decorative background blob */}
      <div
        className="absolute top-1/2 -right-32 w-96 h-96 rounded-full pointer-events-none transition-all duration-700 blur-3xl opacity-30"
        style={{ background: cat.accentColor, transform: 'translateY(-50%)' }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4" style={{ background: '#E8F5ED', color: '#1B8B3B' }}>
            <Sparkles size={12} />
            Shop by Category
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
            Discover Our <span style={{ color: '#C8102E' }}>Collections</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Handpicked favourites across every category — something for everyone
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10 reveal reveal-d1">
          <div className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-white shadow-sm border border-gray-100">
            {panels.map((p, i) => (
              <button
                key={p.category.slug}
                onClick={() => setActiveIdx(i)}
                className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                  idx === i
                    ? 'text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={idx === i ? { background: p.style.accentColor } : {}}
              >
                <span className="text-base">{p.style.emoji}</span>
                {p.category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active panel */}
        <div
          key={activeIdx}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-500"
        >
          {/* Hero panel */}
          <div
            className="lg:col-span-4 relative overflow-hidden rounded-3xl min-h-[420px] lg:min-h-[560px] group/hero"
            style={{ animation: 'fadeUp 0.5s ease-out' }}
          >
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-1000 group-hover/hero:scale-110"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${cat.color}66 45%, ${cat.color}F0 100%)`,
              }}
            />

            {/* Badge */}
            <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-black shadow-lg" style={{ color: cat.accentColor }}>
              <Sparkles size={11} />
              {cat.badge}
            </div>

            <div className="absolute inset-0 p-7 md:p-8 flex flex-col justify-end text-white">
              <div className="text-5xl mb-3 drop-shadow-lg">{cat.emoji}</div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">{cat.label}</p>
              <h3 className="text-3xl md:text-4xl font-black mb-3 leading-[1.05]">{cat.headline}</h3>
              <p className="text-sm opacity-85 leading-relaxed mb-6 max-w-xs">{cat.sub}</p>
              <Link
                href={`/shop?category=${cat.slug}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white font-bold text-sm w-fit hover:scale-105 transition-all shadow-xl group/cta"
                style={{ color: cat.color }}
              >
                Shop All {cat.label}
                <ArrowRight size={14} className="group-hover/cta:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Products grid (2×2) */}
          <div className="lg:col-span-8 grid grid-cols-2 gap-4 md:gap-5">
            {cat.products.map((p, i) => (
              <div key={p.id} style={{ animation: `fadeUp 0.5s ease-out ${0.05 + i * 0.08}s both` }}>
                <ShowcaseCard product={p} accentColor={cat.accentColor} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom strip — see all link */}
        <div className="mt-8 text-center reveal reveal-d2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:border-green-500 hover:text-green-700 hover:bg-green-50 transition-all"
          >
            Browse All Categories
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
