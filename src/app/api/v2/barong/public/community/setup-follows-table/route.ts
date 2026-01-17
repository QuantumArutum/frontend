/**
 * Setup User Follows Table
 * Creates the user_follows table for follow/follower functionality
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    // 创建 user_follows 表
    await sql`
      CREATE TABLE IF NOT EXISTS user_follows (
        id SERIAL PRIMARY KEY,
        follower_id VARCHAR(255) NOT NULL,
        following_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id)
      )
    `;

    // 创建索引
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id)
    `;

    return NextResponse.json({
      success: true,
      message: 'user_follows table created successfully',
    });
  } catch (error) {
    console.error('Error creating user_follows table:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: String(error)
    }, { status: 500 });
  }
}
