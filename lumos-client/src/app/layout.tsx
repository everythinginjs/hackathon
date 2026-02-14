import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: {
    default: 'Lumos - AI-Powered Design Platform',
    template: '%s | Lumos',
  },
  description:
    'Create stunning designs with Lumos - the AI-powered design platform. Multi-page canvas, intelligent shapes, and collaborative tools.',
  keywords: [
    'design',
    'canvas',
    'AI design',
    'collaborative design',
    'graphic design',
    'web design',
    'design platform',
  ],
  authors: [{ name: 'Lumos Team' }],
  creator: 'Lumos',
  publisher: 'Lumos',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lumos.app'), // Update with actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lumos.app',
    title: 'Lumos - AI-Powered Design Platform',
    description:
      'Create stunning designs with Lumos - the AI-powered design platform.',
    siteName: 'Lumos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumos - AI-Powered Design Platform',
    description:
      'Create stunning designs with Lumos - the AI-powered design platform.',
    creator: '@lumos',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
