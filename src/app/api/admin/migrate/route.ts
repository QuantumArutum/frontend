/**
 * 数据库迁移 API - 创建验证码表
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function POST(request: NextRequest) {
  // 简单的安全检查
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer migrate-secret-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!sql) {
    return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
  }

  try {
    // 创建验证码表
    await sql`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        type VARCHAR(50) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(email, type)
      )
    `;

    // 创建索引
    await sql`
      CREATE INDEX IF NOT EXISTS idx_verification_codes_email 
      ON verification_codes(email)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_verification_codes_expires 
      ON verification_codes(expires_at)
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Migration completed: verification_codes table created' 
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error.message 
    }, { status: 500 });
  }
}
