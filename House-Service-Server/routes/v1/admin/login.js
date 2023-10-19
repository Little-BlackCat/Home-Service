import { Router } from "express";
import { prisma } from "../../../lib/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  // #swagger.tags = ["Admin/Login"]
  // #swagger.summary = "Get Admin/Technician by Email"
  const email = req.query.email;
  const role = req.query.role;

  if (role === "Admin") {
    try {
      const result = await prisma.admin.findMany({
        where: {
          email: email,
        },
      });
      if (result.length === 0) {
        return res.status(409).json({
          data: {
            message: `Cannot find this email`,
          },
        });
      }

      return res.json({
        data: {
          message: `Admin has this email: ${email} in database.`,
        },
      });
    } catch (error) {
      return console.error(error);
    }
  } else if (role === "Technician") {
    try {
      const result = await prisma.employee.findMany({
        where: {
          email: email,
        },
      });
      if (result.length === 0) {
        return res.status(409).json({
          data: {
            message: `Cannot find this email`,
          },
        });
      }

      return res.json({
        data: {
          message: `Technician has this email: ${email} in database.`,
        },
      });
    } catch (error) {
      return console.error(error);
    }
  }
});

export default router;
