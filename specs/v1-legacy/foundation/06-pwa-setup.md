# Spec: 06 — PWA Setup (Progressive Web App Configuration)

**Phase:** 0 (Foundation)
**Step:** 0.7
**Depends On:** 01-packages.md (`@serwist/next`, `serwist` installed), 03-design-system.md (brand colors)
**Produces:** Installable PWA with service worker, manifest, offline fallback, iOS meta tags
**Estimated Time:** 1-2 hours
**CRITICAL:** This spec must be completed in Phase 0 so every subsequent page is automatically cached and mobile-installable.

---

## CLAUDE.md Rules That Apply

- `PWA`: The CRM MUST be installable as a PWA on mobile and desktop
- `PWA`: Service worker caches the app shell, static assets, and recent data for offline access
- `PWA`: Cache strategies: shell=cache-first, API=network-first, documents=stale-while-revalidate
- `Mobile-First Design`: All pages designed mobile-first, then enhanced for larger screens

---

## Part 1: Web App Manifest

### File: `src/app/manifest.ts`

Next.js 16 App Router supports generating the manifest via a TypeScript file in `src/app/`. This is preferred over a static JSON file because it can reference shared constants.

```typescript
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
    theme_color: '#0A0F1A',       // Dark mode bg-body
    background_color: '#0A0F1A',  // Splash screen background
    categories: ['business', 'finance', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/pipeline-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Pipeline Board — Desktop',
      },
      {
        src: '/screenshots/pipeline-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Pipeline Board — Mobile',
      },
    ],
    shortcuts: [
      {
        name: 'Pipeline Board',
        short_name: 'Pipeline',
        url: '/crm',
        icons: [{ src: '/icons/shortcut-pipeline.png', sizes: '96x96' }],
      },
      {
        name: 'Tasks',
        short_name: 'Tasks',
        url: '/crm/tasks',
        icons: [{ src: '/icons/shortcut-tasks.png', sizes: '96x96' }],
      },
      {
        name: 'New Asset',
        short_name: 'New Asset',
        url: '/crm/assets/new',
        icons: [{ src: '/icons/shortcut-new-asset.png', sizes: '96x96' }],
      },
    ],
  }
}
```

### Icon Assets Required

| File | Size | Purpose |
|------|------|---------|
| `public/icons/icon-192x192.png` | 192x192 | Standard icon (Android, desktop) |
| `public/icons/icon-512x512.png` | 512x512 | High-res icon (Android splash, store) |
| `public/icons/icon-maskable-192x192.png` | 192x192 | Maskable variant (Android adaptive icons) |
| `public/icons/icon-maskable-512x512.png` | 512x512 | Maskable variant (high-res) |
| `public/icons/shortcut-pipeline.png` | 96x96 | App shortcut icon |
| `public/icons/shortcut-tasks.png` | 96x96 | App shortcut icon |
| `public/icons/shortcut-new-asset.png` | 96x96 | App shortcut icon |
| `public/screenshots/pipeline-desktop.png` | 1280x720 | Install prompt screenshot (desktop) |
| `public/screenshots/pipeline-mobile.png` | 390x844 | Install prompt screenshot (mobile) |

