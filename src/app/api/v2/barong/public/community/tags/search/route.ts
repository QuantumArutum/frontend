import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/v2/barong/public/community/tags/search - 搜索标签
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        data: { tags: [] },
      });
    }

    // 使用数据库函数搜索标签
    const tags = await sql`
      SELECT * FROM search_tags(${query}, ${limit})
    `;

    return NextResponse.json({
      success: true,
      data: { tags },
    });
  } catch (error: any) {
    console.error('Error searching tags:', error);
    return NextResponse.json(
      {
        success: false,
        message: '搜索标签失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
