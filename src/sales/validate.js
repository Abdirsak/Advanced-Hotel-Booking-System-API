import { body } from "express-validator";

export const validate = [
  //Customer ID validation
  body("customer")
    .notEmpty()
    .withMessage("customer id is Required")
    .isMongoId()
    .withMessage("customer id must be mongo id"),

  // Sale Date validation
  body("saleDate").notEmpty().withMessage("Sale Date is required").isDate(),

  //TotalAmount validation
  // body("totalAmount").notEmpty().withMessage("totalAmount is Required field"),

  // Status validation
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["completed", "pending", "cancelled"])
    .withMessage("Invalid Status"),
];
