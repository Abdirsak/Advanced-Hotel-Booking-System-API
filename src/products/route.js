import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./controller.js";
import { validateProducts } from "./validate.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", validateProducts, createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
