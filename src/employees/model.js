import mongoose from "mongoose";
const Schema = mongoose.Schema;

import MongoosePaginate from "mongoose-paginate-v2";
import User from "../users/model.js";

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
    hiringDate: {
      type: Date,
      required: true,
    },
    user:{
    type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  
    salary: {
      type: Number,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    emergencyContact: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

EmployeeSchema.plugin(MongoosePaginate);

// Add pre-save middleware before the plugin
EmployeeSchema.pre("save", async function (next) {
  try {
    if (this.isNew) { // Only create user for new employees
      const user = await User.create({
        fullName: this.fullName,
        username: this.username, // Using contact as username, adjust if needed
        password: this.password, // Using contact as default password, adjust if needed
        status: this.status,
        contact: this.contact,
        role: this.role,
        createdBy: this.createdBy 
      });
      
      this.user = user._id; 
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Export the Employee model
const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;
