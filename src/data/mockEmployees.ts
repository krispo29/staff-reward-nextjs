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


export function generateMockEmployees(count: number = 100): Employee[] {
  const employees: Employee[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const department = departments[i % departments.length];

    const nationality = Math.random() > 0.3 ? "Myanmar" : "Thai";
    const plant = i % 2 === 0 ? "Bangkok Plant" : "Rayong Plant";
    const section = i % 3 === 0 ? "Production" : i % 3 === 1 ? "Quality" : "Logistics";
    const position = i % 5 === 0 ? "Supervisor" : "Operator";

    employees.push({
      id: (2210001 + i).toString(),
      name: `${firstName} ${lastName}`,
      department,
      plant,
      section,
      position,
      nationality,
    });
  }

  return employees;
}

export const mockEmployees: Employee[] = generateMockEmployees(100);
