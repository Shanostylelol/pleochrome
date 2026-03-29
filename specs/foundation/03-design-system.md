# Spec: 03 — Design System (Neumorphic Components)

**Phase:** 0 (Foundation)
**Step:** 0.4
**Depends On:** 01-packages.md (packages installed)
**Produces:** CSS custom properties, utility classes, 13 atomic components
**Estimated Time:** 2-3 hours
**CRITICAL:** This spec defines the visual foundation for EVERY page. No UI can be built without this.

---

## CLAUDE.md Rules That Apply

- `Component Rules #1`: Check `src/components/ui/` BEFORE creating any new component.
- `Component Rules #2`: Every visual component MUST use the neumorphic design system. No inline `box-shadow`, no hardcoded colors.
- `Component Rules #3`: Every component MUST support dark AND light mode via CSS custom properties.
- `Component Rules #4`: `Neu` prefix for neumorphic primitives.
- `Component Rules #5`: No prop drilling beyond 2 levels.
- `Design System`: Raised, Pressed, Flat surface hierarchy.
- `Design System`: Buttons raised at rest, pressed on click. Inputs always pressed/concave. Cards raised at rest, stronger on hover.
- `Colors`: emerald #1B6B4A, teal #1A8B7A, sapphire #1E3A6E, amber #C47A1A, ruby #A61D3A, amethyst #5B2D8E, chartreuse #7BA31E
- `Typography`: Cormorant Garamond (display), DM Sans (body), SF Mono / Fira Code (mono)

---

## Part 1: CSS Custom Properties

### File: `src/styles/neumorphic.css`

This file defines ALL CSS custom properties used by the design system. It is imported in `globals.css` and provides the foundation for every component.

