/**
 * Database Initialization API
 * POST /api/v2/admin/db/init
 * 
 * This endpoint initializes the database tables and creates default admin user
 */

import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, sql, dbQuery } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Check for secret key (basic protection)
    const { secret } = await request.json().catch(() => ({}));
    
    if (secret !== 'quantaureum_init_2024') {
      return NextResponse.json(
        { success: false, message: 'Invalid secret key' },
        { status: 401 }
      );
    }

    if (!sql) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
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

    // Create default categories if not exist
    const categories = await dbQuery.getCategories();
    if (categories.length === 0) {
      await dbQuery.createCategory({ name: 'Announcements', slug: 'announcements', description: 'Official updates', sort_order: 1 });
      await dbQuery.createCategory({ name: 'General Discussion', slug: 'general', description: 'General talk', sort_order: 2 });
      await dbQuery.createCategory({ name: 'Technical Support', slug: 'support', description: 'Get help', sort_order: 3 });
      await dbQuery.createCategory({ name: 'Trading Strategies', slug: 'trading', description: 'Trading tips', sort_order: 4 });
    }

    // Create default system settings if not exist
    const settings = await dbQuery.getSystemSettings();
    if (Object.keys(settings).length === 0) {
      await dbQuery.updateSystemSetting('site_name', 'Quantaureum', 'string');
      await dbQuery.updateSystemSetting('maintenance_mode', 'false', 'boolean');
      await dbQuery.updateSystemSetting('contact_email', 'support@quantaureum.com', 'string');
    }

    // Create default staking pools if not exist
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
  });
}
