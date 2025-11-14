import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { calculateLevel, checkBadgeEligibility } from '@/lib/levels'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { contentId, verdict } = await request.json()

    if (!contentId || !verdict) {
      return NextResponse.json(
        { message: 'Missing contentId or verdict' },
        { status: 400 }
      )
    }

    // Get content item
    const content = await db.getContentItem(contentId)
    if (!content) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 404 }
      )
    }

    // Check if already swiped
    const existingSwipe = await db.getSwipe(userId, contentId)
    if (existingSwipe) {
      return NextResponse.json(
        { message: 'Already swiped' },
        { status: 400 }
      )
    }

    const correct = verdict === content.actualType
    const user = await db.getUser(userId)
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Update stats
    let newStreak = correct ? (user.streak + 1) : 0
    let newScore = user.totalScore + (correct ? 1 : 0)
    const newLevel = calculateLevel(newScore)

    await db.updateUserStats(userId, {
      streak: newStreak,
      totalScore: newScore,
    })

    // Check for badges
    const badges = checkBadgeEligibility(
      newStreak,
      newScore,
      await db.getDailyStreaks(userId)
    )
    
    for (const badge of badges) {
      await db.awardBadge(userId, badge)
    }

    // Save swipe
    await db.createSwipe({
      userId,
      contentId,
      verdictByUser: verdict,
      correctVerdict: content.actualType,
      correct,
      explanation: content.explanation || (correct 
        ? `Correct! This content is ${content.actualType === 'ai' ? 'AI-generated' : 'human-created'}.`
        : `Incorrect. This content is actually ${content.actualType === 'ai' ? 'AI-generated' : 'human-created'}.`),
    })

    return NextResponse.json({
      correct,
      explanation: content.explanation || (correct 
        ? `Correct! This content is ${content.actualType === 'ai' ? 'AI-generated' : 'human-created'}.`
        : `Incorrect. This content is actually ${content.actualType === 'ai' ? 'AI-generated' : 'human-created'}.`),
      newStreak,
      newScore,
      newLevel,
      badges: badges.length > 0 ? badges : undefined,
    })
  } catch (error) {
    console.error('Swipe error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

