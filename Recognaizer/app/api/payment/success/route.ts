import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')
    if (!sessionId) {
      redirect('/premium?error=no_session')
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status === 'paid' && session.client_reference_id) {
      // Update user to Pro
      const userId = session.client_reference_id
      const user = await db.getUser(userId)
      if (user) {
        // In production, you'd update the database here
        // For now, we'll just redirect
        redirect('/profile?upgraded=true')
      }
    }

    redirect('/premium?error=payment_failed')
  } catch (error) {
    console.error('Payment success handler error:', error)
    redirect('/premium?error=processing')
  }
}

