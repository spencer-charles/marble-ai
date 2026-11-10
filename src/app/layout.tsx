import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marble AI — Stone Restoration Operations & Knowledge Base',
  description:
    'Stone restoration workflow, diagnostic assistant, estimator, and franchise knowledge base connecting Sales, Field Craftsmen, Project Managers, and Owner/GMs.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Marble AI'
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0c0a09'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="antialiased bg-stone-950 text-stone-100 text-sm transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
