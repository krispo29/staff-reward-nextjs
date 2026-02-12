import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import Papa from 'papaparse';
import { logAudit } from '@/lib/audit';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const winners = await prisma.winner.findMany({
      include: { employee: true },
      orderBy: { drawRoundNumber: 'asc' }
    });

    // Format for CSV
    const csvData = winners.map(w => ({
      'Employee ID': w.employeeId,
      'Name': w.employee.name,
      'Department': w.employee.department,
      'Position': w.employee.position || '',
      'Plant': w.employee.plant || '',
      'Draw Round': w.drawRoundNumber,
      'Prize Amount': w.prizeAmount.toString(),
      'Won At': w.wonAt.toISOString(),
      'Status': w.status
    }));

    const csv = Papa.unparse(csvData);

    await logAudit('EXPORT_WINNERS', `Exported ${winners.length} winners`, payload.username as string);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="winners_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
