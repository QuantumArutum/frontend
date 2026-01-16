import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!sql) {
      return NextResponse.json({
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      });
    }

    // Update subscription status
    const result = await sql`
      UPDATE newsletter_subscriptions 
      SET status = 'unsubscribed', 
          unsubscribed_at = CURRENT_TIMESTAMP
      WHERE email = ${trimmedEmail} AND status = 'active'
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Email not found or already unsubscribed'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
