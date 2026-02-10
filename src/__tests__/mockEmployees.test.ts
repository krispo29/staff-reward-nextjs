import { describe, it, expect } from 'vitest';
import { generateMockEmployees } from '@/data/mockEmployees';

describe('mockEmployees', () => {
  it('generates the correct number of employees', () => {
    const count = 50;
    const employees = generateMockEmployees(count);
    expect(employees).toHaveLength(count);
  });

  it('generates employees with all required fields', () => {
    const employees = generateMockEmployees(10);
    employees.forEach((emp) => {
      expect(emp.id).toBeDefined();
      expect(emp.name).toBeDefined();
      expect(emp.department).toBeDefined();
      expect(emp.plant).toBeDefined();
      expect(emp.section).toBeDefined();
      expect(emp.position).toBeDefined();
      expect(emp.nationality).toBeDefined();
    });
  });

  it('generates valid values for fields', () => {
    const employees = generateMockEmployees(20);
    employees.forEach((emp) => {
      expect(['Bangkok Plant', 'Rayong Plant']).toContain(emp.plant);
      expect(['Production', 'Cutting', 'Common', 'PE', 'Maintenance', 'Admin', 'QA', 'HR']).toContain(emp.department);
      expect(['Production', 'Quality', 'Logistics']).toContain(emp.section);
      expect(['Supervisor', 'Operator']).toContain(emp.position);
      expect(['Thai', 'Myanmar']).toContain(emp.nationality);
    });
  });
});
