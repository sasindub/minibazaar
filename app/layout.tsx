import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import SiteChrome from '@/components/SiteChrome'
import './globals.css'

export const metadata: Metadata = {
  title: 'MiniBazaar - Where Variety Meets Value',
  description: 'Shop premium chocolates, branded perfumes, snacks, and beauty products at MiniBazaar. Fast delivery across Sri Lanka.',
  keywords: 'chocolates, perfumes, snacks, beauty, online shopping, Sri Lanka',
  icons: { icon: '/miniBazaarlogo.jpg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <SiteChrome>{children}</SiteChrome>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#fff',
              color: '#1a1a1a',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#1B8B3B', secondary: '#fff' } },
            error: { iconTheme: { primary: '#C8102E', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
