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
  const eligible = employees.filter((emp) => !excludeIds.has(emp.employeeId));

  if (eligible.length === 0) return null;

  // Weighted Selection Logic
  // Each candidate's weight is their department's quota percentage
  let totalWeight = 0;
  const weightedCandidates = eligible.map((emp) => {
    const dept = emp.department || "Others";
    const targetKey = quotas[dept] !== undefined ? dept : "Others";
    
    // Weight = Quota % (default to 1 if quota is 0 or undefined to ensure everyone has a chance)
    const weight = Math.max(quotas[targetKey] || 0, 1);
    totalWeight += weight;
    
    return { emp, weight };
  });

  // Pick random based on weights
  let r = Math.random() * totalWeight;
  for (const item of weightedCandidates) {
    if (r < item.weight) return item.emp;
    r -= item.weight;
  }

  // Fallback
  return eligible[Math.floor(Math.random() * eligible.length)];
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
    const [employees, winners, settingsList] = await Promise.all([
      prisma.employee.findMany({ where: { isActive: true } }),
      prisma.winner.findMany({ include: { employee: true } }),
      prisma.drawSettings.findMany()
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

    const quotaSetting = settingsList.find(s => s.keyName === 'quotas');
    if (quotaSetting && quotaSetting.valueJson) {
        quotas = quotaSetting.valueJson as any;
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
