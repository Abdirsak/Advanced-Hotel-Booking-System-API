import express from "express";
import { createOrUpdateMenus, getAllMenus } from "./controller.js";

const router = express.Router();

router.get("/", getAllMenus);
router.post("/", createOrUpdateMenus);

export default router;
