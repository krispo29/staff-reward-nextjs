import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch active employees (not soft-deleted)
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        deletedAt: null, // Only active employees
      },
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
      const employeeIds = body.map((emp: any) => emp.id.toString());
      
      // Delete existing records to allow re-activation and updating of info
      await prisma.employee.deleteMany({
        where: {
          employeeId: {
            in: employeeIds
          }
        }
      });

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
          deletedAt: null, // Ensure new users are active
        })),
        skipDuplicates: true, 
      });
      
      const { logAudit } = await import('@/lib/audit');
      await logAudit('EMPLOYEE_IMPORT', `Imported ${result.count} employees`, 'Admin');
      
      return NextResponse.json({ message: 'Imported successfully', count: result.count });
    } else {
      // Single create - also handle potential re-activation
      const employeeId = body.id.toString();
      
      await prisma.employee.deleteMany({
        where: { employeeId }
      });

      const employee = await prisma.employee.create({
        data: {
          employeeId,
          name: body.name,
          department: body.department || '',
          section: body.section || '',
          position: body.position || '',
          plant: body.plant || '',
          nationality: body.nationality || 'Thai',
          deletedAt: null,
        isActive: true,
        },
      });
      
      const { logAudit } = await import('@/lib/audit');
      await logAudit('EMPLOYEE_CREATE', `Created/Updated employee ${employeeId}`, 'Admin');

      return NextResponse.json(employee);
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Permanently delete records soft-deleted more than 7 days ago
    const deleted = await prisma.employee.deleteMany({
      where: {
        deletedAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    // 2. Soft delete all currently active employees
    await prisma.employee.updateMany({
      where: {
        deletedAt: null,
      },
      data: {
        deletedAt: now,
        isActive: false,
      },
    });

    const { logAudit } = await import('@/lib/audit');
    await logAudit('EMPLOYEE_DELETE_ALL', 'Soft deleted all active employees', 'Admin');

    return NextResponse.json({ 
      message: 'All employees soft deleted', 
      permanentlyDeleted: deleted.count 
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: 'Failed to delete employees' }, { status: 500 });
  }
}
