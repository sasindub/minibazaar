'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import type { Product, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState('latest')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [selectedCategory, sort])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: cats } = await supabase.from('categories').select('*')
      setCategories((cats as Category[]) || [])

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query: any = supabase.from('products').select('*, category:categories(*)').eq('is_active', true)
      if (selectedCategory) {
        const cat = (cats as Category[] | null)?.find((c: Category) => c.slug === selectedCategory)
        if (cat) query = query.eq('category_id', cat.id)
      }
      if (sort === 'price-asc') query = query.order('price', { ascending: true })
      else if (sort === 'price-desc') query = query.order('price', { ascending: false })
      else query = query.order('created_at', { ascending: false })

      const { data } = await query
      setProducts((data as Product[]) || [])
    } catch { setProducts([]) }
    setLoading(false)
  }

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1]
    return matchSearch && matchPrice
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">
            {selectedCategory ? categories.find((c) => c.slug === selectedCategory)?.name || 'Shop' : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm">{filtered.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-green-500"
              style={{ outline: 'none' }}
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!selectedCategory ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-500'}`}
              style={!selectedCategory ? { background: '#1B8B3B' } : {}}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCategory === cat.slug ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-500'}`}
                style={selectedCategory === cat.slug ? { background: '#1B8B3B' } : {}}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:border-green-500 cursor-pointer"
              style={{ outline: 'none' }}
            >
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Active filter tags */}
        {(search || selectedCategory) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {search && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium text-white" style={{ background: '#1B8B3B' }}>
                Search: {search}
                <button onClick={() => setSearch('')}><X size={12} /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium text-white" style={{ background: '#1B8B3B' }}>
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden">
                <div className="shimmer aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="shimmer h-4 rounded-lg w-3/4" />
                  <div className="shimmer h-3 rounded-lg w-1/2" />
                  <div className="shimmer h-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
            <button onClick={() => { setSearch(''); setSelectedCategory('') }} className="px-6 py-3 rounded-xl text-white font-semibold" style={{ background: '#1B8B3B' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  )
}
