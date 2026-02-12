import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Paths to protect
  const protectedPaths = [
    '/api/employees', // Protect modifications? GET might be public?
    '/api/winners', // GET public, POST/DELETE protected?
    '/api/settings', // POST protected
  ];
  
  // For now, let's protect everything except GET employees/winners if we want public transparency
  // But AdminPanel needs access.
  // Strategy:
  // - GET /api/employees -> Public (for draw screen)
  // - POST /api/employees -> Protected
  // - GET /api/winners -> Public
  // - POST /api/winners -> Protected (Draw result)
  // - /api/settings -> GET Public (for styling?), POST Protected
  
  const path = request.nextUrl.pathname;
  const method = request.method;

  const isProtected = 
    (path.startsWith('/api/employees') && method !== 'GET') ||
    (path.startsWith('/api/winners') && method !== 'GET') ||
    (path.startsWith('/api/settings') && method !== 'GET') ||
    path.startsWith('/api/admin');

  if (isProtected) {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Optional: Check role
    // if (payload.role !== 'admin') ...
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
