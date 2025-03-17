import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

// Add a version query parameter to force cache refresh
const faviconVersion = '?v=3';

export const metadata = {
  title: 'Grokade - AI Gaming Vibe Hub',
  description: 'Welcome to Grokade, the ultimate AI gaming community platform',
  icons: {
    icon: [
      { url: `/favicon.ico${faviconVersion}`, sizes: 'any' },
      { url: `/favicon.svg${faviconVersion}`, type: 'image/svg+xml' }
    ],
    shortcut: [
      { url: `/favicon.svg${faviconVersion}`, type: 'image/svg+xml' }
    ],
    apple: [
      { url: `/apple-touch-icon.svg${faviconVersion}`, type: 'image/svg+xml' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: `/safari-pinned-tab.svg${faviconVersion}`,
        color: '#9966FF'
      }
    ]
  },
  manifest: `/site.webmanifest${faviconVersion}`
}

export const viewport = {
  themeColor: '#9966FF'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Force favicon refresh */}
        <link rel="icon" href={`/favicon.ico${faviconVersion}`} sizes="any" />
        <link rel="icon" href={`/favicon.svg${faviconVersion}`} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={`/apple-touch-icon.svg${faviconVersion}`} type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
