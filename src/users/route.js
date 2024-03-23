import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  Login
} from "./controller.js";
import { validate } from "./validation.js";
import { AuthMiddleware } from "./middlewares.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", validate, createUser);
router.post("/login", Login);

router.patch("/:id",AuthMiddleware, updateUser);
router.delete("/:id",AuthMiddleware, deleteUser);

export default router;
