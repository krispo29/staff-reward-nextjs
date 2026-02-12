import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const winners = await prisma.winner.findMany({
      include: { employee: true },
      orderBy: { drawRoundNumber: 'asc' },
    });
    
    // Transform to match frontend expected format if needed
    // But frontend should probably adapt to API format or we adapt here.
    // Frontend expects Employee object. We return Winner object which has Employee inside.
    
    const formattedWinners = winners.map(w => ({
      ...w.employee,
      // Add winner specific info if needed
      wonAt: w.wonAt,
      drawRound: w.drawRoundNumber
    }));

    return NextResponse.json(formattedWinners);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch winners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, drawRound } = body;

    const winner = await prisma.winner.create({
      data: {
        employeeId: employeeId.toString(),
        drawRoundNumber: drawRound,
        status: 'confirmed',
        prizeAmount: 10000.00
      },
      include: { employee: true }
    });

    const { logAudit } = await import('@/lib/audit');
    // Get user from token if possible, or just log as System/Unknown for now since we didn't verify token in this specific route (middleware handles auth but doesn't pass user info easily without decoding again)
    // For simplicity, we'll decode or just log 'Admin'.
    await logAudit('WINNER_CONFIRMED', `Employee ${employeeId} won round ${drawRound}`, 'Admin');

    return NextResponse.json(winner);
  } catch (error) {
     console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to record winner' }, { status: 500 });
  }
}

export async function DELETE() {
    // Reset winners (Development helper)
    try {
        await prisma.winner.deleteMany({});
        const { logAudit } = await import('@/lib/audit');
        await logAudit('WINNERS_RESET', 'All winners deleted', 'Admin');
        return NextResponse.json({ message: "All winners deleted" });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to reset winners' }, { status: 500 });
    }
}
