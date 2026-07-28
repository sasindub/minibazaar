'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    const scan = () => {
      document
        .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach((el) => observer.observe(el))
    }

    scan()
    // Re-scan shortly after so freshly navigated/server-rendered HTML is in the
    // DOM before we observe it.
    const t1 = setTimeout(scan, 100)
    const t2 = setTimeout(scan, 400)

    // Safety net: if a reveal element is somehow never observed as intersecting
    // (e.g. a race on client navigation), reveal everything after a short delay
    // so content can never get stuck invisible.
    const fallback = setTimeout(() => {
      document
        .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach((el) => el.classList.add('visible'))
    }, 1200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(fallback)
      observer.disconnect()
    }
    // Re-run on every route change so newly rendered sections get observed.
  }, [pathname])

  return null
}
