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
    type: Schema.Types.Decimal128,
    required: true,
  },
  discount: {
    type:  Schema.Types.Decimal128,
    default: 0,
  },
  balance: {
    type:  Schema.Types.Decimal128,
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
    price: {type: Schema.Types.Decimal128},
    total: {type: Schema.Types.Decimal128}

    }
  ],
  status: {
    type: String,
    required: true,
    enum: ["completed", "pending", "cancelled"],
  },
});

salesSchema.plugin(MongoosePaginate);

const Sales = mongoose.model("Sales", salesSchema);

export default Sales;
