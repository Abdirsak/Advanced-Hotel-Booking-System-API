import express from "express";
import {
  createBooking,
  deleteBooking,
  findAllBookings,
  findOneBooking,
  updateBooking
} from "./controller.js";
import { validate } from "./validate.js";

const router = express.Router();

router.get("/", findAllBookings);
router.get("/:id", findOneBooking);
router.post("/", validate, createBooking);
router.patch("/:id", validate, updateBooking);
router.delete("/:id", deleteBooking);

export default router;