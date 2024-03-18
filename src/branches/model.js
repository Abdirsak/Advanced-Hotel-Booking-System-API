import mongoose from "mongoose";
const Schema = mongoose.Schema;

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
      type: String,
      required: true,
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

// BranchSchema.plugin(mongoosePaginate);
// BranchSchema.plugin(mongooseAggregate);

// Export the Branch model
const Branch = mongoose.model("Branch", BranchSchema);

export default Branch;
