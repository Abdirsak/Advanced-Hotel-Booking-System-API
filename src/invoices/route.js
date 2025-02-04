import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  updateInvoice,
  getSingleInvoice,
} from "./controller.js";

const router = express.Router();

// Get all invoices (requires authentication)
router.get("/", 
  getInvoices
);

// Create a new invoice (requires authentication and validation)
router.post("/",
  createInvoice
);

// Get a single invoice by ID (requires authentication)
router.get("/:id",
  getSingleInvoice
);

// Update an existing invoice (requires authentication and validation)
router.patch("/:id",
  updateInvoice
);

// Delete an invoice (requires authentication)
router.delete("/:id",
  deleteInvoice
);

export default router;