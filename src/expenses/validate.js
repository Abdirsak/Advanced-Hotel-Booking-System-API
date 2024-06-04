import { body } from "express-validator";
import mongoose from "mongoose";

// Import the Products model
import Expense from "./model.js";

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
  body("expDate")
    .notEmpty()
    .withMessage("Expired Date is required")
    .isDate()
    .withMessage("Expired Date must be Date"),
];
