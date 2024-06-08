import { body } from "express-validator";

export const validate = [
  //Sales ID validation
  body("sales")
    .notEmpty()
    .withMessage("Sales id is Required")
    .isMongoId()
    .withMessage("Sales id must be mongo id"),

  // Invoice Date validation
  body("invoiceDate")
    .notEmpty()
    .withMessage("Invoice Date is required")
    .isDate(),

  //Due Date validation
  body("dueDate").notEmpty().withMessage("Due Date is required").isDate(),

  //TotalAmount validation
  body("totalAmount").notEmpty().withMessage("totalAmount is Required field"),

  // Status validation
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["unpaid", "paid", "overdue"])
    .withMessage("Invalid Status"),
];
