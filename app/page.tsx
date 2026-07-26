import HeroSection from '@/components/HeroSection'
import StatsSection from '@/components/StatsSection'
import CategorySection from '@/components/CategorySection'
import FeaturedProducts from '@/components/FeaturedProducts'
import PromoSection from '@/components/PromoSection'
import TrendingSection from '@/components/TrendingSection'
import LuxuryBanner from '@/components/LuxuryBanner'
import FlashDeals from '@/components/FlashDeals'
import CategoryShowcase, { type ShowcaseGroup } from '@/components/CategoryShowcase'
import TestimonialsSection from '@/components/TestimonialsSection'
import NewsletterSection from '@/components/NewsletterSection'
import { getProducts, getCategories } from '@/lib/products'
import type { Product } from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  const [featuredProducts, categories, allProducts] = await Promise.all([
    getProducts({ featured: true, limit: 8 }).catch(() => []),
    getCategories().catch(() => []),
    getProducts({ limit: 100 }).catch(() => []),
  ])

  const products = (allProducts as Product[]) || []

  // Newest products for the Trending strip
  const trending = products.slice(0, 6)

  // Group products by category for the Category Showcase
  const groups: ShowcaseGroup[] = categories.map((category) => ({
    category,
    products: products.filter((p) => p.category_id === category.id),
  }))

  return (
    <>
      <HeroSection />
      {/* Mobile only: Flash Deals immediately below hero */}
      <div className="block md:hidden">
        <FlashDeals />
      </div>
      <StatsSection />
      {/* Desktop only: Flash Deals in normal position */}
      <div className="hidden md:block">
        <FlashDeals />
      </div>
      <CategorySection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <PromoSection />
      <TrendingSection products={trending} />
      <LuxuryBanner />
      <CategoryShowcase groups={groups} />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  )
}
