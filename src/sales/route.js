import express from "express";
import {
  createSales,
  deleteSales,
  getSales,
  getSalesById,
  updateSales,
  getLosOrProfitSales,
  getSalesLedger
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getSales);
router.get("/los/profit/:startDate?/:endDate?", getLosOrProfitSales);
router.get("/ledger/:startDate?/:endDate?", getSalesLedger);
router.get("/:id", getSalesById);
router.post("/", validate, createSales);
router.patch("/:id", updateSales);
router.delete("/:id", deleteSales);

export default router;
