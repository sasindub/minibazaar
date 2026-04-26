'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import type { Product, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'

const dummyProducts: Product[] = [
  { id: '1', name: 'Ferrero Rocher 24 Pieces Gift Box', slug: 'ferrero-rocher-24', description: 'Iconic hazelnut chocolate in golden wrap.', price: 2850, compare_price: 3200, images: ['https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80'], category_id: null, stock: 50, is_featured: true, is_active: true, tags: ['gift'], created_at: '', updated_at: '' },
  { id: '2', name: 'Dior Sauvage Eau de Parfum 100ml', slug: 'dior-sauvage', description: 'Radically fresh and noble fragrance.', price: 38500, compare_price: 42000, images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80'], category_id: null, stock: 20, is_featured: true, is_active: true, tags: ['luxury'], created_at: '', updated_at: '' },
  { id: '3', name: 'Cadbury Dairy Milk 200g', slug: 'cadbury-dairy-milk', description: 'Classic creamy milk chocolate.', price: 650, compare_price: 750, images: ['https://images.unsplash.com/photo-1559181567-c3190b10a1d5?w=500&q=80'], category_id: null, stock: 120, is_featured: true, is_active: true, tags: ['classic'], created_at: '', updated_at: '' },
  { id: '4', name: 'Chanel No. 5 EDP 50ml', slug: 'chanel-no5', description: "The world's most iconic fragrance.", price: 52000, compare_price: 58000, images: ['https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=500&q=80'], category_id: null, stock: 15, is_featured: true, is_active: true, tags: ['luxury'], created_at: '', updated_at: '' },
  { id: '5', name: 'Mixed Premium Nuts 500g', slug: 'mixed-nuts', description: 'Premium selection of roasted nuts.', price: 2200, compare_price: 2600, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80'], category_id: null, stock: 75, is_featured: true, is_active: true, tags: ['healthy'], created_at: '', updated_at: '' },
  { id: '6', name: 'Godiva Gold Collection 16pc', slug: 'godiva-gold', description: 'Premium Belgian chocolate assortment.', price: 5800, compare_price: 6500, images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80'], category_id: null, stock: 30, is_featured: true, is_active: true, tags: ['gift', 'premium'], created_at: '', updated_at: '' },
  { id: '7', name: 'Viktor & Rolf Flowerbomb EDP 50ml', slug: 'flowerbomb', description: 'Explosive feminine floral fragrance.', price: 42000, compare_price: 47500, images: ['https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&q=80'], category_id: null, stock: 18, is_featured: true, is_active: true, tags: ['floral'], created_at: '', updated_at: '' },
  { id: '8', name: 'Lindt Excellence Dark 85%', slug: 'lindt-dark-85', description: 'Intense Swiss dark chocolate.', price: 1100, compare_price: 1300, images: ['https://images.unsplash.com/photo-1611070022-87990e12c919?w=500&q=80'], category_id: null, stock: 80, is_featured: true, is_active: true, tags: ['dark', 'swiss'], created_at: '', updated_at: '' },
  { id: '9', name: 'Versace Eros EDT 100ml', slug: 'versace-eros', description: 'Powerful and seductive fragrance for men.', price: 28500, compare_price: 32000, images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&q=80'], category_id: null, stock: 25, is_featured: false, is_active: true, tags: ['mens'], created_at: '', updated_at: '' },
  { id: '10', name: 'Raffaello Coconut Almond 230g', slug: 'raffaello', description: 'Delicate white chocolate coconut balls.', price: 1950, compare_price: 2200, images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80'], category_id: null, stock: 60, is_featured: false, is_active: true, tags: ['coconut'], created_at: '', updated_at: '' },
  { id: '11', name: 'Belgian Waffle Cookies Gift Box', slug: 'belgian-waffle-cookies', description: 'Authentic Belgian butter waffle cookies.', price: 1650, compare_price: 1950, images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80'], category_id: null, stock: 90, is_featured: false, is_active: true, tags: ['cookies'], created_at: '', updated_at: '' },
  { id: '12', name: 'L\'Oréal Revitalift Moisturizer', slug: 'loreal-revitalift', description: 'Anti-wrinkle + firming day moisturizer.', price: 4200, compare_price: 5000, images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80'], category_id: null, stock: 45, is_featured: false, is_active: true, tags: ['skincare'], created_at: '', updated_at: '' },
]

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>(dummyProducts)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
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
      if (cats && cats.length > 0) setCategories(cats as Category[])

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
      if (data && data.length > 0) setProducts(data as Product[])
    } catch {}
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
            {(categories.length > 0 ? categories : [
              { id: 'c1', slug: 'chocolates', name: 'Chocolates', description: null, image_url: null, created_at: '' },
              { id: 'c2', slug: 'perfumes', name: 'Perfumes', description: null, image_url: null, created_at: '' },
              { id: 'c3', slug: 'snacks', name: 'Snacks', description: null, image_url: null, created_at: '' },
              { id: 'c4', slug: 'beauty', name: 'Beauty', description: null, image_url: null, created_at: '' },
            ]).map((cat) => (
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
