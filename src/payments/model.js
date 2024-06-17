import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;
// Define the Payment schema
const PaymentSchema = new Schema(
  {
    invoiceId: {
        type: Schema.Types.ObjectId,
        ref: "Invoice",
      },
    paymentDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    method: {
      type: String,
      required: false,
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
