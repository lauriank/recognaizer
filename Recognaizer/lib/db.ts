// Database abstraction layer
// In production, replace with Supabase client or your database of choice

interface User {
  id: string
  email: string
  displayName: string
  passwordHash: string
  isPro: boolean
  streak: number
  totalScore: number
  createdAt: Date
}

interface ContentItem {
  id: string
  type: 'image' | 'text' | 'video'
  content: string
  sourceHash?: string
  actualType: 'ai' | 'human'
  hint: 'ai' | 'human'
  explanation?: string
  createdAt: Date
}

interface Swipe {
  id: string
  userId: string
  contentId: string
  verdictByUser: 'ai' | 'human'
  correctVerdict: 'ai' | 'human'
  correct: boolean
  explanation: string
  confidence?: number
  timestamp: Date
}

interface Badge {
  id: string
  userId: string
  badgeType: string
  awardedAt: Date
}

// In-memory storage for development
// Replace with actual database calls in production
const users: Map<string, User> = new Map()
const contentItems: Map<string, ContentItem> = new Map()
const swipes: Map<string, Swipe> = new Map()
const badges: Map<string, Badge[]> = new Map()

export const db = {
  // User operations
  async getUser(id: string): Promise<User | null> {
    return users.get(id) || null
  },

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of users.values()) {
      if (user.email === email) return user
    }
    return null
  },

  async createUser(data: {
    email: string
    passwordHash: string
    displayName: string
    isPro: boolean
    streak?: number
    totalScore?: number
  }): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: data.email,
      displayName: data.displayName,
      passwordHash: data.passwordHash,
      isPro: data.isPro,
      streak: data.streak || 0,
      totalScore: data.totalScore || 0,
      createdAt: new Date(),
    }
    users.set(user.id, user)
    return user
  },

  async updateUserStats(userId: string, stats: { streak?: number; totalScore?: number }): Promise<void> {
    const user = users.get(userId)
    if (user) {
      if (stats.streak !== undefined) user.streak = stats.streak
      if (stats.totalScore !== undefined) user.totalScore = stats.totalScore
      users.set(userId, user)
    }
  },

  // Content operations
  async getContentItem(id: string): Promise<ContentItem | null> {
    return contentItems.get(id) || null
  },

  async getNextContentItem(userId: string): Promise<ContentItem | null> {
    // Get content user hasn't swiped yet
    const swipedIds = new Set(
      Array.from(swipes.values())
        .filter(s => s.userId === userId)
        .map(s => s.contentId)
    )

    for (const item of contentItems.values()) {
      if (!swipedIds.has(item.id)) {
        return item
      }
    }

    // If all content swiped, return random item
    const items = Array.from(contentItems.values())
    return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null
  },

  async createContentItem(data: {
    type: 'image' | 'text' | 'video'
    content: string
    sourceHash?: string
    actualType: 'ai' | 'human'
    hint: 'ai' | 'human'
    explanation?: string
  }): Promise<ContentItem> {
    const item: ContentItem = {
      id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: data.type,
      content: data.content,
      sourceHash: data.sourceHash,
      actualType: data.actualType,
      hint: data.hint,
      explanation: data.explanation,
      createdAt: new Date(),
    }
    contentItems.set(item.id, item)
    return item
  },

  // Swipe operations
  async getSwipe(userId: string, contentId: string): Promise<Swipe | null> {
    for (const swipe of swipes.values()) {
      if (swipe.userId === userId && swipe.contentId === contentId) {
        return swipe
      }
    }
    return null
  },

  async getSwipesToday(userId: string): Promise<number> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return Array.from(swipes.values()).filter(s => {
      if (s.userId !== userId) return false
      const swipeDate = new Date(s.timestamp)
      swipeDate.setHours(0, 0, 0, 0)
      return swipeDate.getTime() === today.getTime()
    }).length
  },

  async createSwipe(data: {
    userId: string
    contentId: string
    verdictByUser: 'ai' | 'human'
    correctVerdict: 'ai' | 'human'
    correct: boolean
    explanation: string
    confidence?: number
  }): Promise<Swipe> {
    const swipe: Swipe = {
      id: `swipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      contentId: data.contentId,
      verdictByUser: data.verdictByUser,
      correctVerdict: data.correctVerdict,
      correct: data.correct,
      explanation: data.explanation,
      confidence: data.confidence,
      timestamp: new Date(),
    }
    swipes.set(swipe.id, swipe)
    return swipe
  },

  // Badge operations
  async getUserBadges(userId: string): Promise<Badge[]> {
    return badges.get(userId) || []
  },

  async awardBadge(userId: string, badgeType: string): Promise<void> {
    const userBadges = badges.get(userId) || []
    if (userBadges.some(b => b.badgeType === badgeType)) {
      return // Already awarded
    }
    
    const badge: Badge = {
      id: `badge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      badgeType,
      awardedAt: new Date(),
    }
    userBadges.push(badge)
    badges.set(userId, userBadges)
  },

  // History
  async getUserHistory(userId: string): Promise<any[]> {
    const userSwipes = Array.from(swipes.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 100)

    return userSwipes.map(swipe => {
      const content = contentItems.get(swipe.contentId)
      return {
        id: swipe.id,
        contentId: swipe.contentId,
        type: content?.type,
        content: content?.content,
        verdict: swipe.verdictByUser,
        correct: swipe.correct,
        explanation: swipe.explanation,
        timestamp: swipe.timestamp,
      }
    })
  },

  // Leaderboard
  async getLeaderboard(limit: number = 100): Promise<any[]> {
    return Array.from(users.values())
      .map(user => ({
        userId: user.id,
        displayName: user.displayName,
        totalScore: user.totalScore,
        streak: user.streak,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
  },

  // Daily streaks
  async getDailyStreaks(userId: string): Promise<number[]> {
    // Simplified: return array of consecutive days with swipes
    const userSwipes = Array.from(swipes.values())
      .filter(s => s.userId === userId)
      .map(s => {
        const date = new Date(s.timestamp)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })

    const uniqueDays = Array.from(new Set(userSwipes)).sort((a, b) => b - a)
    return uniqueDays.map(() => 1) // Simplified
  },
}

