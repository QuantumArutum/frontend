/**
 * Community Activities & Events API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService } from '@/lib/communityService';

// GET - List activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'events';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || undefined;

    if (type === 'events') {
      const result = await communityService.getEvents(status, page, limit);
      return NextResponse.json({
        success: true,
        data: {
          events: result.events,
          total: result.total,
          stats: {
            total: result.total,
            active: result.events.filter((e) => e.status === 'active').length,
            scheduled: result.events.filter((e) => e.status === 'upcoming').length,
          },
        },
      });
    }

    if (type === 'announcements') {
      const active =
        searchParams.get('active') === 'true'
          ? true
          : searchParams.get('active') === 'false'
            ? false
            : undefined;
      const result = await communityService.getAnnouncements(active, page, limit);
      return NextResponse.json({
        success: true,
        data: {
          announcements: result.announcements,
          total: result.total,
          stats: {
            total: result.total,
            active: result.announcements.filter((a) => a.is_active).length,
          },
        },
      });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Activities GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'event') {
      const event = await communityService.createEvent(data);
      return NextResponse.json({ success: true, data: event });
    }

    if (type === 'announcement') {
      const announcement = await communityService.createAnnouncement(data);
      return NextResponse.json({ success: true, data: announcement });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Activities POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update activity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, ...data } = body;

    if (type === 'event') {
      const event = await communityService.updateEvent(id, data);
      return NextResponse.json({ success: true, data: event });
    }

    if (type === 'announcement') {
      const announcement = await communityService.updateAnnouncement(id, data);
      return NextResponse.json({ success: true, data: announcement });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Activities PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete activity
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = parseInt(searchParams.get('id') || '0');

    if (type === 'event') {
      await communityService.deleteEvent(id);
      return NextResponse.json({ success: true });
    }

    if (type === 'announcement') {
      await communityService.deleteAnnouncement(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Activities DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
