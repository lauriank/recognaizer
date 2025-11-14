import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { calculateLevel } from '@/lib/levels'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.getUser(userId)
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    const level = calculateLevel(user.totalScore)
    const badges = await db.getUserBadges(userId)

    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      isPro: user.isPro,
      streak: user.streak,
      totalScore: user.totalScore,
      level,
      badges: badges.map(b => b.badgeType),
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

