import prisma from '@/lib/prisma';

export async function logAudit(action: string, details?: string, performedBy?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        details,
        performedBy: performedBy || 'System',
      },
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
}
