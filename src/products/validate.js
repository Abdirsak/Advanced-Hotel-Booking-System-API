import { body } from "express-validator";
import mongoose from "mongoose";

// Import the Products model
import Product from "./model.js";

// Validation middleware
export const validateProducts = [
  // Product Name validation
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters"),

  // Product Description validation
  body("description").notEmpty().withMessage("Description is required"),

  // Product Category validation
  body("category").notEmpty().withMessage("Category is required"),

  // Product Brand validation
  body("brand").notEmpty().withMessage("Brand is required"),

  // Product Price validation
  body("price").notEmpty().withMessage("Product price is required feild"),

  // Product Cost validation
  body("cost").notEmpty().withMessage("Product cost is required feild"),

  // Expired Date validation
  body("expireDate")
    .notEmpty()
    .withMessage("Expired Date is required")
    .isDate()
    .withMessage("Expired Date must be Date"),
];
