import { body } from "express-validator";
import mongoose from "mongoose";

export const validate = [
  // supplier ID validation
  body("supplierId")
    .notEmpty()
    .withMessage("Supplier ID is required"),
    

  // Expected Date validation
  body("expectedDate").notEmpty().withMessage("Expected Date is required"),

  // Order Status validation
  body("orderStatus").notEmpty().withMessage("Order Status is required"),

  //Payment Status validation
  body("paymentStatus").notEmpty().withMessage("Payment Status is required"),

  //Billing Address validation
  body("billingAddress").notEmpty().withMessage("Billing Address  is required"),

  //Shipping Address validation
  body("shippingAddress").notEmpty().withMessage("Shipping Address is required"),

  // items validation
  body("items").notEmpty().withMessage("items  is required"),

  // orderAmount validation
  body("orderAmount").notEmpty().withMessage("Order Amount  is required"),

  // Tax Information validation
  body("taxInformation").notEmpty().withMessage("Tax Information  is required"),

  // Tax Information validation
  body("invoiceId").notEmpty().withMessage("Invoice ID  is required")

 
 
];
