import express from "express";
import { upsertSetting } from "./controller.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

// Route to upsert Setting with file upload middleware
router.post("/setting", upload.single("logo"), upsertSetting);

export default router;
