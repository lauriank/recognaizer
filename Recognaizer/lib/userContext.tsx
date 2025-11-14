'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { checkAuth, getAuthToken } from './auth'

interface User {
  id: string
  email: string
  displayName: string
  isPro: boolean
  streak: number
  totalScore: number
  level: string
  badges?: string[]
}

interface UserContextType {
  user: User | null
  updateUser: (updates: Partial<User>) => void
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const refreshUser = async () => {
    const token = getAuthToken()
    if (!token) {
      setUser(null)
      return
    }

    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }

  useEffect(() => {
    const init = async () => {
      const authenticated = await checkAuth()
      if (authenticated) {
        await refreshUser()
      }
    }
    init()
  }, [])

  return (
    <UserContext.Provider value={{ user, updateUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

