import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

//sales schema
const salesSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  saleDate: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["completed", "pending", "cancelled"],
  },
});

salesSchema.plugin(MongoosePaginate);

const Sales = mongoose.model("Sales", salesSchema);

export default Sales;
