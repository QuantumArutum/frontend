/**
 * Admin Login API
 * POST /api/v2/barong/admin/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { dbQuery, sql } from '@/lib/database';
import bcrypt from 'bcryptjs';

// Demo admin credentials (fallback when database not configured)
const DEMO_ADMIN = {
  email: 'admin@quantaureum.com',
  password: 'admin123',
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

    // Try database first if configured
    if (sql) {
      const admin = await dbQuery.getAdminByEmail(email);

      if (admin && bcrypt.compareSync(password, admin.password_hash)) {
        const token = generateToken({
          uid: admin.uid,
          email: admin.email,
          role: admin.role,
        });

        return NextResponse.json({
          success: true,
          data: {
            token,
            expires_in: 86400,
            user: {
              uid: admin.uid,
              email: admin.email,
              role: admin.role,
              permissions: admin.permissions || ['*'],
              last_login: new Date().toISOString(),
              created_at: admin.created_at,
            },
          },
        });
      }
    }

    // Fallback to demo admin
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
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

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
