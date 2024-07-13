import express from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  payExpense,
} from "./controller.js";
import { validateExpenses } from "./validate.js";
import { AuthMiddleware } from "../users/middlewares.js";

const router = express.Router();

router.get("/", AuthMiddleware, getAllExpenses);
router.get("/:id", AuthMiddleware, getSingleExpense);
router.post("/", AuthMiddleware, validateExpenses, createExpense);
router.patch("/pay/:id", AuthMiddleware, validateExpenses, payExpense);
router.patch("/:id", AuthMiddleware, updateExpense);
router.delete("/:id", AuthMiddleware, deleteExpense);

export default router;
