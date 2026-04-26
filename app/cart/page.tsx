'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

const SHIPPING_THRESHOLD = 5000
const SHIPPING_FEE = 350

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const subtotal = total()
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const grandTotal = subtotal + shipping - discount

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'MINI10') {
      setPromoApplied(true)
      toast.success('Promo code applied! 10% discount.')
    } else {
      toast.error('Invalid promo code.')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#E8F5ED' }}>
            <ShoppingBag size={48} style={{ color: '#1B8B3B' }} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet. Start shopping!</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}
          >
            <ShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-8">
          Shopping Cart <span className="text-lg font-normal text-gray-400 ml-2">({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex gap-5">
                <Link href={`/product/${item.product.id}`} className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                  <Image
                    src={item.product.images[0] || 'https://picsum.photos/200/200'}
                    alt={item.product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/product/${item.product.id}`} className="font-bold text-gray-900 text-sm md:text-base hover:text-green-700 transition-colors line-clamp-2 leading-snug">
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => { removeItem(item.product.id); toast.success('Removed from cart') }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-lg font-black mt-2" style={{ color: '#1B8B3B' }}>
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Rs. {item.product.price.toLocaleString()} each</p>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-40"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={() => { clearCart(); toast.success('Cart cleared') }}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear all items
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Free shipping progress */}
            {subtotal < SHIPPING_THRESHOLD && (
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Truck size={18} style={{ color: '#1B8B3B' }} />
                  <p className="text-sm font-semibold text-gray-900">
                    Add Rs. {(SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for <strong style={{ color: '#1B8B3B' }}>FREE delivery</strong>
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%`, background: '#1B8B3B' }}
                  />
                </div>
              </div>
            )}

            {/* Promo code */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} style={{ color: '#1B8B3B' }} />
                <p className="text-sm font-bold text-gray-900">Promo Code</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (try MINI10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-400"
                  style={{ outline: 'none' }}
                />
                <button
                  onClick={applyPromo}
                  disabled={promoApplied || !promoCode}
                  className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                  style={{ background: '#1B8B3B' }}
                >
                  {promoApplied ? '✓' : 'Apply'}
                </button>
              </div>
              {promoApplied && <p className="text-xs text-green-600 mt-2 font-medium">✓ MINI10 applied — 10% discount!</p>}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm" style={{ color: '#1B8B3B' }}>
                    <span>Promo discount (10%)</span>
                    <span className="font-semibold">-Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-black" style={{ color: '#1B8B3B' }}>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full mt-5 py-4 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)', boxShadow: '0 8px 25px rgba(27,139,59,0.35)' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <Link href="/shop" className="flex items-center justify-center gap-2 w-full mt-3 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                ← Continue Shopping
              </Link>

              {/* Accepted payments */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center mb-3">We Accept</p>
                <div className="flex justify-center gap-3">
                  {['Bank Transfer', 'Cash on Delivery'].map((m) => (
                    <span key={m} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
