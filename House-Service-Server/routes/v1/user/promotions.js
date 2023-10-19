import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/:id", async (req, res) => {
  // #swagger.tags = ["Admin/Promotions"]
  // #swagger.summary = "Get Promotion code by id"
  const promotionId = req.params.id;
  console.log(promotionId);
  try {
    const promotion = await prisma.promotions.findUnique({
      where: {
        promotion_code: promotionId,
      },
    });

    res.json({
      data: promotion,
    });
  } catch (error) {
    res.json({
      message: error,
    });
  }
});

export default router;
