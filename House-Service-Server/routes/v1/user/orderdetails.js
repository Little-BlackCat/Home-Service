import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const {
    address,
    details,
    province,
    district,
    subdistrict,
    working_time,
    user_email,
    status_id,
    promotion_code,
    sub_service_orders,
    totalprice,
  } = req.body;

  //สร้าง order_id
  function generateOrderId() {
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // เดือน
    const day = currentDate.getDate().toString().padStart(2, "0"); // วันที่
    const randomDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

    const newOrderId = `ORD${month}${day}${randomDigits}`;

    return newOrderId;
  }
  const newOrderId = generateOrderId();

  try {
    const workingTimeTimestamp = new Date(working_time);

    const getUserId = await prisma.Customer_profile.findMany({
      where: {
        email: user_email,
      },
      select: {
        id: true,
      },
    });

    console.log(getUserId);
    // if (getUserId.length > 0) {
    //   console.log(getUserId[0].id);
    // }
    const userId = getUserId[0].id;

    //หา id ช่าง
    const totalEmployees = await prisma.Employee.count();

    const getEmployeeId = await prisma.Order_Employee.findFirst({
      orderBy: { order_employee_id: "desc" },
      select: { employee_id: true },
    });

    const lastEmployeeId = !getEmployeeId ? 0 : getEmployeeId.employee_id;
    let newEmployeeId;

    if (lastEmployeeId < totalEmployees) {
      console.log(lastEmployeeId + 1);
      newEmployeeId = lastEmployeeId + 1;
    } else {
      console.log("restart", 1);
      newEmployeeId = 1;
    }

    //สร้าง order_employee_id
    const latestOrderEmployeeId = await prisma.Order_Employee.findFirst({
      orderBy: { order_employee_id: "desc" },
    });

    let newOrderEmployeeId;
    if (latestOrderEmployeeId) {
      newOrderEmployeeId = latestOrderEmployeeId.order_employee_id + 1;
    } else {
      newOrderEmployeeId = 1;
    }

    const orderDetail = await prisma.Order_details.create({
      data: {
        address,
        details,
        province,
        district,
        subdistrict,
        working_time: workingTimeTimestamp,
        order: {
          create: {
            order_id: newOrderId,
            user_id: userId,
            status_id,
            promotion_code,
            totalprice,
          },
        },
        order_employee: {
          create: {
            order_employee_id: newOrderEmployeeId,
            employee_id: newEmployeeId,
          },
        },
      },
    });

    //สร้าง subservice orders
    const serviceOrders = await Promise.all(
      sub_service_orders.map(async (subServiceOrder, index) => {
        const { name, count } = subServiceOrder;

        //สร้าง service_order_id
        if (count > 0) {
          const getServiceOrder = await prisma.Service_Order.findFirst({
            orderBy: { service_order_id: "desc" },
            select: { service_order_id: true },
          });

          const latestServiceOrder = !getServiceOrder
            ? 0
            : getServiceOrder.service_order_id;

          const newServiceOrderId = latestServiceOrder + 1;

          //หา id ของ subservice
          const getSubServiceId = await prisma.Sub_services.findMany({
            where: {
              sub_service_name: name,
            },
            select: {
              id: true,
            },
          });
          const subServiceId = getSubServiceId[0].id;

          return prisma.Service_Order.create({
            data: {
              order_id: newOrderId,
              sub_service_id: subServiceId,
              service_order_id: newServiceOrderId,
              amount: count,
            },
          });
        }
      })
    );

    res.json({
      orderDetail,
      serviceOrders,
      message: "Order Created :)",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error creating order", message: error.message });
  }
});

export default router;
