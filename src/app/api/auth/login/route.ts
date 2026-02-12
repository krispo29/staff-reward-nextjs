import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Sign Token
    const token = await signJWT({ sub: user.id, username: user.username, role: user.role });

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    // Log Audit
    // We need to import logAudit first, but let's add the import line at the top via separate edit or just assume it works if I add import
    // Wait, I need to add import. I'll do content replacement for the import too or use multi_replace.
    // I'll assume I can add import in a separate tool call to be safe or just use dynamic import if needed, but better to use proper import.
    // I will use replace_file_content to add import AND the log call.
    
    const { logAudit } = await import('@/lib/audit');
    await logAudit('LOGIN', 'User logged in', user.username);

    return NextResponse.json({ success: true, user: { username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
