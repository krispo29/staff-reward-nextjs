import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { employeeId: 'asc' },
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if it's a bulk import (array) or single create
    if (Array.isArray(body)) {
      // Upsert many to avoid duplicates
      // Prisma doesn't support createMany with skipDuplicates for SQLite/Postgres efficiently in all versions
      // But for Postgres createMany is supported. skipDuplicates is supported in recent versions.
      // We'll use transaction for safety or just createMany.
      
      const result = await prisma.employee.createMany({
        data: body.map((emp: any) => ({
          employeeId: emp.id.toString(), // Ensure string
          name: emp.name,
          department: emp.department,
          section: emp.section,
          position: emp.position,
          plant: emp.plant,
          nationality: emp.nationality || 'Thai',
          isActive: true,
        })),
        skipDuplicates: true, 
      });
      
      return NextResponse.json({ message: 'Imported successfully', count: result.count });
    } else {
      // Single create
      const employee = await prisma.employee.create({
        data: {
          employeeId: body.id.toString(),
          name: body.name,
          department: body.department || '',
          section: body.section || '',
          position: body.position || '',
          plant: body.plant || '',
          nationality: body.nationality || 'Thai',
        },
      });
      return NextResponse.json(employee);
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
