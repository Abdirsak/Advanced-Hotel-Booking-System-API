import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

// Define the Expense schema
const ExpenseSchema = new Schema(
  {
    expDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Schema.Types.Decimal128,
      required: true,
    },
  
    category: {
      type: Schema.Types.ObjectId,
      ref: "ExpenseCategory",
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

ExpenseSchema.plugin(MongoosePaginate);

// Export the Expense model
const Expense = mongoose.model("Expense", ExpenseSchema);

export default Expense;
