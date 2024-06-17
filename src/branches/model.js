import mongoose from "mongoose";
const Schema = mongoose.Schema;
import MongoosePaginate from "mongoose-paginate-v2";

// Define the Branch schema
const BranchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    director: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    workingHours: {
      from: {
        type: String,
        required: true,
      },
      to: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BranchSchema.plugin(MongoosePaginate);

// Export the Branch model
const Branch = mongoose.model("Branch", BranchSchema);

export default Branch;
