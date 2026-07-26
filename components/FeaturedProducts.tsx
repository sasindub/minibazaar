'use client'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/types'

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const displayProducts = products
  if (displayProducts.length === 0) return null

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4 reveal">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} style={{ color: '#1B8B3B' }} />
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#1B8B3B' }}>Featured Products</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Best <span style={{ color: '#C8102E' }}>Sellers</span>
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">Hand-picked premium products loved by our customers</p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:scale-105 group"
            style={{ borderColor: '#1B8B3B', color: '#1B8B3B' }}
          >
            View All Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product, i) => (
            <div key={product.id} className={`reveal reveal-d${Math.min((i % 4) + 1, 8)}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
