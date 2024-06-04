import express from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
} from "./controller.js";
import { validateExpenses } from "./validate.js";

const router = express.Router();

router.get("/", getAllExpenses);
router.get("/:id", getSingleExpense);
router.post("/", validateExpenses, createExpense);
router.patch("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
