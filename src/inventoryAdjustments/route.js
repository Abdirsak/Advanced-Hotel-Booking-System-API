import express from "express";
import {
  createInventoryAdjustment,
  deleteInventoryAdjustment,
  getAllInventoryAdjustment,
  updateInventoryAdjustment,
  getSingleInventoryAdjustment
} from "./controller.js";
import { validateInventoryAdjustment } from "./validate.js";

const router = express.Router();

router.get("/", getAllInventoryAdjustment);
router.get("/:id", getSingleInventoryAdjustment);
router.post("/", validateInventoryAdjustment, createInventoryAdjustment);
router.patch("/:id", updateInventoryAdjustment);
router.delete("/:id", deleteInventoryAdjustment);

export default router;
