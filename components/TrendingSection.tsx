'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Flame, ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'

const trendingProducts: Product[] = [
  {
    id: 't1', name: 'Toblerone Variety Pack 6×100g', slug: 'toblerone-variety',
    description: 'Six iconic triangular bars in milk, white, and dark.',
    price: 3200, compare_price: 3800,
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&q=80'],
    category_id: null, stock: 45, is_featured: false, is_active: true, tags: ['swiss'], created_at: '', updated_at: '',
  },
  {
    id: 't2', name: 'Giorgio Armani Acqua di Giò 100ml', slug: 'acqua-di-gio',
    description: 'Fresh aquatic fragrance inspired by the Mediterranean.',
    price: 31500, compare_price: 36000,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80'],
    category_id: null, stock: 22, is_featured: false, is_active: true, tags: ['mens'], created_at: '', updated_at: '',
  },
  {
    id: 't3', name: 'Pringles Mega Stack Gift Set', slug: 'pringles-mega-set',
    description: 'Six fan-favourite flavours in a gorgeous gift tin.',
    price: 2450, compare_price: 2900,
    images: ['https://images.unsplash.com/photo-1600952899601-4c6d8e4c5f1e?w=500&q=80'],
    category_id: null, stock: 60, is_featured: false, is_active: true, tags: ['snacks'], created_at: '', updated_at: '',
  },
  {
    id: 't4', name: 'Neutrogena Hydro Boost Serum', slug: 'neutrogena-hydro-boost',
    description: 'Hyaluronic acid serum for deep 48-hour hydration.',
    price: 5800, compare_price: 6800,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80'],
    category_id: null, stock: 35, is_featured: false, is_active: true, tags: ['skincare'], created_at: '', updated_at: '',
  },
  {
    id: 't5', name: 'Kinder Bueno White 39g × 12', slug: 'kinder-bueno-white-12',
    description: 'Crispy wafer with smooth white chocolate & hazelnut cream.',
    price: 1850, compare_price: 2200,
    images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&q=80'],
    category_id: null, stock: 80, is_featured: false, is_active: true, tags: ['kinder'], created_at: '', updated_at: '',
  },
  {
    id: 't6', name: 'Yves Saint Laurent Black Opium EDP', slug: 'ysl-black-opium',
    description: 'Bold floral coffee scent with vanilla and white florals.',
    price: 44500, compare_price: 50000,
    images: ['https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&q=80'],
    category_id: null, stock: 12, is_featured: false, is_active: true, tags: ['womens', 'luxury'], created_at: '', updated_at: '',
  },
]

function TrendingCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  const handleAdd = () => {
    addItem(product, 1)
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart!`)
  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#C8102E' }}>
            -{discount}%
          </span>
        )}
        {product.stock <= 5 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
          {product.tags?.[0] ?? 'Product'}
        </p>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-black text-gray-900 text-base">Rs. {product.price.toLocaleString()}</span>
            {product.compare_price && (
              <span className="text-xs text-gray-400 line-through ml-2">Rs. {product.compare_price.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
            style={{ background: '#1B8B3B' }}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TrendingSection({ products }: { products?: Product[] }) {
  const display = products && products.length > 0 ? products : trendingProducts

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4 reveal">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame size={16} style={{ color: '#C8102E' }} />
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#C8102E' }}>Hot Right Now</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Trending <span style={{ color: '#1B8B3B' }}>Products</span>
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">What customers are loving this week</p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:scale-105 group"
            style={{ borderColor: '#C8102E', color: '#C8102E' }}
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {display.map((p, i) => (
            <div key={p.id} className={`reveal reveal-d${Math.min(i + 1, 8)}`}>
              <TrendingCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
