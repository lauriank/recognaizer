import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/lib/auth-utils'
import { db } from '@/lib/db'

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

    if (user.isPro) {
      return NextResponse.json({ remaining: Infinity })
    }

    const swipesToday = await db.getSwipesToday(userId)
    const dailyLimit = parseInt(process.env.DAILY_FREE_SWIPES || '50')
    const remaining = Math.max(0, dailyLimit - swipesToday)

    return NextResponse.json({ remaining })
  } catch (error) {
    console.error('Get swipes remaining error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

