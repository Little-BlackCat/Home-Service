import { Router } from "express";

const router = new Router();

router.get("/", (req, res) => {
  // #swagger.tags = ["User/Products"]
  // #swagger.summary = "Get all products"
  res.send("Hello, world!");
});

router.get("/:id", (req, res) => {
  // #swagger.tags = ["User/Products"]
  // #swagger.summary = "Get products by id"
  res.send("Hello, world!");
});

export default router;
