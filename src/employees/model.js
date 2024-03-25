import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the Employee schema
const EmployeeSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    hiringDate: {
      type: Date,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    emergencyContact: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Export the Employee model
const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;
