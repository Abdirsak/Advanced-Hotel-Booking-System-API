import { body } from "express-validator";
import mongoose from "mongoose";

export const validate = [
   //FullName validation
   body("name")
      .notEmpty()
      .withMessage("name is Required")
      .isLength({ min: 3 })
      .withMessage("name must contained 3 at least"),

   //address validation
   body("address")
      .notEmpty()
      .withMessage("Address is required"),

   //contact validation
   body("contact")
      .notEmpty()
      .withMessage("contact is required"),

   //gender validation 
   body("gender")
      .notEmpty()
      .withMessage("Gender is required")
      .isIn(["Male", "Female"])
      .withMessage("invalid gender"),

      body("startDate")
      .notEmpty()
      .withMessage("Start Date is required")
      .isDate(),

      body("endDate")
      .notEmpty()
      .withMessage("End Date is required")
      .isDate(),
    
   //description validation
   body("description").optional()
]