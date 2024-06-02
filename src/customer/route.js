import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getCustomers);
router.post("/", validate, createCustomer);
router.patch("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
