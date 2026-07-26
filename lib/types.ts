export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_price: number | null
  images: string[]
  category_id: string | null
  stock: number
  is_featured: boolean
  is_active: boolean
  tags: string[]
  created_at: string
  updated_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ShippingAddress {
  address: string
  city: string
  province: string
  postal_code: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: ShippingAddress
  payment_method: 'bank_transfer' | 'cash_on_delivery'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping_fee: number
  total: number
  notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string | null
  price: number
  quantity: number
  created_at: string
}
