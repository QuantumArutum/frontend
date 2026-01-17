import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        message: 'Database not configured'
      }, { status: 500 });
    }

    const sql = neon(databaseUrl);

    console.log('Starting moderator system migration...');

    // 1. 创建 moderators 表
    console.log('Creating moderators table...');
    await sql`
      CREATE TABLE IF NOT EXISTS moderators (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) NOT NULL,
        category_id INTEGER,
        permissions JSONB,
        appointed_by VARCHAR(255),
        appointed_at TIMESTAMP DEFAULT NOW(),
        removed_at TIMESTAMP
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_moderators_user_id ON moderators(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_moderators_category_id ON moderators(category_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_moderators_role ON moderators(role)`;
    console.log('Moderators table created successfully');

    // 2. 创建 mod_actions 表
    console.log('Creating mod_actions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS mod_actions (
        id SERIAL PRIMARY KEY,
        moderator_id VARCHAR(255) NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        target_type VARCHAR(50) NOT NULL,
        target_id VARCHAR(255) NOT NULL,
        reason TEXT,
        details JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_mod_actions_moderator ON mod_actions(moderator_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_mod_actions_type ON mod_actions(action_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_mod_actions_target ON mod_actions(target_type, target_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_mod_actions_created_at ON mod_actions(created_at)`;
    console.log('Mod_actions table created successfully');

    // 3. 创建 user_bans 表
    console.log('Creating user_bans table...');
    await sql`
      CREATE TABLE IF NOT EXISTS user_bans (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        ban_type VARCHAR(50) NOT NULL,
        reason TEXT,
        banned_by VARCHAR(255) NOT NULL,
        banned_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_user_bans_user_id ON user_bans(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_bans_is_active ON user_bans(is_active)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_bans_expires_at ON user_bans(expires_at)`;
    console.log('User_bans table created successfully');

    // 4. 添加字段到 posts 表
    console.log('Adding fields to posts table...');
    await sql`
      ALTER TABLE posts 
      ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS pin_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS pinned_by VARCHAR(255),
      ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS locked_by VARCHAR(255),
      ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS mod_note TEXT
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_posts_is_pinned ON posts(is_pinned)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_is_locked ON posts(is_locked)`;
    console.log('Posts table fields added successfully');

    // 5. 添加字段到 post_reports 表（如果存在）
    console.log('Checking if post_reports table exists...');
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'post_reports'
      )
    `;
    
    if (tableExists[0]?.exists) {
      console.log('Adding fields to post_reports table...');
      await sql`
        ALTER TABLE post_reports 
        ADD COLUMN IF NOT EXISTS handled_by VARCHAR(255),
        ADD COLUMN IF NOT EXISTS handled_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS handler_note TEXT
      `;
      console.log('Post_reports table fields added successfully');
    } else {
      console.log('Post_reports table does not exist, skipping...');
    }

    console.log('All moderator system migrations completed successfully');
    return NextResponse.json({
      success: true,
      message: 'Moderator system migration completed successfully',
      details: {
        tables_created: ['moderators', 'mod_actions', 'user_bans'],
        tables_updated: ['posts', 'post_reports'],
        indexes_created: 11
      }
    });

  } catch (error: any) {
    console.error('Migration error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: error.code,
      detail: error.detail
    });
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        detail: error.detail
      } : undefined
    }, { status: 500 });
  }
}
