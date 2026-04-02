const KEY = 'plc-recently-viewed'
const MAX = 6

interface RecentAsset {
  id: string
  name: string
  reference_code: string | null
  current_phase: string | null
}

export function trackAssetView(asset: RecentAsset) {
  if (typeof window === 'undefined') return
  const current = getRecentAssets()
  const filtered = current.filter((a) => a.id !== asset.id)
  const next = [asset, ...filtered].slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function getRecentAssets(): RecentAsset[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as RecentAsset[]
  } catch {
    return []
  }
}
