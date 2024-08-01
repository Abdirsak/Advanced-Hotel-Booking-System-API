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
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
    },
    brand: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    cost: {
      type: Number,
      required: false,
    },
    expireDate: {
      type: Date,
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
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
