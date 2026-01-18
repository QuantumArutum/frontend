/**
 * Authentication utilities for API routes
 */

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_quantaureum_2024';

export interface JWTPayload {
  uid: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Verify JWT token from request
 */
export function verifyToken(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  if (!token) return null;

  // Allow demo token for testing
  if (token.startsWith('demo-jwt-token-')) {
    return {
      uid: 'demo-admin-001',
      email: 'admin@quantaureum.com',
      role: 'super_admin',
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Generate JWT token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Check if user has admin role
 */
export function isAdmin(user: JWTPayload | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'super_admin';
}

/**
 * Middleware helper to require authentication
 */
export function requireAuth(request: NextRequest): { user: JWTPayload } | { error: Response } {
  const user = verifyToken(request);
  if (!user) {
    return {
      error: new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
  return { user };
}

/**
 * Middleware helper to require admin role
 */
export function requireAdmin(request: NextRequest): { user: JWTPayload } | { error: Response } {
  const authResult = requireAuth(request);
  if ('error' in authResult) return authResult;

  if (!isAdmin(authResult.user)) {
    return {
      error: new Response(
        JSON.stringify({ success: false, message: 'Forbidden: Admin access required' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      ),
    };
  }
  return authResult;
}
