'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { trpc } from '@/lib/trpc'

interface CurrentUser {
  id: string
  full_name: string
  email: string
  role: string
}

const CurrentUserContext = createContext<CurrentUser>({
  id: '', full_name: '...', email: '', role: '',
})

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { data } = trpc.team.getCurrentUser.useQuery()
  const user: CurrentUser = data
    ? { id: data.id, full_name: data.full_name ?? '...', email: data.email ?? '', role: data.role ?? '' }
    : { id: '', full_name: '...', email: '', role: '' }

  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUser() {
  return useContext(CurrentUserContext)
}
