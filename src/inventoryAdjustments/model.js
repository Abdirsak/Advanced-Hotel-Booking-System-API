import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

// Define the inventory adjustment schema
const InventoryAdjustmentSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },

    adjustedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

InventoryAdjustmentSchema.plugin(MongoosePaginate);

// Export the Inventory Adjustment model
const InventoryAdjustment = mongoose.model(
  "InventoryAdjustment",
  InventoryAdjustmentSchema
);

export default InventoryAdjustment;
