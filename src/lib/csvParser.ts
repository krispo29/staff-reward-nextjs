import Papa from "papaparse";
import { Employee } from "@/types/employee";

interface CSVRow {
  [key: string]: string;
}

/**
 * Parse a CSV file and return an array of Employee objects.
 * Expects at minimum an "id" or "employee_id" or "รหัสพนักงาน" column.
 * Optional columns: "name", "department", "plant", "section", "position", "nationality"
 */
export function parseEmployeeCSV(file: File): Promise<Employee[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (results) => {
        if (results.errors.length > 0) {
          const criticalErrors = results.errors.filter(
            (e) => e.type === "FieldMismatch" || e.type === "Quotes"
          );
          if (criticalErrors.length > 0) {
            reject(new Error(`CSV parsing error: ${criticalErrors[0].message}`));
            return;
          }
        }

        const employees: Employee[] = [];
        const headers = results.meta.fields || [];

        // Detect column names (support both English and Thai)
        const idCol = headers.find((h) =>
          ["id", "employee_id", "employeeid", "รหัสพนักงาน", "รหัส"].includes(
            h.toLowerCase().trim()
          )
        );
        const nameCol = headers.find((h) =>
          ["name", "employee_name", "ชื่อ", "ชื่อ-สกุล", "ชื่อ-นามสกุล"].includes(
            h.toLowerCase().trim()
          )
        );
        const deptCol = headers.find((h) =>
          ["department", "dept", "แผนก"].includes(h.toLowerCase().trim())
        );
        const natCol = headers.find((h) =>
          ["nationality", "nat", "สัญชาติ"].includes(h.toLowerCase().trim())
        );
        const plantCol = headers.find((h) =>
          ["plant", "factory", "site", "ที่ทำงาน", "โรงงาน"].includes(h.toLowerCase().trim())
        );
        const sectCol = headers.find((h) =>
          ["section", "sect", "ส่วนงาน", "ส่วน"].includes(h.toLowerCase().trim())
        );
        const posCol = headers.find((h) =>
          ["position", "pos", "job", "job title", "ตำแหน่ง"].includes(h.toLowerCase().trim())
        );

        if (!idCol) {
          reject(
            new Error(
              "ไม่พบคอลัมน์รหัสพนักงาน กรุณาใช้หัวคอลัมน์: id, employee_id, หรือ รหัสพนักงาน"
            )
          );
          return;
        }

        for (const row of results.data) {
          const id = row[idCol]?.toString().trim();
          if (!id) continue;

          // Validate 7-digit ID
          if (!/^\d{7}$/.test(id)) {
            console.warn(`Skipping invalid employee ID: ${id}`);
            continue;
          }

          let nationality: "Thai" | "Myanmar" = "Thai";
          if (natCol) {
            const val = row[natCol]?.toString().trim().toLowerCase();
            if (val === "myanmar" || val === "burmese" || val === "พม่า" || val === "mm") {
              nationality = "Myanmar";
            }
          }

          employees.push({
            id,
            name: nameCol ? row[nameCol]?.trim() : undefined,
            department: deptCol ? row[deptCol]?.trim() : undefined,
            plant: plantCol ? row[plantCol]?.trim() : undefined,
            section: sectCol ? row[sectCol]?.trim() : undefined,
            position: posCol ? row[posCol]?.trim() : undefined,
            nationality,
          });
        }

        if (employees.length === 0) {
          reject(new Error("ไม่พบข้อมูลพนักงานที่ถูกต้องในไฟล์ CSV"));
          return;
        }

        resolve(employees);
      },
      error: (error) => {
        reject(new Error(`ไม่สามารถอ่านไฟล์ CSV: ${error.message}`));
      },
    });
  });
}
