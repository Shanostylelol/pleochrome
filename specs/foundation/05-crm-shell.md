# Spec: 05 — CRM Shell (Layout, Sidebar, Header)

**Phase:** 0 (Foundation)
**Step:** 0.6
**Depends On:** 03-design-system.md (components), 04-trpc-setup.md (providers)
**Produces:** CRM shell at `/crm` with sidebar navigation, header bar, theme toggle, responsive behavior
**Estimated Time:** 1-2 hours

---

## CLAUDE.md Rules That Apply

- `Security Rules #1`: All pages under `/crm/` require authentication. Enforced in `crm/layout.tsx`.
- `Component Rules #2`: Every visual component MUST use the neumorphic design system.
- `Component Rules #3`: Every component MUST support dark AND light mode.
- `File Structure`: `src/app/crm/layout.tsx` is the CRM shell (sidebar + header + auth).
- Auth bypass for development: no login required yet (mock user from tRPC context).

---

## Architecture

```
/crm (CRM root)
  layout.tsx         ← THE SHELL (this spec)
  providers.tsx      ← tRPC + TanStack Query providers (from 04-trpc-setup.md)
  page.tsx           ← Pipeline Board (Phase 1 — placeholder for now)
  assets/
    [id]/page.tsx    ← Asset Detail (Phase 2)
    new/page.tsx     ← New Asset Wizard (Phase 7)
  partners/          ← Phase 5
  documents/         ← Phase 3
  tasks/             ← Phase 4
  meetings/          ← Phase 5
  activity/          ← Phase 4
  team/              ← Phase 7
  templates/         ← Phase 7
  compliance/        ← Phase 7
  settings/          ← Phase 7
```

The shell layout wraps ALL pages under `/crm/`. It provides:
1. Left sidebar with navigation
2. Top header bar
3. Theme toggle (dark/light)
4. Content area where child pages render

---

## File: `src/app/crm/layout.tsx`

### Structure

```
+--------------------------------------------------+
| HEADER BAR (56px, full width)                     |
| [Logo/Text] [Breadcrumb area]  [Theme] [Avatar]  |
+-------+------------------------------------------+
| SIDE  | CONTENT AREA                              |
| BAR   |                                           |
| 240px | (children render here)                    |
| or    |                                           |
| 64px  | scrollable, padding: var(--space-lg)      |
| on    |                                           |
| small |                                           |
+-------+------------------------------------------+
```

### Imports and Providers

The layout wraps children with `CRMProviders` (from `providers.tsx`) which provides tRPC + TanStack Query context.

```typescript
import { CRMProviders } from './providers'
import { CRMSidebar } from '@/components/crm/CRMSidebar'
import { CRMHeader } from '@/components/crm/CRMHeader'
```

### Auth Bypass (Development)

For development, the layout does NOT check authentication. It renders the shell for any visitor.

In production (Phase 8+), this will:
1. Check for a Supabase session via `createServerSupabaseClient()`
2. Redirect to `/login` if no session
3. Check that the user exists in `team_members` and `is_active = true`

For now, the layout simply renders:

```typescript
export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <CRMProviders>
      <div className="crm-shell">
        <CRMHeader />
        <div className="crm-body">
          <CRMSidebar />
          <main className="crm-content">
            {children}
          </main>
        </div>
      </div>
    </CRMProviders>
  )
}
```

---

## Component: `src/components/crm/CRMSidebar.tsx`

**Type:** Client component (`'use client'`)

### Navigation Items

| Label | Icon (Lucide) | Href | Description |
|-------|---------------|------|-------------|
| Pipeline | `LayoutDashboard` | `/crm` | Main dashboard / kanban board |
| Assets | `Gem` | `/crm/assets` | Asset list view (future — redirects to pipeline for now) |
| Partners | `Handshake` | `/crm/partners` | Partner directory |
| Documents | `FileText` | `/crm/documents` | Document library |
| Tasks | `CheckSquare` | `/crm/tasks` | Task dashboard |
| Meetings | `Calendar` | `/crm/meetings` | Meeting records |
| Activity | `Activity` | `/crm/activity` | Audit trail |
| Team | `Users` | `/crm/team` | Team directory |
| Templates | `BookOpen` | `/crm/templates` | Governance templates |
| Compliance | `Shield` | `/crm/compliance` | Compliance dashboard |
| Settings | `Settings` | `/crm/settings` | App settings |

