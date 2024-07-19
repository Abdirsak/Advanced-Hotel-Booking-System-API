import { body } from "express-validator";

export const validate = [
  //Customer ID validation
  body("customer")
    .notEmpty()
    .withMessage("customer id is Required")
    .isMongoId()
    .withMessage("customer id must be mongo id"),

  // Sale Date validation
  body("receiptDate").notEmpty().withMessage("Receipt Date is required").isDate(),

//   TotalAmount validation
  body("amount").notEmpty().withMessage("Amount is Required field"),

//   reference validation
  // body("reference").notEmpty().withMessage("reference is Required field"),

//   receipt No validation
  body("receiptNo").notEmpty().withMessage("receipt No is Required field"),

  // Status validation
 
];
