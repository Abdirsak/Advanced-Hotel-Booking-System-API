import express from "express";
import {
  createProductCategory,
  deleteProductCategory,
  getAllProductCategories,
  getSingleProductCategory,
  updateProductCategory,
} from "./controller.js";
import { validateProductCategory } from "./validate.js";

const router = express.Router();

router.get("/", getAllProductCategories);
router.get("/:id", getSingleProductCategory);
router.post("/", validateProductCategory, createProductCategory);
router.patch("/:id", updateProductCategory);
router.delete("/:id", deleteProductCategory);

export default router;
