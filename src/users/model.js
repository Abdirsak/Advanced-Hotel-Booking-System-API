import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
        type: String,
        required: true,
        enum:['Admin','User']
    },
    departmentId: {
        type: Schema.Types.ObjectId, ref: "departments"  ,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum:['Active','Inactive']
    },
    lastLogin: {
        type: Date,
        default: new Date()
    },
    registeredDate: {
        type: Date,
        default: new Date()
    },
    createdBy: {
        type: Schema.Types.ObjectId, ref: "users"  ,
        required: true,
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



// Export the User model
const User = mongoose.model("User", UserSchema);

export default User;
