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
  discount: {
    type:  Number,
    default: 0,
  },
  balance: {
    type:  Number,
    default: 0,
  },
  salesItems:[
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    quantity:  {type:Number},
    price: {type: Number},
    total: {type: Number}

    }
  ],
  status: {
    type: String,
    required: true,
    enum: ["completed", "pending", "cancelled"],
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
    required: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

salesSchema.plugin(MongoosePaginate);

const Sales = mongoose.model("Sales", salesSchema);

export default Sales;
