'use client'
import { usePathname } from 'next/navigation'

export default function NavbarSpacer() {
  const pathname = usePathname()
  // Home page has a full-screen hero that handles its own navbar clearance.
  if (pathname === '/') return null
  // Mobile: nav h-16 = 64px. Desktop: top contact bar (~32px) + nav h-20 (80px) = 112px.
  return <div className="h-16 md:h-[112px]" aria-hidden />
}
