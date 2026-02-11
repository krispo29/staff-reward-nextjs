# วิธีการจับรางวัลและความโปร่งใส (Randomization & Transparency)

เอกสารนี้อธิบายวิธีการทำงานของระบบจับรางวัลในโปรแกรม **Staff Reward System** เพื่อให้มั่นใจถึงความโปร่งใส ยุติธรรม และไม่มีการล็อกผลรางวัลใดๆ ทั้งสิ้น

---

## 1. หลักการทำงาน (Algorithm Overview)

ระบบใช้การสุ่มแบบ **สุ่มจากผู้ที่มีสิทธิ์เท่านั้น (Filtered Random Selection)** โดยมีขั้นตอนดังนี้:

1.  **คัดกรองผู้มีสิทธิ์ (Filtering):** ระบบจะดึงรายชื่อพนักงานทั้งหมดออกมา และตัดรายชื่อผู้ที่เคยได้รับรางวัลไปแล้วออกทันที
2.  **ตรวจสอบโควต้า (Quota Check):** ระบบจะตรวจสอบว่าแผนกของผู้ลุ้นรางวัล ได้รับรางวัลครบตาม **สัดส่วนเปอร์เซ็นต์ (Department %)** ที่กำหนดไว้หรือยัง หากครบแล้ว จะไม่นำรายชื่อแผนกนั้นมาสุ่มต่อ
3.  **การสุ่มตัวเลข (Randomization):**
    - ใช้มาตรฐาน **Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)** ผ่านฟังก์ชัน `crypto.getRandomValues()` ของ Web Browser ซึ่งมีความปลอดภัยสูงและคาดเดาได้ยากกว่า `Math.random()` ทั่วไป
    - หาก Browser ไม่รองรับ (กรณีเครื่องเก่ามาก) ระบบจะสำรองไปใช้ `Math.random()` ซึ่งยังคงให้ผลลัพธ์ที่เป็นการสุ่มกระจายตัวดีเยี่ยม

---

## 2. การกำหนดโควต้าปัจจุบัน (Current Quotas)

ระบบได้กำหนดสัดส่วนการแจกรางวัลให้กับแต่ละแผนกดังนี้:

| แผนก (Department) | สัดส่วน (Percentage) |
| :---------------- | :------------------- |
| **Common**        | 20%                  |
| **Maintenance**   | 20%                  |
| **QA**            | 15%                  |
| **Production**    | 10%                  |
| **PE**            | 10%                  |
| **Admin**         | 10%                  |
| **HR**            | 10%                  |
| **Cutting**       | 5%                   |

_หมายเหตุ: สัดส่วนนี้คำนวณจากจำนวนรางวัลทั้งหมด (Max Draws) เพื่อกระจายรางวัลให้ทั่วถึงทุกแผนกตามความเหมาะสม_

---

## 3. โค้ดที่ใช้ในการประมวลผล (Core Logic)

อ้างอิงจากไฟล์: `src/lib/drawLogic.ts`

```typescript
export function selectRandomWinner(
  employees: Employee[],
  winners: Employee[],
  quotas: { [key: string]: number },
  maxDraws: number,
): Employee | null {
  // 1. สร้างรายการ ID ผู้ที่ได้รับรางวัลไปแล้ว เพื่อนำมาตัดออก
  const excludeIds = new Set(winners.map((w) => w.id));

  // 2. นับจำนวนผู้ได้รับรางวัลแยกตามแผนก (Department)
  const currentCounts = winners.reduce(
    (acc, w) => {
      const dept = w.department || "Others";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // 3. กรองผู้ที่มีสิทธิ์ลุ้นรางวัล (Eligible Candidates)
  const eligible = employees.filter((emp) => {
    // ถ้าเคยได้รางวัลแล้ว -> ตัดออก
    if (excludeIds.has(emp.id)) return false;

    // 2. ตรวจสอบโควต้าตามแผนก (Department Percentage Quota)
    const dept = emp.department || "Others";
    const percent = quotas[dept] || 0;

    // คำนวณจำนวนสูงสุดที่แผนกนี้จะได้ (ตาม % ของจำนวนรางวัลทั้งหมด)
    const maxAllowed = Math.floor(maxDraws * (percent / 100));
    const current = currentCounts[dept] || 0;

    // ถ้ายังไม่ครบโควต้าตามสัดส่วน -> มีสิทธิ์
    return current < maxAllowed;
  });

  if (eligible.length === 0) return null;

  // 4. สุ่มผู้โชคดี 1 คน จากรายการผู้มีสิทธิ์
  let randomIndex: number;

  // พยายามใช้ตัวสุ่มที่มีความปลอดภัยสูง (CSPRNG)
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    randomIndex = array[0] % eligible.length;
  } else {
    // กรณีสำรอง
    randomIndex = Math.floor(Math.random() * eligible.length);
  }

  return eligible[randomIndex];
}
```

---

## 4. คำถามที่พบบ่อย (FAQ)

**Q: มีการล็อกผลให้คนใดคนหนึ่งหรือไม่?**
**A:** ไม่มีครับ ระบบจะกรองเฉพาะผู้ที่มีสิทธิ์ (ยังไม่เคยได้รางวัล และโควต้าของแผนกยังไม่เต็ม) มารวมกันใน "ตะกร้า" แล้วสุ่มหยิบ 1 คนจากตะกร้านั้นโดยวิธีการทางคณิตศาสตร์ที่โปร่งใส

**Q: ทำไมบางแผนกได้รางวัลเยอะกว่า?**
**A:** ระบบใช้ **"สัดส่วนเปอร์เซ็นต์ (Percentage Quota)"** ในการกำหนดจำนวนผู้โชคดีในแต่ละแผนกครับ เช่น แผนก Production อาจมีโควต้า 10% ของรางวัลทั้งหมด ในขณะที่แผนก Common มี 20% ดังนั้นแผนกที่มีเปอร์เซ็นต์สูงกว่าจะมีจำนวนผู้ได้รับรางวัลมากกว่า แต่โอกาสของ **"รายบุคคล"** ในแผนกนั้นๆ ยังคงเท่าเทียมกันในการถูกสุ่มเลือกจนกว่าจะครบโควต้าครับ

**Q: สามารถตรวจสอบย้อนหลังได้ไหม?**
**A:** ได้ครับ โค้ดทั้งหมดเป็น Open Source และสามารถเปิดดูไฟล์ `src/lib/drawLogic.ts` เพื่อยืนยันการทำงานได้ตลอดเวลา
