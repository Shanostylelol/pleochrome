'use client'

import { cn } from '@/lib/utils'

export interface NeuAvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

const avatarColors = ['#1B6B4A', '#1A8B7A', '#1E3A6E', '#5B2D8E', '#C47A1A', '#A61D3A', '#7BA31E']

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function hashColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export function NeuAvatar({ name, src, size = 'md', color }: NeuAvatarProps) {
  const bg = color || hashColor(name)

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full shadow-[var(--shadow-raised-sm)] overflow-hidden font-semibold text-white shrink-0',
        sizeMap[size]
      )}
      style={{ backgroundColor: src ? undefined : bg }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  )
}
