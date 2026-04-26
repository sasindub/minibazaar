'use client'
import { useState } from 'react'
import { Mail, Send, CheckCircle2 } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      <div className="max-w-3xl mx-auto text-center reveal">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(27,139,59,0.2)' }}>
          <Mail size={28} style={{ color: '#4ade80' }} />
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Get Exclusive <span style={{ color: '#4ade80' }}>Deals</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and sweet surprises!
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(27,139,59,0.2)' }}>
              <CheckCircle2 size={32} style={{ color: '#4ade80' }} />
            </div>
            <p className="text-white text-xl font-bold">You&apos;re subscribed!</p>
            <p className="text-gray-400">Watch your inbox for exclusive deals and sweet surprises.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:border-green-400"
              style={{ outline: 'none' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Subscribe
                </>
              )}
            </button>
          </form>
        )}

        <p className="text-gray-500 text-xs mt-6">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
