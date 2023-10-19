import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/name", async (req, res) => {
  const employeeEmail = req.query.email;
  console.log("/name:", employeeEmail);

  try {
    const name = await prisma.employee.findMany({
      where: {
        email: employeeEmail,
      },
      select: {
        name: true,
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

router.get("/comingwork", async (req, res) => {
  const employeeEmail = req.query.email;
  console.log("/comingwork:", employeeEmail);
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
                    status: {
                      select: {
                        status: true,
                      },
                    },
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
                  },
                  where: {
                    status_id: 1,
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

router.get("/working", async (req, res) => {
  const employeeEmail = req.query.email;
  console.log("/working:", employeeEmail);

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
                    status: {
                      select: {
                        status: true,
                      },
                    },
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
                  },
                  where: {
                    status_id: 2,
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

router.get("/success", async (req, res) => {
  const employeeEmail = req.query.email;
  console.log("/success:", employeeEmail);

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
                    status: {
                      select: {
                        status: true,
                      },
                    },
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
                  },
                  where: {
                    status_id: 3,
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
