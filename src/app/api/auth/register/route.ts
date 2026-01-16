/**
 * 用户注册 API - 邮箱验证码版本
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';
import { verifyCode, deleteCode } from '@/lib/verification';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, verificationCode, password, confirmPassword, acceptTerms } = body;
    
    // 基本验证
    if (!email || !password) {
      return NextResponse.json({ success: false, message: '邮箱和密码不能为空' }, { status: 400 });
    }
    
    // 验证邮箱格式
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: '邮箱格式不正确' }, { status: 400 });
    }
    
    // 验证验证码
    if (!verificationCode) {
      return NextResponse.json({ success: false, message: '请输入验证码' }, { status: 400 });
    }
    
    const codeCheck = verifyCode(email, verificationCode, 'register');
    if (!codeCheck.valid) {
      return NextResponse.json({ success: false, message: codeCheck.message }, { status: 400 });
    }
    
    // 验证密码
    if (password.length < 8) {
      return NextResponse.json({ success: false, message: '密码至少需要8个字符' }, { status: 400 });
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json({ success: false, message: '密码必须包含大小写字母和数字' }, { status: 400 });
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, message: '两次输入的密码不一致' }, { status: 400 });
    }
    
    // 验证条款
    if (!acceptTerms) {
      return NextResponse.json({ success: false, message: '请同意服务条款和隐私政策' }, { status: 400 });
    }
    
    // 检查数据库连接
    if (!sql) {
      return NextResponse.json({ success: false, message: '数据库未连接' }, { status: 500 });
    }
    
    // 检查邮箱是否已注册
    const [existingUser] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser) {
      return NextResponse.json({ success: false, message: '该邮箱已被注册' }, { status: 400 });
    }
    
    // 创建用户
    const passwordHash = await bcrypt.hash(password, 12);
    const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(7);
    
    const [user] = await sql`
      INSERT INTO users (uid, email, password_hash, role, level, status, is_verified)
      VALUES (${uid}, ${email}, ${passwordHash}, 'user', 1, 'active', true)
      RETURNING id, uid, email, is_verified
    `;
    
    // 删除已使用的验证码
    deleteCode(email);
    
    // 创建会话 token
    const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(7);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时
    
    // 存储会话
    await sql`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (${uid}, ${token}, ${expiresAt})
    `;
    
    return NextResponse.json({
      success: true,
      message: '注册成功',
      user: {
        id: user.uid,
        email: user.email,
        isVerified: user.is_verified,
      },
      token,
      expiresAt: expiresAt.toISOString(),
    });
    
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ 
      success: false, 
      message: '注册失败: ' + (error.message || '未知错误') 
    }, { status: 500 });
  }
}
