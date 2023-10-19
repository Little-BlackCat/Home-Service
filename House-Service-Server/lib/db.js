import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export async function createYourModel() {
  // สร้างวันที่และเวลาในโซนเวลาที่ต้องการ
  const date = new Date();
  const timeZone = 'Asia/Bangkok';

  // แปลงเวลาจาก UTC เป็นโซนเวลาที่ต้องการ
  const zonedDate = utcToZonedTime(date, timeZone);

  // สร้างข้อมูลโมเดลของคุณ
  const Categories = {
    createdAt: zonedDate,  // กำหนดวันที่และเวลาในโซนเวลาที่ต้องการ
		updateAt: zonedDate,

    // สิ่งอื่น ๆ ในโมเดล
  };

  // บันทึกข้อมูลในฐานข้อมูลผ่าน Prisma

}
