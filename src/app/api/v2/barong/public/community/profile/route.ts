/**
 * Update User Profile API
 * Allows users to update their profile information
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function PUT(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { 
      currentUserId,
      displayName,
      bio,
      location,
      website,
      socialLinks 
    } = body;

    // 验证认证
    if (!currentUserId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required. Please login first.' 
      }, { status: 401 });
    }

    // 验证用户存在
    const userCheck = await sql`
      SELECT uid FROM users WHERE uid = ${currentUserId} AND status = 'active'
    `;

    if (userCheck.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    // 数据验证
    if (displayName && displayName.length > 100) {
      return NextResponse.json({ 
        success: false, 
        message: 'Display name must be less than 100 characters' 
      }, { status: 400 });
    }

    if (bio && bio.length > 500) {
      return NextResponse.json({ 
        success: false, 
        message: 'Bio must be less than 500 characters' 
      }, { status: 400 });
    }

    if (location && location.length > 100) {
      return NextResponse.json({ 
        success: false, 
        message: 'Location must be less than 100 characters' 
      }, { status: 400 });
    }

    if (website && website.length > 255) {
      return NextResponse.json({ 
        success: false, 
        message: 'Website URL must be less than 255 characters' 
      }, { status: 400 });
    }

    // 验证网站 URL 格式
    if (website && website.trim() !== '') {
      try {
        new URL(website);
      } catch {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid website URL format' 
        }, { status: 400 });
      }
    }

    // 确保 user_profiles 表存在
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id VARCHAR(255) PRIMARY KEY,
        display_name VARCHAR(100),
        bio TEXT,
        location VARCHAR(100),
        website VARCHAR(255),
        avatar_url VARCHAR(500),
        social_links JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 检查用户资料是否已存在
    const existingProfile = await sql`
      SELECT user_id FROM user_profiles WHERE user_id = ${currentUserId}
    `;

    const socialLinksJson = socialLinks ? JSON.stringify(socialLinks) : null;

    if (existingProfile.length > 0) {
      // 更新现有资料
      await sql`
        UPDATE user_profiles
        SET 
          display_name = ${displayName || null},
          bio = ${bio || null},
          location = ${location || null},
          website = ${website || null},
          social_links = ${socialLinksJson}::jsonb,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${currentUserId}
      `;
    } else {
      // 插入新资料
      await sql`
        INSERT INTO user_profiles (
          user_id,
          display_name,
          bio,
          location,
          website,
          social_links
        ) VALUES (
          ${currentUserId},
          ${displayName || null},
          ${bio || null},
          ${location || null},
          ${website || null},
          ${socialLinksJson}::jsonb
        )
      `;
    }

    // 获取更新后的完整资料
    const updatedProfile = await sql`
      SELECT 
        u.uid,
        u.email,
        u.created_at,
        p.display_name,
        p.bio,
        p.location,
        p.website,
        p.social_links,
        p.updated_at as profile_updated_at
      FROM users u
      LEFT JOIN user_profiles p ON u.uid = p.user_id
      WHERE u.uid = ${currentUserId}
    `;

    const profile = updatedProfile[0];

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: profile.uid,
        email: profile.email,
        displayName: profile.display_name,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        socialLinks: profile.social_links,
        createdAt: profile.created_at,
        updatedAt: profile.profile_updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
