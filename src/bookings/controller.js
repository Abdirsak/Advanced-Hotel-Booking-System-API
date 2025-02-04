import Booking from "./model.js";
import Invoice from "../invoices/model.js";
import { validationResult } from "express-validator";
import Room from "../Room/model.js";

// Create a new booking with associated invoice
export const createBooking = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the room is available
    const { room, checkInDate, checkOutDate, customer } = req.body;
    const existingBookings = await Booking.find({
      room: room,
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gt: new Date(checkInDate) }
        }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: "Room is not available for the selected dates" });
    }

    req.body.createdBy = req.user._id;

    // Create new booking
    const newBooking = new Booking({
      ...req.body
    });

    await newBooking.save();

    // Calculate total amount (you might want to adjust this calculation)
    const roomDetails = await Room.findById(newBooking.room);
    const totalAmount = roomDetails.price * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));

    // Create associated invoice
    const newInvoice = new Invoice({
      booking: newBooking._id,
      customer: customer,
      totalAmount: req.body.totalAmount,
      status: 'Pending',
      createdBy: req.user._id
    });

    await newInvoice.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
      invoice: newInvoice
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating booking", 
      error: error.message 
    });
  }
};

// Find all bookings with pagination
export const findAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || {};

    const options = {
      page,
      limit,
      populate: [
        { path: 'customer' },
        { path: 'room' }
      ],
      sort: { createdAt: -1 }
    };

    // Construct search criteria based on the search parameter
    let query = {};

    // If search is a string (legacy support), search by status
    if (typeof search === 'string') {
      query = { status: { $regex: search, $options: 'i' } };
    } 
    // If search is an object with keyword and fields
    else if (search.keyword && search.fields) {
      const searchFields = Array.isArray(search.fields) ? search.fields : [search.fields];
      query = {
        $or: searchFields.map((field) => ({
          [field]: { $regex: String(search.keyword), $options: 'i' }
        }))
      };
    }

    const result = await Booking.paginate(query, options);

    res.status(200).json({
      message: "Bookings retrieved successfully",
      data: result,
      totalPages: result.totalPages,
      currentPage: result.page,
      totalBookings: result.totalDocs
    });
  } catch (error) {
    console.error('Booking search error:', error);
    res.status(500).json({ 
      message: "Error retrieving bookings", 
      error: error.message 
    });
  }
};

// Find a single booking by ID
export const findOneBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer')
      .populate('room')
      .populate('createdBy');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking retrieved successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving booking", 
      error: error.message 
    });
  }
};

// Update a booking with associated invoice update
export const updateBooking = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if booking exists
    const existingBooking = await Booking.findById(req.params.id);
    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check room availability if room or dates are being changed
    if (req.body.room || req.body.checkInDate || req.body.checkOutDate) {
      const roomToCheck = req.body.room || existingBooking.room;
      const checkInDate = req.body.checkInDate ? new Date(req.body.checkInDate) : existingBooking.checkInDate;
      const checkOutDate = req.body.checkOutDate ? new Date(req.body.checkOutDate) : existingBooking.checkOutDate;

      const conflictingBookings = await Booking.find({
        _id: { $ne: req.params.id }, // Exclude current booking
        room: roomToCheck,
        $or: [
          {
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate }
          }
        ]
      });

      if (conflictingBookings.length > 0) {
        return res.status(400).json({ message: "Room is not available for the selected dates" });
      }
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    // Find and update associated invoice
    const existingInvoice = await Invoice.findOne({ booking: req.params.id });
    
    if (existingInvoice) {
      // Recalculate total amount if dates or room changed
      const roomDetails = await Room.findById(updatedBooking.room);
      const totalAmount = roomDetails.price * Math.ceil((new Date(updatedBooking.checkOutDate) - new Date(updatedBooking.checkInDate)) / (1000 * 60 * 60 * 24));

      // Update invoice with new details
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        existingInvoice._id,
        {
          totalAmount: req.body.totalAmount,
          customer: updatedBooking.customer,
          status: req.body.status || existingInvoice.status
        },
        { new: true }
      );

      res.status(200).json({
        message: "Booking and invoice updated successfully",
        booking: updatedBooking,
        invoice: updatedInvoice
      });
    } else {
      // If no invoice exists, create a new one
      const newInvoice = new Invoice({
        booking: updatedBooking._id,
        customer: updatedBooking.customer,
        totalAmount: roomDetails.price * Math.ceil((new Date(updatedBooking.checkOutDate) - new Date(updatedBooking.checkInDate)) / (1000 * 60 * 60 * 24)),
        status: 'Pending',
        createdBy: req.user._id
      });

      await newInvoice.save();

      res.status(200).json({
        message: "Booking updated and new invoice created",
        booking: updatedBooking,
        invoice: newInvoice
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating booking", 
    });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    // Check if there's an existing invoice for this booking
    const existingInvoice = await Invoice.findOne({ booking: req.params.id });

    if (existingInvoice) {
      return res.status(400).json({ 
        message: "This booking cannot be deleted because it has a related invoice" 
      });
    }

    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ 
      message: "Booking deleted successfully",
      booking 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting booking", 
      error: error.message 
    });
  }
};