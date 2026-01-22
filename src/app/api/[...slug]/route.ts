import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

async function handler(req: NextRequest) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication token is missing.' }, { status: 401 });
  }
  
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

  // e.g. /api/dashboard/stats -> dashboard/stats
  const path = req.nextUrl.pathname.substring('/api/'.length);
  const targetUrl = `${backendUrl}/${path}${req.nextUrl.search}`;

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  // Forward content-type for POST/PUT requests
  if (req.headers.get('Content-Type')) {
    headers.set('Content-Type', req.headers.get('Content-Type')!);
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
      // @ts-ignore - duplex is needed for streaming request bodies
      duplex: 'half',
    });

    // Forward the response from the backend to the client
    // Remove content-encoding headers since Node's fetch auto-decompresses
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error(`[API PROXY] Error for ${req.method} ${path}:`, error);
    return NextResponse.json({ message: 'An error occurred while communicating with the backend.' }, { status: 502 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
