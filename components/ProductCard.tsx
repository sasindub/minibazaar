'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Eye, Star, Zap } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'

interface Props {
  product: Product
  variant?: 'default' | 'compact'
}

export default function ProductCard({ product, variant = 'default' }: Props) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imgError, setImgError] = useState(false)
  const { addItem } = useCartStore()

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock === 0) return
    addItem(product)
    toast.success(`${product.name} added to cart!`, {
      style: { borderLeft: '4px solid #1B8B3B' },
    })
  }

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <Image
          src={(!imgError && product.images[0]) ? product.images[0] : `https://picsum.photos/seed/${product.id}/400/400`}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgError(true)}
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-50"
            title="Add to cart"
          >
            <ShoppingCart size={16} style={{ color: '#1B8B3B' }} />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110"
            title="View product"
          >
            <Eye size={16} className="text-gray-700" />
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="text-white text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: '#C8102E' }}>
              -{discount}%
            </span>
          )}
          {product.is_featured && (
            <span className="text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1" style={{ background: '#D4AF37' }}>
              <Zap size={10} fill="white" /> Hot
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-white text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-500">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted) }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <Heart
            size={15}
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className={i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
          ))}
          <span className="text-xs text-gray-400 ml-1">(4.0)</span>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug mb-2 hover:text-green-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-base" style={{ color: '#1B8B3B' }}>
              Rs. {product.price.toLocaleString()}
            </span>
            {product.compare_price && (
              <span className="text-xs text-gray-400 line-through">
                Rs. {product.compare_price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}
          >
            <ShoppingCart size={13} />
            {product.stock === 0 ? 'Out' : 'Add'}
          </button>
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs mt-2 font-medium" style={{ color: '#C8102E' }}>
            Only {product.stock} left!
          </p>
        )}
      </div>
    </div>
  )
}
