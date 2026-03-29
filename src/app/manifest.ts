import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/crm',
    name: 'PleoChrome Powerhouse',
    short_name: 'Powerhouse',
    description: 'Real-world asset value orchestration platform — CRM & governance pipeline',
    start_url: '/crm',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    theme_color: '#0A0F1A',
    background_color: '#0A0F1A',
    categories: ['business', 'finance', 'productivity'],
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Pipeline Board', short_name: 'Pipeline', url: '/crm' },
      { name: 'Tasks', short_name: 'Tasks', url: '/crm/tasks' },
      { name: 'New Asset', short_name: 'New Asset', url: '/crm/assets/new' },
    ],
  }
}
