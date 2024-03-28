import mongoose from "mongoose";

const Schema = mongoose.Schema;

const supplierSchema = new Schema(
   {
      SupplierName: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true
      },
      phone: {
         type: String,
         required: true
      },
      address: {
         type: String,
         required: true
      },
      description: {
         type: String,

      },
      country: {
         type: String,
         required: true,

      }
   }
);


const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;