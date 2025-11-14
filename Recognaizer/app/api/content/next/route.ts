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

    // Check daily swipe limit
    const user = await db.getUser(userId)
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.isPro) {
      const swipesToday = await db.getSwipesToday(userId)
      const dailyLimit = parseInt(process.env.DAILY_FREE_SWIPES || '50')
      if (swipesToday >= dailyLimit) {
        return NextResponse.json(
          { message: 'Daily swipe limit reached' },
          { status: 429 }
        )
      }
    }

    // Get next content item
    const content = await db.getNextContentItem(userId)
    
    if (!content) {
      return NextResponse.json(
        { message: 'No content available' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: content.id,
      type: content.type,
      content: content.content,
      hint: content.hint,
      actualType: content.actualType,
    })
  } catch (error) {
    console.error('Get next content error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

