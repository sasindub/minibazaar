'use client'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/types'

const dummyProducts: Product[] = [
  { id: '1', name: 'Ferrero Rocher 24 Pieces Gift Box', slug: 'ferrero-rocher-24', description: 'Iconic hazelnut chocolate in golden wrap.', price: 2850, compare_price: 3200, images: ['https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80'], category_id: null, stock: 50, is_featured: true, is_active: true, tags: ['gift'], created_at: '', updated_at: '' },
  { id: '2', name: 'Dior Sauvage Eau de Parfum 100ml', slug: 'dior-sauvage', description: 'Radically fresh and noble fragrance.', price: 38500, compare_price: 42000, images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80'], category_id: null, stock: 20, is_featured: true, is_active: true, tags: ['luxury'], created_at: '', updated_at: '' },
  { id: '3', name: 'Cadbury Dairy Milk 200g', slug: 'cadbury-dairy-milk', description: 'Classic creamy milk chocolate.', price: 650, compare_price: 750, images: ['https://images.unsplash.com/photo-1559181567-c3190b10a1d5?w=500&q=80'], category_id: null, stock: 120, is_featured: true, is_active: true, tags: ['classic'], created_at: '', updated_at: '' },
  { id: '4', name: 'Chanel No. 5 EDP 50ml', slug: 'chanel-no5', description: "The world's most iconic fragrance.", price: 52000, compare_price: 58000, images: ['https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=500&q=80'], category_id: null, stock: 15, is_featured: true, is_active: true, tags: ['luxury'], created_at: '', updated_at: '' },
  { id: '5', name: 'Mixed Premium Nuts 500g', slug: 'mixed-nuts', description: 'Premium selection of roasted nuts.', price: 2200, compare_price: 2600, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80'], category_id: null, stock: 75, is_featured: true, is_active: true, tags: ['healthy'], created_at: '', updated_at: '' },
  { id: '6', name: 'Godiva Gold Collection 16pc', slug: 'godiva-gold', description: 'Premium Belgian chocolate assortment.', price: 5800, compare_price: 6500, images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80'], category_id: null, stock: 30, is_featured: true, is_active: true, tags: ['gift', 'premium'], created_at: '', updated_at: '' },
  { id: '7', name: 'Viktor & Rolf Flowerbomb EDP', slug: 'flowerbomb', description: 'Explosive feminine floral fragrance.', price: 42000, compare_price: 47500, images: ['https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&q=80'], category_id: null, stock: 18, is_featured: true, is_active: true, tags: ['floral'], created_at: '', updated_at: '' },
  { id: '8', name: 'Lindt Excellence Dark 85%', slug: 'lindt-dark-85', description: 'Intense Swiss dark chocolate.', price: 1100, compare_price: 1300, images: ['https://images.unsplash.com/photo-1611070022-87990e12c919?w=500&q=80'], category_id: null, stock: 80, is_featured: true, is_active: true, tags: ['dark', 'swiss'], created_at: '', updated_at: '' },
]

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const displayProducts = products.length > 0 ? products : dummyProducts

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
