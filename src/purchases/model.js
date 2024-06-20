import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the Purchase schema
const PurchaseSchema = new Schema(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    reference:{
      type: String,
      required: true,
    },
    expectedDate: {
      type: Date,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Received", "Processing", "Shipped"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Overdue"],
      required: true,
    },
    billingAddress: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,  
    },

    items: [
      {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {type: Number},
      cost: {type: Schema.Types.Decimal128},
      total: {type: Schema.Types.Decimal128},
    }
    ],
    totalAmount: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    taxInformation: {
      type: String,
      required: true,
    },
    invoiceId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// Export the Purchase model
const Purchase = mongoose.model("Purchase", PurchaseSchema);

export default Purchase;
