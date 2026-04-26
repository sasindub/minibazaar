'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'

const showcaseData = [
  {
    slug: 'chocolates',
    label: 'Chocolates',
    emoji: '🍫',
    color: '#6B3A2A',
    lightBg: '#FFF8F5',
    accentColor: '#C8102E',
    headline: 'Sweet Indulgence',
    sub: 'Premium chocolates from world-renowned brands',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80',
    products: [
      { id: 's1', name: 'Ferrero Rocher 24pc Gift Box', price: 2850, compare_price: 3200, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80', rating: 5 },
      { id: 's2', name: 'Lindt Excellence Dark 85%', price: 1100, compare_price: 1300, image: 'https://images.unsplash.com/photo-1611070022-87990e12c919?w=400&q=80', rating: 5 },
      { id: 's3', name: 'Godiva Gold Collection 16pc', price: 5800, compare_price: 6500, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80', rating: 4 },
    ],
  },
  {
    slug: 'perfumes',
    label: 'Perfumes',
    emoji: '🌸',
    color: '#0d1b2a',
    lightBg: '#F5F7FF',
    accentColor: '#D4AF37',
    headline: 'Luxury Fragrances',
    sub: 'Authentic branded perfumes at great prices',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80',
    products: [
      { id: 's4', name: 'Dior Sauvage EDP 100ml', price: 38500, compare_price: 42000, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80', rating: 5 },
      { id: 's5', name: 'Chanel No. 5 EDP 50ml', price: 52000, compare_price: 58000, image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=400&q=80', rating: 5 },
      { id: 's6', name: 'Versace Eros EDT 100ml', price: 28500, compare_price: 32000, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80', rating: 4 },
    ],
  },
  {
    slug: 'snacks',
    label: 'Snacks & Nuts',
    emoji: '🥜',
    color: '#1B4D1A',
    lightBg: '#F5FFF5',
    accentColor: '#1B8B3B',
    headline: 'Premium Snacks',
    sub: 'Exotic nuts, crackers and gourmet snacks',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80',
    products: [
      { id: 's7', name: 'Mixed Premium Nuts 500g', price: 2200, compare_price: 2600, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', rating: 5 },
      { id: 's8', name: 'Belgian Waffle Cookies Gift Box', price: 1650, compare_price: 1950, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80', rating: 4 },
      { id: 's9', name: 'Raffaello Coconut Almond 230g', price: 1950, compare_price: 2200, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80', rating: 5 },
    ],
  },
]

function MiniProductCard({ product, accentColor }: {
  product: { id: string; name: string; price: number; compare_price: number; image: string; rating: number }
  accentColor: string
}) {
  const addItem = useCartStore((s) => s.addItem)

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

  const discount = Math.round(((product.compare_price - product.price) / product.compare_price) * 100)

  return (
    <div className="group flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50">
        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 line-clamp-1 leading-tight mb-0.5">{product.name}</p>
        <div className="flex gap-0.5 mb-1">
          {[...Array(product.rating)].map((_, i) => <Star key={i} size={9} className="fill-amber-400 text-amber-400" />)}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black text-gray-900">Rs. {product.price.toLocaleString()}</span>
          {discount > 0 && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md text-white" style={{ background: accentColor }}>
              -{discount}%
            </span>
          )}
        </div>
      </div>
      <button
        onClick={handleAdd}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 transition-all hover:scale-110 active:scale-95"
        style={{ background: accentColor }}
      >
        <ShoppingCart size={13} />
      </button>
    </div>
  )
}

export default function CategoryShowcase() {
  return (
    <section className="py-20 px-4" style={{ background: '#FAFBFA' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#1B8B3B' }}>Shop by Category</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Discover Our <span style={{ color: '#C8102E' }}>Collections</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Handpicked favourites across every category — something for everyone
          </p>
        </div>

        <div className="space-y-8">
          {showcaseData.map((cat, ci) => (
            <div
              key={cat.slug}
              className={`grid lg:grid-cols-5 gap-6 rounded-3xl overflow-hidden reveal reveal-d${ci + 1}`}
              style={{ background: cat.lightBg }}
            >
              {/* Category hero panel */}
              <div className="lg:col-span-2 relative min-h-[280px] lg:min-h-0 overflow-hidden rounded-3xl">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${cat.color}CC 0%, ${cat.color}80 60%, transparent 100%)` }} />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-3xl mb-2">{cat.emoji}</span>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">{cat.label}</p>
                  <h3 className="text-2xl font-black text-white mb-1 leading-tight">{cat.headline}</h3>
                  <p className="text-white/70 text-sm mb-4">{cat.sub}</p>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-3 w-fit"
                    style={{ color: ci === 1 ? '#D4AF37' : '#86efac' }}
                  >
                    View All {cat.label} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Product list */}
              <div className="lg:col-span-3 p-6 flex flex-col justify-center gap-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-700 text-sm">Top picks in {cat.label}</p>
                  <Link href={`/shop?category=${cat.slug}`} className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: cat.accentColor }}>
                    See all <ArrowRight size={11} />
                  </Link>
                </div>
                {cat.products.map((p) => (
                  <MiniProductCard key={p.id} product={p} accentColor={cat.accentColor} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
