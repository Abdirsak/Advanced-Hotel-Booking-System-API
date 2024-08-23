import express from "express";
import { createRole, getRoles, updateRole, getRole } from "./controller.js";
import { validateRole } from "./validate.js";
import { AuthMiddleware } from "../users/middlewares.js";

const router = express.Router();

// Route to get all roles
router.get("/", AuthMiddleware, getRoles);

// Route to create a new role
router.post("/", AuthMiddleware, validateRole, createRole);

// Route to get single role
router.get("/:id", AuthMiddleware, getRole);

// Route to update an existing role
router.patch("/:id", AuthMiddleware, validateRole, updateRole);

export default router;
