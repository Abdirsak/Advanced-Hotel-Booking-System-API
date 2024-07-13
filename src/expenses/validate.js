import { body } from "express-validator";

// Validation middleware
export const validateExpenses = [
  // Expense Name validation

  // Expense Description validation
  body("description").notEmpty().withMessage("Description is required"),

  // Expense Category validation
  body("category").notEmpty().withMessage("Category is required"),

  // Expense Brand validation
  body("amount").notEmpty().withMessage("Amount is required"),

  // Expense Date validation
  body("date").notEmpty().withMessage("Date is required"),
];
