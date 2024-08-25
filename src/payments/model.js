import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;
// Define the Payment schema
const PaymentSchema = new Schema(
  {
    expenseId: {
      type: Schema.Types.ObjectId,
      ref: "Expense",
      default: null,
    },
    purchaseId: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
      default: null,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: false,
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

PaymentSchema.plugin(MongoosePaginate);

// Export the Payment model
const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
