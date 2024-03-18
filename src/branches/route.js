import express from "express";
import {
  createBranch,
  deleteBranch,
  getBranches,
  updateBranch,
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", getBranches);
router.post("/", validate, createBranch);
router.patch("/:id", updateBranch);
router.delete("/:id", deleteBranch);

export default router;
