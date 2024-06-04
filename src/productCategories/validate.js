import { body } from "express-validator";
import mongoose from "mongoose";

// Import the Products model
import ProductCategory from "./model.js";

// Validation middleware
export const validateProductCategory = [
  // Product Category Name validation
  body("name")
    .notEmpty()
    .withMessage("Product Category name is required")
    .isLength({ min: 3 })
    .withMessage("Product Category name must be at least 3 characters"),
  // ExpenseC ategory Description validation
  body("description").notEmpty().withMessage("Description is required"),
];
