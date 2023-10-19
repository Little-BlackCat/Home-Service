import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
  // #swagger.tags = ["Admin/Category"]
  // #swagger.summary = "Get all categories"

  const oders = req.query.orders;

  try {
    const allOrders = await prisma.orders.findMany({
      // where: {
      //   order_id: "ORD8892",
      // },
      select: {
        order_id: true,
        service_order: {
          select: {
            amount: true,
            sub_service: {
              select: {
                sub_service_name: true,
                unit: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        status: {
          select: {
            status: true,
          },
        },
        order_detail: {
          select: {
            working_time: true,
            address: true,
            subdistrict: true,
            district: true,
            province: true,
            details: true,
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    res.json({
      data: allOrders,
    });
  } catch (error) {
    console.error(error);
  }
});

router.put("/status/towork", async (req, res) => {
  const orderId = req.query.orderId;
  try {
    const toWorking = await prisma.orders.update({
      where: {
        order_id: orderId,
      },
      data: {
        status_id: 2,
      },
    });
    res.json({
      data: toWorking,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Status update error",
      error,
    });
  }
});

router.put("/status/tofinish", async (req, res) => {
  const orderId = req.query.orderId;

  console.log("Update status orderID:", orderId);
  try {
    const toFinish = await prisma.orders.update({
      where: {
        order_id: orderId,
      },
      data: {
        status_id: 3,
      },
    });
    res.json({
      data: toFinish,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Status update error",
      error,
    });
  }
});

router.get("/comingwork", async (req, res) => {
  const employeeEmail = req.query.email;
  console.log("/comingwork", employeeEmail);
  try {
    const comingwork = await prisma.orders.findMany({
      where: {
        status_id: 1,
      },
      select: {
        order_id: true,
        service_order: {
          select: {
            amount: true,
            sub_service: {
              select: {
                sub_service_name: true,
                unit: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        status: {
          select: {
            status: true,
          },
        },
        order_detail: {
          select: {
            working_time: true,
            address: true,
            subdistrict: true,
            district: true,
            province: true,
            details: true,
            order_employee: {
              employee: {
                where: employeeEmail,
              },
            },
          },
        },
      },
      orderBy: {
        order_detail: {
          working_time: "asc",
        },
      },
    });
    res.json({
      data: comingwork,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Status update error",
      error,
    });
  }
});

router.get("/working", async (req, res) => {
  const employeeEmail = req.query.email;
  console.log("/working", employeeEmail);
  try {
    const working = await prisma.orders.findMany({
      where: {
        status_id: 2,
      },
      select: {
        order_id: true,
        service_order: {
          select: {
            amount: true,
            sub_service: {
              select: {
                sub_service_name: true,
                unit: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        status: {
          select: {
            status: true,
          },
        },
        order_detail: {
          select: {
            working_time: true,
            address: true,
            subdistrict: true,
            district: true,
            province: true,
            details: true,
            order_employee: {
              employee: {
                where: employeeEmail,
              },
            },
          },
        },
      },
      orderBy: {
        order_detail: {
          working_time: "asc",
        },
      },
    });
    res.json({
      data: comingwork,
    });
    res.json({
      data: working,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Status update error",
      error,
    });
  }
});

router.get("/success", async (req, res) => {
  const employeeEmail = req.query.email;
  console.log("/success", employeeEmail);

  try {
    const success = await prisma.orders.findMany({
      where: {
        status_id: 3,
      },
      select: {
        order_id: true,
        service_order: {
          select: {
            amount: true,
            sub_service: {
              select: {
                sub_service_name: true,
                unit: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        status: {
          select: {
            status: true,
          },
        },
        order_detail: {
          select: {
            working_time: true,
            address: true,
            subdistrict: true,
            district: true,
            province: true,
            details: true,
            order_employee: {
              employee: {
                where: employeeEmail,
              },
            },
          },
        },
      },
      orderBy: {
        order_detail: {
          working_time: "asc",
        },
      },
    });
    res.json({
      data: comingwork,
    });
    res.json({
      data: success,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Status update error",
      error,
    });
  }
});

// //////////////////////////////////////////////

router.get("/namechang", async (req, res) => {
  const employeeEmail = req.query.email;
  // const employeeId = req.query.employee_Id;
  try {
    const name = await prisma.employee.findMany({
      where: {
        email: employeeEmail,
      },
      select: {
        name: true,
        order_employee: {
          select: {
            order_detail: {
              select: {
                working_time: true,
                address: true,
                subdistrict: true,
                district: true,
                province: true,
                details: true,
                order: {
                  select: {
                    user: {
                      select: {
                        name: true,
                        phone: true,
                        email: true,
                      },
                    },
                    order_id: true,
                    status_id: true,
                    service_order: {
                      select: {
                        sub_service: {
                          select: {
                            sub_service_name: true,
                          },
                        },
                      },
                    },
                  },
                  where: {
                    status_id: 1, // เงื่อนไขที่คุณต้องการ (status_id เท่ากับ 1)
                  },
                },
              },
            },
          },
        },
      },
    });
    return res.json({
      name,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "error",
      error,
    });
  }
});

export default router;
