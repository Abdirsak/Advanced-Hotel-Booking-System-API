import { body } from "express-validator";
import mongoose from "mongoose";

export const validate = [
   //FullName validation
   body("fullName")
      .notEmpty()
      .withMessage("fullName is Required")
      .isLength({ min: 3 })
      .withMessage("FullName must contained 3 at least"),

   //address validation
   body("address")
      .notEmpty()
      .withMessage("Address is required"),

   //contect validation
   body("contect")
      .notEmpty()
      .withMessage("contect is required"),

   //gender validation 
   body("gender")
      .notEmpty()
      .withMessage("Gender is required")
      .isIn(["Male", "Female"])
      .withMessage("invalid gender"),

   //description validation
   body("description").optional()
]