import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

function md5Upper(s: string): string {
  return crypto.createHash('md5').update(s).digest('hex').toUpperCase()
}

// Server-to-server callback from PayHere after a payment attempt.
// Verifies the signature, then updates the order's payment status.
// NOTE: PayHere cannot reach localhost — this only fires on a public (deployed) URL.
export async function POST(req: Request) {
  const form = await req.formData()
  const get = (k: string) => String(form.get(k) ?? '')

  const merchantId = get('merchant_id')
  const orderId = get('order_id')
  const payhereAmount = get('payhere_amount')
  const payhereCurrency = get('payhere_currency')
  const statusCode = get('status_code')
  const md5sig = get('md5sig')

  const secret = process.env.PAYHERE_MERCHANT_SECRET || ''
  const expected = md5Upper(
    merchantId + orderId + payhereAmount + payhereCurrency + statusCode + md5Upper(secret),
  )

  if (md5sig !== expected) {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 })
  }

  // PayHere status_code: 2 = success, 0 = pending, -1 = cancelled, -2 = failed, -3 = chargedback
  let payment_status: 'paid' | 'pending' | 'failed' | 'refunded' = 'pending'
  if (statusCode === '2') payment_status = 'paid'
  else if (statusCode === '-1' || statusCode === '-2') payment_status = 'failed'
  else if (statusCode === '-3') payment_status = 'refunded'

  const update: Record<string, string> = { payment_status }
  // Auto-confirm the order once paid
  if (payment_status === 'paid') update.order_status = 'confirmed'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin.from('orders') as any).update(update).eq('id', orderId)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
