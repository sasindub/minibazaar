'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Package, Truck, Phone, Mail, ShoppingBag, ArrowRight, Copy } from 'lucide-react'
import { getOrder } from '@/lib/products'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id') || ''
  const [orderNumber, setOrderNumber] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!orderId) return
    let active = true
    getOrder(orderId)
      .then((o) => { if (active && o) setOrderNumber((o as { order_number?: string }).order_number || '') })
      .catch(() => {})
    return () => { active = false }
  }, [orderId])

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const steps = [
    { icon: CheckCircle2, label: 'Order Placed', desc: 'We\'ve received your order', done: true },
    { icon: Package, label: 'Processing', desc: 'We\'re preparing your items', done: false },
    { icon: Truck, label: 'Shipped', desc: 'Your order is on the way', done: false },
    { icon: CheckCircle2, label: 'Delivered', desc: 'Enjoy your purchase!', done: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        {/* Success card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Green header */}
          <div className="p-8 text-center text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white" style={{ transform: 'translate(30%, -30%)' }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white" style={{ transform: 'translate(-30%, 30%)' }} />
            </div>
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                <CheckCircle2 size={36} className="text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black mb-2">Order Confirmed! 🎉</h1>
              <p className="text-green-100 text-base">Thank you for shopping with MiniBazaar</p>
            </div>
          </div>

          <div className="p-6">
            {/* Order number */}
            <div className="flex items-center justify-between p-4 rounded-2xl mb-6" style={{ background: '#E8F5ED' }}>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Order Number</p>
                <p className="text-lg font-black" style={{ color: '#1B8B3B' }}>{orderNumber || 'Loading…'}</p>
              </div>
              <button
                onClick={copyOrderNumber}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                style={{ background: '#1B8B3B', color: 'white' }}
              >
                <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* What happens next */}
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-900 mb-4">What happens next?</p>
              <div className="space-y-3">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.done ? '' : 'bg-gray-100'}`}
                      style={s.done ? { background: '#1B8B3B' } : {}}>
                      <s.icon size={14} className={s.done ? 'text-white' : 'text-gray-400'} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${s.done ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</p>
                        {s.done && <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ background: '#1B8B3B' }}>Done</span>}
                      </div>
                      <p className="text-xs text-gray-400">{s.desc}</p>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="absolute left-[19px] ml-[2px] w-0.5 h-6 bg-gray-100 hidden" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment reminder */}
            <div className="p-4 rounded-2xl border border-amber-200 mb-6" style={{ background: '#FFFBEB' }}>
              <p className="text-sm font-bold text-amber-800 mb-2">📋 Important Reminder</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                If you chose <strong>Bank Transfer</strong>, please complete your payment within 24 hours and WhatsApp the receipt to us. Your order will be shipped once payment is confirmed.
              </p>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <a
                href="https://wa.me/94772525362"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Phone size={16} style={{ color: '#1B8B3B' }} />
                <div>
                  <p className="text-xs font-bold text-gray-900">WhatsApp</p>
                  <p className="text-xs text-gray-400">Chat with us</p>
                </div>
              </a>
              <a
                href="mailto:hello@minibazaar.lk"
                className="flex items-center gap-2 p-3 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Mail size={16} style={{ color: '#1B8B3B' }} />
                <div>
                  <p className="text-xs font-bold text-gray-900">Email Us</p>
                  <p className="text-xs text-gray-400">hello@minibazaar.lk</p>
                </div>
              </a>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}
              >
                <ShoppingBag size={16} /> Continue Shopping
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200"
              >
                Back to Home <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Social share */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Love MiniBazaar? Share us with your friends! 💚
        </p>
        <div className="flex justify-center gap-3 mt-3">
          <a href="https://www.facebook.com/minibazaar.lk/" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-white text-xs font-bold" style={{ background: '#1877F2' }}>
            Share on Facebook
          </a>
          <a href={`https://wa.me/?text=I%20just%20ordered%20from%20MiniBazaar!%20Check%20them%20out%20at%20minibazaar.lk`} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-white text-xs font-bold" style={{ background: '#25D366' }}>
            Share on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
