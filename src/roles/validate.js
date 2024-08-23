import { body } from "express-validator";

export const validateRole = [
  // Name validation
  body("name")
    .notEmpty()
    .withMessage("Role name is required")
    .isString()
    .withMessage("Role name must be a string"),

  // Description validation
  body("description")
    .notEmpty()
    .withMessage("Role description is required")
    .isString()
    .withMessage("Role description must be a string"),

  // Abilities validation
  body("abilities")
    .isArray({ min: 1 })
    .withMessage("Abilities must be an array with at least one item")
    .custom((abilities) => {
      abilities.forEach((ability) => {
        if (!ability.subject || typeof ability.subject !== "string") {
          throw new Error("Each ability must have a valid subject");
        }
        if (!Array.isArray(ability.action) || ability.action.length === 0) {
          throw new Error(
            "Each ability must have an action array with at least one action"
          );
        }
        ability.action.forEach((action) => {
          if (typeof action !== "string") {
            throw new Error("Each action must be a string");
          }
        });
      });
      return true;
    }),
];
