import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
  Login,
} from "./controller.js";
import { validate } from "./validation.js";
import { AuthMiddleware } from "./middlewares.js";

const router = express.Router();

router.get("/", AuthMiddleware, getUsers);
router.get("/:id", AuthMiddleware, getUserById);
router.post("/", validate, AuthMiddleware, createUser);
router.post("/login", Login);

router.patch("/:id", AuthMiddleware, updateUser);
router.delete("/:id", AuthMiddleware, deleteUser);

export default router;
