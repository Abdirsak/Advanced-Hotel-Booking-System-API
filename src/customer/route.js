import express from 'express'
import { createCustomer, deleteCustomer, getCustomer, updateCustomer } from './controller';
import { validate } from './validate.js';

const router = express.Router();

router.get("/", getCustomer);
router.post("/", validate, createCustomer);
router.patch("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;