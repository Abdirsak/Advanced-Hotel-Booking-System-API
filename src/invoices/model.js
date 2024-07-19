import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

//invoice schema
const InvoiceSchema = new Schema({
  sales: {
    type: Schema.Types.ObjectId,
    ref: "Sales",
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ["unpaid", "paid", "overdue"],
  },
});

InvoiceSchema.plugin(MongoosePaginate);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
