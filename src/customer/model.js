import mongoose from "mongoose";

const Schema = mongoose.Schema;

//Define the Customer Schema

const CustomerSchema = new Schema(
   {
      fullName: {
         type: String,
         required: true,
      },
      address: {
         type: String,
         required: true
      },
      contect: {
         type: Object,
         required: true
      },
      gender: {
         type: String,
         required: true,
         enum: ["Male", "Female"],
      },
      description: {
         type: String,

      }

   },
   {
      timestamps: true,
      versionKey: false
   }
);

//Export the Customer Model
const Customer = mongoose.model("Custome", CustomerSchema);

export default Customer;