'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white shadow-2xl flex flex-col"
        style={{ animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: '#1B8B3B' }} />
            <h2 className="text-lg font-bold text-gray-900">My Cart</h2>
            {items.length > 0 && (
              <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: '#1B8B3B' }}>
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: '#E8F5ED' }}>
                <ShoppingBag size={36} style={{ color: '#1B8B3B' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</h3>
                <p className="text-sm text-gray-500">Add some items to get started!</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: '#1B8B3B' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white">
                    <Image
                      src={item.product.images[0] || '/placeholder.jpg'}
                      alt={item.product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-sm font-bold" style={{ color: '#1B8B3B' }}>
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 hover:border-green-500 hover:text-green-600 transition-colors text-gray-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 hover:border-green-500 hover:text-green-600 transition-colors text-gray-600 disabled:opacity-40"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full text-center py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95"
              style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all hover:bg-gray-100 border border-gray-200 text-gray-700"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