```css
/* ═══════════════════════════════════════════════════════
   PleoChrome Design System — Neumorphic CSS Variables
   ═══════════════════════════════════════════════════════
   Source of truth: wireframe-prototype.html
   Rule: NEVER hardcode colors or shadows in components.
         Always reference these variables.
   ═══════════════════════════════════════════════════════ */

/* ── Brand Colors (theme-independent) ────────────── */
:root {
  --emerald: #1B6B4A;
  --emerald-light: #2A8B62;
  --emerald-dark: #124E35;
  --emerald-bg: rgba(27, 107, 74, 0.15);

  --teal: #1A8B7A;
  --teal-light: #28A894;
  --teal-dark: #126B5E;
  --teal-bg: rgba(26, 139, 122, 0.15);

  --sapphire: #1E3A6E;
  --sapphire-light: #2A4F8E;
  --sapphire-dark: #142852;
  --sapphire-bg: rgba(30, 58, 110, 0.15);

  --amethyst: #5B2D8E;
  --amethyst-light: #7340AB;
  --amethyst-dark: #442068;
  --amethyst-bg: rgba(91, 45, 142, 0.15);

  --ruby: #A61D3A;
  --ruby-light: #C42950;
  --ruby-dark: #7E1530;
  --ruby-bg: rgba(166, 29, 58, 0.15);

  --amber: #C47A1A;
  --amber-light: #D89030;
  --amber-dark: #9E6214;
  --amber-bg: rgba(196, 122, 26, 0.15);

  --chartreuse: #7BA31E;
  --chartreuse-light: #92C028;
  --chartreuse-dark: #5E7E16;
  --chartreuse-bg: rgba(123, 163, 30, 0.15);

  --gold: #D4AF37;

  /* ── Spacing ─────────────────────────────────── */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* ── Border Radius ───────────────────────────── */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* ── Transitions ─────────────────────────────── */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* ── Layout ──────────────────────────────────── */
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  --header-height: 56px;

  /* ── Typography ──────────────────────────────── */
  /* Fonts loaded in layout.tsx as --font-cormorant and --font-dm-sans.
     These aliases let design system components use semantic names. */
  --font-display: var(--font-cormorant), Georgia, 'Times New Roman', serif;
  --font-body: var(--font-dm-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
}

/* ── Dark Theme ────────────────────────────────── */
[data-theme="dark"] {
  /* Backgrounds */
  --bg-body: #0A0F1A;
  --bg-surface: #141B2D;
  --bg-elevated: #1C2540;
  --bg-input: #0F1526;
  --bg-sidebar: #0D1220;

  /* Borders */
  --border: #1E293B;
  --border-focus: #334155;

  /* Text */
  --text-primary: #F0F4F8;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --text-placeholder: #475569;
  --text-inverse: #0A0F1A;

  /* Neumorphic Shadows */
  --shadow-raised: 8px 8px 16px rgba(0,0,0,0.4), -8px -8px 16px rgba(255,255,255,0.03);
  --shadow-raised-sm: 4px 4px 8px rgba(0,0,0,0.35), -4px -4px 8px rgba(255,255,255,0.025);
  --shadow-pressed: inset 4px 4px 8px rgba(0,0,0,0.4), inset -4px -4px 8px rgba(255,255,255,0.03);
  --shadow-card-hover: 10px 10px 20px rgba(0,0,0,0.5), -10px -10px 20px rgba(255,255,255,0.04);
  --shadow-flat: 0 1px 3px rgba(0,0,0,0.3);

  /* Overlay */
  --overlay: rgba(0,0,0,0.6);
}

/* ── Light Theme ───────────────────────────────── */
[data-theme="light"] {
  /* Backgrounds */
  --bg-body: #E8EDF2;
  --bg-surface: #E0E5EC;
  --bg-elevated: #F0F4F8;
  --bg-input: #D8DDE4;
  --bg-sidebar: #DDE2E9;

  /* Borders */
  --border: #C8CED6;
  --border-focus: #A0A8B4;

  /* Text */
  --text-primary: #1A2332;
  --text-secondary: #4A5568;
  --text-muted: #718096;
  --text-placeholder: #A0AEC0;
  --text-inverse: #F0F4F8;

  /* Neumorphic Shadows */
  --shadow-raised: 8px 8px 16px rgba(0,0,0,0.08), -8px -8px 16px rgba(255,255,255,0.80);
  --shadow-raised-sm: 4px 4px 8px rgba(0,0,0,0.06), -4px -4px 8px rgba(255,255,255,0.70);
  --shadow-pressed: inset 4px 4px 8px rgba(0,0,0,0.08), inset -4px -4px 8px rgba(255,255,255,0.80);
  --shadow-card-hover: 10px 10px 20px rgba(0,0,0,0.10), -10px -10px 20px rgba(255,255,255,0.85);
  --shadow-flat: 0 1px 3px rgba(0,0,0,0.08);

  /* Overlay */
  --overlay: rgba(0,0,0,0.3);
}

/* ── Utility Classes ───────────────────────────── */

.neu-raised {
  background: var(--bg-surface);
  box-shadow: var(--shadow-raised);
  border-radius: var(--radius-md);
}

.neu-raised-sm {
  background: var(--bg-surface);
  box-shadow: var(--shadow-raised-sm);
  border-radius: var(--radius-md);
}

.neu-pressed {
  background: var(--bg-body);
  box-shadow: var(--shadow-pressed);
  border-radius: var(--radius-md);
}

.neu-flat {
  background: var(--bg-surface);
  box-shadow: var(--shadow-flat);
  border-radius: var(--radius-md);
}

.neu-card-hover {
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}
.neu-card-hover:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
}

.neu-btn-press {
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}
.neu-btn-press:active {
  box-shadow: var(--shadow-pressed);
  transform: translateY(1px);
}
```

### Integration with globals.css

**NOTE:** The `src/styles/` directory does not yet exist. Create it first:

```bash
mkdir -p ~/Projects/pleochrome/src/styles
```

Then move or keep `globals.css` in its current location (`src/app/globals.css`) and add this import to the TOP of `src/app/globals.css`, **before** the existing `@import "tailwindcss";` line:

```css
@import '../styles/neumorphic.css';
@import "tailwindcss";
```

**IMPORTANT:** The neumorphic.css import must come BEFORE `@import "tailwindcss"` so that the CSS custom properties are available to Tailwind utility classes. The existing globals.css content (`:root` variables, animations, etc.) should remain intact. The neumorphic.css variables will supplement, not replace, the existing design tokens -- the CRM pages will use neumorphic.css while the landing page continues using the existing tokens.

### Google Fonts

