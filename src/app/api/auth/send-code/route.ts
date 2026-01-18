/**
 * 发送邮箱验证码 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';
import { generateCode, checkRateLimitAsync, storeCodeAsync } from '@/lib/verification';

// 发送邮件函数（使用 Resend API）
async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log(`[DEV] No RESEND_API_KEY configured. Verification code for ${email}: ${code}`);
    return true; // 开发模式下跳过邮件发送
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Quantaureum <noreply@quantaureum.com>',
        to: [email],
        subject: 'Quantaureum 验证码 / Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8B5CF6; margin: 0;">Quantaureum</h1>
              <p style="color: #666; margin-top: 5px;">量子安全区块链平台</p>
            </div>
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); padding: 30px; border-radius: 12px; text-align: center;">
              <p style="color: white; margin: 0 0 15px 0; font-size: 16px;">您的验证码是 / Your verification code is:</p>
              <div style="background: white; padding: 15px 30px; border-radius: 8px; display: inline-block;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #8B5CF6;">${code}</span>
              </div>
              <p style="color: rgba(255,255,255,0.8); margin: 15px 0 0 0; font-size: 14px;">验证码 10 分钟内有效 / Valid for 10 minutes</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
              <p style="color: #666; margin: 0; font-size: 13px;">
                如果您没有请求此验证码，请忽略此邮件。<br/>
                If you didn't request this code, please ignore this email.
              </p>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
              © 2024 Quantaureum. All rights reserved.
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 });
    }

    // 验证邮箱格式
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: '邮箱格式不正确' }, { status: 400 });
    }

    // 检查速率限制
    const rateCheck = await checkRateLimitAsync(email);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `请求过于频繁，请 ${rateCheck.retryAfter} 分钟后再试`,
        },
        { status: 429 }
      );
    }

    // 如果是注册，检查邮箱是否已存在
    if (type === 'register' && sql) {
      const [existingUser] = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (existingUser) {
        return NextResponse.json({ success: false, message: '该邮箱已被注册' }, { status: 400 });
      }
    }

    // 生成并存储验证码
    const code = generateCode();
    await storeCodeAsync(email, code, type);

    // 发送验证码邮件
    const emailSent = await sendVerificationEmail(email, code);

    if (!emailSent && process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: '邮件发送失败，请稍后重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '验证码已发送到您的邮箱',
      // 开发模式下返回验证码（未配置邮件服务时）
      ...(!process.env.RESEND_API_KEY && { devCode: code }),
    });
  } catch (error: any) {
    console.error('Send code error:', error);
    return NextResponse.json({ success: false, message: '发送验证码失败' }, { status: 500 });
  }
}
