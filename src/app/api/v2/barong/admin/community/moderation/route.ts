/**
 * Content Moderation API
 * Handles content review queue and sensitive word filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Demo data
const demoModerationQueue: any[] = [];
const demoSensitiveWords = [
  { id: 1, word: 'spam', level: 'block', category: 'spam' },
  { id: 2, word: 'scam', level: 'review', category: 'fraud' },
];

// GET - Get moderation data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'queue';

    if (type === 'queue') {
      return NextResponse.json({
        success: true,
        data: {
          queue: demoModerationQueue,
          stats: { pending: 0, approved: 0, rejected: 0 }
        }
      });
    }

    if (type === 'words') {
      return NextResponse.json({
        success: true,
        data: demoSensitiveWords
      });
    }

    if (type === 'stats') {
      return NextResponse.json({
        success: true,
        data: {
          total_reviewed: 45,
          approved: 38,
          rejected: 7,
          pending: 0,
        }
      });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Add sensitive word or submit for review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'word') {
      const newWord = { id: Date.now(), ...body };
      return NextResponse.json({ success: true, data: newWord });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Review content or update word
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete sensitive word
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
