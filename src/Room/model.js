import mongoose from "mongoose";
const Schema = mongoose.Schema;

import MongoosePaginate from "mongoose-paginate-v2";
import User from "../users/model.js";

// Define the Room schema
const RoomSchema = new Schema(
  {
    roomNo: {
      type: String,
      required: true,
      unique: true
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Suite', 'Deluxe'],
      required: true
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0
    },
    is_available: {
      type: Boolean,
      default: true
    },
    floor: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    amenities: {
      type: [String],
      default: []
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

RoomSchema.plugin(MongoosePaginate);

const Room = mongoose.model('Room', RoomSchema);

export { Room };
