'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import ScrollObserver from '@/components/ScrollObserver'
import NavbarSpacer from '@/components/NavbarSpacer'

// Wraps page content with the storefront chrome (navbar, footer, cart), except
// on the admin panel which is standalone.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <>
      <ScrollObserver />
      <Navbar />
      <NavbarSpacer />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  )
}
