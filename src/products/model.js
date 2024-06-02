import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

// Define the Product schema
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    expiredDate: {
      type: Date,
      required: true,
    },
    picture: {
      type: String,
      required: true,
      default: "No picture",
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProductSchema.plugin(MongoosePaginate);

// Export the Product model
const Product = mongoose.model("Product", ProductSchema);

export default Product;