**IMPORTANT:** The existing `src/app/layout.tsx` already loads these fonts with the CSS variable names `--font-cormorant` and `--font-dm-sans`. The existing `globals.css` references these names. Do NOT change the variable names in `layout.tsx` — instead, the neumorphic.css typography section maps them:

```css
  /* ── Typography ──────────────────────────────── */
  /* Fonts loaded in layout.tsx as --font-cormorant and --font-dm-sans */
  --font-display: var(--font-cormorant), Georgia, 'Times New Roman', serif;
  --font-body: var(--font-dm-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
```

This approach creates alias variables (`--font-display`, `--font-body`) that reference the actual font variables from `layout.tsx`. All design system components use the aliases.

**Also update `layout.tsx`:** Add `data-theme="dark"` to the `<html>` tag so the neumorphic CSS variables activate:

```typescript
// Change: <html lang="en" className="dark">
// To:     <html lang="en" className="dark" data-theme="dark">
// Note: className="dark" can remain for Tailwind dark mode compat
```

**Do NOT change the existing `300` weight inclusion** — the existing layout loads weight `300` which the spec's version omits. Keep all existing weights: `['300', '400', '500', '600', '700']`.

---

## Part 2: TypeScript Design Tokens

### File: `src/lib/design-system.ts`

```typescript
/**
 * PleoChrome Design System — TypeScript Constants
 * Use these when you need design values in JS/TS (not CSS).
 * For CSS, always use the custom properties from neumorphic.css.
 */

export const BRAND_COLORS = {
  emerald:    { hex: '#1B6B4A', label: 'Fractional / Phase 1 / Success' },
  teal:       { hex: '#1A8B7A', label: 'Tokenization / Phase 2 / Primary' },
  sapphire:   { hex: '#1E3A6E', label: 'Debt Instruments' },
  amethyst:   { hex: '#5B2D8E', label: 'Partner indicators' },
  ruby:       { hex: '#A61D3A', label: 'Risk / Error / Blocked' },
  amber:      { hex: '#C47A1A', label: 'Distribution / Warning' },
  chartreuse: { hex: '#7BA31E', label: 'Complete / Positive trend' },
  gold:       { hex: '#D4AF37', label: 'Premium accent' },
} as const

export const PATH_COLORS = {
  fractional_securities: BRAND_COLORS.emerald.hex,
  tokenization: BRAND_COLORS.teal.hex,
  debt_instruments: BRAND_COLORS.sapphire.hex,
  evaluating: BRAND_COLORS.amber.hex,
} as const

export const PHASE_COLORS: Record<string, string> = {
  phase_0_foundation: '#64748B',
  phase_1_intake: BRAND_COLORS.emerald.hex,
  phase_2_certification: BRAND_COLORS.teal.hex,
  phase_3_custody: BRAND_COLORS.teal.hex,
  phase_4_legal: BRAND_COLORS.amethyst.hex,
  phase_5_tokenization: BRAND_COLORS.teal.hex,
  phase_6_regulatory: BRAND_COLORS.amber.hex,
  phase_7_distribution: BRAND_COLORS.amber.hex,
  phase_8_ongoing: BRAND_COLORS.chartreuse.hex,
}

export const STATUS_COLORS: Record<string, string> = {
  prospect: '#64748B',
  screening: BRAND_COLORS.emerald.hex,
  active: BRAND_COLORS.teal.hex,
  paused: BRAND_COLORS.amber.hex,
  completed: BRAND_COLORS.chartreuse.hex,
  terminated: BRAND_COLORS.ruby.hex,
  archived: '#475569',
}

export const STEP_STATUS_COLORS: Record<string, string> = {
  not_started: '#64748B',
  in_progress: BRAND_COLORS.teal.hex,
  blocked: BRAND_COLORS.ruby.hex,
  completed: BRAND_COLORS.chartreuse.hex,
  skipped: '#475569',
}

export const PRIORITY_COLORS: Record<string, string> = {
  low: '#64748B',
  medium: BRAND_COLORS.teal.hex,
  high: BRAND_COLORS.amber.hex,
  urgent: BRAND_COLORS.ruby.hex,
  blocker: BRAND_COLORS.ruby.hex,
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const

export const RADII = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const
```

---

