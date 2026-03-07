import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/footer';
import { siteConfig } from '@/lib/site';
import { WebSiteJsonLd } from '@/components/json-ld';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Payment Channels for Streaming Delivery`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "SeedPay",
    "BitTorrent payments",
    "payment channels",
    "micropayments",
    "USDC",
    "Solana",
    "P2P payments",
    "streaming payments",
    "ECDH",
    "decentralized protocol",
    "torrent seeding incentives",
    "cryptocurrency",
    "open protocol",
  ],
  authors: [{ name: "SeedPay Protocol" }],
  creator: "SeedPay Protocol",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Payment Channels for Streaming Delivery`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Payment Channels for Streaming Delivery`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <WebSiteJsonLd />
        <RootProvider>
          {children}
          <Footer />
        </RootProvider>
      </body>
    </html>
  );
}
