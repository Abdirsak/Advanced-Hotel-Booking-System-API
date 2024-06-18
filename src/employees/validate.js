import { body } from "express-validator";
import mongoose from "mongoose";
import Employee from "./model.js";

// Validation middleware
export const validateEmployee = [
  // Full Name validation
  body("fullName")
    .notEmpty()
    .withMessage("Full Name is required")
    .isLength({ min: 3 })
    .withMessage("Full Name must be at least 3 characters"),

  // Date of Birth validation
  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of Birth is required"),
  

  // Gender validation
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female"])
    .withMessage("Invalid Gender"),

  // Contact validation
  body("contact")
    .notEmpty()
    .withMessage("Contact is required")
    .custom(async (value, { req }) => {
      // Check if the contact already exists in the database
      const exists = await Employee.findOne({ contact: value });
      if (exists) {
        throw new Error("Contact must be unique");
      }
      // Return true if the contact is unique
      return true;
    }),

  // Address validation
  body("address").notEmpty().withMessage("Address is required"),

  // Position validation
  body("position").notEmpty().withMessage("Position is required"),

  // Department validation
  body("department").notEmpty().withMessage("Department is required"),

  // Hiring Date validation
  body("hiringDate")
    .notEmpty()
    .withMessage("Hiring Date is required"),

  // Salary validation
  body("salary")
    .notEmpty()
    .withMessage("Salary is required")
    .isNumeric()
    .withMessage("Invalid Salary"),

  // Emergency Contact validation
  body("emergencyContact")
    .notEmpty()
    .withMessage("Emergency Contact is required"),

  // Description validation (optional)
  body("description").optional(),
];
