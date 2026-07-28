import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-server'
import { requireAdmin } from '../actions'
import ProductManager from './ProductManager'
import type { Product, Category } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  await requireAdmin()

  const [{ data: products }, { data: categories }, { data: setting }] = await Promise.all([
    supabaseAdmin.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
    supabaseAdmin.from('categories').select('*').order('name'),
    supabaseAdmin.from('site_settings').select('value').eq('key', 'hot_deals_enabled').single(),
  ])
  const hotDealsEnabled = (setting as { value?: string } | null)?.value !== 'false'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-black text-gray-900">Products</h1>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductManager
          initialProducts={(products || []) as Product[]}
          categories={(categories || []) as Category[]}
          hotDealsEnabled={hotDealsEnabled}
        />
      </div>
    </div>
  )
}
