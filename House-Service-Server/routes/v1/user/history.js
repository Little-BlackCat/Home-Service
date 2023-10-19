import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = new Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const currentLoginEmail = req.query.email;
    console.log(currentLoginEmail);
    const response = await prisma.orders.findMany({
      where: {
        user: {
          email: currentLoginEmail,
        },
        status_id: 3,
      },
      select: {
        order_id: true,
        totalprice: true,
        promotion_code: true,
        order_detail: {
          select: {
            working_time: true,
            order_employee: {
              select: {
                employee: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        service_order: {
          select: {
            amount: true,
            sub_service: {
              select: {
                sub_service_name: true,
                price_per_unit: true,
                unit: true,
              },
            },
          },
        },
        status: {
          select: {
            status: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json({
      message: "Data fetched successfully!",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "Error fetching order details:",
      error,
    });
  }
});

export default router;
