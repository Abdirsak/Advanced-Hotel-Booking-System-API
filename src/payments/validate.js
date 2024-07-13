import { body, validationResult } from "express-validator";

export const validate = [
  // expense ID validation
  body("expenseId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("expense id must be a valid mongo id"),

  // purchase ID validation
  body("purchaseId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("purchase id must be a valid mongo id"),

  // payment Date validation
  body("paymentDate")
    .notEmpty()
    .withMessage("Payment Date is required")
    .isDate(),

  // amount validation
  body("amount").notEmpty().withMessage("amount is a required field"),

  // method validation
  body("method").notEmpty().withMessage("method is required"),

  // custom validation to ensure only one of purchaseId or expenseId is provided
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { expenseId, purchaseId } = req.body;

    if ((expenseId && purchaseId) || (!expenseId && !purchaseId)) {
      return res.status(400).json({
        errors: [
          {
            msg: "Either purchaseId or expenseId must be provided, but not both.",
            param: "purchaseId, expenseId",
            location: "body",
          },
        ],
      });
    }

    next();
  },
];
