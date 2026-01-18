import { NextRequest, NextResponse } from 'next/server';

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  console.log('Google OAuth callback received');
  console.log('Code present:', !!code);
  console.log('Error:', error, errorDescription);

  if (error) {
    console.error('Google auth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(
        `/auth/login?error=google_auth_failed&details=${encodeURIComponent(errorDescription || error)}`,
        request.url
      )
    );
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

  console.log('OAuth config - clientId present:', !!clientId);
  console.log('OAuth config - clientSecret present:', !!clientSecret);
  console.log('OAuth config - redirectUri:', redirectUri);

  if (!clientId || !clientSecret) {
    console.error('OAuth not configured - missing clientId or clientSecret');
    return NextResponse.redirect(new URL('/auth/login?error=oauth_not_configured', request.url));
  }

  try {
    // Exchange code for tokens
    console.log('Exchanging code for tokens...');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.text();
    console.log('Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(
        new URL(
          `/auth/login?error=token_exchange_failed&status=${tokenResponse.status}`,
          request.url
        )
      );
    }

    const tokens: GoogleTokenResponse = JSON.parse(tokenData);
    console.log('Token exchange successful, access_token present:', !!tokens.access_token);

    // Get user info
    console.log('Fetching user info...');
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoResponse.ok) {
      const userInfoError = await userInfoResponse.text();
      console.error('User info fetch failed:', userInfoError);
      return NextResponse.redirect(new URL('/auth/login?error=user_info_failed', request.url));
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json();
    console.log('User info received for:', userInfo.email);

    // Create session token
    const sessionData = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      provider: 'google',
      loginTime: Date.now(),
    };

    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    // 使用绝对 URL 重定向到社区页面
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quantaureum.com';
    const response = NextResponse.redirect(new URL('/community', baseUrl));

    // Set session cookie
    response.cookies.set('qau_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Set user info cookie (for client-side access)
    response.cookies.set(
      'qau_user',
      JSON.stringify({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      }),
      {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      }
    );

    console.log('Login successful, redirecting to /community');
    return response;
  } catch (err) {
    console.error('Google OAuth error:', err);
    const errorMessage = err instanceof Error ? err.message : 'unknown';
    return NextResponse.redirect(
      new URL(
        `/auth/login?error=oauth_error&details=${encodeURIComponent(errorMessage)}`,
        request.url
      )
    );
  }
}