## Part 3: Atomic Components

All components live in `src/components/ui/`. Each file exports a single named component.

### 3.1 NeuCard

**File: `src/components/ui/NeuCard.tsx`**

```typescript
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface NeuCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface variant */
  variant?: 'raised' | 'raised-sm' | 'pressed' | 'flat'
  /** Enable hover lift effect */
  hoverable?: boolean
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Make the card clickable (adds cursor and hover) */
  as?: 'div' | 'button' | 'article'
}
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'raised' \| 'raised-sm' \| 'pressed' \| 'flat'` | `'raised'` | Surface level |
| `hoverable` | `boolean` | `false` | Adds hover lift + shadow intensify |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `as` | `'div' \| 'button' \| 'article'` | `'div'` | HTML element to render |

**CSS classes used:**
- `neu-raised` / `neu-raised-sm` / `neu-pressed` / `neu-flat` (from neumorphic.css)
- `neu-card-hover` (when `hoverable`)
- Padding: `p-[var(--space-sm)]`, `p-[var(--space-md)]`, `p-[var(--space-lg)]`

**Interaction states:**
- Default: shadow per variant
- Hover (when hoverable): `--shadow-card-hover`, translateY(-1px)
- Focus (when button): ring with `--border-focus`
- Active (when button): pressed shadow

---

### 3.2 NeuButton

**File: `src/components/ui/NeuButton.tsx`**

```typescript
export interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style */
  variant?: 'primary' | 'ghost' | 'danger' | 'success'
  /** Size */
  size?: 'sm' | 'md' | 'lg'
  /** Optional left icon (Lucide component) */
  icon?: React.ReactNode
  /** Show loading spinner */
  loading?: boolean
  /** Full width */
  fullWidth?: boolean
}
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'ghost' \| 'danger' \| 'success'` | `'primary'` | Color scheme |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height: sm=32px, md=40px, lg=48px |
| `icon` | `ReactNode` | - | Left-aligned icon |
| `loading` | `boolean` | `false` | Shows spinner, disables clicks |
| `fullWidth` | `boolean` | `false` | `width: 100%` |

**Styles by variant:**
- `primary`: `background: var(--teal)`, `color: white`, shadow: `--shadow-raised-sm`
- `ghost`: `background: transparent`, `color: var(--text-secondary)`, no shadow
- `danger`: `background: var(--ruby)`, `color: white`, shadow: `--shadow-raised-sm`
- `success`: `background: var(--emerald)`, `color: white`, shadow: `--shadow-raised-sm`

**Interaction states:**
- Rest: raised shadow (for non-ghost)
- Hover: stronger shadow, slight translateY(-1px)
- Active/Click: pressed shadow, translateY(1px) (the "push" effect)
- Disabled: opacity 0.5, cursor not-allowed, no shadow
- Loading: spinner replaces icon, disabled state

---

### 3.3 NeuInput

**File: `src/components/ui/NeuInput.tsx`**

```typescript
export interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  label?: string
  /** Error message displayed below the input */
  error?: string
  /** Helper text displayed below the input (when no error) */
  helperText?: string
  /** Left icon */
  icon?: React.ReactNode
}

export interface NeuTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}
```

**Two exports from this file: `NeuInput` and `NeuTextarea`**

**Styles:**
- Container: always pressed/concave (`--shadow-pressed`, `--bg-input`)
- Text: `color: var(--text-primary)`
- Placeholder: `color: var(--text-placeholder)`
- Label: `font-size: 12px`, `font-weight: 600`, `color: var(--text-secondary)`, `margin-bottom: 6px`
- Error: `font-size: 12px`, `color: var(--ruby)`, `margin-top: 4px`
- Helper: `font-size: 12px`, `color: var(--text-muted)`, `margin-top: 4px`
- Border: `1px solid var(--border)` at rest

**Interaction states:**
- Focus: `border-color: var(--teal)`, `box-shadow: var(--shadow-pressed), 0 0 0 2px rgba(26,139,122,0.3)`
- Error state: `border-color: var(--ruby)`, `box-shadow: var(--shadow-pressed), 0 0 0 2px rgba(166,29,58,0.3)`
- Disabled: `opacity: 0.5`, `cursor: not-allowed`

