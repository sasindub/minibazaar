'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, SESSION_MAX_AGE, checkCredentials, createSessionToken, verifySessionToken } from '@/lib/auth'

/** Throws (redirects to login) if the current request has no valid admin session. */
export async function requireAdmin(): Promise<void> {
  const store = await cookies()
  const user = await verifySessionToken(store.get(ADMIN_COOKIE)?.value)
  if (!user) redirect('/admin/login')
}

export async function login(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  const username = String(formData.get('username') || '')
  const password = String(formData.get('password') || '')

  if (!checkCredentials(username, password)) {
    return { error: 'Invalid username or password' }
  }

  const token = await createSessionToken(username)
  const store = await cookies()
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  redirect('/admin')
}

export async function logout(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
  redirect('/admin/login')
}

// --- Order management (writes go through the service-role client) ---

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const

export async function updateOrderStatus(orderId: string, status: string): Promise<{ error?: string }> {
  await requireAdmin()
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) return { error: 'Invalid status' }
  const { supabaseAdmin } = await import('@/lib/supabase-server')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin.from('orders') as any).update({ order_status: status }).eq('id', orderId)
  return error ? { error: error.message } : {}
}

export async function updatePaymentStatus(orderId: string, status: string): Promise<{ error?: string }> {
  await requireAdmin()
  if (!(PAYMENT_STATUSES as readonly string[]).includes(status)) return { error: 'Invalid status' }
  const { supabaseAdmin } = await import('@/lib/supabase-server')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin.from('orders') as any).update({ payment_status: status }).eq('id', orderId)
  return error ? { error: error.message } : {}
}
