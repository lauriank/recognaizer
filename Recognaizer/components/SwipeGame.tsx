'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import SwipeCard from './SwipeCard'
import FeedbackOverlay from './FeedbackOverlay'
import StatsBar from './StatsBar'
import { swipeContent, getNextContent } from '@/lib/api'
import { useUser } from '@/lib/userContext'

interface ContentItem {
  id: string
  type: 'image' | 'text' | 'video'
  content: string
  hint: 'ai' | 'human'
  actualType: 'ai' | 'human'
  explanation?: string
}

export default function SwipeGame() {
  const [currentContent, setCurrentContent] = useState<ContentItem | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackData, setFeedbackData] = useState<{ correct: boolean; explanation: string } | null>(null)
  const [swipesRemaining, setSwipesRemaining] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, updateUser } = useUser()

  useEffect(() => {
    loadNextContent()
    fetchSwipesRemaining()
  }, [])

  const loadNextContent = async () => {
    try {
      const content = await getNextContent()
      setCurrentContent(content)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load content:', error)
      setLoading(false)
    }
  }

  const fetchSwipesRemaining = async () => {
    try {
      const response = await fetch('/api/user/swipes-remaining')
      if (response.ok) {
        const data = await response.json()
        setSwipesRemaining(data.remaining)
      }
    } catch (error) {
      console.error('Failed to fetch swipes remaining:', error)
    }
  }

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentContent) return

    const userVerdict = direction === 'right' ? 'ai' : 'human'
    
    try {
      const result = await swipeContent(currentContent.id, userVerdict)
      
      setFeedbackData({
        correct: result.correct,
        explanation: result.explanation || ''
      })
      setShowFeedback(true)

      // Update user stats
      if (updateUser && user) {
        updateUser({
          streak: result.newStreak ?? user.streak,
          totalScore: result.newScore ?? user.totalScore,
          level: result.newLevel ?? user.level
        })
      }

      // Haptic feedback (if enabled)
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        const settings = localStorage.getItem('vibrationEnabled')
        if (settings !== 'false') {
          navigator.vibrate(50)
        }
      }

      // Hide feedback after 2 seconds and load next content
      setTimeout(() => {
        setShowFeedback(false)
        setSwipesRemaining(prev => (prev !== null && prev > 0 ? prev - 1 : prev))
        loadNextContent()
      }, 2000)
    } catch (error) {
      console.error('Swipe failed:', error)
      alert('Failed to process swipe. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white/70">Loading content...</div>
      </div>
    )
  }

  if (swipesRemaining !== null && swipesRemaining <= 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl mb-4">Daily Swipe Limit Reached</h2>
          <p className="text-white/70 mb-6">
            You've used all {process.env.NEXT_PUBLIC_DAILY_SWIPES || 50} free swipes today.
          </p>
          {!user?.isPro && (
            <a
              href="/premium"
              className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Upgrade to Pro for Unlimited Swipes
            </a>
          )}
        </div>
      </div>
    )
  }

  if (!currentContent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white/70">No content available</div>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col items-center justify-center p-4">
      <StatsBar 
        streak={user?.streak || 0}
        level={user?.level || 'Beginner'}
        swipesRemaining={swipesRemaining}
      />
      
      <div className="relative w-full max-w-md h-[600px] mt-8">
        <SwipeCard
          content={currentContent}
          onSwipe={handleSwipe}
        />
      </div>

      {showFeedback && feedbackData && (
        <FeedbackOverlay
          correct={feedbackData.correct}
          explanation={feedbackData.explanation}
        />
      )}

      <div className="mt-8 flex gap-8">
        <button
          onClick={() => handleSwipe('left')}
          className="group px-8 py-4 border-2 border-white/20 rounded-lg hover:border-white/40 transition-all"
          aria-label="Swipe Left - Real/Human"
        >
          <span className="text-2xl group-hover:text-teal transition-colors">←</span>
          <div className="text-sm mt-2 text-white/70">Real</div>
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="group px-8 py-4 border-2 border-white/20 rounded-lg hover:border-white/40 transition-all"
          aria-label="Swipe Right - AI"
        >
          <span className="text-2xl group-hover:text-teal transition-colors">→</span>
          <div className="text-sm mt-2 text-white/70">AI</div>
        </button>
      </div>
    </div>
  )
}

