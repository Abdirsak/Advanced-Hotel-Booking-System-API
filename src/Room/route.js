import express from "express";
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
  getSingleRoom,
} from "./controller.js";
import { validateRoom } from "./validate.js";
const router = express.Router();

router.get("/", getRooms);

router.post("/", 
  validateRoom, 
  createRoom
);
router.get("/:id", getSingleRoom);
router.patch("/:id",
  validateRoom, 
  updateRoom
);
router.delete("/:id",
  deleteRoom
);

export default router;
