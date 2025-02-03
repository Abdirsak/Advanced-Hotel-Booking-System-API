import { body } from "express-validator";
import mongoose from "mongoose";
import { Room } from "./model.js";

// Validation middleware for Room creation and update
export const validateRoom = [
  // Room Number validation
  body("roomNo")
    .notEmpty()
    .withMessage("Room Number is required")
    .isString()
    .withMessage("Room Number must be a string")
    .custom(async (value, { req }) => {
      // Check if the room number already exists in the database
      const exists = await Room.findOne({ roomNo: value });
      if (exists && (!req.params.id || exists._id.toString() !== req.params.id)) {
        throw new Error("Room Number must be unique");
      }
      return true;
    }),

  // Room Type validation
  body("roomType")
    .notEmpty()
    .withMessage("Room Type is required")
    .isIn(['Single', 'Double', 'Suite', 'Deluxe'])
    .withMessage("Invalid Room Type. Must be Single, Double, Suite, or Deluxe"),

  // Price Per Night validation
  body("pricePerNight")
    .notEmpty()
    .withMessage("Price Per Night is required")
    .isNumeric()
    .withMessage("Price Per Night must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price Per Night must be a positive number"),

  // Floor validation
  body("floor")
    .notEmpty()
    .withMessage("Floor is required")
    .isInt({ min: 0 })
    .withMessage("Floor must be a non-negative integer"),

  // Description validation (optional, but with length constraint if provided)
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  // Amenities validation (optional)
  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array")
    .custom((value) => {
      // Optional: Add more specific amenities validation if needed
      if (value && !value.every(item => typeof item === 'string')) {
        throw new Error("Each amenity must be a string");
      }
      return true;
    }),

  // Availability validation (optional)
  body("is_available")
    .optional()
    .isBoolean()
    .withMessage("Availability must be a boolean"),
];
