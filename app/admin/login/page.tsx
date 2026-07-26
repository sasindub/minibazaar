'use client'

import { useActionState } from 'react'
import { Settings } from 'lucide-react'
import { login } from '../actions'

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, {})

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        action={formAction}
        className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#E8F5ED' }}>
            <Settings size={28} style={{ color: '#1B8B3B' }} />
          </div>
          <h1 className="text-2xl font-black text-gray-900">MiniBazaar Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your store</p>
        </div>

        <label className="block text-xs font-bold text-gray-500 mb-1.5">Username</label>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4 focus:outline-none focus:border-green-500"
        />

        <label className="block text-xs font-bold text-gray-500 mb-1.5">Password</label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4 focus:outline-none focus:border-green-500"
        />

        {state?.error && (
          <p className="text-sm text-red-600 font-medium mb-4 text-center">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 rounded-2xl text-white font-bold transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}
        >
          {pending ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}
