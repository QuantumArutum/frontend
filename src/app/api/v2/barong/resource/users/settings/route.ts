/**
 * User Settings API (for logged-in users)
 * GET /api/v2/barong/resource/users/settings - Get user settings
 * PUT /api/v2/barong/resource/users/settings - Update user settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

// In-memory storage for user settings (demo mode)
const userSettings = new Map<string, any>();

export async function GET(request: NextRequest) {
  const authResult = requireAuth(request);
  if ('error' in authResult) return authResult.error;

  const { user } = authResult;

  try {
    // Get user settings from storage
    const settings = userSettings.get(user.uid) || {
      language: 'en',
      theme: 'dark',
      notifications: {
        email: true,
        push: true,
        trading: true,
        marketing: false,
      },
      privacy: {
        showProfile: true,
        showActivity: true,
      },
      security: {
        twoFactorEnabled: false,
      },
    };

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Get user settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authResult = requireAuth(request);
  if ('error' in authResult) return authResult.error;

  const { user } = authResult;

  try {
    const newSettings = await request.json();

    // Merge with existing settings
    const existingSettings = userSettings.get(user.uid) || {};
    const mergedSettings = { ...existingSettings, ...newSettings };

    // Save settings
    userSettings.set(user.uid, mergedSettings);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: mergedSettings,
    });
  } catch (error) {
    console.error('Update user settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
