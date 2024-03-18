import { body } from "express-validator";
import mongoose from "mongoose";

export const validate = [
  // Name validation
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  // Address validation
  body("address").notEmpty().withMessage("Address is required"),

  // Contact validation
  body("contact").notEmpty().withMessage("Contact is required"),

  // Director validation
  body("director")
    .notEmpty()
    .withMessage("Director is required")
    .isLength({ min: 3 })
    .withMessage("Director name must be at least 3 characters"),

  // Opening hours validation
  body("workingHours.from")
    .notEmpty()
    .withMessage("Working hours 'from' is required"),

  body("workingHours.to")
    .notEmpty()
    .withMessage("Working hours 'to' is required"),

  // Description validation
  body("description").optional(),
];
