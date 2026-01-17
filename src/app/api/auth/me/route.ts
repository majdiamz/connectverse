import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const token = cookies().get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!backendUrl) {
            throw new Error('Backend API URL is not configured.');
        }

        const response = await fetch(`${backendUrl}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }

        const userData = await response.json();
        return NextResponse.json(userData);

    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
