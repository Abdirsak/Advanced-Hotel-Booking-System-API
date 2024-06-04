import { body } from "express-validator";
import mongoose from "mongoose";

// Import the Products model
import ExpenseCategory from "./model.js";

// Validation middleware
export const validateExpenseCategory = [
  // Expense Category Name validation
  body("name")
    .notEmpty()
    .withMessage("Expense ategory name is required")
    .isLength({ min: 3 })
    .withMessage("Expense Category name must be at least 3 characters"),
  // ExpenseC ategory Description validation
  body("description").notEmpty().withMessage("Description is required"),
];