---

### 3.4 NeuSelect

**File: `src/components/ui/NeuSelect.tsx`**

```typescript
export interface NeuSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}
```

**Styles:** Same concave style as NeuInput. Custom dropdown arrow using Lucide `ChevronDown` icon positioned absolutely.

---

### 3.5 NeuBadge

**File: `src/components/ui/NeuBadge.tsx`**

```typescript
export interface NeuBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color scheme — maps to brand colors */
  color: 'emerald' | 'teal' | 'sapphire' | 'amethyst' | 'ruby' | 'amber' | 'chartreuse' | 'gray'
  /** Size */
  size?: 'sm' | 'md'
  /** Optional dot indicator (no text, just a colored circle) */
  dot?: boolean
}
```

**Styles per color:**
- Background: the color's `*-bg` variable (e.g., `rgba(27,107,74,0.15)` for emerald)
- Text: the color's main variable (e.g., `var(--emerald)`)
- Shadow: `2px 2px 4px rgba(0,0,0,0.15), -1px -1px 3px rgba(255,255,255,0.05)` (dark) / `2px 2px 4px rgba(0,0,0,0.06), -1px -1px 3px rgba(255,255,255,0.5)` (light)
- Border radius: `var(--radius-full)` (pill shape)
- Padding: sm = `2px 8px`, md = `4px 12px`
- Font: `font-weight: 600`, `font-size: 11px` (sm) / `12px` (md), `text-transform: uppercase`, `letter-spacing: 0.5px`

---

### 3.6 NeuTabs

**File: `src/components/ui/NeuTabs.tsx`**

```typescript
export interface NeuTabsProps {
  /** Tab definitions */
  tabs: { id: string; label: string; icon?: React.ReactNode; count?: number }[]
  /** Currently active tab ID */
  activeTab: string
  /** Callback when tab changes */
  onTabChange: (tabId: string) => void
  /** Size */
  size?: 'sm' | 'md'
}
```

**Styles:**
- Container (the "trough"): concave/pressed (`--shadow-pressed`, `--bg-body`), `border-radius: var(--radius-lg)`, `padding: 4px`
- Inactive tab: `background: transparent`, `color: var(--text-muted)`, no shadow
- Active tab: `background: var(--bg-surface)`, `color: var(--text-primary)`, `box-shadow: var(--shadow-raised-sm)`, `border-radius: var(--radius-md)`
- Hover (inactive): `color: var(--text-secondary)`
- Count badge: small `NeuBadge` color="gray" inside the tab

**Interaction:** Clicking an inactive tab calls `onTabChange`. Active tab has the raised neumorphic look. Tabs are flexed horizontally and scrollable on overflow.

---

### 3.7 NeuCheckbox

**File: `src/components/ui/NeuCheckbox.tsx`**

```typescript
export interface NeuCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  color?: 'teal' | 'emerald' | 'ruby'
}
```

**Styles:**
- Unchecked box: 20x20px, `--shadow-pressed` (concave), `--bg-input`, `border: 1px solid var(--border)`, `border-radius: var(--radius-sm)`
- Checked box: `background: var(--teal)` (or specified color), `box-shadow: var(--shadow-raised-sm)`, check icon (Lucide `Check`) in white
- Label: `color: var(--text-primary)`, `font-size: 14px`, `margin-left: 8px`
- Disabled: `opacity: 0.5`

---

### 3.8 NeuToggle

**File: `src/components/ui/NeuToggle.tsx`**

```typescript
export interface NeuToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  disabled?: boolean
}
```

**Styles:**
- Track: 44x24px, `--shadow-pressed` (concave), `border-radius: var(--radius-full)`, `--bg-input`
- Track (enabled): `background: var(--teal)`
- Knob: 20x20px circle, `--shadow-raised-sm`, `background: var(--bg-surface)`, positioned left (off) or right (on) with `transition: transform var(--transition-base)`
- Label: same as NeuCheckbox label

---

### 3.9 NeuProgress

**File: `src/components/ui/NeuProgress.tsx`**