### Sidebar Layout

```
+----------------------------+
| PleoChrome Logo/Text       |  ← 56px height, matches header
| "Powerhouse"               |
+----------------------------+
|                             |
| [icon] Pipeline             |  ← nav items
| [icon] Partners             |
| [icon] Documents            |
| [icon] Tasks                |
| [icon] Meetings             |
| [icon] Activity             |
|                             |
| ─ divider ─                 |
|                             |
| [icon] Team                 |  ← admin section
| [icon] Templates            |
| [icon] Compliance           |
| [icon] Settings             |
|                             |
| (spacer)                    |
|                             |
| [avatar] Shane Pierson      |  ← user info at bottom
| CEO                         |
+----------------------------+
```

### Styles

- Background: `var(--bg-sidebar)`
- Width: `var(--sidebar-width)` = 240px
- Height: `100vh - var(--header-height)` (sidebar sits below header)
- Position: `fixed` left, below header
- Border right: `1px solid var(--border)`
- Overflow-y: `auto` (scrollable if many items)

**Nav item (inactive):**
- `padding: 10px 16px`
- `border-radius: var(--radius-md)`
- `color: var(--text-muted)`
- `font-size: 14px`
- `font-weight: 500`
- `display: flex`, `align-items: center`, `gap: 12px`
- `cursor: pointer`

**Nav item (hover):**
- `color: var(--text-secondary)`
- `background: var(--bg-elevated)`

