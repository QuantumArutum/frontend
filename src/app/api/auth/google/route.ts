import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
  
  if (!clientId) {
    console.error('GOOGLE_CLIENT_ID is not configured');
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });
  }

  const scope = encodeURIComponent('openid email profile');
  const state = Math.random().toString(36).substring(7);
  
  // 使用 select_account 而不是 consent，允许用户选择账户而不强制重新授权
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&access_type=offline` +
    `&prompt=select_account`;

  console.log('Redirecting to Google OAuth with redirect_uri:', redirectUri);
  
  return NextResponse.redirect(authUrl);
}
