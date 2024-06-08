import express from "express";
import {
  createSales,
  deleteSales,
  getSales,
  updateSales,
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getSales);
router.post("/", validate, createSales);
router.patch("/:id", updateSales);
router.delete("/:id", deleteSales);

export default router;
