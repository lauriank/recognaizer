'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserProvider, useUser } from '@/lib/userContext'
import { checkAuth } from '@/lib/auth'

function PremiumContent() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuth()
      if (!authenticated) {
        router.push('/')
      }
    }
    verifyAuth()
  }, [router])

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Subscription failed:', error)
      alert('Failed to start subscription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (user?.isPro) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-clash text-teal mb-4">You're Already Pro!</h1>
          <p className="text-white/70 mb-6">You have access to all Recognaizer Pro features.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-teal text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to App
          </button>
        </div>
      </div>
    )
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
        <h1 className="text-3xl font-clash text-teal mb-2">Recognaizer Pro</h1>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Unlock Premium Features</h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">🔍</div>
              <div>
                <h3 className="font-bold mb-2">DeepScan™</h3>
                <p className="text-white/70">
                  Advanced AI analysis with confidence percentages and detailed explanations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-2xl">📤</div>
              <div>
                <h3 className="font-bold mb-2">Upload Mode</h3>
                <p className="text-white/70">
                  Upload your own images, text, or video clips for analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-2xl">📚</div>
              <div>
                <h3 className="font-bold mb-2">Content History</h3>
                <p className="text-white/70">
                  Save and review all your analyzed content with full explanations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-2xl">∞</div>
              <div>
                <h3 className="font-bold mb-2">Unlimited Swipes</h3>
                <p className="text-white/70">
                  No daily limits. Swipe as much as you want, whenever you want.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-2xl">📊</div>
              <div>
                <h3 className="font-bold mb-2">Advanced Insights</h3>
                <p className="text-white/70">
                  Detailed reports and analytics on detection patterns and accuracy.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 bg-teal text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-lg font-bold"
          >
            {loading ? 'Processing...' : 'Subscribe to Recognaizer Pro'}
          </button>

          <p className="text-white/50 text-sm mt-4 text-center">
            Subscription managed securely through Stripe
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PremiumPage() {
  return (
    <UserProvider>
      <PremiumContent />
    </UserProvider>
  )
}

