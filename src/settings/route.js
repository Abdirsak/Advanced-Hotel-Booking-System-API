import express from "express";
import { upsertSetting, getCompanyProfile } from "./controller.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

// Route to upsert Setting with file upload middleware
router.post("/company-profile", upload.single("logo"), upsertSetting);
router.get("/company-profile", upload.single("logo"), getCompanyProfile);

export default router;
