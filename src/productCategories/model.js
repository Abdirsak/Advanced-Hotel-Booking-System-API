import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

// Define the Product Category schema
const ProductCategoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
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

ProductCategoriesSchema.plugin(MongoosePaginate);

// Export the Product Category model
const ProductCategory = mongoose.model(
  "ProductCategory",
  ProductCategoriesSchema
);

export default ProductCategory;
