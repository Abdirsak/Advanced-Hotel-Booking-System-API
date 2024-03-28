import { body } from "express-validator";
import mongoose from "mongoose";

export const validate = [
   //SupplierName validation
   body("SupplierName")
      .notEmpty()
      .withMessage("SupplierName is Required")
      .isLength({ min: 3 })
      .withMessage("SupplierName must contained 3 at least"),

   //email validation
   body("email")
   .notEmpty()
   .withMessage("email is required"),

   //phone validation
   body("phone")
   .notEmpty()
   .withMessage("phone is required"),

   //address validation
   body("address")
      .notEmpty()
      .withMessage("Address is required"),

   //country validation
   body("country")
   .notEmpty()
   .withMessage("country is required"),

   //description validation
   body("description").optional()
]