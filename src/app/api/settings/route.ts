import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.drawSettings.findMany();
    // Convert array of settings to single object for frontend
    const formattedSettings: any = {};
    settings.forEach(s => {
      formattedSettings[s.keyName] = s.valueJson;
    });
    
    return NextResponse.json(formattedSettings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Body should be key-value pairs e.g. { quotas: {...}, maxDraws: ... }
    const updates = [];
    
    for (const [key, value] of Object.entries(body)) {
      updates.push(
        prisma.drawSettings.upsert({
          where: { keyName: key },
          update: { valueJson: value as any },
          create: { keyName: key, valueJson: value as any },
        })
      );
    }
    
    await prisma.$transaction(updates);
    
    const { logAudit } = await import('@/lib/audit');
    await logAudit('SETTINGS_UPDATE', 'Draw settings updated', 'Admin');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
