'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserProvider, useUser } from '@/lib/userContext'
import { getUserHistory, logout } from '@/lib/api'
import { checkAuth } from '@/lib/auth'

interface HistoryItem {
  id: string
  contentId: string
  type?: string
  content?: string
  verdict: string
  correct: boolean
  explanation: string
  timestamp: string
}

function ProfileContent() {
  const { user } = useUser()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const authenticated = await checkAuth()
      if (!authenticated) {
        router.push('/')
        return
      }

      try {
        const hist = await getUserHistory()
        setHistory(hist)
      } catch (error) {
        console.error('Failed to load history:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <header className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="text-white/70 hover:text-white mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-clash text-teal mb-2">Profile</h1>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-white/50">Display Name:</span>
              <span className="ml-2 text-white">{user.displayName}</span>
            </div>
            <div>
              <span className="text-white/50">Email:</span>
              <span className="ml-2 text-white">{user.email}</span>
            </div>
            <div>
              <span className="text-white/50">Status:</span>
              <span className={`ml-2 ${user.isPro ? 'text-teal' : 'text-white'}`}>
                {user.isPro ? 'Recognaizer Pro' : 'Free'}
              </span>
            </div>
            {!user.isPro && (
              <a
                href="/premium"
                className="inline-block mt-4 px-6 py-2 bg-teal text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Upgrade to Pro
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-white/50 text-sm mb-2">Current Streak</div>
            <div className="text-3xl font-bold text-teal">{user.streak}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-white/50 text-sm mb-2">Total Score</div>
            <div className="text-3xl font-bold text-white">{user.totalScore}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-white/50 text-sm mb-2">Level</div>
            <div className="text-3xl font-bold text-white">{user.level}</div>
          </div>
        </div>

        {/* Badges */}
        {user.badges && user.badges.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Badges</h2>
            <div className="flex flex-wrap gap-3">
              {user.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-teal/20 border border-teal rounded-lg"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History (Pro feature) */}
        {user.isPro && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Content History</h2>
            {history.length === 0 ? (
              <p className="text-white/50">No history yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-white/50">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-sm ${
                          item.correct ? 'text-teal' : 'text-brown'
                        }`}
                      >
                        {item.correct ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    <div className="text-white/70 text-sm mb-1">
                      Verdict: {item.verdict === 'ai' ? 'AI' : 'Real'}
                    </div>
                    {item.explanation && (
                      <div className="text-white/50 text-xs mt-2">
                        {item.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-white/70">Vibration (Mobile)</span>
              <input
                type="checkbox"
                defaultChecked={localStorage.getItem('vibrationEnabled') !== 'false'}
                onChange={(e) => {
                  localStorage.setItem('vibrationEnabled', e.target.checked.toString())
                }}
                className="w-5 h-5"
              />
            </label>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-brown text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <UserProvider>
      <ProfileContent />
    </UserProvider>
  )
}

