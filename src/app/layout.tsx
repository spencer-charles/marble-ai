import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marble AI — Stone Restoration & Field Troubleshooter',
  description:
    'Interactive stone restoration workflow & AI troubleshooter connecting Sales/Estimators, Field Craftsmen, and Project Managers on a shared live customer job record.',
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
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0c0a09'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-stone-950 text-stone-100">{children}</body>
    </html>
  );
}
