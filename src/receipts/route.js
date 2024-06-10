import express from "express";
import {
  createReceipt,
  deleteReceipt,
  getReceipts,
  updateReceipt,
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getReceipts);
router.post("/", validate, createReceipt);
router.patch("/:id", updateReceipt);
router.delete("/:id", deleteReceipt);

export default router;
