import { supabase } from './supabase'
import type { Product, Category } from './types'

export async function getProducts(options?: {
  category?: string
  featured?: boolean
  hotDeal?: boolean
  search?: string
  limit?: number
  offset?: number
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (options?.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.category)
      .single()
    if (cat) query = query.eq('category_id', (cat as any).id)
  }

  if (options?.featured) query = query.eq('is_featured', true)

  if (options?.hotDeal) query = query.eq('is_hot_deal', true)

  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`)
  }

  if (options?.limit) query = query.limit(options.limit)
  if (options?.offset) query = query.range(options.offset, (options.offset + (options.limit || 20)) - 1)

  const { data, error } = await query
  if (error) throw error
  return data as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Product
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data as Product
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data as Category[]
}

export async function createOrder(orderData: {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: Record<string, string>
  payment_method: 'bank_transfer' | 'cash_on_delivery'
  subtotal: number
  shipping_fee: number
  total: number
  notes?: string
  items: Array<{
    product_id: string
    product_name: string
    product_image: string | null
    price: number
    quantity: number
  }>
}) {
  const { items, ...orderFields } = orderData

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { data: order, error: orderError } = await sb
    .from('orders')
    .insert(orderFields)
    .select()
    .single()

  if (orderError) throw orderError

  const orderItems = items.map((item) => ({
    ...item,
    order_id: order.id,
  }))

  const { error: itemsError } = await sb.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  return order
}

export async function getOrder(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()
  if (error) return null
  return data
}
