import { validationResult } from "express-validator";
import Invoice from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";
import Booking from "../bookings/model.js";

// Get all invoices with optional pagination and filtering
export const getInvoices = getAll(Invoice);

// Get a single invoice by ID
export const getSingleInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid invoice id" });

    const invoice = await Invoice.findById(id)
      .populate('booking', 'bookingNumber')
      .populate('customer', 'fullName')
      .populate('createdBy', 'fullName');
    
    if (!invoice)
      return res
        .status(404)
        .json({ status: false, message: "Invoice not found" });

    res.send({ status: true, data: invoice });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Create a new invoice
export const createInvoice = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: false, 
        errors: errors.array() 
      });
    }

    // Add the currently logged-in user as the creator
    req.body.createdBy = req.user._id;

    const invoice = await Invoice.create(req.body);

    res.status(201).send({
      status: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// Update an existing invoice
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid invoice id" });

    // Check if invoice exists
    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice)
      return res
        .status(404)
        .json({ status: false, message: "Invoice not found" });

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: false, 
        errors: errors.array() 
      });
    }

    // Only allow updating status
    const allowedStatuses = ['Paid', 'Cancelled'];
    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ 
        status: false, 
        message: "Invalid status. Only 'Paid' and 'Cancelled' are allowed." 
      });
    }

    // Prevent changing other fields
    const updateData = { status: req.body.status };

    // Update invoice
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    // Update related booking status
    if (updatedInvoice.booking) {
      const bookingStatus = updatedInvoice.status === 'Paid' 
        ? 'Confirmed' 
        : (updatedInvoice.status === 'Cancelled' ? 'Cancelled' : undefined);

      if (bookingStatus) {
        await Booking.findByIdAndUpdate(
          updatedInvoice.booking, 
          { status: bookingStatus }
        );
      }
    }

    res.status(200).send({
      status: true,
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Delete an invoice
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid invoice id" });

    const deletedInvoice = await Invoice.findOneAndDelete({ _id: id });

    if (!deletedInvoice)
      return res
        .status(404)
        .json({ status: false, message: "Invoice not found" });

    res.send({
      status: true,
      message: "Invoice deleted successfully",
      data: deletedInvoice,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};