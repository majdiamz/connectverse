import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // If user is trying to access the login page
  if (pathname.startsWith('/login')) {
    // If they have a valid token, redirect them to the dashboard
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (e) {
        // Token is invalid, clear it and let them proceed to login
        const response = NextResponse.next();
        response.cookies.delete('token');
        return response;
      }
    }
    // No token, so let them go to the login page
    return NextResponse.next();
  }

  // For any other page, check for a token
  if (!token) {
    // No token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Token exists, verify it
  try {
    await jwtVerify(token, secret);
    // Token is valid, allow the request to continue
    return NextResponse.next();
  } catch (e) {
    // Token is invalid, redirect to login and clear the bad cookie
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  // Protect all dashboard routes, but exclude API routes, static files, and image optimization files
  // Also include the login page to handle redirecting already-authenticated users
  matcher: ['/dashboard/:path*', '/login'],
};
