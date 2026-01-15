/**
 * Community Activities & Events API
 * Handles events, polls, AMAs, and campaigns
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Demo data for activities
const demoEvents = [
  { id: 'evt_1', title: 'QAU Token Launch AMA', description: 'Ask Me Anything session', type: 'ama', status: 'scheduled', start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), participant_count: 45, created_at: new Date().toISOString() },
  { id: 'evt_2', title: 'Trading Competition', description: 'Win prizes!', type: 'contest', status: 'active', start_time: new Date().toISOString(), participant_count: 128, created_at: new Date().toISOString() },
];

const demoAnnouncements = [
  { id: 1, title: 'Platform Update v2.0', content: 'New features released', type: 'info', is_pinned: 1, is_active: 1, created_at: new Date().toISOString() },
  { id: 2, title: 'Scheduled Maintenance', content: 'Brief downtime expected', type: 'warning', is_pinned: 0, is_active: 1, created_at: new Date().toISOString() },
];

const demoPolls = [
  { id: 'poll_1', question: 'Which feature should we build next?', options: JSON.stringify(['Mobile App', 'NFT Marketplace', 'Lending']), status: 'active', total_votes: 234, created_at: new Date().toISOString() },
];

// GET - List activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'events';

    if (type === 'events') {
      return NextResponse.json({
        success: true,
        data: { events: demoEvents, stats: { total: demoEvents.length, active: 1, scheduled: 1 } }
      });
    }

    if (type === 'announcements') {
      return NextResponse.json({
        success: true,
        data: { announcements: demoAnnouncements, stats: { total: demoAnnouncements.length, active: 2 } }
      });
    }

    if (type === 'polls') {
      return NextResponse.json({
        success: true,
        data: { polls: demoPolls, stats: { total: demoPolls.length, active: 1 } }
      });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'event') {
      const newEvent = { id: 'evt_' + Date.now(), ...body, participant_count: 0, created_at: new Date().toISOString() };
      return NextResponse.json({ success: true, data: newEvent });
    }

    if (type === 'announcement') {
      const newAnnouncement = { id: Date.now(), ...body, is_active: 1, created_at: new Date().toISOString() };
      return NextResponse.json({ success: true, data: newAnnouncement });
    }

    if (type === 'poll') {
      const newPoll = { id: 'poll_' + Date.now(), ...body, total_votes: 0, status: 'active', created_at: new Date().toISOString() };
      return NextResponse.json({ success: true, data: newPoll });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update activity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete activity
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
