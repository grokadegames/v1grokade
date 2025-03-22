import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

// Add a version query parameter to force cache refresh
const faviconVersion = '?v=3';

export const metadata = {
  metadataBase: new URL('https://grokade.com'),
  title: 'Grokade - AI Gaming Vibe Hub',
  description: 'Discover games built with Grok and other AI tools. Play AI-generated games, browse our vibegame index, hire talent, and join competitions on the ultimate AI gaming community platform.',
  keywords: ['AI games', 'vibe coding', 'grok games', 'WebGL games', 'AI game development', 'game developers', 'Three.js', 'talent marketplace', 'game competitions'],
  authors: [{ name: 'Grokade Team' }],
  creator: 'Grokade',
  publisher: 'Grokade',
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
  manifest: `/site.webmanifest${faviconVersion}`,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://grokade.com',
    siteName: 'Grokade',
    title: 'Grokade - AI Gaming Vibe Hub',
    description: 'Discover games built with Grok and other AI tools. Attract players, run competitions, hire game devs, or browse our vibegame index.',
    images: [
      {
        url: 'https://ik.imagekit.io/cbzkrwprl/Grokade%20Logo.png?updatedAt=1742653726017',
        width: 1200,
        height: 630,
        alt: 'Grokade - AI Gaming Vibe Hub'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grokade - AI Gaming Vibe Hub',
    description: 'Discover games built with Grok and other AI tools. Attract players, run competitions, hire game devs, or browse our vibegame index.',
    site: '@GrokadeGames',
    creator: '@aigamelord',
    images: ['https://ik.imagekit.io/cbzkrwprl/Grokade%20Logo.png?updatedAt=1742653726017']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
}

export const viewport = {
  themeColor: '#9966FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Force favicon refresh */}
        <link rel="icon" href={`/favicon.ico${faviconVersion}`} sizes="any" />
        <link rel="icon" href={`/favicon.svg${faviconVersion}`} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={`/apple-touch-icon.svg${faviconVersion}`} type="image/svg+xml" />
        <link rel="canonical" href="https://grokade.com" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
