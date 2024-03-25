import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getEmployees);
router.post("/", validate, createEmployee);
router.patch("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
