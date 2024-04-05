
import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the Purchase schema
const PurchaseSchema = new Schema(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "departments",
      required: true,
    },
    createdDate: {
      type: Date,
      required: true,
      
    },
    expectedDate: {
      type: Date,
      required: true,
      
    },
    orderStatus: {
      type: String,
      enum:['Pending','Received','Processing','Shipped'],
      required: true,
      
    },
    paymentStatus: {
      type: String,
      enum:['Paid','Pending','Overdue'],
      required: true,
      
    },
    billingAddress: {
      type: String,
      required:true
    },
    shippingAddress: {
      type: String,
      required:true
    },
    items: {
      type: Array,
      required:true,
      default:[]
    },
    orderAmount : {
      type: Number,
      required:true
    },
    taxInformation  : {
      type: String,
      required:true
    },
    invoiceId: {
      type: String,
      required:true
    },
   
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
;

// Export the Purchase model
const Purchase = mongoose.model("Purchase", PurchaseSchema);

export default Purchase;