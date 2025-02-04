import Booking from "./model.js";
import { validationResult } from "express-validator";
import Room from "../Room/model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the room is available
    const { room, checkInDate, checkOutDate } = req.body;
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

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking
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

// Update a booking
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

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating booking", 
      error: error.message 
    });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
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