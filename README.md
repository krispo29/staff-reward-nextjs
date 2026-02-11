# 🎰 Staff Lucky Draw — ระบบจับรางวัลพนักงาน

ระบบจับรางวัลพนักงานแบบ Slot Machine สำหรับจับรางวัลผู้โชคดี 10 ท่าน รางวัลละ 10,000 บาท พร้อมแอนิเมชันที่สวยงามและรองรับการใช้งานบน iPad

🌐 **Live Demo**: [https://staff-reward-nextjs.vercel.app](https://staff-reward-nextjs.vercel.app)

## ✨ ฟีเจอร์หลัก

- 🎰 **Slot Machine Animation** — ตัวเลข 7 หลักหมุนแบบสล็อตแมชชีน หยุดทีละตัวจากซ้ายไปขวา
- 🎉 **Confetti Celebration** — เอฟเฟกต์ confetti เมื่อจับรางวัลได้ผู้โชคดี
- 🔊 **Sound Effects** — เสียงหมุน, เสียงหยุด, เสียงชนะ (เปิด/ปิดได้)
- 📱 **iPad Optimized** — ออกแบบมาสำหรับ iPad ทั้ง landscape และ portrait
- 👴 **Elderly Friendly** — ตัวหนังสือใหญ่ ปุ่มใหญ่ อ่านง่าย เหมาะกับผู้ใช้สูงอายุ
- 📊 **Winners List** — แสดงรายชื่อผู้โชคดีทั้งหมด พร้อม export CSV และ print
- 📋 **Department Quota** — กำหนดสัดส่วนโควต้าแต่ละแผนกเป็น % ได้ พร้อมแสดง tooltip สรุปโควต้า
- 🔍 **Entrants Viewer** — ตรวจสอบรายชื่อผู้เข้าร่วมทั้งหมดพร้อมค้นหา
- ⚙️ **Admin Panel** — แผงควบคุมสำหรับตั้งค่า, นำเข้าข้อมูล, กรอกข้อมูลมือ, reset
- 📂 **CSV Import** — นำเข้าข้อมูลพนักงานด้วยไฟล์ CSV (ลากวาง)
- ✏️ **Manual Entry** — กรอกข้อมูลพนักงานในเว็บโดยตรง
- 🧪 **Unit Tests** — ทดสอบด้วย Vitest + React Testing Library

## 🛠 Tech Stack

| เทคโนโลยี               | หน้าที่           |
| ----------------------- | ----------------- |
| Next.js 16 (App Router) | Framework         |
| React 19                | UI Library        |
| TypeScript              | Language          |
| Tailwind CSS v4         | Styling           |
| shadcn/ui + Radix UI    | UI Components     |
| Zustand                 | State Management  |
| Framer Motion           | Animations        |
| Phosphor Icons          | Icon Library      |
| canvas-confetti         | Confetti Effects  |
| PapaParse               | CSV Parsing       |
| Vitest                  | Testing Framework |

## 📦 การติดตั้ง

```bash
# Clone โปรเจค
git clone <repository-url>
cd staff-reward-nextjs

# ติดตั้ง dependencies
npm install

# เริ่มการพัฒนา
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## 📁 โครงสร้างโปรเจค

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, viewport)
│   ├── page.tsx                # Main draw page
│   └── globals.css             # Theme + iPad optimization
├── components/
│   ├── ui/                     # shadcn/ui components (Button, Dialog, Slider, Switch)
│   ├── icons/                  # Custom icon components
│   ├── Layout.tsx              # Responsive container
│   ├── StartScreen.tsx         # หน้าเริ่มต้น (New Year Party theme)
│   ├── DrawScreen.tsx          # หน้าจับรางวัลหลัก + Quota tooltip
│   ├── SlotMachine.tsx         # Slot machine (7 reels)
│   ├── SlotReel.tsx            # Single digit reel + animation
│   ├── DrawCounter.tsx         # ตัวนับ (X จาก 10)
│   ├── WinnerReveal.tsx        # แสดงผู้โชคดี + confetti
│   ├── WinnerModal.tsx         # Modal ยืนยัน/ปฏิเสธผู้โชคดี
│   ├── WinnerCard.tsx          # Card ผู้โชคดีแต่ละคน
│   ├── WinnersList.tsx         # รายชื่อผู้โชคดีทั้งหมด (sidebar)
│   ├── EntrantsModal.tsx       # Modal ตรวจสอบรายชื่อผู้เข้าร่วม
│   ├── AdminPanel.tsx          # แผงควบคุม
│   ├── Settings.tsx            # ตั้งค่า (ความเร็ว, เสียง, confetti)
│   ├── EmployeeImport.tsx      # นำเข้า CSV (drag & drop)
│   └── ManualEmployeeEntry.tsx # กรอกข้อมูลพนักงานมือ
├── store/
│   └── drawStore.ts            # Zustand store (state + actions)
├── hooks/
│   └── useSlotAnimation.ts     # Animation hook (reel timing)
├── types/
│   └── employee.ts             # TypeScript types (Employee, DrawSettings)
├── lib/
│   ├── drawLogic.ts            # Random selection + quota algorithm
│   ├── animationConfig.ts      # Animation timing config
│   ├── audioUtils.ts           # Sound effects manager
│   ├── exportWinners.ts        # CSV export + print
│   ├── csvParser.ts            # PapaParse CSV parsing
│   └── utils.ts                # Utility functions (cn)
└── data/
    └── mockEmployees.ts        # Mock data (100 คน, 8 แผนก)
```

## 🎮 วิธีใช้งาน

### เริ่มจับรางวัล

1. เปิดเว็บที่ `http://localhost:3000`
2. กดปุ่ม **"เริ่มจับรางวัล"**
3. กดปุ่ม **"จับรางวัล"** — ดู slot machine หมุน
4. รอผลลัพธ์ — confetti + แสดงชื่อผู้โชคดี
5. กด **"ยืนยัน"** หรือ **"ปฏิเสธ"** ผู้โชคดี
6. กดปุ่ม **"จับรางวัลถัดไป"** ทำซ้ำจนครบ 10 รางวัล

### ดูโควต้าแผนก

- **Hover** หรือ **คลิก** ที่ badge **"Department Quota Active"** เพื่อดูสัดส่วนโควต้าแต่ละแผนก (%)

### ตรวจสอบรายชื่อผู้เข้าร่วม

- กดปุ่ม **"ตรวจสอบรายชื่อ"** เพื่อดูรายชื่อพนักงานทั้งหมด พร้อมค้นหาตามชื่อหรือแผนก

### นำเข้าข้อมูลพนักงาน

#### วิธีที่ 1: Import CSV

1. กดปุ่ม ⚙️ (มุมขวาบน) เปิดแผงควบคุม
2. กด **"นำเข้าข้อมูลพนักงาน"**
3. ลากไฟล์ CSV มาวาง หรือคลิกเพื่อเลือกไฟล์

#### วิธีที่ 2: กรอกข้อมูลเอง

1. กดปุ่ม ⚙️ (มุมขวาบน) เปิดแผงควบคุม
2. กด **"กรอกข้อมูลพนักงาน"**
3. กรอกรหัส 7 หลัก, ชื่อ, แผนก, ส่วน, ตำแหน่ง, โรงงาน, สัญชาติ
4. กด **"เพิ่มแถว"** เพื่อเพิ่มคนต่อไป
5. กด **"เพิ่มพนักงาน"** เพื่อบันทึก

### รูปแบบไฟล์ CSV

```csv
id,name,department,section,position,plant,nationality
2210001,สมชาย สุขใจ,Production,Assembly,Operator,Rayong Plant,Thai
2210002,สมหญิง ใจดี,Cutting,Line A,Technician,Rayong Plant,Myanmar
2210003,วิชัย มั่นคง,Admin,HR,Manager,Bangkok,Thai
```

> ⚠️ คอลัมน์ **id** เป็นข้อบังคับ (ตัวเลข 7 หลัก) คอลัมน์อื่นเป็น optional

ไฟล์ตัวอย่าง: [`public/sample_employees.csv`](public/sample_employees.csv)

### ตั้งค่า

- **ความเร็วแอนิเมชัน**: ช้า / ปกติ / เร็ว
- **เสียง**: เปิด / ปิด
- **Confetti**: เปิด / ปิด
- **โควต้าแผนก**: ตั้งค่าเปอร์เซ็นต์ต่อแผนก

### Export ผลลัพธ์

- **Export CSV** — ดาวน์โหลดรายชื่อผู้โชคดีเป็นไฟล์ CSV
- **พิมพ์** — พิมพ์รายชื่อผู้โชคดีเป็นตาราง

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Build & Deploy

```bash
# Build สำหรับ production
npm run build

# เริ่ม production server
npm start
```

### Deploy บน Vercel

```bash
npx vercel --prod
```

## 📋 สิ่งที่ต้องรู้

- ข้อมูลพนักงานเก็บใน **client-side state** (Zustand) — จะหายเมื่อ refresh หน้า
- Mock data 100 คน (8 แผนก) จะโหลดอัตโนมัติเมื่อเปิดครั้งแรก
- สามารถ import CSV เพื่อแทนที่ mock data
- ไม่ต้องมี backend / database
- Department quota จะจำกัดจำนวนผู้โชคดีตามสัดส่วน % ของแต่ละแผนก