**Nav item (active — current page):**
- `color: var(--text-primary)`
- `background: var(--bg-body)`
- `box-shadow: var(--shadow-pressed)` (concave — "pressed in" to show it's selected)
- `font-weight: 600`

**Active detection:** Use `usePathname()` from `next/navigation`. Match the current path against nav item hrefs. For `/crm` and `/crm/assets/[id]`, the "Pipeline" item should be active.

**User info section (bottom):**
- Fixed to bottom of sidebar
- `padding: 12px 16px`
- `border-top: 1px solid var(--border)`
- Avatar (NeuAvatar size="sm") + name + role
- Hover: `background: var(--bg-elevated)`

**Divider:** `height: 1px`, `background: var(--border)`, `margin: 8px 16px`

### Props

```typescript
// No props — uses pathname for active state and mock user for name
```

### Responsive Behavior

- `>= 1024px`: Full sidebar (240px), labels visible
- `768px - 1023px`: Collapsed sidebar (64px), only icons visible, labels hidden
- `< 768px`: Sidebar hidden entirely. Replaced by **bottom navigation bar** with 5 items: Pipeline, Assets, Tasks, Activity, More. "More" opens a slide-up sheet with remaining nav items (Partners, Documents, Meetings, Team, Templates, Compliance, Settings). Hamburger menu in header opens a slide-out drawer as secondary navigation.

Implementation:
- Use `useState` for collapsed state
- Use a CSS media query or `useMediaQuery` hook to detect width
- On collapse: width shrinks to 64px, labels get `display: none`, icons center
- On mobile (`< 768px`):
  - Sidebar is hidden (`display: none`)
  - Bottom navigation bar renders (see `specs/foundation/03-design-system.md` for CSS)
  - Content area gets `padding-bottom: calc(80px + env(safe-area-inset-bottom))` for bottom nav clearance
  - FAB (Quick Add) renders on Pipeline page, positioned above bottom nav
  - Hamburger menu in header opens a full slide-out drawer (overlay) with complete nav for edge cases

### Bottom Navigation Component

**File: `src/components/crm/CRMBottomNav.tsx`**

**Type:** Client component (`'use client'`)

| Item | Icon (Lucide) | Href |
|------|---------------|------|
| Pipeline | `LayoutDashboard` | `/crm` |
| Assets | `Gem` | `/crm/assets` |
| Tasks | `CheckSquare` | `/crm/tasks` |
| Activity | `Activity` | `/crm/activity` |
| More | `Menu` | (opens slide-up sheet) |

- Only rendered when viewport is < 768px (use CSS media query or JS check)
- Active state: `color: var(--teal)`, icon filled
- Inactive state: `color: var(--text-muted)`
- Touch targets: minimum 44x44px per item
- Height: `calc(64px + env(safe-area-inset-bottom))`
- Background: `var(--bg-surface)`, `border-top: 1px solid var(--border)`

---

## Component: `src/components/crm/CRMHeader.tsx`

**Type:** Client component (`'use client'`)

### Header Layout

```
+------------------------------------------------------------------+
| [Hamburger]  PleoChrome Powerhouse    [Search?]  [Theme] [Avatar]|
+------------------------------------------------------------------+
```

**Left section:**
- Hamburger menu button (visible only on mobile < 768px, toggles sidebar drawer)
- "PleoChrome" text: `font-family: var(--font-display)`, `font-size: 18px`, `font-weight: 600`, `color: var(--text-primary)`
- "Powerhouse" text: `font-size: 12px`, `color: var(--teal)`, `letter-spacing: 1px`, `text-transform: uppercase`

**Right section:**
- Theme toggle button (sun/moon icons)
- User avatar (NeuAvatar size="sm")

### Styles

- Background: `var(--bg-surface)`
- Height: `var(--header-height)` = 56px
- Position: `fixed`, top, full width
- `z-index: 40`
- `box-shadow: var(--shadow-flat)` (subtle bottom shadow)
- `border-bottom: 1px solid var(--border)`
- `display: flex`, `align-items: center`, `justify-content: space-between`
- `padding: 0 var(--space-lg)`

### Theme Toggle

**Component: `ThemeToggle` (inline in CRMHeader or separate file)**

```typescript
// State stored in localStorage under key 'pleochrome-theme'
// Default: 'dark'
// Toggle updates document.documentElement.dataset.theme
```

**Implementation:**
1. On mount: read `localStorage.getItem('pleochrome-theme')` or default to `'dark'`
2. Set `document.documentElement.dataset.theme` to the value
3. On click: toggle between `'dark'` and `'light'`, update localStorage and DOM
4. Icon: `Sun` (Lucide) when dark (clicking switches to light), `Moon` (Lucide) when light

**Button style:** `NeuButton variant="ghost" size="sm"` wrapping the icon

---

## Component: `src/components/crm/ThemeProvider.tsx`

**Type:** Client component

A context provider that manages theme state and provides it to components that need to know the current theme programmatically.

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('pleochrome-theme') as Theme | null
    const initial = stored ?? 'dark'
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('pleochrome-theme', next)
    document.documentElement.dataset.theme = next
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
```

**Wire into CRM layout:** `ThemeProvider` is rendered inside the layout.tsx, wrapping children but itself wrapped by `CRMProviders`. The nesting order in layout.tsx is: `CRMProviders` (outermost) > `ThemeProvider` > shell UI + children. This is already shown in the "Updated Layout File" section below.

---

## CSS for the Shell

### File: Append to `src/styles/neumorphic.css`

Add the following CSS to the END of `src/styles/neumorphic.css` (created in spec 03). Do NOT create a separate file -- keeping all layout CSS in one file avoids import order issues.

```css
/* ── CRM Shell Layout ──────────────────────────── */

.crm-shell {
  min-height: 100vh;
  background: var(--bg-body);
}

.crm-body {
  display: flex;
  padding-top: var(--header-height);
}

.crm-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: var(--space-lg);
  min-height: calc(100vh - var(--header-height));
  overflow-y: auto;
}

/* Collapsed sidebar */
@media (max-width: 1023px) {
  .crm-content {
    margin-left: var(--sidebar-collapsed-width);
  }
}

/* Mobile — no sidebar margin */
@media (max-width: 767px) {
  .crm-content {
    margin-left: 0;
  }
}
```

---

## Updated Layout File

### File: `src/app/crm/layout.tsx` (final version)

```typescript
import type { Metadata } from 'next'
import { CRMProviders } from './providers'
import { ThemeProvider } from '@/components/crm/ThemeProvider'
import { ToastProvider } from '@/components/ui/NeuToast'
import { CRMSidebar } from '@/components/crm/CRMSidebar'
import { CRMHeader } from '@/components/crm/CRMHeader'

