import { body } from "express-validator";
import mongoose from "mongoose";

// Import the Inventory Adjustment model
import InventoryAdjustment from "./model.js";

// Validation middleware
export const validateInventoryAdjustment = [
  // InventoryAdjustment Name validation
  body("type")
    .notEmpty()
    .withMessage("Inventory Adjustment type is required"),
 

  // Inventory Adjustment Description validation
  body("reasn").notEmpty().withMessage("Reason is required"),

  // Inventory Adjustment Quantity validation
  body("quantity").notEmpty().withMessage("Quantity is required"),

  

];
