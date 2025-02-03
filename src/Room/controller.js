import { validationResult } from "express-validator";
import { Room } from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";

// Get all rooms with optional pagination and filtering
export const getRooms = getAll(Room);

// Get a single room by ID
export const getSingleRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid room id" });

    const room = await Room.findById(id);
    
    if (!room)
      return res
        .status(404)
        .json({ status: false, message: "Room not found" });

    res.send({ status: true, data: room });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNo: req.body.roomNo });
    if (existingRoom) {
      return res.status(400).json({ 
        status: false, 
        message: "Room number already exists" 
      });
    }

    // Add the currently logged-in user as the creator
    req.body.createdBy = req.user._id;

    const room = await Room.create(req.body);

    res.status(201).send({
      status: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// Update an existing room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid room id" });

    // Check if room exists
    const existingRoom = await Room.findById(id);
    if (!existingRoom)
      return res
        .status(404)
        .json({ status: false, message: "Room not found" });

    // Prevent changing room number if it would create a duplicate
    if (req.body.roomNo && req.body.roomNo !== existingRoom.roomNo) {
      const duplicateRoom = await Room.findOne({ roomNo: req.body.roomNo });
      if (duplicateRoom) {
        return res.status(400).json({ 
          status: false, 
          message: "Room number already exists" 
        });
      }
    }

    const updatedRoom = await Room.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    res.status(200).send({
      status: true,
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid room id" });

    const deletedRoom = await Room.findOneAndDelete({ _id: id });

    if (!deletedRoom)
      return res
        .status(404)
        .json({ status: false, message: "Room not found" });

    res.send({
      status: true,
      message: "Room deleted successfully",
      data: deletedRoom,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