export const metadata: Metadata = {
  title: 'Powerhouse CRM | PleoChrome',
  description: 'Real-world asset value orchestration platform',
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <CRMProviders>
      <ThemeProvider>
        <ToastProvider>
          <div className="crm-shell">
            <CRMHeader />
            <div className="crm-body">
              <CRMSidebar />
              <main className="crm-content">
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </ThemeProvider>
    </CRMProviders>
  )
}
```

**NOTE:** This layout.tsx is a Server Component that renders client components as children. The `metadata` export works here because the file itself is NOT a client component -- `CRMProviders`, `ThemeProvider`, `CRMSidebar`, and `CRMHeader` are client components (they have `'use client'` directives), but they are imported and rendered inside a Server Component layout. This is the correct pattern. Do NOT add `'use client'` to layout.tsx.
```

---

## User Interactions

| Interaction | What Happens |
|-------------|-------------|
| Click nav item | `router.push(href)`, item becomes active (pressed style) |
| Click theme toggle | Theme switches dark/light, persisted to localStorage |
| Click user avatar | (Future: dropdown menu with profile, logout) |
| Resize below 1024px | Sidebar collapses to icon-only mode (64px wide) |
| Resize below 768px | Sidebar hidden, hamburger button appears in header |
| Click hamburger (mobile) | Sidebar slides in as overlay drawer |
| Click overlay (mobile drawer) | Drawer closes |
| Press Escape (mobile drawer) | Drawer closes |

---

## Verification Checklist

| Check | How | Expected |
|-------|-----|----------|
| Navigate to `/crm` | Browser | Shell renders with sidebar + header |
| Sidebar visible | Visual | 11 nav items visible with icons |
| Active state works | Click different nav items | Pressed/concave style on active item |
| Theme toggle | Click sun/moon icon | Background and text colors switch |
| Theme persists | Toggle, refresh page | Theme matches last selection |
| Responsive collapse | Resize window to < 1024px | Sidebar shows icons only |
| Mobile drawer | Resize to < 768px | Hamburger appears, opens drawer |
| Bottom nav renders | Resize to < 768px | 5-item bottom nav bar visible |
| Bottom nav active state | Tap nav items on mobile | Active item highlighted in teal |
| "More" opens sheet | Tap "More" in bottom nav | Slide-up sheet with remaining items |
| FAB renders (Pipeline) | Resize to < 768px on /crm | Teal FAB visible bottom-right |
| Safe area padding | Test on iOS simulator | Bottom nav respects notch inset |
| Content scrolls | Add tall content | Main area scrolls independently |
| Fonts render | Inspect computed styles | Cormorant Garamond (headers), DM Sans (body) |
| Dark mode correct | Set dark, inspect `--bg-body` | `#0A0F1A` |
| Light mode correct | Set light, inspect `--bg-body` | `#E8EDF2` |
| `npm run build` passes | `npm run build` | Zero errors |

---

## Components Used

| Component | From | Usage |
|-----------|------|-------|
| `NeuAvatar` | `src/components/ui/NeuAvatar.tsx` | User avatar in sidebar footer + header |
| `NeuButton` | `src/components/ui/NeuButton.tsx` | Theme toggle button, hamburger button |

---

## Files Created

| File | Purpose |
|------|---------|
| `src/app/crm/layout.tsx` | CRM shell layout (replaces placeholder from 04) |
| `src/components/crm/CRMSidebar.tsx` | Left sidebar navigation |
| `src/components/crm/CRMHeader.tsx` | Top header bar |
| `src/components/crm/ThemeProvider.tsx` | Theme context + localStorage persistence |
| `src/components/crm/CRMBottomNav.tsx` | Mobile bottom navigation bar (< 768px) |
| `src/components/crm/MoreSheet.tsx` | Slide-up sheet for "More" nav items |

---

## Database Tables/Views Used

None directly. The mock user comes from the tRPC context (spec 04).

---

## tRPC Routes Used

None directly in the shell. Child pages use tRPC via the providers.
