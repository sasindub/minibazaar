'use client'
import { useEffect } from 'react'

export default function ScrollObserver() {
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
    // Re-scan after a tick so server-rendered HTML is in the DOM
    const t = setTimeout(scan, 100)
    return () => {
      clearTimeout(t)
      observer.disconnect()
    }
  }, [])

  return null
}
