import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  SupplierName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
});

supplierSchema.plugin(MongoosePaginate);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
