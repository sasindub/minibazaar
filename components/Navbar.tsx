'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { Search, ShoppingCart, Menu, X, ChevronDown, Phone, Mail } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  {
    label: 'Categories', href: '#',
    children: [
      { label: 'Chocolates', href: '/shop?category=chocolates' },
      { label: 'Perfumes & Fragrances', href: '/shop?category=perfumes' },
      { label: 'Snacks & Nuts', href: '/shop?category=snacks' },
      { label: 'Beauty & Personal Care', href: '/shop?category=beauty' },
      { label: 'Beverages', href: '/shop?category=beverages' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { itemCount, toggleCart } = useCartStore()
  const count = itemCount()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = isHome && !isScrolled

  // ── styling presets ─────────────────────────
  const linkPill = transparent
    ? 'text-white hover:bg-white/25 bg-white/10 backdrop-blur-md border border-white/15'
    : 'text-gray-700 hover:text-green-700 hover:bg-green-50 border border-transparent'

  const iconBtn = transparent
    ? 'text-white hover:bg-white/25 bg-white/10 backdrop-blur-md'
    : 'text-gray-600 hover:bg-gray-100 bg-transparent'

  const cartBadgeBg = '#C8102E'

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top contact bar — collapses on transparent */}
      <div
        className={`text-white text-xs hidden md:block overflow-hidden transition-all duration-500 ${
          transparent ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
        style={{ background: '#1B8B3B' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+94XXXXXXXXX" className="flex items-center gap-1.5 hover:text-green-200 transition-colors">
              <Phone size={12} /><span>+94 77 XXX XXXX</span>
            </a>
            <a href="mailto:hello@minibazaar.lk" className="flex items-center gap-1.5 hover:text-green-200 transition-colors">
              <Mail size={12} /><span>hello@minibazaar.lk</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-200">🚚 Free delivery on orders over Rs. 5,000</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`transition-all duration-500 ${
          transparent
            ? 'bg-transparent'
            : 'shadow-sm'
        }`}
        style={
          transparent
            ? {}
            : { background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)' }
        }
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div
                className={`relative w-32 h-12 md:w-40 md:h-14 rounded-2xl transition-all duration-300 ${
                  transparent ? 'bg-white/90 backdrop-blur-md px-2 shadow-lg' : ''
                }`}
              >
                <Image
                  src="/miniBazaarlogo.jpg"
                  alt="MiniBazaar"
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'left' }}
                  priority
                />
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group">
                  {link.children ? (
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${linkPill}`}
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 block ${linkPill}`}
                    >
                      {link.label}
                    </Link>
                  )}

                  {link.children && (
                    <div
                      className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                        activeDropdown === link.label
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-2'
                      }`}
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors border-b border-gray-50 last:border-0"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${iconBtn}`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <button
                onClick={toggleCart}
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${iconBtn}`}
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: cartBadgeBg, fontSize: '10px' }}
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>

              <button
                className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${iconBtn}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3">
            <div className="max-w-2xl mx-auto relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search chocolates, perfumes, snacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`
                  }
                }}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-green-500"
                style={{ outline: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <div className="px-4 py-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-8 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors border-b border-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="p-4 border-t border-gray-100">
              <a href="tel:+94XXXXXXXXX" className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} /> +94 77 XXX XXXX
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
