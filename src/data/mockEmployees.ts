import { Employee } from "@/types/employee";

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "IT Support",
  "R&D",
  "Customer Service",
  "Legal",
];

const firstNames = [
  "สมชาย", "สมหญิง", "วิชัย", "วิภา", "ประเสริฐ",
  "ประภา", "สุรชัย", "สุภา", "อนุชา", "อรุณี",
  "กิตติ", "กัลยา", "ธนา", "ธนิดา", "พิชัย",
  "พิมพ์", "ชัยวัฒน์", "ชลธิชา", "นิรันดร์", "นารี",
  "ศักดิ์", "ศิริ", "มานะ", "มาลี", "รัตน์",
  "รุ่ง", "วัฒน์", "วันดี", "ปิยะ", "ปัทมา",
  "จักร", "จันทร์", "เกียรติ", "เกษร", "ทวี",
  "ทิพย์", "บุญ", "บุษบา", "ยุทธ", "ยุพา",
  "ลักษณ์", "ลัดดา", "สิทธิ์", "สุดา", "อุดม",
  "อุไร", "เฉลิม", "เฉลา", "ไพศาล", "ไพลิน",
];

const lastNames = [
  "สุขใจ", "ใจดี", "มั่นคง", "เจริญ", "รุ่งเรือง",
  "สว่าง", "แก้ว", "ทอง", "เงิน", "ดี",
  "สมบูรณ์", "พัฒนา", "ก้าวหน้า", "มงคล", "ศรี",
  "บุญมี", "รักดี", "สุข", "สันต์", "สมาน",
];

function generateEmployeeId(index: number): string {
  // Generate 7-digit IDs starting from 2210001
  return (2210001 + index).toString();
}

export function generateMockEmployees(count: number = 100): Employee[] {
  const employees: Employee[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const department = departments[i % departments.length];

    employees.push({
      id: generateEmployeeId(i),
      name: `${firstName} ${lastName}`,
      department,
    });
  }

  return employees;
}

export const mockEmployees: Employee[] = generateMockEmployees(100);
