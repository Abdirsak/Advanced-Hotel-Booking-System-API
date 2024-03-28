import { body } from "express-validator";
import mongoose from "mongoose";

// Import the Employee model
// import Employee from "./EmployeeModel"; // Assuming this is the path to your Employee model

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
    .withMessage("Date of Birth is required")
    .isDate()
    .withMessage("Invalid Date of Birth"),

  // Gender validation
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female"])
    .withMessage("Invalid Gender"),

  // Contact validation
  body("contact").notEmpty().withMessage("Contact is required"),

  // Address validation
  body("address").notEmpty().withMessage("Address is required"),

  // Position validation
  body("position").notEmpty().withMessage("Position is required"),

  // Department validation
  body("department").notEmpty().withMessage("Department is required"),

  // Hiring Date validation
  body("hiringDate")
    .notEmpty()
    .withMessage("Hiring Date is required")
    .isDate()
    .withMessage("Invalid Hiring Date"),

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
