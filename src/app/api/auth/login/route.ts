import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // In a real application, you'd validate the credentials against a database
  if (email === 'user@example.com' && password === 'password') {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    const token = await new SignJWT({ email, userId: 'user_01', name: 'Alex Green' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') // Token expires in 1 hour
      .sign(secret);

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}
