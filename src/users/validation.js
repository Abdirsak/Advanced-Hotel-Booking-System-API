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

  // Department ID  validation
  body("departmentId")
    .notEmpty()
    .withMessage("Department ID is required"),

    // user status validation
  body("status")
    .notEmpty()
    .withMessage("User Status is required"),

    // created user validation
  body("createdBy")
    .notEmpty()
    .withMessage("Created User or createdBy is required"),

  // Description validation
  body("description").optional()
  
];
