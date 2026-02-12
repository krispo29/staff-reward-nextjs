import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: { username: payload.username, role: payload.role } });
}
