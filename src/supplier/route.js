import express from 'express'
import { createSupplier, deleteSupplier, getSupplier, updateSupplier } from './controller.js';
import { validate } from './validate.js';

const router = express.Router();

router.get("/", getSupplier);
router.post("/", validate, createSupplier);
router.patch("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

export default router;