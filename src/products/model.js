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
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
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
    expireDate: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sku: String,
    reorder_level: Number,

    picture: {
      type: String,
      required: false,
      default: "No picture",
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: false,
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
