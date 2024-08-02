import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceByCustomerId,
  getInvoices,
  updateInvoice,
  getLastInvoiceNo
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getInvoices);
router.get("/invoiceNo/last", getLastInvoiceNo);
router.get("/single/:customerId?", getInvoiceByCustomerId);
router.post("/", validate, createInvoice);
router.patch("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;
