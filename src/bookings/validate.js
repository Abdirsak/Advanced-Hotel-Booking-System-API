import { body } from "express-validator";
import mongoose from "mongoose";

export const validate = [
  // Customer validation
  body("customer")
    .notEmpty()
    .withMessage("Customer is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid customer ID");
      }
      return true;
    }),

  // Room validation
  body("room")
    .notEmpty()
    .withMessage("Room is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid room ID");
      }
      return true;
    }),

  // Check-in date validation
  body("checkInDate")
    .notEmpty()
    .withMessage("Check-in date is required")
    .isISO8601()
    .withMessage("Check-in date must be a valid date"),

  // Check-out date validation
  body("checkOutDate")
    .notEmpty()
    .withMessage("Check-out date is required")
    .isISO8601()
    .withMessage("Check-out date must be a valid date")
    .custom((value, { req }) => {
      const checkInDate = new Date(req.body.checkInDate);
      const checkOutDate = new Date(value);
      
      if (checkOutDate <= checkInDate) {
        throw new Error("Check-out date must be after check-in date");
      }
      return true;
    }),

  // Total amount validation
  body("totalAmount")
    .notEmpty()
    .withMessage("Total amount is required")
    .isNumeric()
    .withMessage("Total amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number"),

  // Status validation
  body("status")
    .optional()
    .isIn(['Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Canceled'])
    .withMessage("Invalid booking status"),
];