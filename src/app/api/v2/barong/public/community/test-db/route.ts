/**
 * Test Database Connection API
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    // 测试基本查询
    const result = await sql`SELECT 1 as test`;
    
    // 尝试查询 categories 表
    let categoriesTest = null;
    try {
      categoriesTest = await sql`SELECT * FROM categories LIMIT 1`;
    } catch (e: any) {
      categoriesTest = { error: e.message };
    }

    // 尝试查询 posts 表
    let postsTest = null;
    try {
      postsTest = await sql`SELECT * FROM posts LIMIT 1`;
    } catch (e: any) {
      postsTest = { error: e.message };
    }

    return NextResponse.json({
      success: true,
      data: {
        basicQuery: result,
        categoriesTest,
        postsTest,
      },
    });
  } catch (error: any) {
    console.error('Error testing database:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
