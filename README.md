# Interact Club of Bangpakokwittayakom

เว็บไซต์สโมสรอินเทอร์แรคท์ โรงเรียนบางปะกอกวิทยาคม

## โครงสร้างโฟลเดอร์

- `src/` — โค้ด React/TypeScript ของเว็บไซต์
  - `components/` — ส่วนประกอบของหน้าเว็บ
  - `lib/` — Supabase client และ type ที่ใช้ร่วมกัน
- `public/images/` — รูปภาพและไฟล์ภาพที่เว็บไซต์เรียกใช้
  - `branding/` — โลโก้และตราโรงเรียน
  - `committee/` — รูปคณะกรรมการ
  - `projects/` — รูปโครงการ/กิจกรรม
  - `gallery/` — รูปภาพสำรอง/แกลเลอรี
- `supabase/` — config, migrations และ Edge Functions
- `index.html` — HTML entry point ของ Vite
- `vite.config.ts` — การตั้งค่า Vite
- `.env` — ตัวแปรสภาพแวดล้อมของ Supabase (ไม่ควร commit ลง Git)

## การรัน

```bash
npm install
npm run dev
```

สร้าง production build:

```bash
npm run build
```

ตรวจ TypeScript:

```bash
npm run typecheck
```
