'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserProvider } from '@/lib/userContext'
import SwipeGame from '@/components/SwipeGame'
import AuthModal from '@/components/AuthModal'
import ProfileButton from '@/components/ProfileButton'
import { checkAuth } from '@/lib/auth'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth()
      setIsAuthenticated(auth)
      setLoading(false)
      if (!auth) {
        setShowAuth(true)
      }
    }
    verifyAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <UserProvider>
      <main className="min-h-screen bg-black">
        <header className="w-full p-6 flex justify-between items-center border-b border-white/10">
          <h1 className="text-3xl font-clash text-teal">Recognaizer</h1>
          {isAuthenticated ? (
            <div className="flex gap-4 items-center">
              <a
                href="/upload"
                className="px-4 py-2 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm"
              >
                Upload
              </a>
              <ProfileButton onProfileClick={() => router.push('/profile')} />
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="px-6 py-2 bg-teal text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          )}
        </header>
        
        {isAuthenticated ? (
          <SwipeGame />
        ) : (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <h2 className="text-2xl mb-4">Welcome to Recognaizer</h2>
              <p className="text-white/70 mb-6">Sign in to start detecting AI content</p>
              <button
                onClick={() => setShowAuth(true)}
                className="px-8 py-3 bg-teal text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
        
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={() => {
              setIsAuthenticated(true)
              setShowAuth(false)
            }}
          />
        )}
      </main>
    </UserProvider>
  )
}

