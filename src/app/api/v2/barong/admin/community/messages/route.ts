/**
 * Private Messages & Conversations API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService } from '@/lib/communityService';

// GET - List messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const userId = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || undefined;

    if (type === 'all' || type === 'admin') {
      const result = await communityService.getAllMessages({ page, limit, search });
      return NextResponse.json({
        success: true,
        data: {
          messages: result.messages,
          total: result.total,
        },
      });
    }

    if (type === 'inbox' && userId) {
      const result = await communityService.getMessages(userId, 'inbox', page, limit);
      return NextResponse.json({
        success: true,
        data: {
          messages: result.messages,
          total: result.total,
        },
      });
    }

    if (type === 'sent' && userId) {
      const result = await communityService.getMessages(userId, 'sent', page, limit);
      return NextResponse.json({
        success: true,
        data: {
          messages: result.messages,
          total: result.total,
        },
      });
    }

    if (type === 'stats') {
      const allMessages = await communityService.getAllMessages({ page: 1, limit: 1 });
      return NextResponse.json({
        success: true,
        data: {
          total_messages: allMessages.total,
        },
      });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Messages GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Send message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sender_id, receiver_id, subject, content } = body;

    if (action === 'send' || !action) {
      const message = await communityService.sendMessage(sender_id, receiver_id, subject, content);
      return NextResponse.json({ success: true, data: message });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Messages POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Mark message as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (action === 'read') {
      const success = await communityService.markMessageRead(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Messages PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (id) {
      const success = await communityService.deleteMessage(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
  } catch (error: any) {
    console.error('Messages DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
