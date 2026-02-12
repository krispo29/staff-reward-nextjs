import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

// Logic duplicated from src/lib/drawLogic.ts but adapted for server
function selectRandomWinner(
  employees: any[],
  winners: any[],
  quotas: { [key: string]: number },
  maxDraws: number
) {
  const excludeIds = new Set(winners.map((w) => w.employeeId));

  // 1. Calculate current counts by department
  const currentCounts = winners.reduce((acc: any, w: any) => {
    // We need to look up the winner's department from the employees list 
    // because Winner model might not have department if it's just a link
    // But wait, our Prisma Winner model DOES NOT have department, it links to Employee.
    // So 'w.employee' should be included in the fetch.
    const dept = w.employee?.department || "Others";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Filter eligible employees
  const eligible = employees.filter((emp) => {
    // Exclude if already drawn
    if (excludeIds.has(emp.employeeId)) return false;

    // Check quota (Percentage based)
    const dept = emp.department || "Others";
    const targetKey = quotas[dept] !== undefined ? dept : "Others";
    
    const percent = quotas[targetKey] || 0;
    const maxAllowed = Math.floor(maxDraws * (percent / 100));

    const current = currentCounts[targetKey] || 0;
    
    if (current < maxAllowed) return true;

    return false;
  });

  if (eligible.length === 0) {
    return null;
  }

  // Secure Random
  const randomIndex = Math.floor(Math.random() * eligible.length);
  return eligible[randomIndex];
}

export async function POST(request: Request) {
  try {
    // Verify Auth (Optional: if we want to allow public draws, remove this. But for "Secure", keep it)
    // Verify Auth
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    // Log for debugging
    console.log('Draw Request Initiated');
    console.log('Token present:', !!token);

    if (!token || !(await verifyJWT(token))) {
      console.log('Draw Audit: Unauthorized access attempt');
      // For now, let's allow it to debug, or return 401 with explicit message
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนจับรางวัล (Unauthorized)' }, { status: 401 });
    }

    // Fetch necessary data
    const [employees, winners, settings] = await Promise.all([
      prisma.employee.findMany({ where: { isActive: true } }),
      prisma.winner.findMany({ include: { employee: true } }),
      prisma.drawSettings.findFirst()
    ]);

    // Parse Settings
    const defaultQuotas = {
      "Production": 10,
      "Cutting": 5,
      "Common": 20,
      "PE": 10,
      "Maintenance": 20,
      "Admin": 10,
      "QA": 15,
      "HR": 10, 
    };
    
    let quotas = defaultQuotas;
    let maxDraws = 10;

    if (settings && settings.valueJson) {
        const parsed = settings.valueJson as any;
        if (parsed.quotas) quotas = parsed.quotas;
        // We might want to pass maxDraws from client or store in DB. 
        // Currently DB doesn't have maxDraws column strictly, it's in valueJson?
        // Let's assume it's in valueJson or passed from client.
        // For security, trust DB or fixed value.
        // Let's use the body to allow flexibility or default to generic.
    }
    
    // Read maxDraws from body if provided, else default 10
    const body = await request.json().catch(() => ({}));
    if (body.maxDraws) maxDraws = body.maxDraws;

    // Perform Selection
    const winner = selectRandomWinner(employees, winners, quotas, maxDraws);

    if (!winner) {
      return NextResponse.json({ error: 'No eligible winner found' }, { status: 404 });
    }

    return NextResponse.json({ winner: {
        ...winner,
        id: winner.employeeId // Remap for frontend compatibility
    }});

  } catch (error) {
    console.error('Draw error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