**Design:** Icons should use the PleoChrome teal (#1A8B7A) on dark navy (#0A0F1A) background. The maskable variants need safe-zone padding (inner 80% of canvas). Generate placeholder icons initially — replace with final branding in Phase 8.

---

## Part 2: Service Worker Configuration

### File: `next.config.ts` (update)

Wrap the existing Next.js config with Serwist:

```typescript
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development', // Disable SW in dev to avoid caching issues
})

const nextConfig = {
  // ... existing Next.js config
}

export default withSerwist(nextConfig)
```

### File: `src/app/sw.ts` (Service Worker)

```typescript
import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // App Shell — Cache First (fast loads, update in background)
    {
      urlPattern: /^\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    // API Data — Network First (fresh data, fallback to cache)
    {
      urlPattern: /\/api\/trpc\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-data',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    // Document/Image Assets — Stale While Revalidate
    {
      urlPattern: /\/storage\/v1\/object\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'document-assets',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
    // Google Fonts — Cache First
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    // Default cache for other requests
    ...defaultCache,
  ],
})

serwist.addEventListeners()
```

---

## Part 3: iOS Meta Tags

### File: Update `src/app/layout.tsx`

Add the following meta tags inside the `<head>` (via Next.js metadata or direct tags):

```typescript
export const metadata: Metadata = {
  // ... existing metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Powerhouse',
  },
  formatDetection: {
    telephone: false, // Prevent iOS from auto-linking phone numbers
  },
}
```

Also add to the root layout `<head>`:

```html
<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />

<!-- Apple Splash Screens (generated for common iOS devices) -->
<!-- These are created in Phase 8 with actual screenshots -->
```

---

## Part 4: Offline Fallback Page

### File: `src/app/crm/offline/page.tsx`

A simple offline fallback page shown when the user navigates while offline and the page is not cached:

```typescript
export default function OfflinePage() {
  return (
    <div className="offline-page">
      <div className="offline-content">
        <WifiOff size={48} />
        <h1>You're Offline</h1>
        <p>PleoChrome Powerhouse requires an internet connection for real-time data.</p>
        <p>Your recent changes have been saved and will sync when you reconnect.</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    </div>
  )
}
```

---

## Part 5: Offline Indicator Banner

### File: `src/components/crm/OfflineBanner.tsx`

A banner that appears at the top of the CRM when the user loses connection:

```typescript
'use client'

import { useEffect, useState } from 'react'

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)

    // Check initial state
    setIsOffline(!navigator.onLine)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="offline-banner">
      <WifiOff size={14} />
      <span>You're offline. Changes will sync when you reconnect.</span>
    </div>
  )
}
```

**Styles (add to neumorphic.css):**
```css
.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--amber);
  color: white;
  font-size: 13px;
  font-weight: 500;
}
```

**Integration:** Add `<OfflineBanner />` inside the CRM layout, above the header.

---

## Part 6: Background Sync (Future — Phase 8)

Background sync will queue tRPC mutations made while offline and replay them on reconnection. This is registered in Phase 0 but implemented fully in Phase 8.

The service worker registers a sync event:
```typescript
// In sw.ts — add when implementing background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'mutation-queue') {
    event.waitUntil(replayMutationQueue())
  }
})
```

The mutation queue is stored in IndexedDB using a lightweight wrapper. Each queued mutation stores: route name, input data, timestamp, and retry count.

---

## Verification Checklist

| Check | How | Expected |
|-------|-----|----------|
| Manifest loads | DevTools > Application > Manifest | All fields populated, icons load |
| Service worker registers | DevTools > Application > Service Workers | SW active, no errors |
| App installable | Chrome address bar install icon | Install prompt appears |
| Offline indicator | Toggle DevTools offline mode | Amber banner appears |
| Back online | Toggle online | Banner disappears |
| Cache strategies work | Network tab > filter cached | Static = from SW, API = network |
| iOS meta tags | Inspect `<head>` | apple-mobile-web-app-capable present |
| Lighthouse PWA score | Run Lighthouse audit | Score > 90 |
| `npm run build` | Terminal | Zero errors |

---

## Files Created

| File | Purpose |
|------|---------|
| `src/app/manifest.ts` | Web app manifest (TypeScript, auto-served by Next.js) |
| `src/app/sw.ts` | Service worker source (compiled by Serwist) |
| `src/app/crm/offline/page.tsx` | Offline fallback page |
| `src/components/crm/OfflineBanner.tsx` | Connection status banner |
| `public/icons/*.png` | PWA icons (placeholder, replaced in Phase 8) |

---

## Files Modified

| File | Change |
|------|--------|
| `next.config.ts` | Wrapped with `withSerwist()` |
| `src/app/layout.tsx` | Added iOS meta tags via metadata export |
| `src/app/crm/layout.tsx` | Added `<OfflineBanner />` component |
| `src/styles/neumorphic.css` | Added `.offline-banner` styles |
