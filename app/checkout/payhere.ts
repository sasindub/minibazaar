'use server'

import crypto from 'crypto'

function md5Upper(s: string): string {
  return crypto.createHash('md5').update(s).digest('hex').toUpperCase()
}

export type PayHereResult =
  | { ok: true; actionUrl: string; fields: Record<string, string> }
  | { ok: false; error: string }

/**
 * Build the signed PayHere checkout fields for an order. The merchant secret
 * never leaves the server — only the resulting hash is sent to the browser.
 * Hash spec: MD5( merchant_id + order_id + amount + currency + MD5(secret) ).
 */
export async function createPayHereCheckout(input: {
  orderId: string
  orderNumber: string
  amount: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
}): Promise<PayHereResult> {
  const merchantId = process.env.PAYHERE_MERCHANT_ID
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET
  const sandbox = process.env.PAYHERE_SANDBOX !== 'false'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (!merchantId || !merchantSecret) return { ok: false, error: 'PayHere is not configured' }

  const currency = 'LKR'
  const amount = input.amount.toFixed(2) // e.g. "1500.00", no thousands separators

  const hash = md5Upper(merchantId + input.orderId + amount + currency + md5Upper(merchantSecret))

  const actionUrl = sandbox
    ? 'https://sandbox.payhere.lk/pay/checkout'
    : 'https://www.payhere.lk/pay/checkout'

  const fields: Record<string, string> = {
    merchant_id: merchantId,
    return_url: `${siteUrl}/order-confirmation?id=${input.orderId}`,
    cancel_url: `${siteUrl}/checkout`,
    notify_url: `${siteUrl}/api/payhere/notify`,
    order_id: input.orderId,
    items: `MiniBazaar Order ${input.orderNumber}`,
    currency,
    amount,
    first_name: input.firstName,
    last_name: input.lastName || '-',
    email: input.email,
    phone: input.phone,
    address: input.address,
    city: input.city,
    country: 'Sri Lanka',
    hash,
  }

  return { ok: true, actionUrl, fields }
}