```typescript
export interface NeuProgressProps {
  /** Progress value 0-100 */
  value: number
  /** Max value (default 100) */
  max?: number
  /** Color of the filled bar */
  color?: 'teal' | 'emerald' | 'amber' | 'ruby' | 'chartreuse'
  /** Height */
  size?: 'sm' | 'md'
  /** Show percentage text */
  showLabel?: boolean
}
```

**Styles:**
- Track (outer): `height: 8px` (sm) / `12px` (md), `--shadow-pressed` (concave), `--bg-input`, `border-radius: var(--radius-full)`
- Fill bar: `height: 100%`, `background: var(--teal)` (or specified color), `box-shadow: var(--shadow-raised-sm)`, `border-radius: var(--radius-full)`, `width: {value}%`, `transition: width var(--transition-slow)`
- Label: positioned to the right, `font-size: 12px`, `font-weight: 600`, `color: var(--text-secondary)`

---

### 3.10 NeuAvatar

**File: `src/components/ui/NeuAvatar.tsx`**

```typescript
export interface NeuAvatarProps {
  /** Full name (used for initials fallback) */
  name: string
  /** Image URL */
  src?: string
  /** Size */
  size?: 'sm' | 'md' | 'lg'
  /** Color for initials background */
  color?: string
}
```

**Styles:**
- Container: circle, `--shadow-raised-sm`, sizes: sm=32px, md=40px, lg=48px
- With image: `<img>` filling the circle, `object-fit: cover`
- Without image (initials): 1-2 letters from name, centered, `font-weight: 600`, `color: white`, background = hash of name to pick from brand colors
- `border-radius: var(--radius-full)`

---

### 3.11 NeuModal

**File: `src/components/ui/NeuModal.tsx`**

```typescript
export interface NeuModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Callback to close */
  onClose: () => void
  /** Modal title */
  title: string
  /** Modal description (below title) */
  description?: string
  /** Max width of the modal content */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Content */
  children: React.ReactNode
  /** Footer actions (buttons) */
  footer?: React.ReactNode
}
```

**Styles:**
- Backdrop: `position: fixed`, `inset: 0`, `background: var(--overlay)`, `z-index: 50`, `backdrop-filter: blur(4px)`
- Content: centered (flex), `background: var(--bg-surface)`, `box-shadow: var(--shadow-raised)`, `border-radius: var(--radius-lg)`, `padding: var(--space-lg)`, max-width by size: sm=400px, md=560px, lg=720px, xl=900px
- Title: `font-family: var(--font-display)`, `font-size: 20px`, `font-weight: 600`, `color: var(--text-primary)`
- Description: `font-size: 14px`, `color: var(--text-secondary)`, `margin-top: 4px`
- Close button: top-right, Lucide `X` icon, `NeuButton variant="ghost" size="sm"`
- Footer: `border-top: 1px solid var(--border)`, `padding-top: var(--space-md)`, `display: flex`, `gap: var(--space-sm)`, `justify-content: flex-end`

**Interaction:**
- Opens with fade-in + scale from 0.95 (use motion/framer-motion `AnimatePresence`)
- Closes on: backdrop click, close button, Escape key
- Focus trap: first focusable element gets focus on open
- Scroll: if content overflows, body of modal scrolls (header/footer fixed)

---

### 3.12 NeuToast

**File: `src/components/ui/NeuToast.tsx`**

```typescript
export interface NeuToastProps {
  /** Toast message */
  message: string
  /** Type determines icon and color */
  type: 'success' | 'error' | 'warning' | 'info'
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number
  /** Callback when dismissed */
  onDismiss: () => void
}

/** Toast container + manager */
export interface ToastManagerProps {
  children: React.ReactNode
}
```

**Two exports: `NeuToast` (individual) and `ToastProvider` / `useToast` hook.**

**Styles:**
- Container: `position: fixed`, `bottom: var(--space-lg)`, `right: var(--space-lg)`, `z-index: 60`
- Toast: `background: var(--bg-surface)`, `box-shadow: var(--shadow-raised)`, `border-radius: var(--radius-md)`, `padding: 12px 16px`, `display: flex`, `align-items: center`, `gap: 12px`, `min-width: 300px`, `max-width: 480px`
- Icon: 20px, color by type: success=chartreuse, error=ruby, warning=amber, info=teal. Icons: success=CheckCircle, error=XCircle, warning=AlertTriangle, info=Info
- Message: `font-size: 14px`, `color: var(--text-primary)`
- Dismiss button: Lucide `X`, `NeuButton variant="ghost" size="sm"`
- Left border accent: `4px solid var(--{type-color})`

