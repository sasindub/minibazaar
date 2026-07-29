'use client'
import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/lib/types'

const fallbackCategories = [
  { id: '1', name: 'Chocolates', slug: 'chocolates', description: 'Premium chocolates', image_url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=80', created_at: '' },
  { id: '2', name: 'Perfumes', slug: 'perfumes', description: 'Luxury fragrances', image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80', created_at: '' },
  { id: '3', name: 'Snacks & Nuts', slug: 'snacks', description: 'Premium snacks', image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80', created_at: '' },
  { id: '4', name: 'Beauty & Care', slug: 'beauty', description: 'Skincare & beauty', image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', created_at: '' },
  { id: '5', name: 'Beverages', slug: 'beverages', description: 'Specialty drinks', image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80', created_at: '' },
]

// Local image overrides for specific category cards
const categoryImages: Record<string, string> = {
  perfumes: '/images/perfume.png',
  snacks: '/images/nuts.png',
}

export default function CategorySection({ categories }: { categories: Category[] }) {
  const cats = categories.length > 0 ? categories : fallbackCategories

  return (
    <section className="py-20 px-4 hidden md:block" style={{ background: '#FAFBFA' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#1B8B3B' }}>Shop by Category</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Find What You <span style={{ color: '#C8102E' }}>Love</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From indulgent chocolates to luxury perfumes — explore our curated categories
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cats.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`group relative overflow-hidden rounded-3xl aspect-square cursor-pointer reveal reveal-d${Math.min(i + 1, 8)}`}
            >
              {/* Image */}
              <Image
                src={categoryImages[cat.slug] || cat.image_url || `https://picsum.photos/seed/${cat.slug}/400/400`}
                alt={cat.name}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-500 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 transition-all duration-300"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(27,139,59,0.8) 0%, rgba(27,139,59,0.3) 50%, transparent 100%)' }} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                <h3 className="text-white font-bold text-sm md:text-base leading-tight group-hover:text-green-200 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-white/0 group-hover:text-white/80 text-xs mt-1 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
