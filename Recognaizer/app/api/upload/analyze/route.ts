import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { detectText, detectImage, detectVideo } from '@/lib/detection'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.getUser(userId)
    if (!user || !user.isPro) {
      return NextResponse.json(
        { message: 'Premium feature. Upgrade to Recognaizer Pro.' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const type = formData.get('type') as string
    const file = formData.get('file') as File | null
    const text = formData.get('text') as string | null

    if (!type || (!file && !text)) {
      return NextResponse.json(
        { message: 'Missing type or content' },
        { status: 400 }
      )
    }

    let result
    if (type === 'text' && text) {
      result = await detectText(text)
    } else if (type === 'image' && file) {
      // In production, upload file and get URL
      const imageUrl = URL.createObjectURL(file)
      result = await detectImage(imageUrl)
    } else if (type === 'video' && file) {
      const videoUrl = URL.createObjectURL(file)
      result = await detectVideo(videoUrl)
    } else {
      return NextResponse.json(
        { message: 'Invalid type or content' },
        { status: 400 }
      )
    }

    // Save to history
    const contentItem = await db.createContentItem({
      type: type as 'image' | 'text' | 'video',
      content: text || (file ? file.name : ''),
      actualType: result.verdict,
      hint: result.verdict,
    })

    await db.createSwipe({
      userId,
      contentId: contentItem.id,
      verdictByUser: result.verdict,
      correctVerdict: result.verdict,
      correct: true,
      explanation: result.explanation,
      confidence: result.confidence,
    })

    return NextResponse.json({
      verdict: result.verdict,
      confidence: result.confidence,
      explanation: result.explanation,
      cues: result.cues,
      disclaimer: 'Indicative — not definitive. Use with caution.',
    })
  } catch (error) {
    console.error('Upload analyze error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