**Behavior:**
- Enter: slide-in from right (motion)
- Auto-dismiss after `duration` ms (default 5000)
- Multiple toasts stack vertically with `gap: var(--space-sm)`
- Max 3 visible toasts, oldest auto-dismissed

---

### 3.13 NeuSkeleton

**File: `src/components/ui/NeuSkeleton.tsx`**

```typescript
export interface NeuSkeletonProps {
  /** Width */
  width?: string | number
  /** Height */
  height?: string | number
  /** Shape */
  variant?: 'text' | 'rectangular' | 'circular'
}
```

**Styles:**
- Background: `var(--bg-input)`
- Shadow: `var(--shadow-pressed)` (concave)
- Animation: pulse (opacity oscillates between 0.4 and 1.0, 1.5s infinite)
- Border radius: text = var(--radius-sm), rectangular = var(--radius-md), circular = var(--radius-full)
- Text default height: 16px, width: 100%

---

## Part 4: Utility Function

### File: `src/lib/utils.ts`

This file should already exist or be created. Ensure it contains:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with clsx conditional logic */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number as USD currency */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/** Format a number with commas */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/** Get initials from a name (first + last) */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
```

---

## Verification Checklist

| Check | How | Expected |
|-------|-----|----------|
| `neumorphic.css` imports correctly | `npm run build` | No CSS import errors |
| Fonts load | Open browser, inspect `<html>` | `--font-display` and `--font-body` CSS vars present |
| Dark mode variables | Set `data-theme="dark"`, inspect `--bg-body` | `#0A0F1A` |
| Light mode variables | Set `data-theme="light"`, inspect `--bg-body` | `#E8EDF2` |
| NeuCard renders | Import and render `<NeuCard>Hello</NeuCard>` | Visible raised card |
| NeuButton press effect | Click a NeuButton | Shadow inverts on press |
| NeuInput concave | Render `<NeuInput label="Test" />` | Visibly recessed input |
| NeuBadge all colors | Render all 8 color variants | Correct bg + text colors |
| NeuModal opens/closes | Toggle NeuModal open state | Overlay, centered content, escape closes |
| NeuProgress animates | Change value from 0 to 75 | Bar slides to 75% |
| All components dark + light | Toggle theme | All components change appearance correctly |
| `npm run build` passes | `npm run build` | Zero errors |

---

## Files Created

| File | Purpose |
|------|---------|
| `src/styles/neumorphic.css` | All CSS custom properties + utility classes |
| `src/lib/design-system.ts` | TypeScript constants for colors, spacing, radii |
| `src/lib/utils.ts` | Utility functions (cn, formatCurrency, etc.) |
| `src/components/ui/NeuCard.tsx` | Raised/pressed/flat card wrapper |
| `src/components/ui/NeuButton.tsx` | Button with primary/ghost/danger/success variants |
| `src/components/ui/NeuInput.tsx` | Text input + Textarea (concave style) |
| `src/components/ui/NeuSelect.tsx` | Dropdown select (concave style) |
| `src/components/ui/NeuBadge.tsx` | Colored pill badges |
| `src/components/ui/NeuTabs.tsx` | Tab bar (pressed container, raised active) |
| `src/components/ui/NeuCheckbox.tsx` | Checkbox (concave unchecked, raised checked) |
| `src/components/ui/NeuToggle.tsx` | Toggle switch (pressed track, raised knob) |
| `src/components/ui/NeuProgress.tsx` | Progress bar (pressed track, raised fill) |
| `src/components/ui/NeuAvatar.tsx` | Avatar circle (image or initials) |
| `src/components/ui/NeuModal.tsx` | Modal overlay with focus trap |
| `src/components/ui/NeuToast.tsx` | Toast notifications + provider |
| `src/components/ui/NeuSkeleton.tsx` | Loading skeleton placeholder |

---

## Database Tables/Views Used

None. This spec is pure frontend.

---

## tRPC Routes Used

None. This spec is pure frontend.
