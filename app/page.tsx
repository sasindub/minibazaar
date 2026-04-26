import HeroSection from '@/components/HeroSection'
import StatsSection from '@/components/StatsSection'
import CategorySection from '@/components/CategorySection'
import FeaturedProducts from '@/components/FeaturedProducts'
import PromoSection from '@/components/PromoSection'
import TrendingSection from '@/components/TrendingSection'
import LuxuryBanner from '@/components/LuxuryBanner'
import CategoryShowcase from '@/components/CategoryShowcase'
import TestimonialsSection from '@/components/TestimonialsSection'
import NewsletterSection from '@/components/NewsletterSection'
import { getProducts, getCategories } from '@/lib/products'

export const revalidate = 60

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getProducts({ featured: true, limit: 8 }).catch(() => []),
    getCategories().catch(() => []),
  ])

  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategorySection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <PromoSection />
      <TrendingSection />
      <LuxuryBanner />
      <CategoryShowcase />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  )
}
