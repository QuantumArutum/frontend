import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'website' } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get client info
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    if (!sql) {
      // Demo mode - just return success
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter',
        data: { email: trimmedEmail }
      });
    }

    // Check if already subscribed
    const existing = await sql`
      SELECT * FROM newsletter_subscriptions WHERE email = ${trimmedEmail}
    `;

    if (existing.length > 0) {
      const subscription = existing[0];
      
      if (subscription.status === 'active') {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed',
          data: { email: trimmedEmail, alreadySubscribed: true }
        });
      }

      // Reactivate subscription
      await sql`
        UPDATE newsletter_subscriptions 
        SET status = 'active', 
            unsubscribed_at = NULL,
            subscribed_at = CURRENT_TIMESTAMP,
            source = ${source}
        WHERE email = ${trimmedEmail}
      `;

      return NextResponse.json({
        success: true,
        message: 'Successfully resubscribed to newsletter',
        data: { email: trimmedEmail, resubscribed: true }
      });
    }

    // Create new subscription
    await sql`
      INSERT INTO newsletter_subscriptions (email, source, ip_address, user_agent)
      VALUES (${trimmedEmail}, ${source}, ${ip}, ${userAgent})
    `;

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: { email: trimmedEmail }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

// GET - Check subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!sql) {
      return NextResponse.json({
        success: true,
        data: { subscribed: false }
      });
    }

    const result = await sql`
      SELECT * FROM newsletter_subscriptions 
      WHERE email = ${email.toLowerCase()} AND status = 'active'
    `;

    return NextResponse.json({
      success: true,
      data: { subscribed: result.length > 0 }
    });

  } catch (error) {
    console.error('Check subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check subscription' },
      { status: 500 }
    );
  }
}
