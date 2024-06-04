import express from "express";
import {
  createExpenseCategory,
  deleteExpenseCategory,
  getAllExpenseCategories,
  getSingleExpenseCategory,
  updateExpenseCategory,
} from "./controller.js";
import { validateExpenseCategory } from "./validate.js";

const router = express.Router();

router.get("/", getAllExpenseCategories);
router.get("/:id", getSingleExpenseCategory);
router.post("/", validateExpenseCategory, createExpenseCategory);
router.patch("/:id", updateExpenseCategory);
router.delete("/:id", deleteExpenseCategory);

export default router;
