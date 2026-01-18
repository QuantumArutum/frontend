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

// 添加超时控制函数
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  console.log('[Google OAuth] Callback started');
  console.log('[Google OAuth] Code present:', !!code);
  console.log('[Google OAuth] Error:', error, errorDescription);

  if (error) {
    console.error('[Google OAuth] Auth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(
        `/auth/login?error=google_auth_failed&details=${encodeURIComponent(errorDescription || error)}`,
        request.url
      )
    );
  }

  if (!code) {
    console.error('[Google OAuth] No authorization code received');
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${request.nextUrl.origin}/api/auth/google/callback`;

  console.log('[Google OAuth] Config - clientId present:', !!clientId);
  console.log('[Google OAuth] Config - clientSecret present:', !!clientSecret);
  console.log('[Google OAuth] Config - redirectUri:', redirectUri);

  if (!clientId || !clientSecret) {
    console.error('[Google OAuth] OAuth not configured - missing credentials');
    return NextResponse.redirect(new URL('/auth/login?error=oauth_not_configured', request.url));
  }

  try {
    // Exchange code for tokens (8秒超时)
    console.log('[Google OAuth] Exchanging code for tokens...');
    const tokenResponse = await fetchWithTimeout(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      },
      8000
    );

    const tokenData = await tokenResponse.text();
    console.log('[Google OAuth] Token response status:', tokenResponse.status);
    console.log('[Google OAuth] Elapsed time:', Date.now() - startTime, 'ms');

    if (!tokenResponse.ok) {
      console.error('[Google OAuth] Token exchange failed:', tokenData);
      return NextResponse.redirect(
        new URL(
          `/auth/login?error=token_exchange_failed&status=${tokenResponse.status}`,
          request.url
        )
      );
    }

    const tokens: GoogleTokenResponse = JSON.parse(tokenData);
    console.log(
      '[Google OAuth] Token exchange successful, access_token present:',
      !!tokens.access_token
    );

    // Get user info (8秒超时)
    console.log('[Google OAuth] Fetching user info...');
    const userInfoResponse = await fetchWithTimeout(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
      8000
    );

    if (!userInfoResponse.ok) {
      const userInfoError = await userInfoResponse.text();
      console.error('[Google OAuth] User info fetch failed:', userInfoError);
      return NextResponse.redirect(new URL('/auth/login?error=user_info_failed', request.url));
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json();
    console.log('[Google OAuth] User info received for:', userInfo.email);
    console.log('[Google OAuth] Elapsed time:', Date.now() - startTime, 'ms');

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

    // 使用相对路径重定向（更快）
    const response = NextResponse.redirect(new URL('/community', request.url));

    // Set session cookie
    response.cookies.set('qau_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      }
    );

    const totalTime = Date.now() - startTime;
    console.log('[Google OAuth] Login successful, total time:', totalTime, 'ms');
    console.log('[Google OAuth] Redirecting to /community');
    return response;
  } catch (err) {
    const totalTime = Date.now() - startTime;
    console.error('[Google OAuth] Error after', totalTime, 'ms:', err);

    // 超时错误特殊处理
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('[Google OAuth] Request timeout');
      return NextResponse.redirect(
        new URL('/auth/login?error=timeout&details=Request+timed+out', request.url)
      );
    }

    const errorMessage = err instanceof Error ? err.message : 'unknown';
    return NextResponse.redirect(
      new URL(
        `/auth/login?error=oauth_error&details=${encodeURIComponent(errorMessage)}`,
        request.url
      )
    );
  }
}
