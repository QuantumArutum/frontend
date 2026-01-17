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

    // 添加嵌套评论相关字段
    await sql`
      ALTER TABLE post_comments 
      ADD COLUMN IF NOT EXISTS parent_id INTEGER,
      ADD COLUMN IF NOT EXISTS reply_to_user_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reply_to_user_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS depth INTEGER DEFAULT 0
    `;

    // 创建索引
    await sql`CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON post_comments(parent_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_comments_reply_to_user ON post_comments(reply_to_user_id)`;

    // 创建 @提及表
    await sql`
      CREATE TABLE IF NOT EXISTS comment_mentions (
        id SERIAL PRIMARY KEY,
        comment_id INTEGER NOT NULL,
        mentioned_user_id VARCHAR(255) NOT NULL,
        mentioned_user_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_mentions_comment_id ON comment_mentions(comment_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_mentions_user_id ON comment_mentions(mentioned_user_id)`;

    // 创建举报表
    await sql`
      CREATE TABLE IF NOT EXISTS comment_reports (
        id SERIAL PRIMARY KEY,
        comment_id INTEGER NOT NULL,
        reporter_id VARCHAR(255) NOT NULL,
        report_type VARCHAR(50) NOT NULL,
        report_reason TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        handled_at TIMESTAMP,
        handled_by VARCHAR(255)
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_reports_comment_id ON comment_reports(comment_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reports_status ON comment_reports(status)`;

    return NextResponse.json({
      success: true,
      message: 'Database migration completed successfully'
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
