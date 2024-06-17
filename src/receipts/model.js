import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

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
    required: true,
  },
  method: {
    type: Date,
    required: true,
  },
  receiptDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },


  InvoiceId: {
        type: Schema.Types.ObjectId,
        ref: "Invoice",
        required: true,
      },

});

ReceiptSchema.plugin(MongoosePaginate);

const Receipt = mongoose.model("Receipt", ReceiptSchema);

export default Receipt;
