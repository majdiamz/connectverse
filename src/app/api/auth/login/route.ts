import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) {
    console.error('Backend API URL is not configured.');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  try {
    const apiResponse = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json({ message: data.error || 'Invalid credentials' }, { status: apiResponse.status });
    }
    
    const { token, user } = data;

    if (!token || !user) {
      return NextResponse.json({ message: 'Invalid response from auth server' }, { status: 500 });
    }

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('Login API route error:', error);
    return NextResponse.json({ message: 'An internal error occurred.' }, { status: 500 });
  }
}
