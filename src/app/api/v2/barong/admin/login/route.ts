/**
 * Admin Login API
 * POST /api/v2/barong/admin/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Demo admin credentials
const DEMO_ADMIN = {
  email: 'admin@quantaureum.com',
  password_hash: bcrypt.hashSync('admin123', 10),
  id: 'admin_001',
  role: 'super_admin',
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check demo admin
    if (email === DEMO_ADMIN.email && bcrypt.compareSync(password, DEMO_ADMIN.password_hash)) {
      const token = generateToken({
        uid: DEMO_ADMIN.id,
        email: DEMO_ADMIN.email,
        role: DEMO_ADMIN.role,
      });

      return NextResponse.json({
        success: true,
        data: {
          token,
          expires_in: 86400,
          user: {
            uid: DEMO_ADMIN.id,
            email: DEMO_ADMIN.email,
            role: DEMO_ADMIN.role,
            permissions: ['*'],
            last_login: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        },
      });
    }

    // TODO: Check database for real users when DATABASE_URL is configured

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
