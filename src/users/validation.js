import { body } from "express-validator";


export const validate = [

  // username validation
  body("username").notEmpty()
  .withMessage("Username is required")
  .isLength({ min: 3 })
  .withMessage("Username must be at least 3 characters"),

  // password validation
  body("password").notEmpty()
  .withMessage("password is required")
  .isLength({ min: 3 })
  .withMessage("password must be at least 3 characters"),

    // full name validation
  body("fullName").notEmpty().withMessage("full name is required")
  .isLength({ min: 3 })
  .withMessage("Full Name must be at least 3 characters"),

  // user role validation
  body("role")
    .notEmpty()
    .withMessage("user role is required"),

     // Contact validation
  body("contact")
  .notEmpty()
  .withMessage("Contact is required")
  .custom(async (value, { req }) => {
    // Check if the contact already exists in the database
    const exists = await Employee.findOne({ contact: value });
    if (exists) {
      throw new Error("Contact must be unique");
    }
    // Return true if the contact is unique
    return true;
  }),

    // user status validation
  body("status")
    .notEmpty()
    .withMessage("User Status is required"),

    // created user validation
  body("createdBy"),
  
];
