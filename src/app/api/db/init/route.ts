/**
 * Database Initialization API
 * POST /api/db/init
 */

import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, sql, dbQuery } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json().catch(() => ({}));

    if (secret !== 'quantaureum_init_2024') {
      return NextResponse.json({ success: false, message: 'Invalid secret key' }, { status: 401 });
    }

    if (!sql) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database not configured. Check DATABASE_URL environment variable.',
        },
        { status: 500 }
      );
    }

    // Initialize tables
    await initDatabase();

    // Create default admin user if not exists
    const existingAdmin = await dbQuery.getAdminByEmail('admin@quantaureum.com');

    if (!existingAdmin) {
      const passwordHash = bcrypt.hashSync('admin123', 10);
      await dbQuery.createAdminUser({
        uid: 'admin_001',
        email: 'admin@quantaureum.com',
        password_hash: passwordHash,
        role: 'super_admin',
        permissions: ['*'],
      });
    }

    // Create default categories
    const categories = await dbQuery.getCategories();
    if (categories.length === 0) {
      await dbQuery.createCategory({
        name: 'Announcements',
        slug: 'announcements',
        description: 'Official updates',
        sort_order: 1,
      });
      await dbQuery.createCategory({
        name: 'General Discussion',
        slug: 'general',
        description: 'General talk',
        sort_order: 2,
      });
      await dbQuery.createCategory({
        name: 'Technical Support',
        slug: 'support',
        description: 'Get help',
        sort_order: 3,
      });
    }

    // Create default staking pools
    const pools = await dbQuery.getStakingPools();
    if (pools.length === 0) {
      await dbQuery.createStakingPool({
        pool_id: 'pool_qau_30',
        token_id: 'QAU',
        name: 'QAU 30-Day Staking',
        apy: 12.0,
        duration_days: 30,
        min_stake: 100,
        is_active: true,
      });
      await dbQuery.createStakingPool({
        pool_id: 'pool_qau_90',
        token_id: 'QAU',
        name: 'QAU 90-Day Staking',
        apy: 25.0,
        duration_days: 90,
        min_stake: 500,
        is_active: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      data: {
        tables_created: true,
        admin_created: !existingAdmin,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Database init error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Database init endpoint. Use POST with secret key to initialize.',
    database_configured: !!sql,
    database_url_set: !!process.env.DATABASE_URL || !!process.env.POSTGRES_URL,
    version: '1.0.1',
    timestamp: new Date().toISOString(),
  });
}
