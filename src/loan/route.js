import express from "express";
import {
  createLoan,
  deleteLoan,
  getAllLoans,
  updateLoan,
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getAllLoans);
router.post("/", validate, createLoan);
router.patch("/:id", updateLoan);
router.delete("/:id", deleteLoan);

export default router;
