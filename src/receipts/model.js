import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";
import Invoice from "../invoices/model.js";
import Sales from "../sales/model.js";

const Schema = mongoose.Schema;
//sales schema
const ReceiptSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  receiptNo: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  reference: {
    type: String,
    required: false,
  },
  method: {
    type: String,
    required: true,
  },
  receiptDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },


  invoiceId: {
        type: Schema.Types.ObjectId,
        ref: "Invoice",
        required: true,
      },

});
 
ReceiptSchema.plugin(MongoosePaginate);
// Middleware to update balance before saving
ReceiptSchema.pre("save", async function (next) {
  const receipt = this;
  const invoice = await mongoose.model("Invoice").findById(receipt?.invoiceId);
  const Sale = await mongoose.model("Sales").findById(invoice?.sales);

  if (!invoice) {
    const err = new Error("Invoice not found");
    return next(err);
  }

  // Update the paid amount and calculate balance

  invoice.paidAmount += receipt.amount;
  Sale.balance = parseInt(Sale.balance - receipt.amount);
  receipt.balance = Sale.balance;

 
  // console.log("paid amount: ",Sale.balance)
  // Update the status of the invoice based on the balance
  if (receipt.balance <= 0) {
    invoice.status = 'paid';
    Sale.status = 'completed';
  } else {
    invoice.status = 'unpaid';
  }

  await invoice.save();
  await Sale.save();
  next();
});

const Receipt = mongoose.model("Receipt", ReceiptSchema);

export default Receipt;
