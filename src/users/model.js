import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
// Define the User schema
const UserSchema = new Schema(
  {
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
      enum: ["Admin", "User"],
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "departments",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive"],
    },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    registeredDate: {
      type: Date,
      default: new Date(),
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

// Check if password is correct
UserSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Export the User model
const User = mongoose.model("User", UserSchema);

export default User;
