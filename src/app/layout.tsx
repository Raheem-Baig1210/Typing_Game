import '@/styles/globals.css';
import { Inter, Roboto_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Providers from './providers';
import Navbar from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'TypeMaster - Improve Your Typing Skills',
  description: 'A modern typing game with multiple modes, real-time multiplayer, and AI coaching.',
  keywords: ['typing game', 'typing practice', 'typing speed', 'wpm', 'typing test', 'multiplayer typing'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/app-icon.svg', sizes: '512x512', type: 'image/svg+xml' }
    ],
    apple: { url: '/app-icon.svg', sizes: '512x512', type: 'image/svg+xml' },
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/app-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
} 