import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
  getSingleEmployee,
} from "./controller.js";
import { validateEmployee } from "./validate.js";

const router = express.Router();

router.get("/", getEmployees);
router.get("/:id", getSingleEmployee);
router.post("/", validateEmployee, createEmployee);
router.patch("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
