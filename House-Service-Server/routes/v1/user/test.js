import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const totalEmployees = await prisma.Employee.count();

    const getEmployeeId = await prisma.Order_Employee.findFirst({
      orderBy: { order_employee_id: "desc" },
      select: { employee_id: true },
    });

    const lastEmployeeId = getEmployeeId.employee_id;

    if (lastEmployeeId < totalEmployees) {
      console.log(lastEmployeeId + 1);
      await prisma.order_details.create({
        data: {
          order_employee: { employee_id: lastEmployeeId + 1 },
        },
      });
    } else {
      console.log("restart", 1);
      await prisma.order_details.create({
        data: {
          order_employee: { employee_id: 1 },
        },
      });
    }

    return res.json({
      message: "เก็ทแล้ว",
      totalEmployees,
      getEmployeeId,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
