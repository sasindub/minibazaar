'use client'
import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw, Plus, Minus, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'

// Dummy product for demo
const getDummyProduct = (id: string): Product => ({
  id,
  name: 'Ferrero Rocher 24 Pieces Gift Box',
  slug: 'ferrero-rocher-24',
  description: `The iconic Ferrero Rocher gift box featuring 24 individually wrapped hazelnut chocolates in their signature golden foil.

Each Ferrero Rocher begins with a whole roasted hazelnut at its heart, surrounded by smooth chocolate cream, encased in a crispy wafer shell, and then enrobed in milk chocolate studded with finely chopped hazelnuts.

Perfect for gifting on birthdays, anniversaries, holidays, or any special occasion. The elegant gold box makes it a premium gift that's sure to impress.`,
  price: 2850,
  compare_price: 3200,
  images: [
    'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80',
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&q=80',
    'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80',
  ],
  category_id: null,
  stock: 50,
  is_featured: true,
  is_active: true,
  tags: ['gift', 'premium', 'hazelnut'],
  created_at: '',
  updated_at: '',
})

const relatedProducts: Product[] = [
  { id: '6', name: 'Godiva Gold Collection 16pc', slug: 'godiva-gold', description: 'Premium Belgian chocolate assortment.', price: 5800, compare_price: 6500, images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80'], category_id: null, stock: 30, is_featured: true, is_active: true, tags: [], created_at: '', updated_at: '' },
  { id: '8', name: 'Lindt Excellence Dark 85%', slug: 'lindt-dark-85', description: 'Intense Swiss dark chocolate.', price: 1100, compare_price: 1300, images: ['https://images.unsplash.com/photo-1611070022-87990e12c919?w=400&q=80'], category_id: null, stock: 80, is_featured: true, is_active: true, tags: [], created_at: '', updated_at: '' },
  { id: '3', name: 'Cadbury Dairy Milk 200g', slug: 'cadbury-dairy-milk', description: 'Classic creamy milk chocolate.', price: 650, compare_price: 750, images: ['https://images.unsplash.com/photo-1559181567-c3190b10a1d5?w=400&q=80'], category_id: null, stock: 120, is_featured: true, is_active: true, tags: [], created_at: '', updated_at: '' },
  { id: '10', name: 'Raffaello Coconut Almond 230g', slug: 'raffaello', description: 'Delicate white chocolate coconut balls.', price: 1950, compare_price: 2200, images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80'], category_id: null, stock: 60, is_featured: false, is_active: true, tags: [], created_at: '', updated_at: '' },
]

import ProductCard from '@/components/ProductCard'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product] = useState<Product>(getDummyProduct(id))
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description')
  const { addItem, openCart } = useCartStore()

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success('Added to cart!', { style: { borderLeft: '4px solid #1B8B3B' } })
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    openCart()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-green-700 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg">
              <Image
                src={product.images[selectedImage] || 'https://picsum.photos/800/800'}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-white text-sm font-bold" style={{ background: '#C8102E' }}>
                  -{discount}% OFF
                </span>
              )}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === i ? 'border-green-500 shadow-md scale-105' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {product.is_featured && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold text-white" style={{ background: '#D4AF37' }}>⭐ Featured</span>
              )}
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg text-xs font-medium capitalize" style={{ background: '#E8F5ED', color: '#1B8B3B' }}>{tag}</span>
              ))}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />)}
              </div>
              <span className="text-sm text-gray-500 font-medium">4.8 (124 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6 p-4 rounded-2xl" style={{ background: '#E8F5ED' }}>
              <span className="text-4xl font-black" style={{ color: '#1B8B3B' }}>Rs. {product.price.toLocaleString()}</span>
              {product.compare_price && (
                <div className="flex flex-col">
                  <span className="text-lg text-gray-400 line-through">Rs. {product.compare_price.toLocaleString()}</span>
                  <span className="text-sm font-bold" style={{ color: '#C8102E' }}>Save Rs. {(product.compare_price - product.price).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-gray-700">
                {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left!` : `In Stock (${product.stock} available)`}
              </span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)', boxShadow: '0 8px 25px rgba(27,139,59,0.35)' }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] border-2 disabled:opacity-50"
                style={{ borderColor: '#C8102E', color: '#C8102E' }}
              >
                Buy Now
              </button>
              <button className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 self-center">
                <Share2 size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: 'Free Delivery', sub: 'On orders Rs.5000+' },
                { icon: Shield, text: '100% Authentic', sub: 'Genuine products' },
                { icon: RotateCcw, text: 'Easy Returns', sub: '7-day return policy' },
              ].map((b) => (
                <div key={b.text} className="flex flex-col items-center text-center p-3 rounded-2xl border border-gray-100 bg-gray-50">
                  <b.icon size={20} className="mb-1.5" style={{ color: '#1B8B3B' }} />
                  <p className="text-xs font-bold text-gray-900">{b.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-12">
          <div className="flex border-b border-gray-100 mb-6 gap-6">
            {(['description', 'details', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none">
              {product.description?.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4 text-sm">{para}</p>
              ))}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Brand', 'Ferrero'],
                ['Weight', '300g'],
                ['Pieces', '24'],
                ['Country', 'Italy'],
                ['Shelf Life', '12 months'],
                ['Allergens', 'Contains nuts, milk, gluten'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <CheckCircle2 size={14} style={{ color: '#1B8B3B' }} />
                  <span className="text-sm text-gray-500 font-medium">{k}:</span>
                  <span className="text-sm font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {[
                { name: 'Dilini P.', rating: 5, date: '2 weeks ago', text: 'Absolutely loved it! Perfect gift for my husband. Arrived well packaged and fresh.' },
                { name: 'Kasun F.', rating: 5, date: '1 month ago', text: 'Great quality, exactly as described. Will definitely order again!' },
                { name: 'Nimesha J.', rating: 4, date: '1 month ago', text: 'Very happy with the product. Fast delivery too!' },
              ].map((r, i) => (
                <div key={i} className="p-4 rounded-2xl bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{r.name}</p>
                      <div className="flex mt-0.5">
                        {[...Array(5)].map((_, j) => <Star key={j} size={12} className={j < r.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related products */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
