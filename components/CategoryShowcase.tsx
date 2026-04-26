'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingCart, Star, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'

type ShowcaseProduct = {
  id: string
  name: string
  price: number
  compare_price: number
  image: string
  rating: number
}

type ShowcaseCategory = {
  slug: string
  label: string
  emoji: string
  color: string
  lightBg: string
  accentColor: string
  ctaText: string
  headline: string
  sub: string
  badge: string
  image: string
  products: ShowcaseProduct[]
}

const showcaseData: ShowcaseCategory[] = [
  {
    slug: 'chocolates',
    label: 'Chocolates',
    emoji: '🍫',
    color: '#3E1C00',
    lightBg: '#FFF8F2',
    accentColor: '#C8102E',
    ctaText: '#FFC857',
    headline: 'Sweet Indulgence',
    sub: 'Premium chocolates from world-renowned brands — Ferrero, Lindt, Godiva and more.',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=900&q=80',
    products: [
      { id: 'sc1', name: 'Ferrero Rocher 24pc Gift Box',     price: 2850,  compare_price: 3200,  image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80', rating: 5 },
      { id: 'sc2', name: 'Lindt Excellence Dark 85%',        price: 1100,  compare_price: 1300,  image: 'https://images.unsplash.com/photo-1611070022-87990e12c919?w=500&q=80', rating: 5 },
      { id: 'sc3', name: 'Godiva Gold Collection 16pc',      price: 5800,  compare_price: 6500,  image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80', rating: 4 },
      { id: 'sc4', name: 'Toblerone Variety Pack 6×100g',    price: 3200,  compare_price: 3800,  image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&q=80', rating: 5 },
    ],
  },
  {
    slug: 'perfumes',
    label: 'Perfumes',
    emoji: '🌸',
    color: '#0D1B2A',
    lightBg: '#F5F7FF',
    accentColor: '#1B8B3B',
    ctaText: '#D4AF37',
    headline: 'Luxury Fragrances',
    sub: 'Authentic branded perfumes from Dior, Chanel, Versace and YSL — at unbeatable prices.',
    badge: 'Authentic',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=900&q=80',
    products: [
      { id: 'sp1', name: 'Dior Sauvage EDP 100ml',                price: 38500, compare_price: 42000, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80', rating: 5 },
      { id: 'sp2', name: 'Chanel No. 5 EDP 50ml',                 price: 52000, compare_price: 58000, image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=500&q=80', rating: 5 },
      { id: 'sp3', name: 'Versace Eros EDT 100ml',                price: 28500, compare_price: 32000, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&q=80', rating: 4 },
      { id: 'sp4', name: 'YSL Black Opium EDP 50ml',              price: 44500, compare_price: 50000, image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&q=80', rating: 5 },
    ],
  },
  {
    slug: 'snacks',
    label: 'Snacks & Nuts',
    emoji: '🥜',
    color: '#1B4D1A',
    lightBg: '#F5FFF5',
    accentColor: '#1B8B3B',
    ctaText: '#86EFAC',
    headline: 'Premium Snacks',
    sub: 'Exotic nuts, gourmet cookies and crackers — perfect for any occasion.',
    badge: 'Best Value',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=900&q=80',
    products: [
      { id: 'ss1', name: 'Mixed Premium Nuts 500g',         price: 2200, compare_price: 2600, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80', rating: 5 },
      { id: 'ss2', name: 'Belgian Waffle Cookies Gift Box', price: 1650, compare_price: 1950, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80', rating: 4 },
      { id: 'ss3', name: 'Raffaello Coconut Almond 230g',   price: 1950, compare_price: 2200, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80', rating: 5 },
      { id: 'ss4', name: 'Pringles Mega Stack 6 flavours',  price: 2450, compare_price: 2900, image: 'https://images.unsplash.com/photo-1600952899601-4c6d8e4c5f1e?w=500&q=80', rating: 4 },
    ],
  },
  {
    slug: 'beauty',
    label: 'Beauty',
    emoji: '💄',
    color: '#4A0E3A',
    lightBg: '#FFF5FB',
    accentColor: '#C8102E',
    ctaText: '#F9A8D4',
    headline: 'Glow Up',
    sub: 'Skincare and beauty essentials from L\'Oréal, Neutrogena and more — for radiant skin every day.',
    badge: 'New In',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80',
    products: [
      { id: 'sb1', name: 'L\'Oréal Revitalift Day Moisturizer',  price: 4200, compare_price: 5000, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80', rating: 5 },
      { id: 'sb2', name: 'Neutrogena Hydro Boost Serum',         price: 5800, compare_price: 6800, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', rating: 5 },
      { id: 'sb3', name: 'The Ordinary Niacinamide 10%',         price: 2400, compare_price: 2800, image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80', rating: 5 },
      { id: 'sb4', name: 'CeraVe Hydrating Cleanser 236ml',      price: 3100, compare_price: 3600, image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&q=80', rating: 4 },
    ],
  },
]

function ShowcaseCard({ product, accentColor }: { product: ShowcaseProduct; accentColor: string }) {
  const addItem = useCartStore((s) => s.addItem)
  const discount = Math.round(((product.compare_price - product.price) / product.compare_price) * 100)

  const handleAdd = () => {
    const p: Product = {
      id: product.id, name: product.name, slug: product.id,
      description: '', price: product.price, compare_price: product.compare_price,
      images: [product.image], category_id: null, stock: 99,
      is_featured: false, is_active: true, tags: [], created_at: '', updated_at: '',
    }
    addItem(p, 1)
    toast.success('Added to cart!')
  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <Image
          src={product.image}
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
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-bold text-gray-800">{product.rating}.0</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-gray-900 text-sm leading-snug mb-3 line-clamp-2 flex-1">
          {product.name}
        </h4>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="font-black text-gray-900 text-base leading-none">
              Rs. {product.price.toLocaleString()}
            </p>
            {product.compare_price > product.price && (
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

export default function CategoryShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)
  const cat = showcaseData[activeIdx]

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
            {showcaseData.map((c, i) => (
              <button
                key={c.slug}
                onClick={() => setActiveIdx(i)}
                className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                  activeIdx === i
                    ? 'text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={activeIdx === i ? { background: c.accentColor } : {}}
              >
                <span className="text-base">{c.emoji}</span>
                {c.label}
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
