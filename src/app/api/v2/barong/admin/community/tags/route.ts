/**
 * Tags & Topics Management API
 * Handles tags, topics, and post tagging
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Demo data
const demoTags = [
  { id: 1, name: 'QAU', slug: 'qau', description: 'Quantaureum token discussions', color: '#1890ff', type: 'tag', post_count: 45, follower_count: 120, is_featured: 1, is_active: 1 },
  { id: 2, name: 'Trading', slug: 'trading', description: 'Trading strategies', color: '#52c41a', type: 'topic', post_count: 89, follower_count: 234, is_featured: 1, is_active: 1 },
  { id: 3, name: 'DeFi', slug: 'defi', description: 'Decentralized finance', color: '#722ed1', type: 'topic', post_count: 67, follower_count: 189, is_featured: 0, is_active: 1 },
  { id: 4, name: 'News', slug: 'news', description: 'Latest news', color: '#fa8c16', type: 'tag', post_count: 34, follower_count: 156, is_featured: 0, is_active: 1 },
];

// GET - List tags/topics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    let tags = [...demoTags];
    if (type === 'tag') tags = tags.filter(t => t.type === 'tag');
    if (type === 'topic') tags = tags.filter(t => t.type === 'topic');
    if (type === 'featured') tags = tags.filter(t => t.is_featured === 1);

    return NextResponse.json({
      success: true,
      data: {
        tags,
        stats: {
          total: demoTags.length,
          tags: demoTags.filter(t => t.type === 'tag').length,
          topics: demoTags.filter(t => t.type === 'topic').length,
          featured: demoTags.filter(t => t.is_featured === 1).length,
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create tag/topic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, name, slug, description, color, type, is_featured } = body;

    if (action === 'create') {
      const newTag = {
        id: Date.now(),
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        color: color || '#1890ff',
        type: type || 'tag',
        post_count: 0,
        follower_count: 0,
        is_featured: is_featured ? 1 : 0,
        is_active: 1,
      };
      return NextResponse.json({ success: true, data: newTag });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update tag/topic
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete tag
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
