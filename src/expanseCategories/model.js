import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

// Define the Expense Category schema
const ExpenseCategorySchema = new Schema(
  {
    name: {
        type: String,
        required: true,
      },
    description: {
      type: String,
      required: false,
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
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

ExpenseCategorySchema.plugin(MongoosePaginate);

// Export the Expense Category model
const ExpenseCategory = mongoose.model("ExpenseCategory", ExpenseCategorySchema);

export default ExpenseCategory;
