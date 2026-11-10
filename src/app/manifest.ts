import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Marble AI — Stone Restoration & Field Troubleshooter',
    short_name: 'Marble AI',
    description:
      'Interactive field stone restoration platform with Role Switcher, AI Stone Troubleshooter, and Shared Customer & Job Record for Sales, Craftsmen, and Project Managers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0a09',
    theme_color: '#f59e0b',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ]
  };
}
