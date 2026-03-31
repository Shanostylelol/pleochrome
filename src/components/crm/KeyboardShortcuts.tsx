'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const IGNORED_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

function isEditable(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false
  if (IGNORED_TAGS.has(el.tagName)) return true
  if (el.isContentEditable) return true
  return false
}

/**
 * Global keyboard shortcut handler for the CRM.
 *
 * Shortcuts:
 *   N         → Navigate to new asset page
 *   T         → Navigate to tasks page
 *   Cmd+K     → Dispatch Cmd+K (caught by CRMHeader for search)
 *
 * All single-key shortcuts are ignored when an input, textarea,
 * select, or contenteditable element is focused.
 */
export function KeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K / Ctrl+K — search (re-dispatch so CRMHeader catches it)
      // CRMHeader already has its own Cmd+K handler, so we don't
      // need to do anything extra here. This component handles
      // the single-key shortcuts only.

      // Skip single-key shortcuts when inside editable elements
      if (isEditable(e.target)) return

      // Skip if any modifier is held (except shift, which we also skip for safety)
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault()
          router.push('/crm/assets/new')
          break
        case 't':
          e.preventDefault()
          router.push('/crm/tasks')
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [router])

  // Render nothing — this is a side-effect-only component
  return null
}
