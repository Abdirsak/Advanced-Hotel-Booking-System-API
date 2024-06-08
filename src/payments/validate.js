import { body } from "express-validator";

export const validate = [
  //invoice ID validation
  body("invoiceId")
    .notEmpty()
    .withMessage("invoice id is Required")
    .isMongoId()
    .withMessage("invoice id must be mongo id"),

  // payment Date validation
  body("paymentDate")
    .notEmpty()
    .withMessage("Payment Date is required")
    .isDate(),

  //amount validation
  body("amount").notEmpty().withMessage("amount is Required field"),

  // method validation
  body("method")
    .notEmpty()
    .withMessage("method is required")
];
