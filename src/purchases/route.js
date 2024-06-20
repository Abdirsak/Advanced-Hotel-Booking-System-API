import express from "express";
import {
  createPurchase,
  deletePurchase,
  getPurchases,
  updatePurchase
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getPurchases);
router.post("/", validate, createPurchase);
router.patch("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

export default router;
