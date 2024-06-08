import express from "express";
import {
  createPayment,
  deletePayment,
  getPayments,
  updatePayment,
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getPayments);
router.post("/", validate, createPayment);
router.patch("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;
