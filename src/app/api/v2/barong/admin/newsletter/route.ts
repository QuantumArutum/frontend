import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// GET - List all newsletter subscriptions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    if (!sql) {
      // Demo mode - return mock data
      const mockSubscriptions = [
        {
          id: 1,
          email: 'demo1@example.com',
          status: 'active',
          source: 'footer',
          subscribed_at: new Date().toISOString(),
          ip_address: '127.0.0.1',
        },
        {
          id: 2,
          email: 'demo2@example.com',
          status: 'active',
          source: 'blog',
          subscribed_at: new Date().toISOString(),
          ip_address: '127.0.0.1',
        },
        {
          id: 3,
          email: 'demo3@example.com',
          status: 'unsubscribed',
          source: 'footer',
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: new Date().toISOString(),
          ip_address: '127.0.0.1',
        },
      ];

      return NextResponse.json({
        success: true,
        data: {
          subscriptions: mockSubscriptions,
          total: 3,
          page,
          limit,
          totalPages: 1,
        },
      });
    }

    // Build query based on filters
    let subscriptions;
    let countResult;

    if (search) {
      if (status === 'all') {
        subscriptions = await sql`
          SELECT * FROM newsletter_subscriptions 
          WHERE email ILIKE ${'%' + search + '%'}
          ORDER BY subscribed_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
        countResult = await sql`
          SELECT COUNT(*) as total FROM newsletter_subscriptions 
          WHERE email ILIKE ${'%' + search + '%'}
        `;
      } else {
        subscriptions = await sql`
          SELECT * FROM newsletter_subscriptions 
          WHERE email ILIKE ${'%' + search + '%'} AND status = ${status}
          ORDER BY subscribed_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
        countResult = await sql`
          SELECT COUNT(*) as total FROM newsletter_subscriptions 
          WHERE email ILIKE ${'%' + search + '%'} AND status = ${status}
        `;
      }
    } else if (status !== 'all') {
      subscriptions = await sql`
        SELECT * FROM newsletter_subscriptions 
        WHERE status = ${status}
        ORDER BY subscribed_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`
        SELECT COUNT(*) as total FROM newsletter_subscriptions WHERE status = ${status}
      `;
    } else {
      subscriptions = await sql`
        SELECT * FROM newsletter_subscriptions 
        ORDER BY subscribed_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`SELECT COUNT(*) as total FROM newsletter_subscriptions`;
    }

    const total = parseInt(countResult[0]?.total || '0');

    return NextResponse.json({
      success: true,
      data: {
        subscriptions,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get newsletter subscriptions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get subscriptions' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a subscription
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    if (!sql) {
      return NextResponse.json({
        success: true,
        message: 'Subscription deleted',
      });
    }

    await sql`DELETE FROM newsletter_subscriptions WHERE id = ${parseInt(id)}`;

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted',
    });
  } catch (error) {
    console.error('Delete subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscription' },
      { status: 500 }
    );
  }
}

// PATCH - Update subscription status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID and status are required' },
        { status: 400 }
      );
    }

    if (!['active', 'unsubscribed'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    if (!sql) {
      return NextResponse.json({
        success: true,
        message: 'Subscription updated',
      });
    }

    if (status === 'unsubscribed') {
      await sql`
        UPDATE newsletter_subscriptions 
        SET status = ${status}, unsubscribed_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE newsletter_subscriptions 
        SET status = ${status}, unsubscribed_at = NULL
        WHERE id = ${id}
      `;
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription updated',
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
