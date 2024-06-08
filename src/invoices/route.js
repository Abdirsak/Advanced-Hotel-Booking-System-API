import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  updateInvoice,
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getInvoices);
router.post("/", validate, createInvoice);
router.patch("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;
