import { Router } from "express";
import { prisma } from "../../../lib/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  // #swagger.tags = ["User/Categories"]
  // #swagger.summary = "Get all categories"

  try {
    const allcategories = await prisma.categories.findMany({
      select: {
        id: true,
        category_name: true,
      },
      orderBy: {
        category_name: "asc",
      },
    });

    res.json({
      data: allcategories,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
