import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

//Define the Loan Schema

const LoanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: Object,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    returnedAmount: {
      type: Number,
      required: false,
      default:0
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: false,
      default:"Pending",
      enum: ["Pending", "Accepted","Rejected"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

LoanSchema.plugin(MongoosePaginate);

//Export the Loan Model
const Loan = mongoose.model("Loan", LoanSchema);

export default Loan;
