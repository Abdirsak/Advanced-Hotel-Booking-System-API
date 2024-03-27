import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "./controller.js";
import { validateEmployee } from "./validate.js";

const router = express.Router();

router.get("/", getEmployees);
router.post("/", validateEmployee, createEmployee);
router.patch("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
